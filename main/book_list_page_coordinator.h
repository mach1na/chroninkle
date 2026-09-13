#ifndef BOOK_LIST_PAGE_COORDINATOR_H_
#define BOOK_LIST_PAGE_COORDINATOR_H_

#include <vector>

#include "epaper_ui/book_list_page.h"
#include "page_navigation/navigation_model.h"
#include "page_navigation/roving_focus.h"
#include "text_reader_service.h"

// Flat, read-only list of the .txt files in the configured folder -- picking one opens the
// reader at that book's saved (or start-of-file) position. Mirrors TopicsBrowsePageCoordinator's
// shape (a flat list feeding a detail screen), minus the manage actions Topics doesn't have
// here either.
class BookListPageCoordinator {
public:
    BookListPageCoordinator();

    void Show(int book_count);
    void Sync(int book_count);
    bool MoveFocus(int delta);
    bool SetFocusIndex(int index);
    bool IsRoleFocused(page_navigation::NavigationItemRole role) const;
    // Index into the book list currently backing this page, or -1 when focus isn't on a row.
    int FocusedBookIndex() const;

    epaper_ui::BookListPageState BuildState(
        const std::vector<text_reader_service::BookEntry>& books) const;

    const page_navigation::NavigationModel& navigation_model() const { return navigation_model_; }
    const page_navigation::RovingFocus& focus() const { return focus_; }

private:
    void RebuildNavigationModel(int book_count);

    page_navigation::NavigationModel navigation_model_ =
        page_navigation::BuildBookListPageNavigationModel(0);
    page_navigation::RovingFocus focus_{navigation_model_.item_count, 0};
};

#endif  // BOOK_LIST_PAGE_COORDINATOR_H_
