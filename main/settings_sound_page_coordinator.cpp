#include "settings_sound_page_coordinator.h"

#include <cstdio>
#include <string>

namespace {

std::string FormatVolumeLabel(int percent)
{
    if (percent <= 0) {
        return "Mute";
    }
    char buffer[16] = {};
    std::snprintf(buffer, sizeof(buffer), "%d%%", percent);
    return std::string(buffer);
}

}  // namespace

SettingsSoundPageCoordinator::SettingsSoundPageCoordinator() = default;

void SettingsSoundPageCoordinator::Show()
{
    focus_.Configure(navigation_model_.item_count, 0);
}

bool SettingsSoundPageCoordinator::MoveFocus(int delta)
{
    return focus_.Move(delta);
}

bool SettingsSoundPageCoordinator::SetFocusIndex(int index)
{
    return focus_.SetIndex(index);
}

bool SettingsSoundPageCoordinator::IsRoleFocused(page_navigation::NavigationItemRole role) const
{
    return navigation_model_.IsRoleSelected(focus_.index(), role);
}

epaper_ui::SettingsSoundPageState SettingsSoundPageCoordinator::BuildState(
    int volume_percent) const
{
    epaper_ui::SettingsSoundPageState state = {};
    state.navigation_focus_index = focus_.index();
    state.volume_input = {
        .label_text = "Volume",
        .value_text = FormatVolumeLabel(volume_percent),
        .focused =
            IsRoleFocused(page_navigation::NavigationItemRole::kSettingsSoundVolumeInput),
    };
    state.back = {
        .label_text = "Back",
        .selected =
            IsRoleFocused(page_navigation::NavigationItemRole::kSettingsSoundBackButton),
    };
    return state;
}
