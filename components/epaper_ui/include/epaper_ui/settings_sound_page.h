#ifndef EPAPER_UI_SETTINGS_SOUND_PAGE_H_
#define EPAPER_UI_SETTINGS_SOUND_PAGE_H_

#include <cstdint>
#include <string_view>

#include "epaper_ui/button.h"
#include "epaper_ui/global_footer.h"
#include "epaper_ui/select_input.h"
#include "epaper_ui/status_bar.h"

namespace epaper_ui {

enum class SettingsSoundPageItemId : uint8_t {
    kNone = 0,
    kVolumeInput,
    kBack,
};

struct SettingsSoundPageState {
    int navigation_focus_index = -1;
    std::string_view title_text = "Sound";
    // "Volume" picker: opens a fixed-choice SelectModal, same pattern as Todos' archive-after
    // field.
    SelectInputState volume_input = {};
    // Returns to the Settings hub -- this page is reached only from there.
    ButtonState back = {};
};

UiRect SettingsSoundPageItemBounds(int portrait_width,
                                   int portrait_height,
                                   const SettingsSoundPageState& state,
                                   SettingsSoundPageItemId item);
bool HitTestSettingsSoundPageItem(int portrait_width,
                                  int portrait_height,
                                  const SettingsSoundPageState& state,
                                  int x,
                                  int y,
                                  SettingsSoundPageItemId* item);
void DrawSettingsSoundPage(uint8_t* framebuffer,
                           int raw_width,
                           int raw_height,
                           int portrait_width,
                           int portrait_height,
                           const SettingsSoundPageState& state,
                           const StatusBarState& status_bar_state,
                           const GlobalFooterState& footer_state);

}  // namespace epaper_ui

#endif  // EPAPER_UI_SETTINGS_SOUND_PAGE_H_
