<template>
  <div class="tasks">
    <div class="container">
      <button class="new-task-btn" @click="showModal = true">New Task</button>
      <TaskForm v-if="showModal" @close="showModal = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TaskForm from '@/components/TaskForm.vue'

const showModal = ref(false)
</script>

<style scoped>
.tasks {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
}

.container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 3rem;
  color: white;
  text-align: center;
  font-size: 2rem;
}

.new-task-btn {
  background-color: #f89c1c;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
}
</style>
