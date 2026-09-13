#ifndef TEXT_READER_SERVICE_H_
#define TEXT_READER_SERVICE_H_

#include <cstddef>
#include <cstdint>
#include <string>
#include <vector>

#include "esp_err.h"

namespace text_reader_service {

struct BookEntry {
    std::string filename = {};
    uint64_t size_bytes = 0;
};

// Ensures the configured book folder exists on the SD card. Safe to call repeatedly, and
// safe to call when the card isn't mounted yet -- the next mount just leaves the folder
// missing until this (or ListBooks) is called again.
esp_err_t Init();

// ".txt" files directly under the configured folder (no subfolder browsing), sorted the
// same way SdCard's own directory listing orders entries. Empty when the folder is
// missing or the card isn't mounted -- not an error the caller needs to distinguish from
// "no books yet".
std::vector<BookEntry> ListBooks();

// Reads up to `length` bytes of `filename` (a bare filename from ListBooks, resolved
// against the configured folder) starting at `offset` into `buffer`. Returns the number
// of bytes actually read -- 0 at/after end of file, or on any error.
size_t ReadChunk(const std::string& filename, size_t offset, char* buffer, size_t length);

uint64_t GetFileSize(const std::string& filename);

// Sidecar "<filename>.pos" position, in bytes, next to the book's own entry in the
// folder. Returns 0 (start of file) when no sidecar exists yet, or when the saved offset
// is out of range for the file's current size -- the caller re-paginates from wherever
// this clamps to.
size_t LoadPosition(const std::string& filename);
void SavePosition(const std::string& filename, size_t offset);

// Removes the book and its position sidecar (if any) from the configured folder. Returns
// true if the book file was removed or was already gone; false on an actual I/O error.
bool DeleteBook(const std::string& filename);

}  // namespace text_reader_service

#endif  // TEXT_READER_SERVICE_H_
