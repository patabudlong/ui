<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { showToast } = useToast()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    showToast('Passwords do not match', 'error')
    return
  }

  try {
    loading.value = true
    console.log('Registering with:', {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value,
    })

    await authService.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value,
    })

    showToast('Registration successful', 'success')
    router.push('/auth/login')
  } catch (error) {
    console.error('Registration error:', error)
    if (error instanceof Error) {
      showToast(error.message, 'error')
    } else {
      showToast('An unexpected error occurred', 'error')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-view">
    <div class="register-card">
      <div class="logo">
        <img src="@/assets/sapere-logo.PNG" alt="Sapere Logo" />
      </div>

      <h1>Create Account</h1>
      <p class="subtitle">Sign up to start managing your tasks</p>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <div class="input-wrapper">
            <input
              type="text"
              id="name"
              v-model="name"
              required
              placeholder="Enter your full name"
            />
          </div>
        </div>

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

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <div class="input-wrapper">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="confirmPassword"
              required
              placeholder="Confirm your password"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showConfirmPassword = !showConfirmPassword"
            >
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
                  v-if="!showConfirmPassword"
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                ></path>
                <line v-if="!showConfirmPassword" x1="1" y1="1" x2="23" y2="23"></line>
                <path
                  v-if="showConfirmPassword"
                  d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                ></path>
                <circle v-if="showConfirmPassword" cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
        </div>

        <button type="submit" class="register-button" :disabled="loading">
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>

        <div class="login-prompt">
          <span>Already have an account?</span>
          <router-link to="/auth/login" class="login-link">Sign in</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.register-card {
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

.register-button {
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
  margin-top: 1rem;
}

.register-button:hover {
  background: #ff9d2f;
}

.register-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-prompt {
  margin-top: 1.5rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.login-link {
  color: #3b82f6;
  text-decoration: none;
  margin-left: 0.5rem;
  cursor: pointer;
}

.login-link:hover {
  color: #60a5fa;
}

@media (max-width: 768px) {
  .register-card {
    padding: 2rem;
    margin-top: 0;
  }
}

@media (max-width: 480px) {
  .register-view {
    padding: 1rem;
  }

  .register-card {
    padding: 1.5rem;
    border-radius: 16px;
  }
}
</style>
