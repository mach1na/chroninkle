#include "book_list_page_runtime.h"

#include <mutex>
#include <vector>

#include "book_list_page_coordinator.h"
#include "epaper_ui/select_modal.h"
#include "esp_log.h"
#include "overlay_runtime.h"
#include "page_navigation/navigation_model.h"
#include "page_navigation/page_focus_projection.h"
#include "text_reader_service.h"
#include "ui_refresh_runtime.h"

namespace book_list_page_runtime {
namespace {

constexpr const char* kTag = "BookListPageRuntime";

enum class ItemAction : uint8_t {
    kContinueReading,
    kStartFromBeginning,
    kDelete,
    kClose,
};

std::mutex s_mutex;
BookListPageCoordinator s_coordinator = {};
// Snapshot of the folder listing as of the last ResetFocus() -- refreshed on page entry rather
// than on every render, matching the "browse a single fixed folder" scope (no live file-add
// notifications to react to).
std::vector<text_reader_service::BookEntry> s_books = {};
bool s_pending_reader = false;
std::string s_pending_filename;

// The item-actions modal is a shared select_modal; track the selection so the app_shell submit
// chain can route it back here, mirroring notes_page_runtime's ItemAction pattern.
bool s_item_actions_pending = false;
std::string s_item_actions_filename;
std::vector<ItemAction> s_item_actions;
// Stashed between the item-actions modal's "Delete" and the confirm modal's "Delete" --
// mirrors settings_topics_page_runtime's s_pending_delete_topic_id.
std::string s_pending_delete_filename;

// Stashes `filename` for the deferred screen transition (app_shell polls
// ConsumePendingShowReader after input dispatch returns).
void RequestShowReader(const std::string& filename)
{
    std::lock_guard<std::mutex> lock(s_mutex);
    s_pending_filename = filename;
    s_pending_reader = true;
}

footer_runtime::FooterFocusItem FooterItemForSelectedIndex(int selected_index)
{
    return selected_index == 0 ? footer_runtime::FooterFocusItem::kHome
                                : footer_runtime::FooterFocusItem::kNone;
}

page_navigation::NavigationItemRole FooterRoleForFooterItem(footer_runtime::FooterFocusItem item)
{
    return item == footer_runtime::FooterFocusItem::kHome
               ? page_navigation::NavigationItemRole::kFooterHome
               : page_navigation::NavigationItemRole::kUnknown;
}

footer_runtime::ProjectionState BuildFooterProjectionStateLocked()
{
    const page_navigation::PageFocusProjection projection = page_navigation::ProjectPageFocus(
        s_coordinator.navigation_model(), page_navigation::NavigationItemSection::kNone,
        s_coordinator.focus().index(), -1, -1);
    footer_runtime::ProjectionState state = {};
    state.focused_item = FooterItemForSelectedIndex(projection.footer_selected_index);
    return state;
}

bool FooterProjectionChangedForFocusIndexes(int old_focus_index, int new_focus_index)
{
    const page_navigation::PageFocusProjection old_projection = page_navigation::ProjectPageFocus(
        s_coordinator.navigation_model(), page_navigation::NavigationItemSection::kNone,
        old_focus_index, -1, -1);
    const page_navigation::PageFocusProjection new_projection = page_navigation::ProjectPageFocus(
        s_coordinator.navigation_model(), page_navigation::NavigationItemSection::kNone,
        new_focus_index, -1, -1);
    return FooterItemForSelectedIndex(old_projection.footer_selected_index) !=
           FooterItemForSelectedIndex(new_projection.footer_selected_index);
}

epaper_ui::BookListPageState BuildStateLocked()
{
    return s_coordinator.BuildState(s_books);
}

}  // namespace

esp_err_t UpdateDisplayState()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    return display_service::SetBookListPageState(BuildStateLocked());
}

esp_err_t UpdateDisplayStateAndRequestRefresh(display_service::RefreshMode refresh_mode)
{
    return UpdateDisplayStateAndRequestRefresh(
        display_service::RefreshRequest{.refresh_mode = refresh_mode});
}

esp_err_t UpdateDisplayStateAndRequestRefresh(
    const display_service::RefreshRequest& refresh_request)
{
    return ui_refresh_runtime::Schedule(ui_refresh_runtime::SurfaceKey::kBookListPage,
                                        &UpdateDisplayState, refresh_request);
}

page_actions::FocusMoveOutcome MoveFocus(int delta)
{
    page_actions::FocusMoveOutcome result = {};
    int old_focus_index = -1;
    int new_focus_index = -1;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        old_focus_index = s_coordinator.focus().index();
        result = book_list_page_interactions::HandleMoveFocus(s_coordinator, delta);
        if (!result.handled) {
            return result;
        }
        new_focus_index = s_coordinator.focus().index();
    }

    result.sync_footer_projection =
        FooterProjectionChangedForFocusIndexes(old_focus_index, new_focus_index);
    return result;
}

