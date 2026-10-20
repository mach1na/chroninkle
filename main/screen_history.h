#ifndef SCREEN_HISTORY_H_
#define SCREEN_HISTORY_H_

#include <string>

#include "display_service.h"

// Back-navigation history: a bounded stack of the screens the user has passed through.
//
// Pure bookkeeping -- no display or page calls. app_shell records every screen change through
// OnNavigate() and asks Top() where "back" should go. See docs/specs/v2/back-navigation.md.
namespace screen_history {

// A screen to return to. Details is the only screen whose state its runtime doesn't retain, so
// it also carries which recording it was showing and which page opened it.
struct Entry {
    display_service::ScreenId screen = display_service::ScreenId::kHome;
    std::string recording_id = {};
    int details_source = 0;
};

// Records a change from `leaving` to `target`:
//  - Home is the root, so it clears the history.
//  - A target already in the history truncates it to just below that entry (a return, so the
//    stack shrinks instead of growing -- this also makes in-page "Back" buttons consistent).
//  - Otherwise `leaving` is pushed (never Onboarding or the lock screen).
void OnNavigate(const Entry& leaving, display_service::ScreenId target);

// Copies the most recent entry into `entry`. Returns false when the history is empty.
bool Top(Entry* entry);

void Clear();

}  // namespace screen_history

#endif  // SCREEN_HISTORY_H_
