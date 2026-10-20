#include "dashboard_page_coordinator.h"

#include <ctime>
#include <string>

namespace {

using page_navigation::NavigationItemRole;
using page_navigation::NavigationItemSection;

constexpr int64_t kMinValidEpoch = 1704067200;  // 2024-01-01 UTC

// Fills weekday/date strings from the system clock; leaves them empty when time is invalid.
void FillCurrentDate(epaper_ui::CurrentDateState* date)
{
    const time_t now = time(nullptr);
    if (static_cast<int64_t>(now) < kMinValidEpoch) {
        return;
    }
    std::tm local_tm = {};
    localtime_r(&now, &local_tm);

    char weekday[16] = {};
    char date_text[24] = {};
    std::strftime(weekday, sizeof(weekday), "%A", &local_tm);
    std::strftime(date_text, sizeof(date_text), "%b %d, %Y", &local_tm);
    date->weekday_text = weekday;
    date->date_text = date_text;
}

}  // namespace

DashboardPageCoordinator::DashboardPageCoordinator() = default;

void DashboardPageCoordinator::RefreshFromArchive(
    const recording_archive_service::Snapshot& snapshot)
{
    archive_ = snapshot;
}

void DashboardPageCoordinator::PrepareForShow()
{
    focus_.Configure(navigation_model_.item_count, 0);
}

bool DashboardPageCoordinator::MoveFocus(int delta)
{
    if (delta == 0) {
        return false;
    }
    return focus_.Move(delta);
}

bool DashboardPageCoordinator::SetFocusIndex(int index)
{
    return focus_.SetIndex(index);
}

bool DashboardPageCoordinator::IsRoleFocused(NavigationItemRole role) const
{
    return navigation_model_.IsRoleSelected(focus_.index(), role);
}

NavigationItemRole DashboardPageCoordinator::FocusedRole() const
{
    const page_navigation::NavigationItemDescriptor* item =
        navigation_model_.ItemAt(focus_.index());
    return item != nullptr ? item->role : NavigationItemRole::kUnknown;
}

int DashboardPageCoordinator::FocusedMenuIndex() const
{
    const page_navigation::NavigationItemDescriptor* item =
        navigation_model_.ItemAt(focus_.index());
    if (item == nullptr || item->section != NavigationItemSection::kDashboardPageMenu) {
        return -1;
    }
    return item->item_index;
}

epaper_ui::DashboardPageState DashboardPageCoordinator::BuildState() const
{
    epaper_ui::DashboardPageState state = {};
    state.navigation_focus_index = focus_.index();

    FillCurrentDate(&state.current_date);

    state.menu.selected_index = FocusedMenuIndex();
    state.menu.shows_follow_up_badge = archive_.follow_up_recording_count > 0;
    state.menu.shows_notes_badge = archive_.notes_recording_count > 0;
    state.menu.shows_todos_badge = archive_.todo_recording_count > 0;
    state.menu.follow_up_badge_text = std::to_string(archive_.follow_up_recording_count);
    state.menu.notes_badge_text = std::to_string(archive_.notes_recording_count);
    state.menu.todos_badge_text = std::to_string(archive_.todo_recording_count);
    return state;
}
