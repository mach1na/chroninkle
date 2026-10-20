#include "epaper_ui/dashboard_page.h"

#include <algorithm>
#include <array>

#include "epaper_ui/font_renderer.h"
#include "project_assets.h"
#include "render_utils.h"

namespace epaper_ui {
namespace {

constexpr int kMargin = design::spacing::k16;
constexpr int kContentTopGap = design::spacing::k32;
constexpr int kDateGridGap = design::spacing::k32;
constexpr int kCellCornerRadius = 4;
constexpr auto kCaptionRole = design::TypographyRole::kLabelSmall;

constexpr std::array<const char*, kDashboardMenuItemCount> kMenuLabels = {
    "Follow up", "Todos", "Notes", "Topics", "Books", "Settings",
};

constexpr std::array<EmbeddedHomeIconId, kDashboardMenuItemCount> kMenuIcons = {
    EmbeddedHomeIconId::kFollowUp, EmbeddedHomeIconId::kTodos, EmbeddedHomeIconId::kNotes,
    EmbeddedHomeIconId::kTopics,   EmbeddedHomeIconId::kBooks,    EmbeddedHomeIconId::kSettings,
};

int PageWidth(int portrait_width)
{
    return std::max(0, portrait_width - (2 * kMargin));
}

int CellHeight()
{
    return design::home_grid::kCellPadding + design::home_grid::kIconSize +
           design::home_grid::kIconCaptionGap + LineHeight(kCaptionRole) +
           design::home_grid::kCellPadding;
}

struct Layout {
    UiRect date = {};
    int grid_y = 0;
    int column_gap = 0;
};

Layout BuildLayout(int portrait_width, const DashboardPageState& state)
{
    Layout layout = {};
    const int content_top = StatusBarHeight() + kContentTopGap;
    layout.date = CurrentDateBounds(kMargin, content_top, state.current_date, {});
    layout.grid_y = layout.date.bottom() + kDateGridGap;
    // Columns are a fixed cell width; the leftover page width is split into the gaps between.
    const int columns = design::home_grid::kColumns;
    layout.column_gap = std::max(
        0, (PageWidth(portrait_width) - (columns * design::home_grid::kCellWidth)) / (columns - 1));
    return layout;
}

UiRect CellBounds(const Layout& layout, int index)
{
    const int column = index % design::home_grid::kColumns;
    const int row = index / design::home_grid::kColumns;
    return {kMargin + (column * (design::home_grid::kCellWidth + layout.column_gap)),
            layout.grid_y + (row * (CellHeight() + design::home_grid::kRowGap)),
            design::home_grid::kCellWidth, CellHeight()};
}

bool MenuItemShowsBadge(const DashboardPageMenuState& menu, int index)
{
    switch (index) {
        case 0:
            return menu.shows_follow_up_badge;
        case 1:
            return menu.shows_todos_badge;
        case 2:
            return menu.shows_notes_badge;
        default:
            return false;
    }
}

BadgeState MenuItemBadge(const DashboardPageMenuState& menu, int index)
{
    switch (index) {
        case 0:
            return {menu.follow_up_badge_text, false};
        case 1:
            return {menu.todos_badge_text, false};
        case 2:
            return {menu.notes_badge_text, false};
        default:
            return {};
    }
}

}  // namespace

const char* DashboardMenuItemLabel(int index)
{
    if (index < 0 || index >= kDashboardMenuItemCount) {
        return "";
    }
    return kMenuLabels[static_cast<size_t>(index)];
}

UiRect DashboardMenuItemBounds(int portrait_width,
                               int portrait_height,
                               const DashboardPageState& state,
                               int index)
{
    (void)portrait_height;
    if (index < 0 || index >= kDashboardMenuItemCount) {
        return {};
    }
    return CellBounds(BuildLayout(portrait_width, state), index);
}

bool HitTestDashboardMenuItem(int portrait_width,
                              int portrait_height,
                              const DashboardPageState& state,
                              int x,
                              int y,
                              int* index)
{
    if (index != nullptr) {
        *index = -1;
    }
    for (int candidate = 0; candidate < kDashboardMenuItemCount; ++candidate) {
        const UiRect bounds =
            DashboardMenuItemBounds(portrait_width, portrait_height, state, candidate);
        if (!bounds.IsEmpty() && bounds.Contains(x, y)) {
            if (index != nullptr) {
                *index = candidate;
            }
            return true;
        }
    }
    return false;
}

void DrawDashboardPage(uint8_t* framebuffer,
                       int raw_width,
                       int raw_height,
                       int portrait_width,
                       int portrait_height,
                       const DashboardPageState& state,
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

    const Layout layout = BuildLayout(portrait_width, state);
    DrawCurrentDate(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                    layout.date.x, layout.date.y, state.current_date, {});

    for (int index = 0; index < kDashboardMenuItemCount; ++index) {
        const UiRect bounds = CellBounds(layout, index);
        const bool selected = index == state.menu.selected_index;
        const uint8_t background = selected ? design::color::kBlack : design::color::kWhite;
        const uint8_t foreground = selected ? design::color::kWhite : design::color::kBlack;

        // Selection inverts the whole cell (icon + caption), mirroring the old menu-row focus.
        FillRoundedPortraitRect(framebuffer, raw_width, raw_height, portrait_width,
                                portrait_height, bounds, kCellCornerRadius, background);

        const int icon_x = bounds.x + CenterOffset(bounds.width, design::home_grid::kIconSize);
        const int icon_y = bounds.y + design::home_grid::kCellPadding;
        DrawPortraitMonoAsset(
            framebuffer, raw_width, raw_height, portrait_width, portrait_height, icon_x, icon_y,
            project_assets::GetHomeIcon(kMenuIcons[static_cast<size_t>(index)]), foreground);

        const std::string caption = FitLabelText(
            kCaptionRole, DashboardMenuItemLabel(index), bounds.width - (2 * kCellCornerRadius));
        DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                           bounds.x + CenterOffset(bounds.width, MeasureText(kCaptionRole, caption)),
                           icon_y + design::home_grid::kIconSize +
                               design::home_grid::kIconCaptionGap,
                           caption, kCaptionRole, foreground);

        if (MenuItemShowsBadge(state.menu, index)) {
            BadgeState badge = MenuItemBadge(state.menu, index);
            badge.inverse = selected;  // white pill so it reads on the inverted cell
            const UiRect badge_bounds = BadgeBounds(0, 0, badge, {});
            DrawBadge(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                      bounds.right() - design::home_grid::kBadgeInset - badge_bounds.width,
                      bounds.y + design::home_grid::kBadgeInset, badge, {});
        }
    }

    DrawGlobalFooter(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                     footer_state);
}

}  // namespace epaper_ui
