import { useState, useCallback } from 'react'
import { votesApi } from '../services/votes'

/**
 * Custom hook para manejar votaciones
 */
export const useVote = (eventId = null) => {
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const checkIfVoted = useCallback(async () => {
    try {
      const response = await votesApi.checkVote(eventId)
      // API returns { success: true, hasVoted: boolean, voteDate: date }
      setHasVoted(response.hasVoted)
      return response
    } catch (err) {
      console.error('Error checking vote:', err)
      return { hasVoted: false }
    }
  }, [eventId])

  const submitVote = async (voteData) => {
    try {
      setLoading(true)
      setError(null)

      const response = await votesApi.submit({
        eventId: eventId || voteData.eventId,
        ...voteData,
      })

      setHasVoted(true)
      return response
    } catch (err) {
      setError(err.message || 'Error al enviar el voto')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    hasVoted,
    loading,
    error,
    submitVote,
    checkIfVoted,
  }
}