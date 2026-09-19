#include "epaper_ui/settings_sound_page.h"

#include <algorithm>

#include "render_utils.h"

namespace epaper_ui {
namespace {

constexpr auto kTitleRole = design::TypographyRole::kHeadingH1;
constexpr int kSideInset = design::spacing::k16;
constexpr int kTopGap = design::spacing::k24;
constexpr int kHeadingBottomPadding = design::spacing::k24;
constexpr int kBackButtonGap = design::spacing::k24;

struct Layout {
    UiRect volume_input = {};
    UiRect back = {};
};

Layout BuildLayout(int portrait_width, int portrait_height, const SettingsSoundPageState& state)
{
    (void)portrait_height;
    const int page_x = kSideInset;
    const int page_width = std::max(0, portrait_width - (2 * kSideInset));
    const int title_y = StatusBarHeight() + kTopGap;
    const int title_bottom = title_y + LineHeight(kTitleRole);

    TextInputStyle volume_style = {};
    volume_style.width = page_width;
    const UiRect volume_input = SelectInputBounds(
        page_x, title_bottom + kHeadingBottomPadding, state.volume_input, volume_style);

    ButtonStyle back_style = {};
    back_style.width = page_width;
    back_style.center_label = true;
    const UiRect back =
        ButtonBounds(page_x, volume_input.bottom() + kBackButtonGap, state.back, back_style);

    return {
        .volume_input = volume_input,
        .back = back,
    };
}

}  // namespace

UiRect SettingsSoundPageItemBounds(int portrait_width,
                                   int portrait_height,
                                   const SettingsSoundPageState& state,
                                   SettingsSoundPageItemId item)
{
    const Layout layout = BuildLayout(portrait_width, portrait_height, state);
    switch (item) {
        case SettingsSoundPageItemId::kVolumeInput:
            return layout.volume_input;
        case SettingsSoundPageItemId::kBack:
            return layout.back;
        case SettingsSoundPageItemId::kNone:
        default:
            return {};
    }
}

bool HitTestSettingsSoundPageItem(int portrait_width,
                                  int portrait_height,
                                  const SettingsSoundPageState& state,
                                  int x,
                                  int y,
                                  SettingsSoundPageItemId* item)
{
    if (item != nullptr) {
        *item = SettingsSoundPageItemId::kNone;
    }

    constexpr SettingsSoundPageItemId kItems[] = {
        SettingsSoundPageItemId::kVolumeInput,
        SettingsSoundPageItemId::kBack,
    };
    for (SettingsSoundPageItemId candidate : kItems) {
        const UiRect bounds =
            SettingsSoundPageItemBounds(portrait_width, portrait_height, state, candidate);
        if (!bounds.IsEmpty() && bounds.Contains(x, y)) {
            if (item != nullptr) {
                *item = candidate;
            }
            return true;
        }
    }
    return false;
}

void DrawSettingsSoundPage(uint8_t* framebuffer,
                           int raw_width,
                           int raw_height,
                           int portrait_width,
                           int portrait_height,
                           const SettingsSoundPageState& state,
                           const StatusBarState& status_bar_state,
                           const GlobalFooterState& footer_state)
{
    if (framebuffer == nullptr) {
        return;
    }

    FillPortraitRect(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                     {0, 0, portrait_width, portrait_height}, design::color::kWhite);
    DrawStatusBar(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                  status_bar_state);

    const Layout layout = BuildLayout(portrait_width, portrait_height, state);
    const int title_x = kSideInset;
    const int title_y = StatusBarHeight() + kTopGap;
    DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                       title_x, title_y, state.title_text, kTitleRole, design::color::kBlack);

    TextInputStyle volume_style = {};
    volume_style.width = layout.volume_input.width;
    DrawSelectInput(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                    layout.volume_input.x, layout.volume_input.y,
                    state.volume_input, volume_style);

    DrawButton(framebuffer, raw_width, raw_height, portrait_width, portrait_height, layout.back.x,
              layout.back.y, state.back,
              {.width = layout.back.width, .center_label = true});

    DrawGlobalFooter(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                     footer_state);
}

}  // namespace epaper_ui
