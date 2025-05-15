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
      <button class="new-task-btn" @click="showModal = true">
        <span class="plus-icon">+</span>
        New Task
      </button>
    </div>

    <!-- Task Form Modal -->
    <TaskForm
      v-if="showModal"
      mode="create"
      @close="showModal = false"
      @success="loadTasks()"
      @showToast="showToast"
    />

    <!-- Edit Task Modal -->
    <TaskForm
      v-if="showEditModal"
      mode="edit"
      :taskToEdit="taskToEdit"
      @close="showEditModal = false"
      @success="loadTasks()"
      @showToast="showToast"
    />

    <!-- Table Structure Always Present -->
    <table class="task-table desktop-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading" class="loading-row">
          <td colspan="5">
            <div class="loading-state">
              <div class="loading-spinner"></div>
              Loading tasks...
            </div>
          </td>
        </tr>
        <tr v-else-if="error" class="error-row">
          <td colspan="5">
            <div class="error-state">
              {{ error }}
              <button @click="loadTasks" class="retry-btn">Retry</button>
            </div>
          </td>
        </tr>
        <tr v-else-if="tasks.length === 0" class="empty-row">
          <td colspan="5">
            <div class="empty-state">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              <p>No tasks found</p>
              <button class="new-task-btn" @click="showModal = true">
                <span class="plus-icon">+</span>
                Create New Task
              </button>
            </div>
          </td>
        </tr>
        <template v-else>
          <tr
            v-for="task in paginatedTasks"
            :key="task.id"
            :class="{ 'overdue-row': isOverdue(task.due_date) && task.status !== 'completed' }"
          >
            <td>{{ task.title }}</td>
            <td>
              <span
                :class="{ 'empty-description': !task.description }"
                :title="task.description || 'No description'"
              >
                {{ truncateDescription(task.description) }}
              </span>
            </td>
            <td>
              <span
                :class="{ 'overdue-date': isOverdue(task.due_date) && task.status !== 'completed' }"
              >
                {{ formatDate(task.due_date) }}
              </span>
            </td>
            <td>
              <span class="status-badge" :class="task.status">
                <span
                  class="status-circle"
                  :style="{ backgroundColor: getStatusColor(task.status) }"
                ></span>
                {{ formatStatus(task.status) }}
              </span>
            </td>
            <td>
              <div class="task-actions">
                <button class="action-btn edit" @click="handleEdit(task)" title="Edit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button class="action-btn delete" @click="handleDelete(task)" title="Delete">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <!-- Modern Pagination -->
    <div v-if="tasks.length > ITEMS_PER_PAGE" class="pagination">
      <button
        class="page-btn"
        :disabled="currentPage === 1"
        @click="handlePageChange(currentPage - 1)"
        title="Previous page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M15 18l-6-6 6-6"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <div class="page-numbers">
        <button
          v-for="page in totalPages"
          :key="page"
          class="page-number"
          :class="{ active: page === currentPage }"
          @click="handlePageChange(page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="handlePageChange(currentPage + 1)"
        title="Next page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <!-- Mobile Cards with Similar Structure -->
    <div class="mobile-cards">
      <div v-if="loading" class="loading-card">
        <div class="loading-state">
          <div class="loading-spinner"></div>
          Loading tasks...
        </div>
      </div>
      <div v-else-if="error" class="error-card">
        <div class="error-state">
          {{ error }}
          <button @click="loadTasks" class="retry-btn">Retry</button>
        </div>
      </div>
      <div v-else-if="tasks.length === 0" class="empty-card">
        <div class="empty-state">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
          <p>No tasks found</p>
          <button class="new-task-btn" @click="showModal = true">
            <span class="plus-icon">+</span>
            Create New Task
          </button>
        </div>
      </div>
      <template v-else>
        <div
          v-for="task in tasks"
          :key="task.id"
          class="task-card"
          :class="{ overdue: isOverdue(task.due_date) && task.status !== 'completed' }"
        >
          <div class="card-header">
            <h3>{{ task.title }}</h3>
            <span class="status-badge" :class="task.status">
              <span
                class="status-circle"
                :style="{ backgroundColor: getStatusColor(task.status) }"
              ></span>
              {{ formatStatus(task.status) }}
            </span>
          </div>
          <p
            class="card-description"
            :class="{ 'empty-description': !task.description }"
            :title="task.description || 'No description'"
          >
            {{ truncateDescription(task.description) }}
          </p>
          <div class="card-footer">
            <span class="due-date">Created: {{ formatDate(task.created_at) }}</span>
            <div class="task-actions">
              <button class="action-btn edit" @click="handleEdit(task)" title="Edit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="action-btn delete" @click="handleDelete(task)" title="Delete">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal" @click.stop>
        <div class="modal-content">
          <h2>Delete Task</h2>
          <p>Are you sure you want to delete "{{ itemToDelete?.title }}"?</p>
          <p class="warning-text">This action cannot be undone.</p>
          <div class="modal-actions">
            <button class="cancel-btn" @click="closeDeleteModal">Cancel</button>
            <button class="delete-btn" @click="confirmDelete">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
