import { useState, useEffect } from 'react'
import { resultsApi } from '../services/results'

/**
 * Custom hook para manejar resultados
 */
export const useResults = (eventId = null) => {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchResults = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await resultsApi.getResults(eventId)
      setResults(data)
    } catch (err) {
      setError(err.message || 'Error al cargar resultados')
      console.error('Error fetching results:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshResults = async () => {
    await fetchResults()
  }

  useEffect(() => {
    fetchResults()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchResults, 30000)

    return () => clearInterval(interval)
  }, [eventId])

  return {
    results,
    loading,
    error,
    refreshResults,
  }
}