idf_component_register(
    SRCS "text_reader_service.cpp"
    INCLUDE_DIRS "include"
    REQUIRES storage_service
)

target_compile_features(${COMPONENT_LIB} PUBLIC cxx_std_17)
