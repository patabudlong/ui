<script lang="ts">
import { defineComponent } from 'vue'
import Navbar from './components/Navbar.vue'

export default defineComponent({
  name: 'App',
  components: {
    Navbar,
  },
})
</script>

<template>
  <div class="app">
    <Navbar />
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
:root {
  min-height: 100vh;
}

body {
  margin: 0;
  min-height: 100vh;
  background: linear-gradient(#0f1924, #1a2634);
  color: white;
}

#app {
  min-height: 100vh;
}

.app {
  min-height: 100vh;
}

.main-content {
  padding-top: 120px; /* Adjust this value based on your navbar height */
}
</style>
