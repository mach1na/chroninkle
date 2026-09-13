#include "epaper_ui/book_reader_page.h"

#include <algorithm>
#include <cctype>

#include "render_utils.h"

namespace epaper_ui {
namespace {

constexpr auto kTitleRole = design::TypographyRole::kHeadingH2;
constexpr auto kBodyRole = design::TypographyRole::kBody;
constexpr auto kPageIndicatorRole = design::TypographyRole::kLabelSmallBlack;
constexpr int kSideInset = design::spacing::k16;
constexpr int kTopGap = design::spacing::k24;
constexpr int kTitleContentGap = design::spacing::k16;
constexpr int kContentIndicatorGap = design::spacing::k8;
constexpr int kIndicatorFooterGap = design::spacing::k16;

int FooterTop(int portrait_height)
{
    return portrait_height - design::global_footer::kBottomPadding -
           design::global_footer::kButtonSize;
}

struct Layout {
    UiRect title = {};
    UiRect content = {};
    UiRect page_indicator = {};
};

Layout BuildLayout(int portrait_width, int portrait_height)
{
    const int page_x = kSideInset;
    const int page_width = std::max(0, portrait_width - (2 * kSideInset));
    const int title_y = StatusBarHeight() + kTopGap;

    Layout layout = {};
    layout.title = {page_x, title_y, page_width, LineHeight(kTitleRole)};

    const int content_top = layout.title.bottom() + kTitleContentGap;
    const int footer_top = FooterTop(portrait_height);
    const int indicator_height = LineHeight(kPageIndicatorRole);
    const int indicator_y = footer_top - kIndicatorFooterGap - indicator_height;
    const int content_height = std::max(0, indicator_y - kContentIndicatorGap - content_top);
    layout.content = {page_x, content_top, page_width, content_height};
    layout.page_indicator = {page_x, indicator_y, page_width, indicator_height};
    return layout;
}

}  // namespace

namespace {

bool IsWrapBreakChar(char c)
{
    return std::isspace(static_cast<unsigned char>(c)) != 0;
}

size_t FindNextBreak(const std::string& text, size_t from)
{
    for (size_t index = from; index < text.size(); ++index) {
        if (IsWrapBreakChar(text[index])) {
            return index;
        }
    }
    return std::string::npos;
}

}  // namespace

BookReaderPageLayout PaginateBookText(int portrait_width, int portrait_height,
                                      const std::string& raw_text)
{
    BookReaderPageLayout result = {};
    if (raw_text.empty()) {
        result.text_exhausted = true;
        return result;
    }

    const UiRect content = BuildLayout(portrait_width, portrait_height).content;
    const int line_height = std::max(1, LineHeight(kBodyRole));
    const int max_lines = content.height > 0 ? std::max(1, content.height / line_height) : 0;
    if (max_lines <= 0 || content.width <= 0) {
        result.text_exhausted = true;
        return result;
    }

    // This is a reflowing reader -- original line breaks are not preserved -- so hard-wrapped
    // source newlines (every .txt file exported from Project Gutenberg et al. hard-wraps at
    // ~70-80 columns) are normalized to spaces up front. Byte-for-byte length-preserving, so
    // consumed_bytes below still lines up with offsets in the original file. Without this,
    // epaper_font::MeasureText (which deliberately stops at the first '\r'/'\n', a safety
    // behavior other single-line UI callers rely on) silently under-reports the width of any
    // multi-word span that has a source newline in it -- which is nearly every span in a real
    // book -- so the "is this line too wide yet" check never trips and the algorithm swallows
    // the entire input buffer into one unbreakable "line".
    std::string text = raw_text;
    std::replace(text.begin(), text.end(), '\r', ' ');
    std::replace(text.begin(), text.end(), '\n', ' ');

    size_t start = 0;
    while (start < text.size() && static_cast<int>(result.lines.size()) < max_lines) {
        while (start < text.size() && IsWrapBreakChar(text[start])) {
            ++start;
        }
        if (start >= text.size()) {
            break;
        }

        size_t best_end = start;
        size_t pos = start;
        while (pos < text.size()) {
            size_t word_end = FindNextBreak(text, pos);
            if (word_end == std::string::npos) {
                word_end = text.size();
            }
            if (MeasureText(kBodyRole, text.substr(start, word_end - start)) > content.width) {
                if (best_end == start) {
                    best_end = word_end;  // a single word longer than the line: keep it whole
                }
                break;
            }
            best_end = word_end;
            if (word_end >= text.size()) {
                break;
            }
            pos = word_end + 1;
        }

        result.lines.push_back(text.substr(start, best_end - start));
        start = best_end + (best_end < text.size() ? 1 : 0);
    }

    result.consumed_bytes = start;
    result.text_exhausted = start >= text.size();
    return result;
}

void DrawBookReaderPage(uint8_t* framebuffer,
                        int raw_width,
                        int raw_height,
                        int portrait_width,
                        int portrait_height,
                        const BookReaderPageState& state,
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

    const Layout layout = BuildLayout(portrait_width, portrait_height);

    const std::string title = FitLabelText(kTitleRole, state.title_text, layout.title.width);
    if (!title.empty()) {
        DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                           layout.title.x, layout.title.y, title, kTitleRole, design::color::kBlack);
    }

    const int line_height = std::max(1, LineHeight(kBodyRole));
    int line_y = layout.content.y;
    for (const std::string& line : state.page_lines) {
        if (line_y + line_height > layout.content.bottom()) {
            break;
        }
        DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                           layout.content.x, line_y, line, kBodyRole, design::color::kBlack);
        line_y += line_height;
    }

    const std::string page_label = "Page " + std::to_string(state.page_number);
    DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                       layout.page_indicator.x, layout.page_indicator.y, page_label,
                       kPageIndicatorRole, design::color::kBlack);

    DrawGlobalFooter(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                     footer_state);
}

}  // namespace epaper_ui
