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

// Called when a book row is activated. Stashes the filename for the deferred screen transition
// (app_shell polls ConsumePendingShowReader after input dispatch returns).
void RequestShowReaderForFocusedBook();
struct PendingBookReader {
    bool valid = false;
    std::string filename = {};
};
PendingBookReader ConsumePendingShowReader();

}  // namespace book_list_page_runtime

#endif  // BOOK_LIST_PAGE_RUNTIME_H_
