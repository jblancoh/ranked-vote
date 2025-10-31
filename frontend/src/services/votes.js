import api from './api'

/**
 * Votes API endpoints
 */
export const votesApi = {
  /**
   * Submit a vote
   */
  submit: async (voteData) => {
    try {
      const response = await api.post('/votes', voteData)
      return response // Interceptor already returns response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Check if user has already voted
   */
  checkVote: async () => {
    try {
      const response = await api.get('/votes/check')
      return response // Interceptor already returns response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get total vote count
   */
  getCount: async () => {
    try {
      const response = await api.get('/votes/count')
      return response // Interceptor already returns response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get all votes (for export/admin)
   */
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString()
      const response = await api.get(`/votes${queryParams ? '?' + queryParams : ''}`)
      return response // Interceptor already returns response.data
    } catch (error) {
      throw error
    }
  }
}

export default votesApi
