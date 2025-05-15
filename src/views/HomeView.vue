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
        <span class="stat-value">{{ totalTasks }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">In Progress</span>
        <span class="stat-value">{{ inProgressTasks }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Completed</span>
        <span class="stat-value">{{ completedTasks }}</span>
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
          <input type="text" placeholder="Search tasks..." />
        </div>
        <div class="view-options">
          <button class="view-btn active">All</button>
          <button class="view-btn">Active</button>
          <button class="view-btn">Completed</button>
        </div>
      </div>

      <!-- Replace empty state with tasks list -->
      <div class="tasks-list">
        <div class="task-item">
          <div class="task-content">
            <div class="task-status" data-status="IN_PROGRESS"></div>
            <div class="task-info">
              <h3>Design User Interface</h3>
              <p>Create modern UI design for the dashboard</p>
              <div class="task-meta">
                <span class="due-date">Due: Mar 25, 2024</span>
              </div>
            </div>
          </div>
          <div class="task-actions">
            <button class="action-btn edit">
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
            <button class="action-btn delete">
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

        <div class="task-item">
          <div class="task-content">
            <div class="task-status" data-status="TODO"></div>
            <div class="task-info">
              <h3>Implement Authentication</h3>
              <p>Set up user authentication system with JWT</p>
              <div class="task-meta">
                <span class="due-date">Due: Mar 28, 2024</span>
              </div>
            </div>
          </div>
          <div class="task-actions">
            <button class="action-btn edit">
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
            <button class="action-btn delete">
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
    </div>

    <TaskForm v-if="showTaskForm" @close="showTaskForm = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TaskForm from '@/components/TaskForm.vue'
import { useRouter } from 'vue-router'
import { taskService, type Task } from '../services/tasks'

const showTaskForm = ref(false)
const router = useRouter()
const tasks = ref<Task[]>([])

// Stats computations
const totalTasks = computed(() => tasks.value.length)
const inProgressTasks = computed(
  () => tasks.value.filter((task) => task.status === 'in_progress').length,
)
const completedTasks = computed(
  () => tasks.value.filter((task) => task.status === 'completed').length,
)

const loadTasks = async () => {
  try {
    tasks.value = await taskService.getTasks()
  } catch (error) {
    console.error('Failed to load tasks:', error)
  }
}

onMounted(() => {
  loadTasks()
})

const navigateToTasks = () => {
  router.push('/tasks')
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
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
}

.stat-item:nth-child(2)::before {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
}

.stat-item:nth-child(3)::before {
  background: linear-gradient(135deg, #10b981, #34d399);
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
  color: #f8fafc;
  font-size: 2rem;
  font-weight: 700;
  position: relative;
  z-index: 1;
  background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Add subtle glow effect */
.stat-item:nth-child(1) {
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.1);
}

.stat-item:nth-child(2) {
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.1);
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
  margin-bottom: 2rem;
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

.view-btn {
  padding: 0.75rem 1.25rem;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  border-radius: 10px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.view-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.view-btn.active {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border: none;
  color: white;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.25rem;
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

.task-status[data-status='TODO'] {
  background: #f97316;
  box-shadow: 0 0 12px rgba(249, 115, 22, 0.3);
}

.task-status[data-status='IN_PROGRESS'] {
  background: #3b82f6;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.3);
}

.task-status[data-status='COMPLETED'] {
  background: #10b981;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
}

.task-info h3 {
  color: #f8fafc;
  font-size: 1.1rem;
  margin: 0 0 0.25rem;
}

.task-info p {
  color: #94a3b8;
  font-size: 0.95rem;
  margin: 0 0 0.75rem;
}

.task-meta {
  display: flex;
  gap: 1rem;
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
}

.action-btn.edit:hover {
  color: #3b82f6;
}

.action-btn.delete:hover {
  color: #ef4444;
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
</style>
