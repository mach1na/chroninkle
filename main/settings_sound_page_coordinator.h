#ifndef SETTINGS_SOUND_PAGE_COORDINATOR_H_
#define SETTINGS_SOUND_PAGE_COORDINATOR_H_

#include "epaper_ui/settings_sound_page.h"
#include "page_navigation/navigation_model.h"
#include "page_navigation/roving_focus.h"

class SettingsSoundPageCoordinator {
public:
    SettingsSoundPageCoordinator();

    void Show();
    bool MoveFocus(int delta);
    bool SetFocusIndex(int index);
    bool IsRoleFocused(page_navigation::NavigationItemRole role) const;

    epaper_ui::SettingsSoundPageState BuildState(int volume_percent) const;

    const page_navigation::NavigationModel& navigation_model() const { return navigation_model_; }
    const page_navigation::RovingFocus& focus() const { return focus_; }

private:
    page_navigation::NavigationModel navigation_model_ =
        page_navigation::BuildSettingsSoundPageNavigationModel();
    page_navigation::RovingFocus focus_{navigation_model_.item_count, 0};
};

#endif  // SETTINGS_SOUND_PAGE_COORDINATOR_H_
