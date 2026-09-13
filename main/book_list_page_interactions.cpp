#include "book_list_page_interactions.h"

namespace book_list_page_interactions {
namespace {

using page_navigation::NavigationItemRole;

}  // namespace

ActivateResult HandlePrimaryActivate(const BookListPageCoordinator& coordinator)
{
    ActivateResult result = {};

    if (coordinator.IsRoleFocused(NavigationItemRole::kBookListBookRow)) {
        result.handled = true;
        result.play_activate_cue = true;
        result.intent = ActivateIntent::kOpenBookActions;
        return result;
    }
    if (coordinator.IsRoleFocused(NavigationItemRole::kFooterHome)) {
        result.handled = true;
        result.play_activate_cue = true;
        result.intent = ActivateIntent::kShowHome;
        return result;
    }

    return result;
}

void ApplyPrimaryActivateResult(const ActivateResult& result, const ActivateCallbacks& callbacks)
{
    switch (result.intent) {
        case ActivateIntent::kShowHome:
            if (callbacks.show_home) {
                callbacks.show_home();
            }
            break;
        case ActivateIntent::kOpenBookActions:
            if (callbacks.open_book_actions) {
                callbacks.open_book_actions();
            }
            break;
        case ActivateIntent::kNone:
        default:
            break;
    }
}

FocusMoveResult HandleMoveFocus(BookListPageCoordinator& coordinator, int delta)
{
    FocusMoveResult result = {};
    if (!coordinator.MoveFocus(delta)) {
        return result;
    }
    result.handled = true;
    result.play_navigation_cue = true;
    result.apply_page_state = true;
    return result;
}

}  // namespace book_list_page_interactions
