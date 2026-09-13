#ifndef BOOK_LIST_PAGE_INTERACTIONS_H_
#define BOOK_LIST_PAGE_INTERACTIONS_H_

#include <cstdint>
#include <functional>

#include "book_list_page_coordinator.h"
#include "page_action_result.h"

namespace book_list_page_interactions {

enum class ActivateIntent : uint8_t {
    kNone = 0,
    kShowHome,
    // Opens the actions menu (Continue reading / Start from the beginning / Delete) for the
    // focused book.
    kOpenBookActions,
};

struct ActivateResult {
    ActivateIntent intent = ActivateIntent::kNone;
    bool handled = false;
    bool play_activate_cue = false;
};

using FocusMoveResult = page_actions::FocusMoveOutcome;

struct ActivateCallbacks {
    std::function<void()> show_home;
    std::function<void()> open_book_actions;
};

ActivateResult HandlePrimaryActivate(const BookListPageCoordinator& coordinator);
void ApplyPrimaryActivateResult(const ActivateResult& result, const ActivateCallbacks& callbacks);
FocusMoveResult HandleMoveFocus(BookListPageCoordinator& coordinator, int delta);

}  // namespace book_list_page_interactions

#endif  // BOOK_LIST_PAGE_INTERACTIONS_H_
