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
      return response.data
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
      return response.data
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
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default votesApi