// Imports
import { ref, computed, watch, onMounted } from 'vue'
import { taskService, type Task } from '@/services/tasks'
import TaskForm from './TaskForm.vue'
import { useDeleteModal } from '@/composables/useDeleteModal'
import { useToast } from '@/composables/useToast'

// Composables
const { showDeleteModal, itemToDelete, closeDeleteModal, openDeleteModal } = useDeleteModal()
const { toast, showToast } = useToast()

// Constants
const ITEMS_PER_PAGE = 5
const STATUS_MAP = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
} as const

const STATUS_COLORS = {
  pending: '#FF4B4B',
  in_progress: '#FFB800',
  completed: '#00B884',
} as const

// State
const tasks = ref<Task[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const showModal = ref(false)
const showEditModal = ref(false)
const taskToEdit = ref<Task | null>(null)
const currentPage = ref(1)
const showTooltip = ref(false)

// Computed
const totalPages = computed(() => Math.ceil(tasks.value.length / ITEMS_PER_PAGE))
const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return tasks.value.slice(start, end)
})

// Task Operations
const loadTasks = async () => {
  loading.value = true
  error.value = null
  try {
    tasks.value = await taskService.getTasks()
  } catch (_err: unknown) {
    error.value = 'Failed to load tasks'
  } finally {
    loading.value = false
  }
}

const handleEdit = (task: Task) => {
  taskToEdit.value = { ...task }
  showEditModal.value = true
}

const handleDelete = (task: Task) => {
  openDeleteModal(task)
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return

  try {
    await taskService.deleteTask(itemToDelete.value.id)
    await loadTasks()

    const lastPage = Math.ceil(tasks.value.length / ITEMS_PER_PAGE)
    if (currentPage.value > lastPage && currentPage.value > 1) {
      currentPage.value = lastPage
    }

    closeDeleteModal()
    setTimeout(() => {
      showToast('Task deleted successfully', 'success')
    }, 100)
  } catch (_err: unknown) {
    showToast('Failed to delete task', 'error')
  }
}

// Utility Functions
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatStatus = (status: string): string => {
  return STATUS_MAP[status as keyof typeof STATUS_MAP] || status
}

const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#64748b'
}

const truncateDescription = (description: string | null): string => {
  if (!description) return 'No description'
  return description.length > 250 ? `${description.slice(0, 250)}...` : description
}

const isOverdue = (dueDate: string): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const taskDueDate = new Date(dueDate)
  taskDueDate.setHours(0, 0, 0, 0)
  return taskDueDate < today
}

// Pagination
const handlePageChange = (page: number) => {
  currentPage.value = page
}

// Lifecycle
onMounted(loadTasks)

// Watchers
watch([showModal, showEditModal], ([newShowModal, newShowEditModal]) => {
  if (newShowModal || newShowEditModal) {
    document.body.classList.add('modal-open')
  } else {
    document.body.classList.remove('modal-open')
  }
})
</script>