book_list_page_interactions::ActivateResult ActivateFocusedItem()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    return book_list_page_interactions::HandlePrimaryActivate(s_coordinator);
}

footer_runtime::ProjectionState BuildFooterProjectionState()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    return BuildFooterProjectionStateLocked();
}

page_actions::FocusUpdateOutcome FocusFooterItem(footer_runtime::FooterFocusItem item)
{
    page_actions::FocusUpdateOutcome result = {};
    const page_navigation::NavigationItemRole role = FooterRoleForFooterItem(item);
    if (role == page_navigation::NavigationItemRole::kUnknown) {
        return result;
    }

    int old_focus_index = -1;
    int new_focus_index = -1;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        const int focus_index = s_coordinator.navigation_model().IndexOfRole(role);
        if (focus_index < 0) {
            return result;
        }
        old_focus_index = s_coordinator.focus().index();
        if (!s_coordinator.SetFocusIndex(focus_index)) {
            return result;
        }
        new_focus_index = s_coordinator.focus().index();
    }

    result.handled = true;
    result.apply_page_state = true;
    result.sync_footer_projection =
        FooterProjectionChangedForFocusIndexes(old_focus_index, new_focus_index);
    return result;
}

void ResetFocus()
{
    footer_runtime::ProjectionState projection = {};
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_books = text_reader_service::ListBooks();
        s_coordinator.Show(static_cast<int>(s_books.size()));
        projection = BuildFooterProjectionStateLocked();
    }
    footer_runtime::SetProjectionState(projection);
}

bool ShowItemActionsModal()
{
    epaper_ui::SelectModalState modal = {};
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        const int index = s_coordinator.FocusedBookIndex();
        if (index < 0 || index >= static_cast<int>(s_books.size())) {
            return false;
        }
        s_item_actions_filename = s_books[static_cast<size_t>(index)].filename;
        s_item_actions.clear();
        modal.title_text = s_item_actions_filename;
        modal.items.push_back({"Continue reading"});
        s_item_actions.push_back(ItemAction::kContinueReading);
        modal.items.push_back({"Start from the beginning"});
        s_item_actions.push_back(ItemAction::kStartFromBeginning);
        modal.items.push_back({"Delete"});
        s_item_actions.push_back(ItemAction::kDelete);
        modal.items.push_back({"Close"});
        s_item_actions.push_back(ItemAction::kClose);
        modal.selected_index = 0;
        s_item_actions_pending = true;
    }
    const esp_err_t err = overlay_runtime::ShowSelectModal(modal);
    if (err != ESP_OK && err != ESP_ERR_INVALID_STATE) {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_item_actions_pending = false;
        ESP_LOGW(kTag, "Show book actions modal failed: %s", esp_err_to_name(err));
        return false;
    }
    return true;
}

bool HandleItemActionSelection(int selected_index)
{
    ItemAction action = ItemAction::kClose;
    std::string filename;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        if (!s_item_actions_pending) {
            return false;
        }
        s_item_actions_pending = false;
        filename = s_item_actions_filename;
        if (selected_index < 0 || selected_index >= static_cast<int>(s_item_actions.size())) {
            return true;  // dismissed without a valid selection
        }
        action = s_item_actions[static_cast<size_t>(selected_index)];
    }
    if (filename.empty()) {
        return true;
    }

    switch (action) {
        case ItemAction::kContinueReading:
            RequestShowReader(filename);
            break;
        case ItemAction::kStartFromBeginning:
            // OpenBook() always resumes the saved position, so force it to the start here
            // rather than teaching the reader coordinator a second open mode for what is a
            // one-off menu choice.
            text_reader_service::SavePosition(filename, 0);
            RequestShowReader(filename);
            break;
        case ItemAction::kDelete: {
            std::lock_guard<std::mutex> lock(s_mutex);
            s_pending_delete_filename = filename;
            const esp_err_t err = overlay_runtime::ShowBookListModalConfirmDelete();
            if (err != ESP_OK && err != ESP_ERR_INVALID_STATE) {
                ESP_LOGW(kTag, "Show book delete-confirm modal failed: %s", esp_err_to_name(err));
                s_pending_delete_filename.clear();
            }
            break;
        }
        case ItemAction::kClose:
        default:
            break;
    }
    return true;
}

bool DeleteConfirmedBook()
{
    std::string filename;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        filename.swap(s_pending_delete_filename);
    }
    if (filename.empty()) {
        return false;
    }
    const bool deleted = text_reader_service::DeleteBook(filename);
    ResetFocus();
    (void)UpdateDisplayStateAndRequestRefresh(display_service::RefreshMode::kFull);
    return deleted;
}

PendingBookReader ConsumePendingShowReader()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    PendingBookReader pending = {};
    if (!s_pending_reader) {
        return pending;
    }
    s_pending_reader = false;
    pending.valid = true;
    pending.filename.swap(s_pending_filename);
    return pending;
}

}  // namespace book_list_page_runtime
