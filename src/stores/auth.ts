import { defineStore } from 'pinia'

interface User {
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),

  actions: {
    setUser(user: User) {
      this.user = user
    },
  },
})
