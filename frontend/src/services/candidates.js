import api from './api'

/**
 * Candidates API endpoints
 */
export const candidatesApi = {
  /**
   * Get all candidates
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/candidates', { params })
      return response // Interceptor already returns response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get active candidates only
   */
  getActive: async () => {
    try {
      const response = await api.get('/candidates', {
        params: { active: true }
      })
      return response // Interceptor already returns response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get candidate by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/candidates/${id}`)
      return response // Interceptor already returns response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Create new candidate
   */
  create: async (candidateData) => {
    try {
      const response = await api.post('/candidates', candidateData)
      return response // Interceptor already returns response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Update candidate
   */
  update: async (id, candidateData) => {
    try {
      const response = await api.put(`/candidates/${id}`, candidateData)
      return response // Interceptor already returns response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Delete candidate
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/candidates/${id}`)
      return response // Interceptor already returns response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Toggle candidate active status
   */
  toggleStatus: async (id) => {
    try {
      const response = await api.patch(`/candidates/${id}/toggle`)
      return response // Interceptor already returns response.data
    } catch (error) {
      throw error
    }
  }
}

export default candidatesApi
