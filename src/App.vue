<script lang="ts">
import { defineComponent } from 'vue'
import Navbar from './components/Navbar.vue'

export default defineComponent({
  name: 'App',
  components: {
    Navbar,
  },
  computed: {
    isAuthRoute(): boolean {
      return this.$route.path.startsWith('/auth')
    },
  },
})
</script>

<template>
  <template v-if="!isAuthRoute">
    <Navbar />
    <main class="main-content">
      <router-view></router-view>
    </main>
  </template>
  <template v-else>
    <router-view></router-view>
  </template>
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

.main-content {
  padding-top: 120px;
}
</style>
