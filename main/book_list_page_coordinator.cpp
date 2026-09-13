#include "book_list_page_coordinator.h"

namespace {

using page_navigation::NavigationItemRole;

}  // namespace

BookListPageCoordinator::BookListPageCoordinator() = default;

void BookListPageCoordinator::RebuildNavigationModel(int book_count)
{
    navigation_model_ = page_navigation::BuildBookListPageNavigationModel(book_count);
}

void BookListPageCoordinator::Show(int book_count)
{
    RebuildNavigationModel(book_count);
    focus_.Configure(navigation_model_.item_count, 0);
}

void BookListPageCoordinator::Sync(int book_count)
{
    const int previous_index = focus_.index();
    RebuildNavigationModel(book_count);
    focus_.Configure(navigation_model_.item_count, previous_index);
}

bool BookListPageCoordinator::MoveFocus(int delta)
{
    return focus_.Move(delta);
}

bool BookListPageCoordinator::SetFocusIndex(int index)
{
    return focus_.SetIndex(index);
}

bool BookListPageCoordinator::IsRoleFocused(NavigationItemRole role) const
{
    return navigation_model_.IsRoleSelected(focus_.index(), role);
}

int BookListPageCoordinator::FocusedBookIndex() const
{
    const page_navigation::NavigationItemDescriptor* item = navigation_model_.ItemAt(focus_.index());
    if (item == nullptr || item->role != NavigationItemRole::kBookListBookRow) {
        return -1;
    }
    return item->item_index;
}

epaper_ui::BookListPageState BookListPageCoordinator::BuildState(
    const std::vector<text_reader_service::BookEntry>& books) const
{
    epaper_ui::BookListPageState state = {};
    state.navigation_focus_index = focus_.index();

    const int focused_index = FocusedBookIndex();
    state.books_list.items.reserve(books.size());
    for (const text_reader_service::BookEntry& book : books) {
        state.books_list.items.push_back({.label_text = book.filename});
    }
    state.books_list.focused = focused_index >= 0;
    state.books_list.active = focused_index >= 0;
    state.books_list.selected_item_index =
        focused_index >= 0 ? focused_index : epaper_ui::kSelectListNoSelection;
    return state;
}
