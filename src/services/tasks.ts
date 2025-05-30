import api from './api'

export interface Task {
  id: number
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  due_date: string
  created_at: string
}

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export const taskService = {
  async getTasks(): Promise<Task[]> {
    try {
      const response = await api.get('/api/tasks', getAuthHeader())
      return response.data
    } catch (error) {
      throw error
    }
  },

  async createTask(task: Pick<Task, 'title' | 'description' | 'status'>): Promise<Task> {
    try {
      const response = await api.post('/api/tasks', task, getAuthHeader())
      return response.data
    } catch (error) {
      throw error
    }
  },

  async updateTask(
    id: number,
    task: Partial<Pick<Task, 'title' | 'description' | 'status'>>,
  ): Promise<Task> {
    try {
      const response = await api.put(`/api/tasks/${id}`, task, getAuthHeader())
      return response.data
    } catch (error) {
      throw error
    }
  },

  async deleteTask(id: number): Promise<void> {
    try {
      await api.delete(`/api/tasks/${id}`, getAuthHeader())
    } catch (error) {
      throw error
    }
  },
}
