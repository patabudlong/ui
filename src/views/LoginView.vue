<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isConnected = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  try {
    loading.value = true
    await authService.login(email.value, password.value)
    localStorage.setItem('isAuthenticated', 'true')
    router.push('/')
  } catch (error) {
    alert('Invalid credentials')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await authService.checkConnection()
    isConnected.value = true
    // console.log('Connected to server')
  } catch (_error) {
    isConnected.value = false
    // alert('Cannot connect to server')
  }
})
</script>

<template>
  <div class="login-view">
    <div class="login-card">
      <div class="connection-status" :class="{ connected: isConnected }">
        {{ isConnected ? '🟢 Connected' : '🔴 Not Connected' }}
      </div>
      <div class="logo">
        <img src="@/assets/sapere-logo.PNG" alt="Sapere Logo" />
      </div>

      <h1>Welcome Back</h1>
      <p class="subtitle">Sign in to continue to your task dashboard</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-wrapper">
            <input
              type="email"
              id="email"
              v-model="email"
              required
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              required
              placeholder="Enter your password"
            />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  v-if="!showPassword"
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                ></path>
                <line v-if="!showPassword" x1="1" y1="1" x2="23" y2="23"></line>
                <path v-if="showPassword" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle v-if="showPassword" cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <a href="#" class="forgot-password">Forgot password?</a>
        </div>

        <button type="submit" class="login-button" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>

        <div class="signup-prompt">
          <span>Don't have an account?</span>
          <a href="#" class="signup-link">Sign up</a>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 2.5rem;
  width: 100%;
  max-width: 380px;
  text-align: center;
  margin-top: -5rem;
}

.logo {
  margin-bottom: 1.5rem;
}

.logo img {
  width: 80px;
  height: auto;
  filter: brightness(0) invert(1);
}

h1 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  margin-bottom: 2rem;
}

.form-group {
  text-align: left;
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
}

.input-wrapper {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.password-toggle:hover {
  color: rgba(255, 255, 255, 0.8);
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  background: transparent;
  border: none;
  color: white;
  font-size: 0.95rem;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
  padding-left: 0.25rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.remember-me input[type='checkbox'] {
  width: 16px;
  height: 16px;
  margin: 0;
  padding: 0;
  position: relative;
  top: -1px;
}

.remember-me span {
  display: block;
  line-height: 1;
}

.forgot-password {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.9rem;
  line-height: 1;
  position: relative;
  top: -1px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.forgot-password:hover {
  color: #3b82f6;
  background: transparent;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  background: #ff8a00;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:hover {
  background: #ff9d2f;
}

.signup-prompt {
  margin-top: 1.5rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.signup-link {
  color: #3b82f6;
  text-decoration: none;
  margin-left: 0.5rem;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.signup-link:hover {
  color: #3b82f6;
  background: transparent;
}

.connection-status {
  position: absolute;
  top: 1rem;
  right: 2rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.connection-status.connected {
  color: #4caf50;
}

@media (max-width: 768px) {
  .login-card {
    padding: 2rem;
    margin-top: 0;
  }
}

@media (max-width: 480px) {
  .login-view {
    padding: 1rem;
  }

  .login-card {
    padding: 1.5rem;
    border-radius: 16px;
  }

  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .forgot-password {
    margin-left: 1.8rem;
  }
}
</style>
