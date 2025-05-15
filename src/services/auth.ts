import api from './api'

export const authService = {
  async checkConnection() {
    try {
      const response = await api.get('/api/health')
      return response.data
    } catch (error) {
      throw error
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await api.post('/api/login', { email, password })
      return response.data
    } catch (error) {
      throw error
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout')
      localStorage.removeItem('isAuthenticated')
    } catch (error) {
      throw error
    }
  },
}
