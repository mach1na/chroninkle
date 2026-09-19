idf_component_register(
    SRCS "audio_settings_service.cpp"
    INCLUDE_DIRS "include"
    REQUIRES board nvs_flash
)

target_compile_features(${COMPONENT_LIB} PUBLIC cxx_std_17)
