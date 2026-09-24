#include "settings_about_page_coordinator.h"

#include <cstdio>

#include "esp_app_desc.h"

SettingsAboutPageCoordinator::SettingsAboutPageCoordinator() = default;

void SettingsAboutPageCoordinator::Show()
{
    focus_.Configure(navigation_model_.item_count, 0);
}

bool SettingsAboutPageCoordinator::MoveFocus(int delta)
{
    return focus_.Move(delta);
}

bool SettingsAboutPageCoordinator::SetFocusIndex(int index)
{
    return focus_.SetIndex(index);
}

bool SettingsAboutPageCoordinator::IsRoleFocused(page_navigation::NavigationItemRole role) const
{
    return navigation_model_.IsRoleSelected(focus_.index(), role);
}

epaper_ui::SettingsAboutPageState SettingsAboutPageCoordinator::BuildState() const
{
    epaper_ui::SettingsAboutPageState state = {};
    state.navigation_focus_index = focus_.index();

    // esp_app_desc_t::version is itself a fixed 32-byte field, so "Version " (8 bytes) + that
    // + a null terminator needs more than 32 bytes of headroom to avoid a format-truncation
    // warning (treated as an error by this project's build flags).
    char version_buffer[48] = {};
    std::snprintf(version_buffer, sizeof(version_buffer), "Version %s",
                 esp_app_get_description()->version);
    state.version_text = version_buffer;

    state.back = {
        .label_text = "Back",
        .selected =
            IsRoleFocused(page_navigation::NavigationItemRole::kSettingsAboutBackButton),
    };
    return state;
}
