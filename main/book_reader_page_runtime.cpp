#include "book_reader_page_runtime.h"

#include <atomic>
#include <mutex>

#include "book_reader_page_coordinator.h"
#include "text_reader_service.h"
#include "ui_refresh_runtime.h"

namespace book_reader_page_runtime {
namespace {

std::mutex s_mutex;
BookReaderPageCoordinator s_coordinator = {};
std::atomic<bool> s_pending_back{false};

epaper_ui::BookReaderPageState BuildStateLocked()
{
    return s_coordinator.BuildState();
}

void SavePositionLocked()
{
    text_reader_service::SavePosition(s_coordinator.filename(), s_coordinator.current_page_start());
}

}  // namespace

esp_err_t UpdateDisplayState()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    return display_service::SetBookReaderPageState(BuildStateLocked());
}

esp_err_t UpdateDisplayStateAndRequestRefresh(display_service::RefreshMode refresh_mode)
{
    return UpdateDisplayStateAndRequestRefresh(
        display_service::RefreshRequest{.refresh_mode = refresh_mode});
}

esp_err_t UpdateDisplayStateAndRequestRefresh(
    const display_service::RefreshRequest& refresh_request)
{
    return ui_refresh_runtime::Schedule(ui_refresh_runtime::SurfaceKey::kBookReaderPage,
                                        &UpdateDisplayState, refresh_request);
}

esp_err_t OpenBook(const std::string& filename)
{
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_coordinator.Show(filename, display_service::PortraitWidth(),
                           display_service::PortraitHeight());
        SavePositionLocked();
    }
    return UpdateDisplayState();
}

page_actions::FocusMoveOutcome MoveFocus(int delta)
{
    page_actions::FocusMoveOutcome result = {};
    bool turned = false;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        turned = s_coordinator.TurnPage(delta, display_service::PortraitWidth(),
                                        display_service::PortraitHeight());
        if (turned) {
            SavePositionLocked();
        }
    }
    if (!turned) {
        return result;
    }
    result.handled = true;
    result.play_navigation_cue = true;
    result.apply_page_state = true;
    result.sync_footer_projection = false;
    return result;
}

footer_runtime::ProjectionState BuildFooterProjectionState()
{
    return {};
}

void ResetFocus()
{
    // Nothing to reset here: opening a specific book happens via OpenBook, called explicitly
    // right before this screen is shown (see app_shell's ShowBookReaderScreenIfRequested) --
    // ResetFocusForScreen's generic no-argument signature can't carry which file to open.
}

bool ExitActiveControl()
{
    RequestBack();
    return true;
}

void RequestBack()
{
    s_pending_back.store(true, std::memory_order_relaxed);
}

bool ConsumePendingBack()
{
    return s_pending_back.exchange(false, std::memory_order_relaxed);
}

}  // namespace book_reader_page_runtime
