<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AuthLayout',
})
</script>

<template>
  <div class="auth-layout-wrapper">
    <div class="auth-layout">
      <div class="auth-container">
        <div>Auth Layout Working</div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style>
.auth-layout-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: linear-gradient(#0f1924, #1a2634);
}

.auth-layout {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 1rem;
}
</style>
