#ifndef BOOK_READER_PAGE_COORDINATOR_H_
#define BOOK_READER_PAGE_COORDINATOR_H_

#include <cstddef>
#include <string>
#include <vector>

#include "epaper_ui/book_reader_page.h"

// Paginates a .txt file for the reader screen: greedily wraps text from a byte offset to fill
// one screen's worth of lines (BookReaderContentBounds/PaginateBookText), reading the file in
// chunks off SD via text_reader_service rather than loading the whole book into RAM. Only
// page-start byte offsets are kept, as an in-memory back-stack pushed on forward / popped on
// back -- a page is re-derived from its start offset on demand rather than cached. Show()
// rebuilds the back-stack for pages already read (0 .. the saved position) by replaying
// pagination up to that point, so paging back works right after reopening a book too, not just
// for pages turned in the current session -- see docs/todo-archive.md's txt-reader entry for
// why that replay (rather than a persisted index) is enough: pagination is a pure function of
// the fixed font/screen geometry, so it always reproduces the same page-start offsets.
class BookReaderPageCoordinator {
public:
    BookReaderPageCoordinator();

    // Opens `filename`, loading its saved position (or start of file, clamped by
    // text_reader_service if the file has changed since) and building the first page.
    void Show(const std::string& filename, int portrait_width, int portrait_height);
    // delta > 0 turns to the next page; delta < 0 returns to the previous page from this
    // session's back-stack. Returns false when there's nowhere to go (delta > 0 at end of file,
    // or delta < 0 with an empty back-stack).
    bool TurnPage(int delta, int portrait_width, int portrait_height);

    epaper_ui::BookReaderPageState BuildState() const;

    const std::string& filename() const { return filename_; }
    size_t current_page_start() const { return page_start_offset_; }

private:
    void BuildPageAt(size_t offset, int portrait_width, int portrait_height);

    std::string filename_ = {};
    size_t page_start_offset_ = 0;
    size_t next_page_start_offset_ = 0;
    bool has_more_after_ = false;
    std::vector<size_t> back_stack_ = {};
    std::vector<std::string> page_lines_ = {};
    int page_number_ = 1;
};

#endif  // BOOK_READER_PAGE_COORDINATOR_H_
