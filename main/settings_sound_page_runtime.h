#ifndef SETTINGS_SOUND_PAGE_RUNTIME_H_
#define SETTINGS_SOUND_PAGE_RUNTIME_H_

#include "app_interaction_target.h"
#include "display_service.h"
#include "esp_err.h"
#include "footer_runtime.h"
#include "page_action_result.h"
#include "settings_sound_page_interactions.h"

namespace settings_sound_page_runtime {

esp_err_t UpdateDisplayState();
esp_err_t UpdateDisplayStateAndRequestRefresh(
    display_service::RefreshMode refresh_mode = display_service::RefreshMode::kPartial);
esp_err_t UpdateDisplayStateAndRequestRefresh(
    const display_service::RefreshRequest& refresh_request);
page_actions::FocusMoveOutcome MoveFocus(int delta);
settings_sound_page_interactions::ActivateResult ActivateFocusedItem();

footer_runtime::ProjectionState BuildFooterProjectionState();
page_actions::FocusUpdateOutcome FocusFooterItem(footer_runtime::FooterFocusItem item);
void ResetFocus();

// Opens the "Volume" picker (Mute, 10%..100%), pre-selected to the currently saved value.
esp_err_t ShowVolumeModal();
// Dispatch the volume modal selection. Returns true if that modal was pending (so the shared
// submit chain in app_shell stops here).
bool HandleSelectModalSubmit(int selected_index);
// Clears the pending-modal flag without applying a selection (e.g. a different modal preempted
// it) so a later, unrelated select-modal submission can't be misrouted here.
void ClearPendingSelectModal();

}  // namespace settings_sound_page_runtime

#endif  // SETTINGS_SOUND_PAGE_RUNTIME_H_
