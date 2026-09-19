#ifndef SETTINGS_SOUND_PAGE_INTERACTIONS_H_
#define SETTINGS_SOUND_PAGE_INTERACTIONS_H_

#include <cstdint>
#include <functional>

#include "page_action_result.h"
#include "settings_sound_page_coordinator.h"

namespace settings_sound_page_interactions {

enum class ActivateIntent : uint8_t {
    kNone = 0,
    kShowHome,
    kShowSettings,
    kShowVolumeModal,
};

struct ActivateResult {
    ActivateIntent intent = ActivateIntent::kNone;
    bool handled = false;
    bool play_activate_cue = false;
};

using FocusMoveResult = page_actions::FocusMoveOutcome;

struct ActivateCallbacks {
    std::function<void()> show_home;
    std::function<void()> show_settings;
    std::function<void()> show_volume_modal;
};

ActivateResult HandlePrimaryActivate(const SettingsSoundPageCoordinator& coordinator);
void ApplyPrimaryActivateResult(const ActivateResult& result, const ActivateCallbacks& callbacks);
FocusMoveResult HandleMoveFocus(SettingsSoundPageCoordinator& coordinator, int delta);

}  // namespace settings_sound_page_interactions

#endif  // SETTINGS_SOUND_PAGE_INTERACTIONS_H_
