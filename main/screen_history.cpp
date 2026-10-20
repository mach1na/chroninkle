#include "screen_history.h"

#include <mutex>
#include <vector>

namespace screen_history {
namespace {

constexpr size_t kMaxDepth = 16;

std::mutex s_mutex;
std::vector<Entry> s_stack;

bool IsRecordable(display_service::ScreenId screen)
{
    return screen != display_service::ScreenId::kOnboarding &&
           screen != display_service::ScreenId::kLockScreen;
}

}  // namespace

void OnNavigate(const Entry& leaving, display_service::ScreenId target)
{
    std::lock_guard<std::mutex> lock(s_mutex);
    if (target == display_service::ScreenId::kHome) {
        s_stack.clear();
        return;
    }
    for (size_t index = s_stack.size(); index > 0; --index) {
        if (s_stack[index - 1].screen == target) {
            s_stack.resize(index - 1);
            return;
        }
    }
    if (leaving.screen == target || !IsRecordable(leaving.screen)) {
        return;
    }
    if (s_stack.size() >= kMaxDepth) {
        s_stack.erase(s_stack.begin());
    }
    s_stack.push_back(leaving);
}

bool Top(Entry* entry)
{
    std::lock_guard<std::mutex> lock(s_mutex);
    if (s_stack.empty()) {
        return false;
    }
    if (entry != nullptr) {
        *entry = s_stack.back();
    }
    return true;
}

void Clear()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    s_stack.clear();
}

}  // namespace screen_history
