<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="logo">
        <img src="@/assets/sapere-logo.png" alt="Sapere Logo" class="logo-image" />
      </router-link>
    </div>

    <div class="nav-links">
      <router-link to="/" class="nav-link">Dashboard</router-link>
      <router-link to="/tasks" class="nav-link">Tasks</router-link>
      <div class="profile-icon">JT</div>
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
  transition: all 0.3s ease;
}

.navbar-brand {
  margin-left: 2rem;
  font-size: 24px;
  font-weight: bold;
}

.logo {
  text-decoration: none;
  color: white;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
}

.logo:hover,
.logo:active,
.logo:focus,
.logo:visited {
  color: white !important;
  text-decoration: none !important;
  outline: none !important;
  background: transparent !important;
}

.nav-links {
  margin-right: 2rem;
  display: flex;
  gap: 2rem;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.nav-link {
  text-decoration: none !important;
  color: white !important;
  font-weight: 500;
  font-size: 18px;
  /* Remove all possible highlight effects */
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
}

/* Remove all possible states */
.nav-link:hover,
.nav-link:active,
.nav-link:focus,
.nav-link:visited,
.router-link-active,
.router-link-exact-active,
.router-link-active.nav-link,
.router-link-exact-active.nav-link {
  color: white !important;
  text-decoration: none !important;
  outline: none !important;
  background: transparent !important;
}

/* Additional specificity */
a.router-link-active,
a.router-link-exact-active,
a.nav-link,
.navbar a.nav-link,
.navbar a.router-link-active,
.navbar a.router-link-exact-active {
  color: white !important;
  background: transparent !important;
}

/* Reset transitions */
* {
  transition: none !important;
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
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logout-btn:hover {
  background-color: #e08a0f;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-image {
  height: 60px;
  width: auto;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  user-drag: none;
}
</style>
