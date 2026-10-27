#ifndef EPAPER_UI_DASHBOARD_PAGE_H_
#define EPAPER_UI_DASHBOARD_PAGE_H_

#include <cstdint>
#include <string>

#include "epaper_ui/badge.h"
#include "epaper_ui/current_date.h"
#include "epaper_ui/global_footer.h"
#include "epaper_ui/status_bar.h"

namespace epaper_ui {

// The dashboard's main menu is a 3-column icon grid of five fixed items (3 + 2); Notes / Todos
// can show a corner badge.
inline constexpr int kDashboardMenuItemCount = 5;

// Fixed slot order of the dashboard menu (must match kMenuLabels in dashboard_page.cpp).
enum class DashboardMenuItem : int {
    kTodos = 0,
    kNotes,
    kTopics,
    kBooks,
    kSettings,
};

struct DashboardPageMenuState {
    int selected_index = -1;
    bool shows_notes_badge = false;
    bool shows_todos_badge = false;
    std::string notes_badge_text = "New";
    std::string todos_badge_text = "New";

    bool operator==(const DashboardPageMenuState& other) const = default;
};

struct DashboardPageState {
    int navigation_focus_index = -1;
    CurrentDateState current_date = {};
    DashboardPageMenuState menu = {};

    bool operator==(const DashboardPageState& other) const = default;
};

// Label + badge-support for each fixed menu slot (0..kDashboardMenuItemCount-1).
const char* DashboardMenuItemLabel(int index);

UiRect DashboardMenuItemBounds(int portrait_width,
                               int portrait_height,
                               const DashboardPageState& state,
                               int index);
bool HitTestDashboardMenuItem(int portrait_width,
                              int portrait_height,
                              const DashboardPageState& state,
                              int x,
                              int y,
                              int* index);
void DrawDashboardPage(uint8_t* framebuffer,
                       int raw_width,
                       int raw_height,
                       int portrait_width,
                       int portrait_height,
                       const DashboardPageState& state,
                       const StatusBarState& status_bar_state,
                       const GlobalFooterState& footer_state);

}  // namespace epaper_ui

#endif  // EPAPER_UI_DASHBOARD_PAGE_H_
