#include "text_reader_service.h"

#include <algorithm>
#include <cctype>
#include <cerrno>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <dirent.h>
#include <sys/stat.h>
#include <unistd.h>

#include "esp_log.h"
#include "sdkconfig.h"
#include "storage_service.h"

namespace text_reader_service {
namespace {

constexpr const char* kTag = "TextReaderService";
constexpr const char* kPositionSuffix = ".pos";

std::string JoinPath(const std::string& left, const std::string& right)
{
    if (left.empty()) {
        return right;
    }
    if (right.empty()) {
        return left;
    }
    if (left.back() == '/') {
        return left + right;
    }
    return left + "/" + right;
}

std::string FolderPath()
{
    return JoinPath(storage_service::MountPoint(), CONFIG_CHRONINKLE_TEXT_READER_FOLDER);
}

std::string BookPath(const std::string& filename)
{
    return JoinPath(FolderPath(), filename);
}

std::string PositionSidecarPath(const std::string& filename)
{
    return BookPath(filename) + kPositionSuffix;
}

bool HasTxtExtension(const std::string& name)
{
    constexpr size_t kExtLen = 4;  // ".txt"
    if (name.size() <= kExtLen) {
        return false;
    }
    std::string ext = name.substr(name.size() - kExtLen);
    std::transform(ext.begin(), ext.end(), ext.begin(),
                   [](unsigned char c) { return static_cast<char>(std::tolower(c)); });
    return ext == ".txt";
}

// Filters out dotfiles: macOS in particular litters any folder it writes to over OTG/USB
// mass storage with ".DS_Store" and, for every real file it copies onto a non-HFS+ volume
// like this SD card's FAT32, a same-named "._<file>" AppleDouble resource-fork sidecar --
// which would otherwise pass HasTxtExtension outright (e.g. "._Dracula.txt").
bool IsHiddenName(const std::string& name)
{
    return !name.empty() && name.front() == '.';
}

}  // namespace

esp_err_t Init()
{
    const std::string folder = FolderPath();
    errno = 0;
    if (mkdir(folder.c_str(), 0775) == 0 || errno == EEXIST) {
        return ESP_OK;
    }
    ESP_LOGW(kTag, "Create folder failed: path=%s errno=%d (%s)", folder.c_str(), errno,
             std::strerror(errno));
    return ESP_FAIL;
}

std::vector<BookEntry> ListBooks()
{
    std::vector<BookEntry> books;
    const std::string folder = FolderPath();

    errno = 0;
    DIR* dir = opendir(folder.c_str());
    if (dir == nullptr) {
        if (errno != ENOENT) {
            ESP_LOGW(kTag, "opendir(%s) failed: errno=%d", folder.c_str(), errno);
        }
        return books;
    }

    while (true) {
        errno = 0;
        struct dirent* entry = readdir(dir);
        if (entry == nullptr) {
            if (errno != 0) {
                ESP_LOGW(kTag, "readdir(%s) failed: errno=%d", folder.c_str(), errno);
            }
            break;
        }

        const std::string name = entry->d_name;
        if (IsHiddenName(name) || !HasTxtExtension(name)) {
            continue;
        }

        struct stat st = {};
        if (stat(JoinPath(folder, name).c_str(), &st) != 0 || S_ISDIR(st.st_mode)) {
            continue;
        }

        books.push_back({.filename = name, .size_bytes = static_cast<uint64_t>(st.st_size)});
    }
    closedir(dir);

    std::sort(books.begin(), books.end(), [](const BookEntry& lhs, const BookEntry& rhs) {
        return lhs.filename < rhs.filename;
    });
    return books;
}

size_t ReadChunk(const std::string& filename, size_t offset, char* buffer, size_t length)
{
    if (buffer == nullptr || length == 0) {
        return 0;
    }

    FILE* file = std::fopen(BookPath(filename).c_str(), "rb");
    if (file == nullptr) {
        return 0;
    }

    size_t bytes_read = 0;
    if (std::fseek(file, static_cast<long>(offset), SEEK_SET) == 0) {
        bytes_read = std::fread(buffer, 1, length, file);
    }
    std::fclose(file);
    return bytes_read;
}

uint64_t GetFileSize(const std::string& filename)
{
    struct stat st = {};
    if (stat(BookPath(filename).c_str(), &st) != 0) {
        return 0;
    }
    return static_cast<uint64_t>(st.st_size);
}

size_t LoadPosition(const std::string& filename)
{
    FILE* file = std::fopen(PositionSidecarPath(filename).c_str(), "rb");
    if (file == nullptr) {
        return 0;
    }
    char text[32] = {};
    const size_t bytes_read = std::fread(text, 1, sizeof(text) - 1, file);
    std::fclose(file);
    text[bytes_read] = '\0';

    const long parsed = std::strtol(text, nullptr, 10);
    if (parsed <= 0) {
        return 0;
    }

    // Clamp against the file's current size: covers the book having been replaced or
    // truncated externally since the position was last saved. The reader re-paginates
    // from offset 0 in that case rather than trying to resume mid-word or past EOF.
    const uint64_t size_bytes = GetFileSize(filename);
    const size_t offset = static_cast<size_t>(parsed);
    return offset < size_bytes ? offset : 0;
}

void SavePosition(const std::string& filename, size_t offset)
{
    FILE* file = std::fopen(PositionSidecarPath(filename).c_str(), "wb");
    if (file == nullptr) {
        ESP_LOGW(kTag, "Save position failed to open sidecar for %s", filename.c_str());
        return;
    }
    std::fprintf(file, "%zu\n", offset);
    std::fclose(file);
}

bool DeleteBook(const std::string& filename)
{
    // Sidecar first: if the process is interrupted between the two removals, leaving a
    // stray .pos behind is harmless (ListBooks only ever looks at .txt files), whereas
    // leaving the book behind with its position already gone is a worse partial state.
    errno = 0;
    if (unlink(PositionSidecarPath(filename).c_str()) != 0 && errno != ENOENT) {
        ESP_LOGW(kTag, "Delete position sidecar for %s failed: errno=%d (%s)", filename.c_str(),
                 errno, std::strerror(errno));
    }

    errno = 0;
    if (unlink(BookPath(filename).c_str()) != 0 && errno != ENOENT) {
        ESP_LOGW(kTag, "Delete book %s failed: errno=%d (%s)", filename.c_str(), errno,
                 std::strerror(errno));
        return false;
    }
    return true;
}

}  // namespace text_reader_service