<style scoped>
.table-container {
  width: 140%;
  max-width: 140%;
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

.task-table th,
.task-table td {
  padding: 0.75rem 1.5rem;
  text-align: left;
}

/* Make due date column center-aligned */
.task-table th:nth-child(3),
.task-table td:nth-child(3) {
  text-align: center;
  min-width: 120px; /* Ensure consistent width */
}

/* Optional: adjust other column widths if needed */
.task-table th:nth-child(1),
.task-table td:nth-child(1) {
  width: 20%; /* Title */
}

.task-table th:nth-child(2),
.task-table td:nth-child(2) {
  width: 35%; /* Description */
}

.task-table th:nth-child(4),
.task-table td:nth-child(4) {
  width: 150px; /* Status */
}

.task-table th:nth-child(5),
.task-table td:nth-child(5) {
  width: 100px; /* Actions */
  text-align: center;
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
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #e2e8f0;
}

.status-circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-badge.pending,
.status-badge.in_progress,
.status-badge.completed,
.status-badge.overdue {
  background: transparent;
}

.task-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.edit {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.action-btn.edit:hover {
  background: rgba(59, 130, 246, 0.3);
}

.action-btn.delete {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.3);
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

  .action-btn {
    flex: 1;
    padding: 0.75rem;
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

.loading-row td,
.error-row td {
  padding: 3rem !important;
  text-align: center;
  background: #1e293b !important;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #64748b;
}

.loading-card,
.error-card {
  background: #1e293b;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #f89c1c;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: #f89c1c;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
}

.retry-btn:hover {
  background: #ff9d2f;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: #64748b;
}

.empty-state svg {
  margin-bottom: 1rem;
  color: #64748b;
}

.empty-state p {
  margin: 0 0 1.5rem;
  font-size: 1rem;
}

.empty-card {
  background: #1e293b;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.empty-row td {
  background: #1e293b !important;
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
  transition: all 0.2s;
}

.new-task-btn:hover {
  background: #ff9d2f;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
  z-index: 1000;
}

.modal {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transform: translateY(0); /* Reset any transform */
  margin: 0; /* Reset any margin */
}

.modal-content {
  text-align: center;
}

.modal-content h2 {
  margin: 0 0 1rem;
  color: white;
  font-size: 1.5rem;
}

.modal-content p {
  margin: 0 0 1rem;
  color: #e2e8f0;
}

.warning-text {
  color: #ef4444;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.cancel-btn,
.delete-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #334155;
  color: white;
}

.cancel-btn:hover {
  background: #475569;
}

.delete-btn {
  background: #dc2626;
  color: white;
}

.delete-btn:hover {
  background: #ef4444;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.delete-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.delete-btn {
  min-width: 80px; /* Prevent button size change when showing spinner */
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  z-index: 2000;
  animation: slideDown 0.3s ease-out;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  justify-content: center;
}

.toast.success {
  background: #00b884;
}

.toast.error {
  background: #ef4444;
}

@keyframes slideDown {
  from {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .toast {
    min-width: 90%;
    margin: 0 auto;
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1rem;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-btn,
.page-number {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  background: #1e293b;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.page-btn {
  background: transparent;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover,
.page-number:not(.active):hover {
  background: #2d3748;
  color: #e2e8f0;
}

.page-number.active {
  background: #f89c1c;
  color: white;
  font-weight: 500;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .pagination {
    gap: 0.25rem;
  }

  .page-btn,
  .page-number {
    min-width: 1.75rem;
    height: 1.75rem;
    font-size: 0.813rem;
  }
}

.overdue-row {
  background: rgba(239, 68, 68, 0.1) !important; /* Subtle red background */
}

.overdue-row td {
  background: transparent !important; /* Ensure background shows through */
}

.overdue-row td:first-child {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.overdue-row td:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

.overdue-date {
  color: #ef4444; /* Red text for overdue date */
  font-weight: 500;
}

/* Ensure mobile cards also show overdue state */
.task-card.overdue {
  background: rgba(239, 68, 68, 0.1);
}

.empty-description {
  font-style: italic;
  color: #64748b; /* light gray */
  opacity: 0.8;
}
</style>
