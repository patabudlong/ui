<template>
  <div class="table-container">
    <div class="table-header">
      <div class="header-content">
        <h2>Tasks</h2>
        <div class="description-container">
          <p class="header-description">Manage your tasks and track their progress</p>
          <div class="tooltip-container">
            <button
              class="info-icon"
              @mouseenter="showTooltip = true"
              @mouseleave="showTooltip = false"
            >
              ?
            </button>
            <div class="tooltip" v-if="showTooltip">
              Create, edit, and track your tasks efficiently. Each task can be marked as TODO, IN
              PROGRESS, or COMPLETED. Use the status indicators to monitor progress and the action
              buttons to manage tasks.
            </div>
          </div>
        </div>
      </div>
      <button class="new-task-btn" @click="$emit('showModal')">
        <span class="plus-icon">+</span>
        New Task
      </button>
    </div>

    <div v-if="loading" class="loading-state">Loading tasks...</div>
    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>
    <template v-else>
      <!-- Desktop Table -->
      <table class="task-table desktop-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Created</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.title }}</td>
            <td>{{ task.description }}</td>
            <td>{{ formatDate(task.created_at) }}</td>
            <td>
              <span class="status-badge" :class="task.status">
                {{ task.status }}
              </span>
            </td>
            <td>
              <div class="task-actions">
                <button class="action-btn edit" @click="handleEdit(task)">Edit</button>
                <button class="action-btn delete" @click="handleDelete(task)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mobile Cards -->
      <div class="mobile-cards">
        <div v-for="task in tasks" :key="task.id" class="task-card">
          <div class="card-header">
            <h3>{{ task.title }}</h3>
            <span class="status-badge" :class="task.status">
              {{ task.status }}
            </span>
          </div>
          <p class="card-description">{{ task.description }}</p>
          <div class="card-footer">
            <span class="due-date">Created: {{ formatDate(task.created_at) }}</span>
            <div class="task-actions">
              <button class="action-btn edit" @click="handleEdit(task)">Edit</button>
              <button class="action-btn delete" @click="handleDelete(task)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { taskService, type Task } from '../services/tasks'

const tasks = ref<Task[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    tasks.value = await taskService.getTasks()
  } catch (_error) {
    error.value = 'Failed to load tasks'
  } finally {
    loading.value = false
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const showTooltip = ref(false)

const handleEdit = async (task: Task) => {
  // TODO: Implement edit functionality
  console.log('Edit task:', task)
}

const handleDelete = async (task: Task) => {
  try {
    await taskService.deleteTask(task.id)
    tasks.value = tasks.value.filter((t) => t.id !== task.id)
  } catch (_error) {
    alert('Failed to delete task')
  }
}
</script>

<style scoped>
.table-container {
  width: 150%;
  background: #0f172a;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.header-content h2 {
  color: white;
  font-size: 1.75rem;
  font-weight: 500;
  margin: 0;
}

.header-description {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

.new-task-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f89c1c;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
}

.plus-icon {
  font-weight: 400;
}

.task-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.75rem;
}

th {
  text-align: left;
  padding: 0.75rem 1.5rem;
  color: #64748b;
  font-weight: 500;
  font-size: 0.95rem;
  text-transform: uppercase;
}

td {
  padding: 1.25rem 1.5rem;
  background: #1e293b;
  color: #e2e8f0;
}

tr td:first-child {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  color: white;
  font-weight: 500;
}

tr td:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

.task-title {
  font-weight: 500;
  color: #fff;
}

.task-description {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.due-date {
  color: #64748b;
  font-size: 0.875rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.todo {
  background: rgba(220, 38, 38, 0.2);
  color: #ef4444;
}

.status-badge.in_progress {
  background: rgba(245, 158, 11, 0.2);
  color: #f89c1c;
}

.status-badge.completed {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.task-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
}

.action-btn.edit {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.action-btn.delete {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

@media (max-width: 768px) {
  .table-container {
    padding: 1rem;
    border-radius: 16px;
  }

  td,
  th {
    padding: 1rem;
  }

  .table-header {
    flex-direction: column-reverse;
    gap: 1.5rem;
    align-items: flex-start;
  }

  .header-content {
    width: 100%;
  }
}

.desktop-table {
  display: table;
}

.mobile-cards {
  display: none;
}

.task-card {
  background: #1e293b;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.card-header h3 {
  color: white;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.card-description {
  color: #94a3b8;
  margin: 0.75rem 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.due-date {
  color: #64748b;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .desktop-table {
    display: none;
  }

  .mobile-cards {
    display: block;
  }

  .task-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.75rem;
    width: 100%;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
    text-align: center;
  }

  .card-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}

.description-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #1e293b;
  color: #64748b;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
}

.info-icon:hover {
  background: #2d3748;
  color: #94a3b8;
}

.tooltip-container {
  position: relative;
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  width: 280px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
  line-height: 1.5;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: #1e293b transparent transparent transparent;
}

@media (max-width: 768px) {
  .tooltip {
    width: 240px;
    font-size: 0.8rem;
    left: auto;
    right: 0;
    transform: none;
  }

  .tooltip::after {
    left: auto;
    right: 5px;
    transform: none;
  }
}

.loading-state,
.error-state {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 1rem;
}

.error-state {
  color: #ef4444;
}
</style>
