<template>
  <div class="tasks">
    <div class="container">
      <TaskForm v-if="showModal" @close="showModal = false" />
      <TaskList @showModal="showModal = true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TaskForm from '@/components/TaskForm.vue'
import TaskList from '@/components/TaskList.vue'

const showModal = ref(false)
</script>

<style scoped>
.tasks {
  padding: 0.25rem;
}

.container {
  width: 100%;
  max-width: 100%;
  margin: 0;
}
</style>
