import api from './api'

/**
 * Events API endpoints
 */
export const eventsApi = {
  /**
   * Get all events
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/events', { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get current/active event
   */
  getCurrent: async () => {
    try {
      const response = await api.get('/events/current')
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get event by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Create new event
   */
  create: async (eventData) => {
    try {
      const response = await api.post('/events', eventData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Update event
   */
  update: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}`, eventData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Delete event
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/events/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Toggle voting status
   */
  toggleVoting: async (id) => {
    try {
      const response = await api.patch(`/events/${id}/voting`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default eventsApi
