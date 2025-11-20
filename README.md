# 🗒️ NoteKeeper

A modern desktop note-taking application built in **C++20** using **Qt 6**, inspired by Google Keep.  
Users can create, edit, delete, and organize notes with a clean UI and persistent storage.

---

## Overview

---

## 🚀 Features

* 📝 Create, edit, and delete notes - manage your notes with ease
* 🔍 Search by title or content - quickly find what you need  
* 🗂️ Organize by category - group notes by topics like Work, Personal, etc 
* 💾 Auto-save to MySQL database - your notes are always stored safely
* 🪟 Modern Qt UI - built with QMainWindow, QListWidget, QTextEdit, and more  
* 🧠 MVC architecture - clean separation of data, logic, and presentation

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
├── src/
  ├── main.cpp
  ├── controller/
    ├── NoteController.cpp  # Handle user actions (create, edit, delete), Communicate with "NoteRepository", Update the view after data changes and Maintain current note state.
  ├── model/
    ├── Note.cpp # represents a single note
    ├── Databasemanager.cpp  # manages MySQL connection and queries
    ├── NoteRepository.cpp  # handles CRUD operations for notes
  ├── view/
    ├── MainWindow.cpp  # main application window
    ├── NoteListView.cpp  # list of notes (titles, snippets)
    ├── NoteEditorView.cpp # text editor for creating/editing notes
  ├── utils/
    ├── config.cpp
├── include/
  ├──controller/
    ├── NoteController.hpp
  ├── model/
    ├── Note.hpp
    ├── Databasemanager.hpp
    ├── NoteRepository.hpp
  ├── view/
    ├── MainWindow.hpp 
    ├── NoteListView.hpp 
    ├── NoteEditorView.hpp
  ├── utils/
    ├── config.hpp
├── ressources
  ├── icons/
  ├── styles
  ├── schema.sql
├── docs/
  ├── architecture.md
├── .gitignore

```
--- 

## 🧑‍💻 Author

---

## 📝 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute it freely.
