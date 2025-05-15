import api from './api'
import type { AuthResponse } from '../types/auth'

export const authService = {
  async checkConnection() {
    try {
      const response = await api.get('/api/health')
      return response.data
    } catch (error) {
      throw error
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/login', { email, password })
      const { token } = response.data

      // Save token to localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('isAuthenticated', 'true')

      // Update API headers with new token
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      return response.data
    } catch (error) {
      throw error
    }
  },

  async logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('isAuthenticated')
    delete api.defaults.headers.common['Authorization']
  },
}
