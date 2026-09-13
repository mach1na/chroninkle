#include "book_list_page_runtime.h"

#include <mutex>
#include <vector>

#include "book_list_page_coordinator.h"
#include "page_navigation/navigation_model.h"
#include "page_navigation/page_focus_projection.h"
#include "text_reader_service.h"
#include "ui_refresh_runtime.h"

namespace book_list_page_runtime {
namespace {

std::mutex s_mutex;
BookListPageCoordinator s_coordinator = {};
// Snapshot of the folder listing as of the last ResetFocus() -- refreshed on page entry rather
// than on every render, matching the "browse a single fixed folder" scope (no live file-add
// notifications to react to).
std::vector<text_reader_service::BookEntry> s_books = {};
bool s_pending_reader = false;
std::string s_pending_filename;

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

void RequestShowReaderForFocusedBook()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    const int index = s_coordinator.FocusedBookIndex();
    if (index < 0 || index >= static_cast<int>(s_books.size())) {
        return;
    }
    s_pending_filename = s_books[static_cast<size_t>(index)].filename;
    s_pending_reader = true;
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
