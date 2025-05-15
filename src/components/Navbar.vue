<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="logo">
        <img src="@/assets/sapere-logo.png" alt="Sapere Logo" class="logo-image" />
      </router-link>
    </div>

    <div class="nav-links" :class="{ 'is-open': isMenuOpen }">
      <router-link to="/" class="nav-link">Dashboard</router-link>
      <router-link to="/tasks" class="nav-link">Tasks</router-link>
      <div class="profile-icon">{{ userInitials }}</div>
      <button class="logout-btn" @click="handleLogout">Logout</button>
    </div>

    <button class="hamburger" @click="toggleMenu" :class="{ 'is-active': isMenuOpen }">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </nav>

  <!-- Logout Dialog -->
  <div v-if="showLogoutDialog" class="dialog-overlay">
    <div class="dialog">
      <div class="dialog-content">
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to logout?</p>
        <div class="dialog-actions">
          <button class="cancel-btn" @click="showLogoutDialog = false">Cancel</button>
          <button class="confirm-btn" @click="confirmLogout">Logout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'NavBar',
})

const router = useRouter()
const isMenuOpen = ref(false)
const showLogoutDialog = ref(false)

const userInitials = computed(() => {
  const userName = localStorage.getItem('userName') || 'John Doe'
  return userName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogout = () => {
  showLogoutDialog.value = true
}

const confirmLogout = () => {
  localStorage.removeItem('isAuthenticated')
  showLogoutDialog.value = false
  router.push('/auth/login')
}
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

  .logo-image {
    height: 40px;
  }

  .nav-link {
    font-size: 16px;
  }

  .logout-btn {
    padding: 0.5rem 1rem;
    font-size: 16px;
  }

  .profile-icon {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }
}

/* For even smaller screens */
@media (max-width: 480px) {
  .nav-links {
    gap: 0.5rem;
  }

  .navbar-brand {
    margin-left: 1rem;
  }

  .nav-links {
    margin-right: 1rem;
  }

  .logo-image {
    height: 30px;
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
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 1rem;
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
}

.hamburger {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 24px;
  position: relative;
  z-index: 100;
}

.hamburger span {
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
  background: white;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.hamburger span:first-child {
  top: 0;
}

.hamburger span:nth-child(2) {
  top: 10px;
}

.hamburger span:last-child {
  top: 20px;
}

.hamburger.is-active span:first-child {
  transform: rotate(45deg);
  top: 10px;
}

.hamburger.is-active span:nth-child(2) {
  opacity: 0;
}

.hamburger.is-active span:last-child {
  transform: rotate(-45deg);
  top: 10px;
}

@media (max-width: 1024px) {
  .hamburger {
    display: block;
    margin-right: 2rem;
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: 250px;
    flex-direction: column;
    background: #48526928;
    padding: 80px 20px;
    transition: right 0.3s ease;
    align-items: center;
    gap: 2rem;
  }

  .nav-links.is-open {
    right: -2rem;
  }
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog {
  background: #1a2634;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dialog-content {
  text-align: center;
}

.dialog-content h2 {
  margin: 0 0 1rem;
  color: white;
  font-size: 1.5rem;
}

.dialog-content p {
  margin: 0 0 1.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.cancel-btn,
.confirm-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.confirm-btn {
  background: #ff8a00;
  color: white;
}

.confirm-btn:hover {
  background: #ff9d2f;
}
</style>
