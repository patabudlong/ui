<script setup lang="ts">
import { ref, computed } from 'vue'
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
const isSubmitting = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

// Real-time validation
const passwordError = computed(() => {
  if (!password.value) return ''
  if (password.value.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(password.value)) return 'Password must contain at least one uppercase letter'
  if (!/[a-z]/.test(password.value)) return 'Password must contain at least one lowercase letter'
  if (!/[0-9]/.test(password.value)) return 'Password must contain at least one number'
  return ''
})

const confirmPasswordError = computed(() => {
  if (!confirmPassword.value) return ''
  if (password.value !== confirmPassword.value) return 'Passwords do not match'
  return ''
})

const isFormValid = computed(() => {
  return (
    name.value.length > 0 &&
    email.value.length > 0 &&
    password.value.length >= 8 &&
    !passwordError.value &&
    !confirmPasswordError.value
  )
})

const handleRegister = async () => {
  if (!isFormValid.value || isSubmitting.value) return

  try {
    isSubmitting.value = true
    loading.value = true

    await authService.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value,
    })

    showToast('Registration successful', 'success')
    setTimeout(() => {
      router.push('/auth/login')
    }, 1500)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Registration failed'
    showErrorModal.value = true
  } finally {
    isSubmitting.value = false
    loading.value = false
  }
}

const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
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
              :class="{ error: passwordError }"
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
          <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
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
              :class="{ error: confirmPasswordError }"
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
          <span v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</span>
        </div>

        <button
          type="submit"
          class="register-button"
          :disabled="!isFormValid || loading || isSubmitting"
        >
          <span v-if="loading" class="spinner"></span>
          <span v-else>{{ isSubmitting ? 'Creating Account...' : 'Create Account' }}</span>
        </button>

        <div class="login-prompt">
          <span>Already have an account?</span>
          <router-link to="/auth/login" class="login-link">Sign in</router-link>
        </div>
      </form>
    </div>
  </div>

  <div v-if="showErrorModal" class="modal-overlay" @click="closeErrorModal">
    <div class="modal" @click.stop>
      <div class="modal-content">
        <h3>Registration Failed</h3>
        <p>{{ errorMessage }}</p>
        <button class="close-btn" @click="closeErrorModal">Try Again</button>
      </div>
    </div>
  </div>
</template>

<style>
/* Remove any global styles that might affect links */
a:hover {
  color: inherit;
  text-decoration: none;
}
</style>

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

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
}

.input-wrapper input.error {
  border-color: #ef4444;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #1a2634;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.modal-content {
  text-align: center;
  padding: 1rem;
}

.modal-content h3 {
  color: #ef4444;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.modal-content p {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.5;
}

.close-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.close-btn:hover {
  background: #dc2626;
}
</style>
