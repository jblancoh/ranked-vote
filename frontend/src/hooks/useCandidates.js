import { useState, useEffect } from 'react'
import { candidatesApi } from '../services/candidates'

/**
 * Custom hook para manejar candidatas
 */
export const useCandidates = (eventId = null, filter = null) => {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtering, setFiltering] = useState(false)
  const [error, setError] = useState(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const fetchCandidates = async () => {
    try {
      // Use different loading states for initial load vs filtering
      if (isInitialLoad) {
        setLoading(true)
      } else {
        setFiltering(true)
      }
      setError(null)
      
      // Only send filter if it's not empty after trimming
      const params = { eventId }
      if (filter && filter.trim()) {
        params.filter = filter.trim()
      }
      const data = await candidatesApi.getAll(params)
      setCandidates(data)
      
      if (isInitialLoad) {
        setIsInitialLoad(false)
      }
    } catch (err) {
      setError(err.message || 'Error al cargar candidatas')
      console.error('Error fetching candidates:', err)
    } finally {
      if (isInitialLoad) {
        setLoading(false)
      } else {
        setFiltering(false)
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, filter])

  return {
    candidates,
    loading,
    filtering,
    error,
    refetch: fetchCandidates,
    getCandidateById,
  }
}