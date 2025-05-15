<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
    }
  },
  mounted() {
    console.log('LoginView mounted')
  },
  methods: {
    handleLogin() {
      // Implement login logic here
      console.log('Login attempted:', { email: this.email, password: this.password })
    },
  },
})
</script>

<template>
  <div class="login-view">
    <h1>Login Form</h1>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required placeholder="Enter your email" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          placeholder="Enter your password"
        />
      </div>
      <button type="submit" class="login-button">Login</button>
    </form>
  </div>
</template>

<style scoped>
.login-view {
  color: white;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input {
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.login-button {
  padding: 0.75rem;
  border-radius: 6px;
  border: none;
  background: #4caf50;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.login-button:hover {
  background: #45a049;
}
</style>
