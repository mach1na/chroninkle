#ifndef EPAPER_UI_BOOK_LIST_PAGE_H_
#define EPAPER_UI_BOOK_LIST_PAGE_H_

#include <cstdint>
#include <string_view>

#include "epaper_ui/global_footer.h"
#include "epaper_ui/select_list.h"
#include "epaper_ui/status_bar.h"

namespace epaper_ui {

struct BookListPageState {
    int navigation_focus_index = -1;
    std::string_view title_text = "Books";
    // One row per .txt file in the configured folder (label_text = filename). Picking one
    // opens the reader at that book's saved (or start-of-file) position.
    SelectListState books_list = {};

    bool operator==(const BookListPageState& other) const = default;
};

UiRect BookListListBounds(int portrait_width, int portrait_height, const BookListPageState& state);
void DrawBookListPage(uint8_t* framebuffer,
                      int raw_width,
                      int raw_height,
                      int portrait_width,
                      int portrait_height,
                      const BookListPageState& state,
                      const StatusBarState& status_bar_state,
                      const GlobalFooterState& footer_state);

}  // namespace epaper_ui

#endif  // EPAPER_UI_BOOK_LIST_PAGE_H_
