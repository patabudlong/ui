<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="logo"> Your Logo </router-link>
    </div>

    <div class="nav-links">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/about" class="nav-link">About</router-link>
      <router-link to="/services" class="nav-link">Services</router-link>
      <router-link to="/contact" class="nav-link">Contact</router-link>
      <button class="logout-btn">Logout</button>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NavBar',
})
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
  width: 100%;
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  box-shadow: none;
}

.navbar-brand {
  margin-left: 2rem;
  font-size: 24px;
  font-weight: bold;
}

.logo {
  text-decoration: none;
  color: white;
}

.nav-links {
  margin-right: 2rem;
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: white;
  font-weight: 500;
  transition: color 0.3s ease;
  font-size: 18px;
}

.nav-link:hover {
  color: rgba(255, 255, 255, 0.8);
}

/* Responsive design */
@media (max-width: 768px) {
  .nav-links {
    gap: 1rem;
  }

  .navbar {
    padding: 1rem;
  }
}

.logout-btn {
  background-color: #f89c1c;
  color: white;
  border: none;
  padding: 0.5rem 2rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  font-size: 18px;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: #e08a0f;
}
</style>
