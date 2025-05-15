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
  backdrop-filter: blur(10px);
  padding: 2rem;
  width: 100%;
  margin: 1rem;
}
</style>
