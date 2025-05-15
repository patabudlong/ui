<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal">
      <div class="modal-header">
        <div class="header-content">
          <h2>{{ mode === 'edit' ? 'Edit Task' : 'Create New Task' }}</h2>
          <div class="description-container">
            <p class="header-description">
              {{
                mode === 'edit'
                  ? 'Update task details and track progress'
                  : 'Add a new task with details and track its progress'
              }}
            </p>
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
        <button class="close-btn" @click="handleClose">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="task-form" novalidate>
        <div class="form-group">
          <label for="title">
            Title
            <span class="required-indicator" style="display: none">*</span>
          </label>
          <input
            type="text"
            id="title"
            v-model="task.title"
            required
            placeholder="Enter task title"
            :class="{ error: hasAttemptedSubmit && errors.title }"
            :disabled="isSubmitting"
          />
          <span v-if="hasAttemptedSubmit && errors.title" class="error-message">
            {{ errors.title }}
          </span>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="task.description"
            rows="4"
            placeholder="Enter task description (Optional)"
            :disabled="isSubmitting"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="dueDate">
            Due Date
            <span class="required-indicator" style="display: none">*</span>
          </label>
          <input
            type="date"
            id="dueDate"
            v-model="task.due_date"
            :class="{ error: hasAttemptedSubmit && errors.dueDate }"
            :disabled="isSubmitting"
          />
          <span v-if="hasAttemptedSubmit && errors.dueDate" class="error-message">
            {{ errors.dueDate }}
          </span>
        </div>

        <div class="form-group">
          <label for="status">
            Status
            <span class="required-indicator" style="display: none">*</span>
          </label>
          <select
            id="status"
            v-model="task.status"
            :class="{ error: hasAttemptedSubmit && errors.status }"
            :disabled="isSubmitting"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <span v-if="hasAttemptedSubmit && errors.status" class="error-message">
            {{ errors.status }}
          </span>
        </div>

        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          <div v-if="isSubmitting" class="spinner-container">
            <div class="spinner"></div>
            <span>{{ mode === 'edit' ? 'Updating...' : 'Creating...' }}</span>
          </div>
          <span v-else>{{ mode === 'edit' ? 'Update Task' : 'Create Task' }}</span>
        </button>
      </form>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="confirm-dialog-overlay" @click.self="cancelClose">
      <div class="confirm-dialog">
        <h3>Discard Changes?</h3>
        <p>You have unsaved changes. Are you sure you want to close?</p>
        <div class="confirm-actions">
          <button class="cancel-btn" @click="cancelClose">Cancel</button>
          <button class="confirm-btn" @click="confirmClose">Discard</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { taskService, type Task } from '../services/tasks'

const props = withDefaults(
  defineProps<{
    mode?: 'create' | 'edit'
    taskToEdit?: Task | null
  }>(),
  {
    mode: 'create',
    taskToEdit: null,
  },
)

interface TaskForm {
  title: string
  description: string
  due_date: string
  status: 'pending' | 'in_progress' | 'completed'
}

const task = reactive<TaskForm>({
  title: props.taskToEdit?.title || '',
  description: props.taskToEdit?.description || '',
  due_date: props.taskToEdit?.due_date || '',
  status: props.taskToEdit?.status || 'pending',
})

watch(
  () => props.taskToEdit,
  (newTask) => {
    if (newTask) {
      task.title = newTask.title
      task.description = newTask.description
      task.due_date = newTask.due_date
      task.status = newTask.status
    }
  },
  { immediate: true },
)

const showTooltip = ref(false)
const showConfirmDialog = ref(false)
const isSubmitting = ref(false)
const hasAttemptedSubmit = ref(false)
const errors = reactive({
  title: '',
  dueDate: '',
  status: '',
})

const hasChanges = computed(() => {
  if (props.mode === 'edit' && props.taskToEdit) {
    // In edit mode, compare with original values
    return (
      task.title !== props.taskToEdit.title ||
      task.description !== props.taskToEdit.description ||
      task.due_date !== props.taskToEdit.due_date ||
      task.status !== props.taskToEdit.status
    )
  } else {
    // In create mode, check if any field has been filled
    return (
      task.title.trim() !== '' ||
      task.description.trim() !== '' ||
      task.due_date !== '' ||
      task.status !== 'pending'
    )
  }
})

