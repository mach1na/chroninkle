#ifndef AUDIO_SETTINGS_SERVICE_H_
#define AUDIO_SETTINGS_SERVICE_H_

#include "esp_err.h"

namespace audio_settings_service {

// Loads the saved output volume from NVS (falling back to the Kconfig default when unset) and
// applies it to the shared codec instance via waveshare_board::GetAudioCodec().
esp_err_t Init();

// Current output volume, 0-100 percent.
int GetOutputVolumePercent();

// Persists a new output volume (must be 0-100 in steps of 10, matching the Sound settings
// picker's fixed choices) to NVS and applies it live to the codec. Returns false on an invalid
// value or NVS failure.
bool SetOutputVolumePercent(int percent);

}  // namespace audio_settings_service

#endif  // AUDIO_SETTINGS_SERVICE_H_
