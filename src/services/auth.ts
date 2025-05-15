import api from './api'
import type { AuthResponse } from '../types/auth'

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

interface RegisterResponse {
  message: string
  user: {
    id: number
    name: string
    email: string
  }
}

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

  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await api.post('/api/register', data)
      return response.data
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Registration error response:', error.response.data)
        throw new Error(error.response.data.message || 'Registration failed')
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request)
        throw new Error('No response from server')
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', error.message)
        throw error
      }
    }
  },
}