const validateForm = (): boolean => {
  hasAttemptedSubmit.value = true
  let isValid = true

  // Reset errors
  errors.title = ''
  errors.dueDate = ''
  errors.status = ''

  if (!task.title.trim()) {
    errors.title = 'Title is required'
    isValid = false
  } else if (task.title.length < 3) {
    errors.title = 'Title must be at least 3 characters'
    isValid = false
  }

  if (!task.due_date) {
    errors.dueDate = 'Due date is required'
    isValid = false
  } else {
    const selectedDate = new Date(task.due_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      errors.dueDate = 'Due date cannot be in the past'
      isValid = false
    }
  }

  if (!task.status) {
    errors.status = 'Status is required'
    isValid = false
  }

  return isValid
}

const emit = defineEmits(['close', 'success', 'showToast'])

const handleSubmit = async () => {
  if (validateForm()) {
    isSubmitting.value = true

    try {
      if (props.mode === 'edit' && props.taskToEdit) {
        await taskService.updateTask(props.taskToEdit.id, {
          title: task.title,
          description: task.description,
          due_date: task.due_date,
          status: task.status,
        })
        emit('showToast', 'Task updated successfully', 'success')
      } else {
        await taskService.createTask({
          title: task.title,
          description: task.description,
          due_date: task.due_date,
          status: task.status,
        })
        emit('showToast', 'Task created successfully', 'success')
      }

      emit('success')
      emit('close')
    } catch (error) {
      emit(
        'showToast',
        props.mode === 'edit' ? 'Failed to update task' : 'Failed to create task',
        'error',
      )
    } finally {
      isSubmitting.value = false
    }
  }
}

const resetValidation = () => {
  hasAttemptedSubmit.value = false // Reset attempt flag
  errors.title = ''
  errors.dueDate = ''
  errors.status = ''
}

const resetForm = () => {
  if (props.mode === 'edit' && props.taskToEdit) {
    // In edit mode, reset to original values
    task.title = props.taskToEdit.title
    task.description = props.taskToEdit.description
    task.due_date = props.taskToEdit.due_date
    task.status = props.taskToEdit.status
  } else {
    // In create mode, reset to empty
    task.title = ''
    task.description = ''
    task.due_date = ''
    task.status = 'pending'
  }

  hasAttemptedSubmit.value = false
  resetValidation()
}

const confirmClose = () => {
  showConfirmDialog.value = false
  document.body.style.overflow = ''
  resetForm()
  emit('close')
}

const handleClose = () => {
  if (hasChanges.value) {
    showConfirmDialog.value = true
    document.body.style.overflow = 'hidden'
  } else {
    resetValidation()
    emit('close')
  }
}

const cancelClose = () => {
  showConfirmDialog.value = false
  document.body.style.overflow = ''
  resetValidation()
}

// Reset everything when form opens
onMounted(() => {
  resetForm()
})
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
  backdrop-filter: blur(3px);
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.modal {
  background: #1a2634;
  border-radius: 24px;
  width: 90%;
  max-width: 600px;
  margin: auto;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-height: 90vh; /* Limit height */
  display: flex;
  flex-direction: column;
}

