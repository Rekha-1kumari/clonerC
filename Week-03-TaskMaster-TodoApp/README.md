# Week 3: JavaScript Logic & State Management (TaskMaster Pro)

**Student Developer:** Rekha Kumari  
**Repository:** [github.com/Rekha-1kumari/clonerC](https://github.com/Rekha-1kumari/clonerC)  
**Due Date:** 24 Oct 2026 (Completed)

---

## Project Overview
TaskMaster Pro is a client-side state-driven task management application built with pure Vanilla JavaScript, mastering DOM manipulation, delegated event listeners, and automatic `window.localStorage` persistence.

### Key Features Implemented:
1. **Full CRUD Architecture:**
   - **Create:** Modal form supporting title, multiline description, category tags, priority levels, due date picker, and subtasks.
   - **Read:** Dynamic card rendering with status styling, priority badges, and checklists.
   - **Update:** Complete task editing and immediate state synchronization.
   - **Delete:** Single task removal and bulk "Clear Completed" action.
2. **Local Data Persistence:**
   - Automatically synchronizes all task state, completion flags, and subtasks to `window.localStorage`.
   - Data persists across browser refreshes and tab closures.
   - Built-in JSON Export backup functionality.
3. **Advanced Filtering & Sorting:**
   - Status filters: `All`, `Active`, `Completed`.
   - Category filtering (`Work`, `Study`, `Personal`).
   - Priority filtering (`High`, `Medium`, `Low`).
   - Real-time instant search input matching titles, descriptions, and categories.
   - Multi-criteria sorting (Newest, Due Date, Priority, Alphabetical).
4. **Performance & Event Delegation:**
   - Uses a single delegated click listener on `#task-list` for maximum DOM performance.
   - Real-time progress bar calculation and completion percentage metrics.
   - Keyboard shortcuts (`/` to focus search, `Esc` to close modal).

---

## How to Test:
- Open `index.html` in your browser.
- Add, complete, and delete tasks to test CRUD operations.
- Refresh the browser to verify data persistence in localStorage.
- Use the search bar and filter dropdowns to test real-time state filtering.
