<script setup lang="ts">
import { ref } from 'vue'
import TaskForm from './TaskForm.vue'

const showModal = ref(false)

const loadTasks = () => {
  // Will be implemented when we add task list
  console.log('Loading tasks...')
}
</script>

<template>
  <TaskForm v-if="showModal" @close="showModal = false" @success="loadTasks()" />
</template>
