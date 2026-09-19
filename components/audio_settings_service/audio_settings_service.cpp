#include "audio_settings_service.h"

#include <mutex>

#include "esp_log.h"
#include "nvs.h"
#include "sdkconfig.h"
#include "waveshare_board.h"

namespace audio_settings_service {
namespace {

constexpr const char* kTag = "AudioSettingsService";
constexpr const char* kNvsNamespace = "audio_cfg";
constexpr const char* kVolumePercentNvsKey = "volume_pct";

std::mutex s_mutex;
int s_output_volume_percent = CONFIG_FOLLOWUP_DEFAULT_VOLUME_PERCENT;

bool IsValidVolumePercent(int percent)
{
    return percent >= 0 && percent <= 100 && percent % 10 == 0;
}

void LoadVolumeFromStorage()
{
    int32_t percent = CONFIG_FOLLOWUP_DEFAULT_VOLUME_PERCENT;
    nvs_handle_t handle = 0;
    if (nvs_open(kNvsNamespace, NVS_READONLY, &handle) == ESP_OK) {
        (void)nvs_get_i32(handle, kVolumePercentNvsKey, &percent);
        nvs_close(handle);
    }
    if (!IsValidVolumePercent(static_cast<int>(percent))) {
        percent = CONFIG_FOLLOWUP_DEFAULT_VOLUME_PERCENT;
    }
    std::lock_guard<std::mutex> lock(s_mutex);
    s_output_volume_percent = static_cast<int>(percent);
}

bool SaveVolumeToStorage(int percent)
{
    nvs_handle_t handle = 0;
    if (nvs_open(kNvsNamespace, NVS_READWRITE, &handle) != ESP_OK) {
        return false;
    }
    esp_err_t err = nvs_set_i32(handle, kVolumePercentNvsKey, static_cast<int32_t>(percent));
    if (err == ESP_OK) {
        err = nvs_commit(handle);
    }
    nvs_close(handle);
    return err == ESP_OK;
}

void ApplyToCodec(int percent)
{
    AudioCodec* codec = waveshare_board::GetAudioCodec();
    if (codec == nullptr) {
        ESP_LOGW(kTag, "Apply volume failed: codec not available");
        return;
    }
    codec->SetOutputVolume(percent);
}

}  // namespace

esp_err_t Init()
{
    LoadVolumeFromStorage();
    ApplyToCodec(GetOutputVolumePercent());
    return ESP_OK;
}

int GetOutputVolumePercent()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    return s_output_volume_percent;
}

bool SetOutputVolumePercent(int percent)
{
    if (!IsValidVolumePercent(percent)) {
        return false;
    }
    if (!SaveVolumeToStorage(percent)) {
        return false;
    }
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_output_volume_percent = percent;
    }
    ApplyToCodec(percent);
    return true;
}

}  // namespace audio_settings_service