.modal-header {
  background: linear-gradient(145deg, #f89c1c 0%, #ff9d2f 100%); /* Keep orange header */
  padding: 1.5rem 1.5rem 0;
  border-radius: 24px 24px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-shrink: 0; /* Prevent header from shrinking */
}

.modal-header h2 {
  color: white;
  font-size: 1.25rem;
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
  background: #1a2634;
  padding: 1.5rem;
  border-radius: 0 0 24px 24px;
  overflow: visible;
  flex: 1; /* Take remaining space */
}

.form-group {
  margin-bottom: 1rem;
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
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: white;
  font-size: 0.813rem;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 0.813rem;
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
  transition: all 0.2s ease;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
}

input::placeholder,
textarea::placeholder {
  color: #94a3b8;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

select {
  appearance: none;
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 0.813rem;
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.875rem center;
  background-size: 0.875rem;
  padding-right: 2.5rem;
}

select:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background-color: rgba(255, 255, 255, 0.05);
}

select:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Style for the options */
select option {
  background: white; /* White background */
  color: #0f172a; /* Dark text color */
  padding: 0.625rem; /* Match select padding */
  font-size: 0.813rem; /* Match select font size */
}

/* For Firefox */
select:-moz-focusring {
  color: transparent;
  text-shadow: 0 0 0 #e2e8f0;
}

/* For Edge/IE */
select::-ms-expand {
  display: none;
}

.submit-btn {
  background: linear-gradient(135deg, #f89c1c, #ff9d2f); /* Orange gradient */
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.813rem;
  font-weight: 500;
  width: 100%;
  margin-top: 1.5rem;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
}

.spinner-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.submit-btn:not(:disabled):hover {
  background: linear-gradient(135deg, #ff9d2f, #f89c1c); /* Reversed gradient on hover */
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.header-content {
  flex: 1;
}

.description-container {
  display: flex;
  gap: 0.5rem;
}

.header-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.813rem;
  margin-bottom: 0.75rem;
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
    padding: 1rem;
    align-items: flex-start;
  }

  .modal {
    width: 100%;
    max-width: 100%;
    margin: 0;
    border-radius: 24px;
    height: auto;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-header {
    padding: 1.25rem 1.25rem 0.75rem;
  }

  .modal-header h2 {
    font-size: 1.5rem;
  }

  .header-description {
    font-size: 0.875rem;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    font-size: 1.25rem;
  }

  .task-form {
    padding: 1.25rem;
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  label {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  input,
  textarea,
  select {
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }

  textarea {
    min-height: 100px;
  }

  .submit-btn {
    margin-top: 1.5rem;
    padding: 0.875rem;
    min-height: 3rem;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border-width: 2px;
  }

  .spinner-container {
    gap: 0.5rem;
  }

  .error-message {
    font-size: 0.8rem;
    margin-top: 0.375rem;
  }

  .tooltip {
    width: 220px;
    font-size: 0.8rem;
    padding: 0.75rem;
    right: 0;
    left: auto;
    transform: none;
  }

  .tooltip::after {
    right: 10px;
    left: auto;
  }
}

/* Small phones */
@media (max-width: 380px) {
  .modal-overlay {
    padding: 0.75rem;
  }

  .modal {
    max-height: 90vh;
  }

  .modal-header {
    padding: 1rem 1rem 0.5rem;
  }

  .task-form {
    padding: 1rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  input,
  textarea,
  select {
    padding: 0.75rem 0.875rem;
  }
}

/* Landscape mode */
@media (max-width: 768px) and (orientation: landscape) {
  .modal-overlay {
    padding: 1rem;
    align-items: flex-start;
  }

  .modal {
    height: auto;
    max-height: 90vh;
    margin: 0 auto;
  }

  .task-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding: 1.25rem;
  }

  .form-group:nth-child(2) {
    grid-column: span 2;
  }

  .submit-btn {
    grid-column: span 2;
  }
}

/* Very short screens */
@media (max-height: 600px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modal {
    max-height: 95vh;
  }
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.375rem;
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

/* Remove browser default invalid styles */
input:invalid,
select:invalid {
  box-shadow: none;
}

/* Customize scrollbar for webkit browsers */
.task-form::-webkit-scrollbar {
  width: 8px;
}

.task-form::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.task-form::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 100vh; /* Ensure full viewport height */
  background: rgba(15, 23, 42, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
  margin: 0;
  padding: 0;
  overflow: hidden; /* Prevent scrolling */
}

.confirm-dialog {
  position: relative;
  z-index: 10000;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
  margin: 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.confirm-dialog:hover {
  transform: scale(1.02); /* Grow effect */
}

.confirm-dialog h3 {
  color: #0f172a;
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
}

.confirm-dialog p {
  color: #64748b;
  margin: 0 0 1.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.confirm-actions button {
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #f1f5f9;
  color: #64748b;
  border: none;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

.confirm-btn {
  background: #ef4444;
  color: white;
  border: none;
}

.confirm-btn:hover {
  background: #dc2626;
}

@media (max-width: 768px) {
  .confirm-dialog {
    margin: 1rem;
    padding: 1.25rem;
  }

  .confirm-actions button {
    padding: 0.75rem 1rem;
    flex: 1;
  }
}

input:disabled,
textarea:disabled,
select:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.8);
}

/* Optional: Add a subtle visual indicator for disabled state */
input:disabled::placeholder,
textarea:disabled::placeholder {
  color: #94a3b8;
}

/* Remove error styles */
input.error,
select.error {
  border-color: rgba(255, 255, 255, 0.1); /* Use default border */
  box-shadow: none;
}

/* Remove required attribute styling */
input:required,
select:required {
  box-shadow: none;
  border-color: rgba(255, 255, 255, 0.1);
}

/* Optional: remove the required attribute altogether from inputs */

/* Style the date input */
input[type='date'] {
  color: #e2e8f0; /* Text color */
  background: rgba(255, 255, 255, 0.05); /* Dark background */
}

/* Make only the calendar icon white */
input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(1); /* Make icon white */
  opacity: 0.7;
  cursor: pointer;
}

/* Remove color-scheme to keep default calendar colors */
input[type='date']::-webkit-datetime-edit-fields-wrapper {
  color: #e2e8f0; /* Text color */
}

input[type='date']::-webkit-datetime-edit {
  color: #e2e8f0; /* Ensure text remains visible */
}

/* Hover effect for icon */
input[type='date']::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
</style>
