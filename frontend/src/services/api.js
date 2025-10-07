import axios from 'axios'

// API Base URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Return only the data
    return response.data
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'Error del servidor'
      throw new Error(message)
    } else if (error.request) {
      // Request was made but no response
      throw new Error('No se pudo conectar con el servidor')
    } else {
      // Something else happened
      throw new Error(error.message || 'Error desconocido')
    }
  }
)

export default api