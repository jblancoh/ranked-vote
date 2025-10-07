import { useState, useEffect } from 'react'
import { candidatesApi } from '../services/candidates'

/**
 * Custom hook para manejar candidatas
 */
export const useCandidates = (eventId = null) => {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await candidatesApi.getAll(eventId)
      setCandidates(data)
    } catch (err) {
      setError(err.message || 'Error al cargar candidatas')
      console.error('Error fetching candidates:', err)
    } finally {
      setLoading(false)
    }
  }

  const getCandidateById = async (id) => {
    try {
      const data = await candidatesApi.getById(id)
      return data
    } catch (err) {
      console.error('Error fetching candidate:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchCandidates()
  }, [eventId])

  return {
    candidates,
    loading,
    error,
    refetch: fetchCandidates,
    getCandidateById,
  }
}