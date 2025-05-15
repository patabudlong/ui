<template>
  <div class="home">
    <div class="header">
      <div class="header-left">
        <h1>Your Tasks Dashboard</h1>
        <div class="subtitle-container">
          <p class="subtitle">Manage your tasks efficiently</p>
          <p class="subtitle-details">
            Track, organize, and complete tasks • Stay productive • Meet deadlines
          </p>
        </div>
      </div>
      <div class="nav-link" @click="navigateToTasks">
        <div class="link-content">
          <span>My Tasks</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
        <div class="link-highlight"></div>
      </div>
    </div>

    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-label">Total Tasks</span>
        <span class="stat-value">
          <span v-if="!isLoading">{{ totalTasks }}</span>
          <div v-else class="spinner"></div>
        </span>
      </div>
      <div class="stat-item">
        <span class="stat-label">In Progress</span>
        <span class="stat-value">
          <span v-if="!isLoading">{{ inProgressTasks }}</span>
          <div v-else class="spinner"></div>
        </span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Completed</span>
        <span class="stat-value">
          <span v-if="!isLoading">{{ completedTasks }}</span>
          <div v-else class="spinner"></div>
        </span>
      </div>
    </div>

    <div class="tasks-container">
      <div class="tasks-header">
        <div class="search-bar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" v-model="searchQuery" placeholder="Search tasks..." />
        </div>
        <div class="view-options">
          <button class="new-task-btn" @click="showTaskForm = true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>New Task</span>
          </button>
        </div>
      </div>

      <div class="tasks-list">
        <div v-if="filteredTasks.length === 0" class="no-results">
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
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <p>No tasks found</p>
          <span>Try adjusting your search</span>
        </div>

        <div
          v-else
          v-for="task in paginatedTasks"
          :key="task.id"
          class="task-item"
          :class="{ overdue: isOverdue(task.due_date) }"
        >
          <div class="task-content">
            <div class="task-status" :data-status="task.status"></div>
            <div class="task-info">
              <h3>{{ task.title }}</h3>
              <p class="description" :class="{ 'no-description': !task.description }">
                {{
                  task.description && task.description.length > 250 && !task.showFullDescription
                    ? truncateText(task.description, 250)
                    : task.description || 'No description'
                }}
                <button
                  v-if="task.description && task.description.length > 250"
                  class="show-more-btn"
                  @click="toggleDescription(task)"
                >
                  {{ task.showFullDescription ? 'Show Less' : 'Show More' }}
                </button>
              </p>
              <div class="task-meta">
                <span class="due-date">Due: {{ formatDate(task.due_date) }}</span>
              </div>
            </div>
          </div>
          <div class="task-actions">
            <button class="action-btn edit" @click="handleEdit(task)">
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
            <button class="action-btn delete" @click="handleDelete(task)">
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

      <!-- Pagination -->
      <div v-if="filteredTasks.length > itemsPerPage" class="pagination">
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
            <path
              d="M9 18l6-6-6-6"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>

    <TaskForm
      v-if="showTaskForm"
      :taskToEdit="taskToEdit"
      :mode="formMode"
      @close="closeForm"
      @success="handleFormSuccess"
    />

    <!-- Add toast -->
    <div v-if="toast" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="confirm-dialog">
        <h3>Delete Task</h3>
        <p>Are you sure you want to delete "{{ itemToDelete?.title }}"?</p>
        <p class="warning">This action cannot be undone.</p>
        <div class="dialog-actions">
          <button class="cancel-btn" @click="closeDeleteModal">Cancel</button>
          <button class="confirm-btn" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import TaskForm from '@/components/TaskForm.vue'
import { useRouter } from 'vue-router'
import { taskService, type Task } from '../services/tasks'
import { useToast } from '@/composables/useToast'
import { useDeleteModal } from '@/composables/useDeleteModal'

const showTaskForm = ref(false)
const router = useRouter()
const tasks = ref<Task[]>([])
const isLoading = ref(false)
const taskToEdit = ref<Task | null>(null)
const formMode = ref<'create' | 'edit'>('create')

const { showToast, toast } = useToast()
const { showDeleteModal, itemToDelete, openDeleteModal, closeDeleteModal } = useDeleteModal()

// Stats computations
const totalTasks = computed(() => tasks.value.length)
const inProgressTasks = computed(
  () => tasks.value.filter((task) => task.status === 'in_progress').length,
)
const completedTasks = computed(
  () => tasks.value.filter((task) => task.status === 'completed').length,
)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 5
const totalPages = computed(() => Math.ceil(tasks.value.length / itemsPerPage))

