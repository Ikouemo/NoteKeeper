# 🗒️ NoteKeeper

A modern desktop note-taking application built in **C++20** using **Qt 6**, inspired by Google Keep.  
Users can create, edit, delete, and organize notes with a clean UI and persistent storage.

---

## Overview

---

## 🚀 Features

* 📝 Create, edit, and delete notes  
* 🔍 Search by title or content  
* 🗂️ Organize by category  
* 💾 Auto-save to MySQL database  
* 🪟 Modern Qt UI (QMainWindow, QListWidget, QTextEdit, etc.)  
* 🧠 MVC architecture for clean separation of logic

---

##  🛠️ Tech Stack
* Language: C++17/20
* Framework: Qt6
* Database: MySQL/PostgreSQL
* Build System: CMake
* Version COntrol: Git + GitHub
* Task Tracking: Trello
* Method: Kanban
* IDE: CLion / VS Code / Qt Creator
  
---

## 🧱 Project Structure

```
Notekeeper/
├── CMakeLists.txt
├── README.md
├── main.cpp
├── NoteController.cpp / NoteController.hpp # Handle user actions (create, edit, delete), Communicate with "NoteRepository", Update the view after data changes and Maintain current note state.
├── Note.cpp / Note.hpp # represents a single note
├── Databasemanager.cpp / Databasemanager.hpp # manages MySQL connection and queries
├── NoteRepository.cpp / NoteRepository.hpp # handles CRUD operations for notes
├── MainWindow.cpp / MainWindow.hpp # main application window
├── NoteListView.cpp / NoteListView.hpp # list of notes (titles, snippets)
├── NoteEditorView.cpp / NoteEditorView.hpp # text editor for creating/editing notes
├── config.cpp / config.hpp
├── icons
├── styles
├── schema.sql
├── docs
├── architecture.md
├── .gitignore

```
--- 

## 🧑‍💻 Author

---

## 📝 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute it freely.
