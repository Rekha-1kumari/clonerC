/* ==========================================================================
   Week 3: JavaScript Logic & State Management (TaskMaster Pro)
   Student: Rekha Kumari | Web Development Internship
   ========================================================================== */

(function() {
  'use strict';

  const STORAGE_KEY = 'rekha_taskmaster_tasks_v1';
  const THEME_KEY = 'rekha_taskmaster_theme';

  // Seed sample tasks if localStorage is empty
  const defaultTasks = [
    {
      id: 'task-1',
      title: 'Complete Semantic HTML5 & WCAG 2.1 Audit',
      description: 'Audit portfolio markup for landmark roles, skip-to-content links, and ARIA labels.',
      category: 'Work',
      priority: 'High',
      dueDate: '2026-10-10',
      completed: true,
      createdAt: '2026-10-01',
      subtasks: [
        { id: 'sub-1', title: 'Verify semantic elements (<nav>, <main>, <aside>)', done: true },
        { id: 'sub-2', title: 'Test keyboard Tab navigation & skip link', done: true }
      ]
    },
    {
      id: 'task-2',
      title: 'Implement CSS Grid Bento Layout & Dark Mode',
      description: 'Design 2D responsive grid, declare custom properties, and add smooth theme transition.',
      category: 'Work',
      priority: 'High',
      dueDate: '2026-10-17',
      completed: true,
      createdAt: '2026-10-02',
      subtasks: [
        { id: 'sub-3', title: 'Configure :root and [data-theme="dark"] tokens', done: true },
        { id: 'sub-4', title: 'Ensure fluid mobile drawer at <768px', done: true }
      ]
    },
    {
      id: 'task-3',
      title: 'Integrate Open-Meteo REST Weather Dashboard',
      description: 'Build real-time asynchronous weather telemetry with geolocation API and error banners.',
      category: 'Study',
      priority: 'Medium',
      dueDate: '2026-10-31',
      completed: false,
      createdAt: '2026-10-03',
      subtasks: [
        { id: 'sub-5', title: 'Connect Geocoding search endpoint', done: true },
        { id: 'sub-6', title: 'Render 24-hour horizontal forecast cards', done: false }
      ]
    },
    {
      id: 'task-4',
      title: 'Finalize AuraMart Full-Stack E-Commerce Capstone',
      description: 'Assemble SPA routing, reactive shopping cart, discount codes, and multi-step checkout.',
      category: 'Work',
      priority: 'High',
      dueDate: '2026-11-02',
      completed: false,
      createdAt: '2026-10-03',
      subtasks: [
        { id: 'sub-7', title: 'Implement client hash routing', done: true },
        { id: 'sub-8', title: 'Connect checkout simulation and invoice generation', done: false }
      ]
    }
  ];

  // Application State
  let tasks = [];
  let currentFilter = 'all'; // 'all' | 'active' | 'completed'
  let currentCategory = 'all';
  let currentPriority = 'all';
  let currentSort = 'created-desc';
  let searchQuery = '';
  let editingTaskId = null;

  // DOM Elements
  const taskListEl = document.getElementById('task-list');
  const emptyStateEl = document.getElementById('empty-state');
  const taskModal = document.getElementById('task-modal');
  const taskForm = document.getElementById('task-form');
  const modalTitle = document.getElementById('modal-title');
  const openModalBtn = document.getElementById('open-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelModalBtn = document.getElementById('cancel-modal-btn');
  const searchInput = document.getElementById('search-input');
  const filterPills = document.querySelectorAll('.pill-btn');
  const categoryFilter = document.getElementById('category-filter');
  const priorityFilter = document.getElementById('priority-filter');
  const sortFilter = document.getElementById('sort-filter');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');
  const exportBtn = document.getElementById('export-tasks-btn');
  const themeToggle = document.getElementById('theme-toggle-btn');
  const toastEl = document.getElementById('toast-notice');

  // Stats Elements
  const totalCountEl = document.getElementById('total-tasks-count');
  const completedCountEl = document.getElementById('completed-tasks-count');
  const pendingCountEl = document.getElementById('pending-tasks-count');
  const rateCountEl = document.getElementById('completion-rate');
  const progressFillEl = document.getElementById('progress-fill');

  // Initialization
  function init() {
    loadTheme();
    loadTasks();
    attachEventListeners();
    render();
  }

  function loadTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    updateThemeIcon(next);
  }

  function updateThemeIcon(theme) {
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark' ? '&#9728;' : '&#9790;';
    }
  }

  function loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        tasks = JSON.parse(stored);
      } catch (e) {
        tasks = defaultTasks;
      }
    } else {
      tasks = defaultTasks;
      saveTasks();
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.style.display = 'block';
    setTimeout(() => {
      toastEl.style.display = 'none';
    }, 2800);
  }

  // Task Operations (CRUD)
  function createTask(taskData) {
    const newTask = {
      id: 'task-' + Date.now(),
      title: taskData.title,
      description: taskData.description || '',
      category: taskData.category || 'General',
      priority: taskData.priority || 'Medium',
      dueDate: taskData.dueDate || '',
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
      subtasks: taskData.subtasks || []
    };
    tasks.unshift(newTask);
    saveTasks();
    render();
    showToast('✓ Task created successfully!');
  }

  function updateTask(id, updatedFields) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedFields };
      saveTasks();
      render();
      showToast('✓ Task updated!');
    }
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
    showToast('Task removed.');
  }

  function toggleTaskCompletion(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      render();
      if (task.completed) {
        showToast('🎉 Task completed! Keep going!');
      }
    }
  }

  function toggleSubtask(taskId, subtaskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.subtasks) {
      const sub = task.subtasks.find(s => s.id === subtaskId);
      if (sub) {
        sub.done = !sub.done;
        // If all subtasks done, optionally mark task complete
        const allDone = task.subtasks.every(s => s.done);
        if (allDone && !task.completed) {
          task.completed = true;
        }
        saveTasks();
        render();
      }
    }
  }

  function clearCompleted() {
    const count = tasks.filter(t => t.completed).length;
    if (count === 0) return;
    if (confirm(`Remove ${count} completed task(s)?`)) {
      tasks = tasks.filter(t => !t.completed);
      saveTasks();
      render();
      showToast('Completed tasks cleared.');
    }
  }

  // Filter & Search Logic
  function getFilteredTasks() {
    return tasks.filter(task => {
      // Status filter
      if (currentFilter === 'active' && task.completed) return false;
      if (currentFilter === 'completed' && !task.completed) return false;

      // Category filter
      if (currentCategory !== 'all' && task.category.toLowerCase() !== currentCategory.toLowerCase()) {
        return false;
      }

      // Priority filter
      if (currentPriority !== 'all' && task.priority.toLowerCase() !== currentPriority.toLowerCase()) {
        return false;
      }

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        const matchesCat = task.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (currentSort === 'due-asc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (currentSort === 'priority-desc') {
        const weight = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return (weight[b.priority] || 0) - (weight[a.priority] || 0);
      }
      if (currentSort === 'alpha-asc') {
        return a.title.localeCompare(b.title);
      }
      // default: created-desc
      return (b.id > a.id) ? 1 : -1;
    });
  }

  // Metrics update
  function updateMetrics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

    totalCountEl.textContent = total;
    completedCountEl.textContent = completed;
    pendingCountEl.textContent = pending;
    rateCountEl.textContent = `${rate}%`;
    progressFillEl.style.width = `${rate}%`;
  }

  // Render UI
  function render() {
    updateMetrics();
    const filtered = getFilteredTasks();

    if (filtered.length === 0) {
      taskListEl.innerHTML = '';
      emptyStateEl.style.display = 'block';
      return;
    }

    emptyStateEl.style.display = 'none';
    taskListEl.innerHTML = filtered.map(task => {
      const priorityClass = `priority-${task.priority.toLowerCase()}`;
      const badgeClass = `badge-${task.priority.toLowerCase()}`;

      // Subtasks HTML
      let subtasksHtml = '';
      if (task.subtasks && task.subtasks.length > 0) {
        subtasksHtml = `
          <div class="subtasks-box">
            ${task.subtasks.map(sub => `
              <div class="subtask-item ${sub.done ? 'done' : ''}" data-subtask-id="${sub.id}" data-task-id="${task.id}">
                <span style="font-size: 0.9rem;">${sub.done ? '&#9745;' : '&#9744;'}</span>
                <span>${escapeHtml(sub.title)}</span>
              </div>
            `).join('')}
          </div>
        `;
      }

      return `
        <article class="task-card ${priorityClass} ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
          <div class="task-checkbox-wrap">
            <button class="custom-checkbox ${task.completed ? 'checked' : ''}" aria-label="Toggle completion status" data-action="toggle">
              ${task.completed ? '&#10003;' : ''}
            </button>
          </div>

          <div class="task-info">
            <h3 class="task-title">${escapeHtml(task.title)}</h3>
            ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ''}
            
            <div class="task-meta-bar">
              <span class="badge ${badgeClass}">${task.priority} Priority</span>
              <span class="badge badge-cat">&#128193; ${escapeHtml(task.category)}</span>
              ${task.dueDate ? `
                <span class="due-date-pill">
                  &#128197; Due: ${task.dueDate}
                </span>
              ` : ''}
            </div>

            ${subtasksHtml}
          </div>

          <div class="task-actions">
            <button class="action-btn edit-btn" title="Edit Task" data-action="edit">
              &#9998;
            </button>
            <button class="action-btn delete-btn" title="Delete Task" data-action="delete">
              &#128465;
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Delegated Event Handlers
  function attachEventListeners() {
    // Delegated task clicks
    taskListEl.addEventListener('click', function(e) {
      const card = e.target.closest('.task-card');
      if (!card) return;
      const taskId = card.getAttribute('data-task-id');

      // Checkbox click
      if (e.target.closest('[data-action="toggle"]')) {
        toggleTaskCompletion(taskId);
        return;
      }

      // Delete action
      if (e.target.closest('[data-action="delete"]')) {
        deleteTask(taskId);
        return;
      }

      // Edit action
      if (e.target.closest('[data-action="edit"]')) {
        openEditModal(taskId);
        return;
      }

      // Subtask toggle
      const subtaskItem = e.target.closest('.subtask-item');
      if (subtaskItem) {
        const subId = subtaskItem.getAttribute('data-subtask-id');
        toggleSubtask(taskId, subId);
      }
    });

    // Search query input
    searchInput.addEventListener('input', function(e) {
      searchQuery = e.target.value.trim();
      render();
    });

    // Filter pills (All, Active, Completed)
    filterPills.forEach(pill => {
      pill.addEventListener('click', function() {
        filterPills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.getAttribute('data-filter');
        render();
      });
    });

    // Category filter
    categoryFilter.addEventListener('change', function(e) {
      currentCategory = e.target.value;
      render();
    });

    // Priority filter
    priorityFilter.addEventListener('change', function(e) {
      currentPriority = e.target.value;
      render();
    });

    // Sort filter
    sortFilter.addEventListener('change', function(e) {
      currentSort = e.target.value;
      render();
    });

    // Clear completed
    clearCompletedBtn.addEventListener('click', clearCompleted);

    // Modal triggers
    openModalBtn.addEventListener('click', () => openCreateModal());
    closeModalBtn.addEventListener('click', () => closeModal());
    cancelModalBtn.addEventListener('click', () => closeModal());
    taskModal.addEventListener('click', (e) => {
      if (e.target === taskModal) closeModal();
    });

    // Form submission
    taskForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const title = document.getElementById('form-task-title').value.trim();
      const desc = document.getElementById('form-task-desc').value.trim();
      const category = document.getElementById('form-task-category').value;
      const priority = document.getElementById('form-task-priority').value;
      const dueDate = document.getElementById('form-task-date').value;
      const subtaskRaw = document.getElementById('form-task-subtasks').value.trim();

      if (!title) return;

      const subtasks = subtaskRaw
        ? subtaskRaw.split('
').filter(s => s.trim().length > 0).map((text, idx) => ({
            id: 'sub-' + Date.now() + '-' + idx,
            title: text.trim(),
            done: false
          }))
        : [];

      if (editingTaskId) {
        updateTask(editingTaskId, {
          title,
          description: desc,
          category,
          priority,
          dueDate,
          ...(subtasks.length > 0 ? { subtasks } : {})
        });
      } else {
        createTask({
          title,
          description: desc,
          category,
          priority,
          dueDate,
          subtasks
        });
      }

      closeModal();
    });

    // Export tasks as JSON
    exportBtn.addEventListener('click', function() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `TaskMaster_Backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Exported tasks JSON file.');
    });

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Keyboard Shortcuts
    document.addEventListener('keydown', function(e) {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
      if (e.key === 'Escape' && taskModal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  function openCreateModal() {
    editingTaskId = null;
    modalTitle.textContent = 'Create New Task';
    taskForm.reset();
    document.getElementById('form-task-date').value = new Date().toISOString().split('T')[0];
    taskModal.classList.add('open');
    document.getElementById('form-task-title').focus();
  }

  function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    editingTaskId = taskId;
    modalTitle.textContent = 'Edit Task';
    document.getElementById('form-task-title').value = task.title;
    document.getElementById('form-task-desc').value = task.description || '';
    document.getElementById('form-task-category').value = task.category;
    document.getElementById('form-task-priority').value = task.priority;
    document.getElementById('form-task-date').value = task.dueDate || '';
    document.getElementById('form-task-subtasks').value = task.subtasks ? task.subtasks.map(s => s.title).join('
') : '';

    taskModal.classList.add('open');
    document.getElementById('form-task-title').focus();
  }

  function closeModal() {
    taskModal.classList.remove('open');
    editingTaskId = null;
  }

  // Start app
  init();
})();
