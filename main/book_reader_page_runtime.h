#ifndef BOOK_READER_PAGE_RUNTIME_H_
#define BOOK_READER_PAGE_RUNTIME_H_

#include <string>

#include "display_service.h"
#include "esp_err.h"
#include "footer_runtime.h"
#include "page_action_result.h"

namespace book_reader_page_runtime {

esp_err_t UpdateDisplayState();
esp_err_t UpdateDisplayStateAndRequestRefresh(
    display_service::RefreshMode refresh_mode = display_service::RefreshMode::kPartial);
esp_err_t UpdateDisplayStateAndRequestRefresh(
    const display_service::RefreshRequest& refresh_request);

// Opens `filename` at its saved (or start-of-file) position and builds the first page. Called
// once, right before the reader screen is shown (see app_shell's ShowBookReaderScreenIfRequested)
// -- there's no archive to re-sync against later the way timeline pages do, so there's no
// separate request_refresh_if_active variant.
esp_err_t OpenBook(const std::string& filename);

// UP/DOWN tilt turns pages directly (delta > 0 next, delta < 0 previous) rather than moving
// roving focus -- the reader has nothing else on screen to focus. Matches every other screen's
// MoveFocus signature so page_input_runtime's per-screen dispatch stays uniform.
page_actions::FocusMoveOutcome MoveFocus(int delta);

// Always empty: with UP/DOWN dedicated to page turns, no footer role is reachable from this
// screen by roving focus -- Home is only reachable after leaving the reader for the book list.
footer_runtime::ProjectionState BuildFooterProjectionState();
void ResetFocus();

// App-wide "exit entered control" gesture (long-press DOWN). The whole reader screen counts as
// one entered control (there's no outer level within it the way a timeline's item list has), so
// this always requests leaving it for the book list rather than collapsing to some inner state.
// Back navigation is deferred the same way as topic_entries_page_runtime's
// RequestBack/ConsumePendingBack, so it happens after input dispatch returns.
bool ExitActiveControl();
void RequestBack();
bool ConsumePendingBack();

}  // namespace book_reader_page_runtime

#endif  // BOOK_READER_PAGE_RUNTIME_H_
