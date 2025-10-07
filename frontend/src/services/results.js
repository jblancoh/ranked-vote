import api from './api'

/**
 * Results API endpoints
 */
export const resultsApi = {
  /**
   * Get calculated results
   */
  getResults: async () => {
    try {
      const response = await api.get('/results/calculate')
      return response // Interceptor already returns response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get top N candidates
   */
  getTop: async (limit = 5) => {
    try {
      const response = await api.get('/results/top', {
        params: { limit }
      })
      return response // Interceptor already returns response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get result for specific candidate
   */
  getCandidateResult: async (candidateId) => {
    try {
      const response = await api.get(`/results/candidate/${candidateId}`)
      return response // Interceptor already returns response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get saved results
   */
  getSavedResults: async () => {
    try {
      const response = await api.get('/results')
      return response // Interceptor already returns response.data
    } catch (error) {
      throw error
    }
  }
}

export default resultsApi
