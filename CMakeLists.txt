

cmake_minimum_required(VERSION 3.16)

# Project's name and language
project(NoteKeeper VERSION 1.0 LANGUAGES CXX)

#C++20 Standard activate
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Qt Setup
find_package(Qt6 REQUIRED COMPONENTS Core Gui Widgets Sql)

# Include directories
include_directories(
    ${CMAKE_SOURCE_DIR}/include
    ${CMAKE_SOURCE_DIR}/include/model
    ${CMAKE_SOURCE_DIR}/include/view
    ${CMAKE_SOURCE_DIR}/include/controller
    ${CMAKE_SOURCE_DIR}/include/utils
)

# Source files
file(GLOB_RECURSE SOURCES
    ${CMAKE_SOURCE_DIR}/src/*.cpp
)

# Executable
add_executable(${PROJECT_NAME} ${SOURCES})

# Link Qt Libraries
target_link_libraries(${PROJECT_NAME}
    Qt6::Core
    Qt6::Gui
    Qt6::Widgets
    Qt6::Sql
)

# Output directories
set_target_properties(${PROJECT_NAME} PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin
)
