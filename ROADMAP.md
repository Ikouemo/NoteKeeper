## 🧠 Project Overview

**Name:** `NoteKeeper`
**Goal:** A desktop application (similar to Google Keep) where users can create, edit, delete, search, and organize notes.

**Core Features:**

* Create text notes with title and content
* Edit and delete notes
* Search notes by title/content
* Organize notes by category (e.g., Work, Personal)
* Auto-save to local **MySQL database**
* Simple, modern **Qt UI**
* MVC architecture with clear separation of concerns

---

## 🏗️ Architecture Breakdown (MVC Pattern)

### **Model (Data Layer)**

Responsible for representing data and communicating with the database.

**Classes:**

* `Note` → represents a single note
* `Category` → represents note categories (optional in v1)
* `DatabaseManager` → manages MySQL connection and queries
* `NoteRepository` → handles CRUD operations for notes

**Responsibilities:**

* Create/read/update/delete notes
* Manage DB schema and connections
* Return data objects to the controller

---

### **View (UI Layer)**

Responsible for user interaction and presentation.

**Components:**

* `MainWindow` → main application window
* `NoteListView` → list of notes (titles, snippets)
* `NoteEditorView` → text editor for creating/editing notes
* `SearchBar` → for quick filtering
* `CategoryFilter` (optional)

**UI Library:**
Use **Qt Widgets** (QMainWindow, QListWidget, QTextEdit, QLineEdit, QPushButton, QVBoxLayout, etc.)

---

### **Controller (Logic Layer)**

Acts as the bridge between UI and data.

**Classes:**

* `NoteController`
* `CategoryController` (optional)

**Responsibilities:**

* Handle user actions (create, edit, delete)
* Communicate with `NoteRepository`
* Update the view after data changes
* Maintain current note state

---

## 🧰 Tech Stack

| Component       | Choice                              |
| --------------- | ----------------------------------- |
| Language        | C++20                               |
| GUI Framework   | Qt 6                                |
| Database        | MySQL (or SQLite for simpler setup) |
| Build System    | CMake                               |
| Version Control | Git + GitHub                        |
| Task Tracking   | Trello or Jira (Free)               |
| IDE             | CLion / Qt Creator                  |

---

## 📁 Project Folder Structure

```
NoteKeeper/
├── CMakeLists.txt
├── README.md
├── src/
│   ├── main.cpp
│   ├── controller/
│   │   └── NoteController.cpp
│   ├── model/
│   │   ├── Note.cpp
│   │   ├── DatabaseManager.cpp
│   │   └── NoteRepository.cpp
│   ├── view/
│   │   ├── MainWindow.cpp
│   │   ├── NoteListView.cpp
│   │   └── NoteEditorView.cpp
│   └── utils/
│       └── Config.cpp
├── include/
│   ├── controller/
│   │   └── NoteController.h
│   ├── model/
│   │   ├── Note.h
│   │   ├── DatabaseManager.h
│   │   └── NoteRepository.h
│   ├── view/
│   │   ├── MainWindow.h
│   │   ├── NoteListView.h
│   │   └── NoteEditorView.h
│   └── utils/
│       └── Config.h
├── resources/
│   ├── icons/
│   ├── styles/
│   └── schema.sql
└── docs/
    └── architecture.md
```

---

## 🧩 Database Schema

**Table: `notes`**

| Field        | Type                     | Description       |
| ------------ | ------------------------ | ----------------- |
| `id`         | INT (AUTO_INCREMENT, PK) | Unique note ID    |
| `title`      | VARCHAR(255)             | Note title        |
| `content`    | TEXT                     | Note body         |
| `category`   | VARCHAR(100)             | Optional category |
| `created_at` | DATETIME                 | Timestamp         |
| `updated_at` | DATETIME                 | Timestamp         |

---

## 🧾 Feature Roadmap

### **Phase 1 – Base Version**

1. Setup project & connect to MySQL
2. Create `Note` model and `NoteRepository`
3. Implement basic CRUD operations
4. Build UI with list of notes + editor area
5. Add create, edit, delete functionality

### **Phase 2 – Usability & Design**

6. Add search bar (filter by title)
7. Add category filter
8. Improve layout & styles
9. Add autosave (every few seconds or on focus lost)

### **Phase 3 – Extra Features**

10. Add color labels or tags
11. Add note pinning (priority display)
12. Export notes to text files or JSON
13. Add settings menu (e.g., dark mode)

---

## 📋 Trello / Jira Ticket Suggestions

| ID  | Title                    | Type    | Description                                  |
| --- | ------------------------ | ------- | -------------------------------------------- |
| #1  | Setup Project Structure  | Task    | Create folders, CMakeLists.txt, and Git repo |
| #2  | Initialize Database      | Task    | Create MySQL schema and test connection      |
| #3  | Implement Note Model     | Feature | Add Note class and getters/setters           |
| #4  | Implement NoteRepository | Feature | CRUD with prepared statements                |
| #5  | Build Main Window        | UI      | Create main layout with list + editor        |
| #6  | Implement Create Note    | Feature | Add button to create new note                |
| #7  | Implement Edit Note      | Feature | Edit and save note content                   |
| #8  | Implement Delete Note    | Feature | Delete selected note from DB                 |
| #9  | Add Search Bar           | Feature | Filter notes by title text                   |
| #10 | UI Polish                | UI      | Add styles and icons                         |

---

## 🧠 Learning Goals for Your Friends

They will gain hands-on experience with:

* **Modern C++ (C++17/20)**
* **Qt GUI design and signals/slots**
* **MVC architecture**
* **SQL queries and DB integration**
* **Git version control workflows**
* **Documentation & issue tracking**
* **Practical software development patterns**

## Architecture

```txt
+---------------------------------------------------+
|                   User Interface                  |
| (Qt Widgets: MainWindow, NoteListView, EditorView)|
+------------------------▲--------------------------+
                         │
                         │ (User actions / Signals)
                         ▼
+---------------------------------------------------+
|                    Controller                     |
|              (NoteController class)               |
| Handles UI actions, updates model and view logic  |
+------------------------▲--------------------------+
                         │
                         │ (Function calls / Data)
                         ▼
+---------------------------------------------------+
|                      Model                        |
|     (Note, NoteRepository, DatabaseManager)       |
| Represents data, handles persistence and CRUD ops |
+------------------------▲--------------------------+
                         │
                         │ (SQL queries / results)
                         ▼
+---------------------------------------------------+
|                  MySQL Database                   |
|   Table: notes (id, title, content, category...)  |
+---------------------------------------------------+

```