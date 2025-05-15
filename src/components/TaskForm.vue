<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <div class="header-content">
          <h2>Create New Task</h2>
          <div class="description-container">
            <p class="header-description">Add a new task with details and track its progress</p>
            <div class="tooltip-container">
              <button
                class="info-icon"
                @mouseenter="showTooltip = true"
                @mouseleave="showTooltip = false"
              >
                ?
              </button>
              <div class="tooltip" v-if="showTooltip">
                Fill in the task details including title, description, due date, and status. All
                fields except description are required. You can update the task status later as
                progress is made.
              </div>
            </div>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="task-form" novalidate>
        <div class="form-group">
          <label for="title">
            Title
            <span class="required-indicator">*</span>
          </label>
          <input
            type="text"
            id="title"
            v-model="task.title"
            required
            placeholder="Enter task title"
            :class="{ error: errors.title }"
          />
          <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="task.description"
            rows="4"
            placeholder="Enter task description"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="dueDate">
            Due Date
            <span class="required-indicator">*</span>
          </label>
          <input
            type="date"
            id="dueDate"
            v-model="task.dueDate"
            required
            :class="{ error: errors.dueDate }"
          />
          <span v-if="errors.dueDate" class="error-message">{{ errors.dueDate }}</span>
        </div>

        <div class="form-group">
          <label for="status">
            Status
            <span class="required-indicator">*</span>
          </label>
          <select id="status" v-model="task.status" required :class="{ error: errors.status }">
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <span v-if="errors.status" class="error-message">{{ errors.status }}</span>
        </div>

        <button type="submit" class="submit-btn">Create Task</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

interface Task {
  title: string
  description: string
  dueDate: string
  status: string
}

const task = reactive<Task>({
  title: '',
  description: '',
  dueDate: '',
  status: 'TODO',
})

const showTooltip = ref(false)
const errors = reactive({
  title: '',
  dueDate: '',
  status: '',
})

const validateForm = (): boolean => {
  let isValid = true

  // Reset errors
  errors.title = ''
  errors.dueDate = ''
  errors.status = ''

  // Title validation
  if (!task.title.trim()) {
    errors.title = 'Title is required'
    isValid = false
  } else if (task.title.length < 3) {
    errors.title = 'Title must be at least 3 characters'
    isValid = false
  }

  // Due date validation
  if (!task.dueDate) {
    errors.dueDate = 'Due date is required'
    isValid = false
  } else {
    const selectedDate = new Date(task.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      errors.dueDate = 'Due date cannot be in the past'
      isValid = false
    }
  }

  // Status validation
  if (!task.status) {
    errors.status = 'Status is required'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    console.log('Task submitted:', task)
    // Add your submission logic here
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.8);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000;
  backdrop-filter: blur(8px);
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.modal {
  background: linear-gradient(145deg, #f97316 0%, #f59e0b 100%);
  border-radius: 24px;
  width: 90%;
  max-width: 800px;
  margin: auto;
  position: relative;
}

.modal-header {
  padding: 2.5rem 2.5rem 0;
  background: inherit;
  border-radius: 24px 24px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.modal-header h2 {
  color: white;
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.025em;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.task-form {
  padding: 2.5rem;
  padding-top: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.required-indicator {
  color: #ef4444;
  margin-left: 4px;
  font-weight: 800;
}

label {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 0.75rem;
  font-weight: 500;
  color: white;
  font-size: 0.95rem;
}

input,
textarea,
select {
  width: 100%;
  padding: 1rem 1.25rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.95);
  color: #0f172a;
  transition: all 0.2s;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  background: white;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    inset 0 2px 4px rgba(0, 0, 0, 0.05),
    0 0 0 3px rgba(255, 255, 255, 0.2);
}

input::placeholder,
textarea::placeholder {
  color: #94a3b8;
}

textarea {
  resize: vertical;
  min-height: 120px;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.5em;
  padding-right: 2.5rem;
}

select option {
  background-color: white;
  color: #0f172a;
}

.submit-btn {
  background: linear-gradient(135deg, #0b1121, #1e293b);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  width: 100%;
  margin-top: 2rem;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.header-content {
  flex: 1;
}

.description-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  margin: 0;
}

.info-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
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
  background: rgba(255, 255, 255, 0.3);
}

.tooltip-container {
  position: relative;
}

.tooltip {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(11, 17, 33, 0.95);
  color: white;
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
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: transparent transparent rgba(11, 17, 33, 0.95) transparent;
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .modal {
    width: 100%;
    max-width: 100%;
    margin: 0;
    border-radius: 24px 24px 0 0;
  }

  .modal-header {
    padding: 1.5rem 1.5rem 0;
  }

  .task-form {
    padding: 1.5rem;
    padding-top: 1rem;
  }

  .modal-header h2 {
    font-size: 1.5rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  input,
  textarea,
  select {
    padding: 0.875rem 1rem;
  }

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

  .close-btn {
    width: 32px;
    height: 32px;
    font-size: 1.25rem;
  }
}

/* For very short screens */
@media (max-height: 600px) {
  .modal-overlay {
    padding: 1rem;
  }
}

/* For landscape mode */
@media (max-width: 768px) and (orientation: landscape) {
  .modal-overlay {
    align-items: flex-start;
    padding: 1rem;
  }
}

.error-message {
  color: #811717;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
  font-weight: 500;
  transition: all 0.2s ease;
}

input:invalid,
select:invalid {
  border-color: #ef4444;
  box-shadow:
    0 2px 4px rgba(239, 68, 68, 0.1),
    inset 0 2px 4px rgba(239, 68, 68, 0.05);
}

/* Adjust spacing when error is present */
.form-group:has(.error-message) {
  margin-bottom: 2rem;
}

/* Remove browser default invalid styles */
input:invalid,
select:invalid {
  box-shadow: none;
}

/* Customize scrollbar for webkit browsers */
.modal-overlay::-webkit-scrollbar {
  width: 8px;
}

.modal-overlay::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.modal-overlay::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.modal-overlay::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

/* Firefox scrollbar styling */
.modal-overlay {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
}
</style>
