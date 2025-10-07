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
      const result = await votesApi.checkVote(eventId)
      setHasVoted(result.hasVoted)
      return result
    } catch (err) {
      console.error('Error checking vote:', err)
      return { hasVoted: false }
    }
  }, [eventId])

  const submitVote = async (voteData) => {
    try {
      setLoading(true)
      setError(null)

      const result = await votesApi.submit({
        eventId: eventId || voteData.eventId,
        ...voteData,
      })

      setHasVoted(true)
      return result
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