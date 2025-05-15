<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h2>Create New Task</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="task-form">
        <div class="form-group">
          <label for="title">Title</label>
          <input
            type="text"
            id="title"
            v-model="task.title"
            required
            placeholder="Enter task title"
          />
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
          <label for="dueDate">Due Date</label>
          <input type="date" id="dueDate" v-model="task.dueDate" required />
        </div>

        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" v-model="task.status" required>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <button type="submit" class="submit-btn">Create Task</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

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

const handleSubmit = () => {
  console.log('Task submitted:', task)
  // Add your submission logic here
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0); /* Transparent white */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal {
  background: linear-gradient(135deg, #f89c1c, #ff8a00); /* Orange gradient */
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(248, 156, 28, 0.2); /* Subtle glow */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h2 {
  color: white;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
}

.task-form {
  width: 100%;
}

.form-group {
  margin-bottom: 2rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: white;
}

input,
textarea,
select {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
}

textarea {
  resize: vertical;
}

.submit-btn {
  background-color: #0f172a; /* Updated dark blue color */
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  margin-top: 1rem;
}

.submit-btn:hover {
  background-color: #1a2542; /* Slightly lighter dark blue for hover */
}
</style>