// Add search ref
const searchQuery = ref('')

// Update paginatedTasks computed to include search
const filteredTasks = computed(() => {
  if (!searchQuery.value) return tasks.value

  const query = searchQuery.value.toLowerCase()
  return tasks.value.filter(
    (task) =>
      task.title.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query)),
  )
})

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTasks.value.slice(start, end)
})

// Update totalPages to use filtered tasks
const totalPagesFiltered = computed(() => Math.ceil(filteredTasks.value.length / itemsPerPage))

// Reset page when search changes
watch(searchQuery, () => {
  currentPage.value = 1
})

const loadTasks = async () => {
  isLoading.value = true
  try {
    tasks.value = await taskService.getTasks()
  } catch (error) {
    console.error('Failed to load tasks:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadTasks()
})

const navigateToTasks = () => {
  router.push('/tasks')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const handleEdit = (task: Task) => {
  taskToEdit.value = task
  formMode.value = 'edit'
  showTaskForm.value = true
}

const handleDelete = (task: Task) => {
  openDeleteModal({ id: task.id, title: task.title })
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return

  try {
    await taskService.deleteTask(Number(itemToDelete.value.id))
    await loadTasks()

    // Update current page if we're on an empty page
    const maxPage = Math.ceil(tasks.value.length / itemsPerPage)
    if (currentPage.value > maxPage && maxPage > 0) {
      currentPage.value = maxPage
    }

    showToast('Task deleted successfully', 'success')
  } catch (error) {
    console.error('Failed to delete task:', error)
    showToast('Failed to delete task', 'error')
  } finally {
    closeDeleteModal()
  }
}

const closeForm = () => {
  showTaskForm.value = false
  taskToEdit.value = null
  formMode.value = 'create'
}

const handleFormSuccess = () => {
  loadTasks()
  closeForm()
  showToast('Task updated successfully', 'success')
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

// Add toggle function
interface ExtendedTask extends Task {
  showFullDescription?: boolean
}

const toggleDescription = (task: ExtendedTask) => {
  task.showFullDescription = !task.showFullDescription
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Add isOverdue function
const isOverdue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date()
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  padding: 2rem;
}

.home {
  max-width: 1200px;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header,
.stats-bar,
.tasks-container {
  width: 100%;
  max-width: 1000px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

h1 {
  font-size: 2.25rem;
  color: #f8fafc;
  font-weight: 700;
  background: linear-gradient(to right, #60a5fa, #818cf8);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.subtitle {
  color: #94a3b8;
  font-size: 1.1rem;
  margin: 0;
  background: linear-gradient(to right, #94a3b8, #64748b);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle-details {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.8;
}

.nav-link {
  position: relative;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  margin-top: -3rem;
}

.link-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #f8fafc;
  font-weight: 500;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.link-highlight {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-link:hover .link-highlight {
  opacity: 0.15;
}

.nav-link:hover {
  transform: translateY(-2px);
  box-shadow:
    0 4px 12px rgba(59, 130, 246, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.15);
}

.nav-link:hover svg {
  transform: translateX(4px);
}

.nav-link:active {
  transform: translateY(0px);
}

svg {
  transition: all 0.3s ease;
  stroke: #60a5fa;
}

.nav-link:hover svg {
  stroke: #93c5fd;
}

.stats-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 1000px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  opacity: 0.1;
  transition: opacity 0.3s ease;
}

/* Different gradient for each stat item */
.stat-item:nth-child(1)::before {
  background: linear-gradient(135deg, #3b82f6, #60a5fa); /* Blue for Total */
}

.stat-item:nth-child(2)::before {
  background: linear-gradient(135deg, #f59e0b, #fbbf24); /* Yellow/Amber for In Progress */
}

.stat-item:nth-child(3)::before {
  background: linear-gradient(135deg, #10b981, #34d399); /* Green for Completed */
}

.stat-item:hover::before {
  opacity: 0.2;
}

.stat-label {
  color: #94a3b8;
  font-size: 0.95rem;
  font-weight: 500;
  position: relative;
  z-index: 1;
}

.stat-value {
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-weight: 700;
  font-size: 2rem;
  color: #f8fafc;
  background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Add subtle glow effect */
.stat-item:nth-child(1) {
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.1);
}

.stat-item:nth-child(2) {
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.1);
}

.stat-item:nth-child(3) {
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.1);
}

.stat-item:hover {
  transform: translateY(-2px);
}

.tasks-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border-radius: 24px;
  padding: 2rem;
  min-height: 400px;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex: 1;
}

.search-bar input {
  border: none;
  background: none;
  outline: none;
  width: 100%;
  font-size: 0.95rem;
  color: #f8fafc;
}

.search-bar input::placeholder {
  color: #64748b;
}

.search-bar svg {
  color: #64748b;
}

.view-options {
  display: flex;
  gap: 0.5rem;
}

.new-task-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  background: #fb923c;
  color: white;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
}

.new-task-btn svg {
  color: white;
  stroke: white;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
}

.task-item:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-1px);
}

.task-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.task-status {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.task-status[data-status='pending'] {
  background: #ef4444; /* Red */
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.3);
}

.task-status[data-status='in_progress'] {
  background: #f59e0b; /* Yellow */
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.3);
}

.task-status[data-status='completed'] {
  background: #10b981; /* Green */
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
}

.task-info h3 {
  color: #f8fafc;
  font-size: 1rem;
  margin: 0 0 0.2rem;
}

.task-info p {
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 0 0 0.5rem;
}

.task-meta {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.due-date {
  color: #64748b;
  font-size: 0.85rem;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.action-btn.edit {
  color: #3b82f6; /* Blue color */
  background: rgba(59, 130, 246, 0.1); /* Transparent blue */
}

.action-btn.edit:hover {
  background: rgba(59, 130, 246, 0.2); /* More visible on hover */
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.2);
}

.action-btn.delete {
  color: #ef4444; /* Red color */
  background: rgba(239, 68, 68, 0.1); /* Transparent red */
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.2); /* More visible on hover */
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.2);
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .home {
    padding: 1rem;
  }

  .header-left h1 {
    font-size: 1.75rem;
  }

  .stats-bar {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-item {
    padding: 1.25rem;
  }

  .stat-value {
    font-size: 1.75rem;
  }

  .tasks-header {
    flex-direction: column;
  }

  .tasks-container {
    padding: 1.5rem;
    border-radius: 16px;
  }

  .view-options {
    width: 100%;
    justify-content: center;
  }

  .view-btn {
    flex: 1;
    text-align: center;
    padding: 0.75rem 1rem;
  }

  .task-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .task-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .subtitle {
    font-size: 1rem;
  }

  .subtitle-details {
    font-size: 0.85rem;
  }

  .nav-link {
    width: 100%;
    text-align: center;
    padding: 1rem;
  }

  .link-content {
    justify-content: center;
    font-size: 1rem;
  }
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0;
  margin-left: 0;
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
  background: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover,
.page-number:not(.active):hover {
  background: rgba(255, 255, 255, 0.2);
  color: #e2e8f0;
}

.page-number.active {
  background: #f89c1c;
  color: white;
  font-weight: 500;
}

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

.description.no-description {
  color: #64748b; /* Lighter color for placeholder */
  font-style: italic;
}

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  z-index: 1000;
  animation: slideDown 0.3s ease;
}

.toast.success {
  background: #10b981;
}

.toast.error {
  background: #ef4444;
}

@keyframes slideDown {
  from {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-dialog {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}

.confirm-dialog:hover {
  transform: scale(1.02);
}

.confirm-dialog h3 {
  color: #f8fafc;
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.confirm-dialog p {
  color: #94a3b8;
  margin: 0 0 0.5rem;
  line-height: 1.5;
}

.warning {
  color: #64748b !important;
  font-size: 0.9rem;
  margin-bottom: 1.5rem !important;
}

.dialog-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.confirm-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-btn:hover {
  background: #dc2626;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #64748b;
}

.no-results svg {
  margin-bottom: 1rem;
  color: #475569;
}

.no-results p {
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
  color: #94a3b8;
}

.no-results span {
  font-size: 0.9rem;
  color: #64748b;
}

.description {
  position: relative;
  color: #94a3b8;
  margin: 0.5rem 0;
  line-height: 1.5;
}

.show-more-btn {
  background: none;
  border: none;
  color: #f59e0b;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.show-more-btn:hover {
  color: #f97316;
}

.task-item.overdue {
  border: 1px solid rgba(239, 68, 68, 0.2); /* Red border */
  background: rgba(239, 68, 68, 0.05); /* Light red background */
}

.task-item.overdue .due-date {
  color: #ef4444; /* Red text for due date */
  font-weight: 500;
}
</style>
