#ifndef BOOK_LIST_PAGE_RUNTIME_H_
#define BOOK_LIST_PAGE_RUNTIME_H_

#include <string>

#include "app_interaction_target.h"
#include "book_list_page_interactions.h"
#include "display_service.h"
#include "esp_err.h"
#include "footer_runtime.h"
#include "page_action_result.h"

namespace book_list_page_runtime {

esp_err_t UpdateDisplayState();
esp_err_t UpdateDisplayStateAndRequestRefresh(
    display_service::RefreshMode refresh_mode = display_service::RefreshMode::kPartial);
esp_err_t UpdateDisplayStateAndRequestRefresh(
    const display_service::RefreshRequest& refresh_request);
page_actions::FocusMoveOutcome MoveFocus(int delta);
book_list_page_interactions::ActivateResult ActivateFocusedItem();

footer_runtime::ProjectionState BuildFooterProjectionState();
page_actions::FocusUpdateOutcome FocusFooterItem(footer_runtime::FooterFocusItem item);
// Re-lists the configured folder off the SD card and resets focus. Called on page entry.
void ResetFocus();

// Called when a book row is activated: opens its actions menu (Continue reading / Start
// from the beginning / Delete). Returns false if no book is focused.
bool ShowItemActionsModal();
// Routes a select_modal submission back to whichever action was chosen. Returns false if
// this page didn't open the modal, so app_shell's submit chain can try the next page.
bool HandleItemActionSelection(int selected_index);
// Deletes whichever book "Delete" was confirmed for (stashed by HandleItemActionSelection
// when the confirm modal was shown) and refreshes the list. Returns false if nothing was
// pending -- mirrors settings_topics_page_runtime::DeleteConfirmedTopic().
bool DeleteConfirmedBook();

struct PendingBookReader {
    bool valid = false;
    std::string filename = {};
};
// Consumed by app_shell after input dispatch, same deferred-screen-transition idiom used
// throughout main/ -- set by HandleItemActionSelection's Continue/Start-over actions.
PendingBookReader ConsumePendingShowReader();

}  // namespace book_list_page_runtime

#endif  // BOOK_LIST_PAGE_RUNTIME_H_
