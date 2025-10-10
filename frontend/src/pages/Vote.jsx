import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Vote as VoteIcon, X } from 'lucide-react'
import { useCandidates } from '../hooks/useCandidates'
import { useVote } from '../hooks/useVote'

const Vote = () => {
  const [selectedCandidates, setSelectedCandidates] = useState({
    first: null,
    second: null,
    third: null,
    fourth: null,
    fifth: null,
  })
  const [voterName, setVoterName] = useState('')
  const [voterEmail, setVoterEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [filterText, setFilterText] = useState('')

  const { candidates, loading, filtering, error: candidatesError } = useCandidates(null, filterText)
  const { submitVote, hasVoted, checkIfVoted } = useVote()

  useEffect(() => {
    checkIfVoted()
  }, [])

  const positions = [
    { key: 'first', label: '1er Lugar', color: 'gold' },
    { key: 'second', label: '2do Lugar', color: 'silver' },
    { key: 'third', label: '3er Lugar', color: 'bronze' },
    { key: 'fourth', label: '4to Lugar', color: 'blue' },
    { key: 'fifth', label: '5to Lugar', color: 'green' },
  ]

  const getColorClasses = (color) => {
    const colors = {
      gold: 'bg-yellow-50 border-yellow-400 text-yellow-700',
      silver: 'bg-gray-50 border-gray-400 text-gray-700',
      bronze: 'bg-orange-50 border-orange-400 text-orange-700',
      blue: 'bg-blue-50 border-blue-400 text-blue-700',
      green: 'bg-green-50 border-green-400 text-green-700',
    }
    return colors[color] || colors.blue
  }

  const handleSelectCandidate = (position, candidateId) => {
    // Si ya está seleccionada en esta posición, deseleccionar
    if (selectedCandidates[position] === candidateId) {
      setSelectedCandidates(prev => ({ ...prev, [position]: null }))
      return
    }

    // Si ya está seleccionada en otra posición, intercambiar
    const currentPosition = Object.keys(selectedCandidates).find(
      key => selectedCandidates[key] === candidateId
    )

    if (currentPosition) {
      setSelectedCandidates(prev => ({
        ...prev,
        [currentPosition]: prev[position],
        [position]: candidateId,
      }))
    } else {
      setSelectedCandidates(prev => ({ ...prev, [position]: candidateId }))
    }
  }

  const isSelected = (candidateId) => {
    return Object.values(selectedCandidates).includes(candidateId)
  }

  const getPosition = (candidateId) => {
    const position = Object.keys(selectedCandidates).find(
      key => selectedCandidates[key] === candidateId
    )
    if (!position) return null
    const positionData = positions.find(p => p.key === position)
    return positionData?.label
  }

  const isFormValid = () => {
    return Object.values(selectedCandidates).every(val => val !== null) &&
      voterName.trim() !== ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await submitVote({
        ...selectedCandidates,
        voterName,
        voterEmail: voterEmail || undefined,
      })
      setShowSuccess(true)
      // Reset form after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 5001)
    } catch (err) {
      setError(err.message || 'Error al enviar el voto. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setSelectedCandidates({
      first: null,
      second: null,
      third: null,
      fourth: null,
      fifth: null,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Cargando candidatas...</p>
        </div>
      </div>
    )
  }

  if (hasVoted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="card p-8 text-center">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-display font-bold mb-2">
              ¡Ya has votado!
            </h2>
            <p className="text-gray-600 mb-6">
              Gracias por participar. Ya registraste tu predicción para el
              Certamen Flor de Tabasco 2026.
            </p>
            <a href="/results" className="btn-primary">
              Ver Resultados
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 animate-fade-in">
        <div className="max-w-md w-full mx-4">
          <div className="card p-8 text-center">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4 animate-bounce-in" />
            <h2 className="text-2xl font-display font-bold mb-2">
              ¡Voto Registrado!
            </h2>
            <p className="text-gray-600 mb-6">
              Tu predicción ha sido guardada exitosamente.
              Gracias por participar en Ranked Vote 2026.
            </p>
            <div className="space-y-3">
              <a href="/results" className="btn-primary w-full">
                Ver Resultados
              </a>
              <a href="/" className="btn-outline w-full">
                Volver al Inicio
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            🗳️ Haz tu Predicción
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Selecciona tus 5 candidatas favoritas del 1er al 5to lugar para el
            Certamen Flor de Tabasco 2026
          </p>
        </div>

        {/* Error Alert */}
        {(error || candidatesError) && (
          <div className="alert-error max-w-4xl mx-auto mb-6 animate-slide-down">
            <AlertCircle size={20} className="inline mr-2" />
            {error || candidatesError}
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Candidatas List */}
            <div className="lg:col-span-2">
              <div className="card p-6 mb-6">
                <div className="flex justify-between items-center mb-4 flex-wrap">
                  <div className="flex flex-1 flex-col justify-between">
                    <h2 className="text-xl font-display font-bold mb-4">
                      Candidatas
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      Haz clic en una candidata para seleccionarla en tu top 5
                    </p>
                  </div>
                  <div className="flex flex-[0.7] items-center justify-end">
                    <input
                      type="text"
                      placeholder="Filtrar candidatas..."
                      className="input w-full max-w-xs"
                      value={filterText}
                      onChange={e => setFilterText(e.target.value)}
                    />
                  </div>
                </div>

                <div className={`grid sm:grid-cols-2 gap-4 transition-opacity duration-200 ${filtering ? 'opacity-70' : 'opacity-100'}`}>
                  {candidates?.length === 0 && !filtering && filterText ? (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-gray-500 mb-2">
                        No se encontraron candidatas con &quot;{filterText}&quot;
                      </p>
                      <button
                        onClick={() => setFilterText('')}
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        Limpiar filtro
                      </button>
                    </div>
                  ) : (
                    candidates?.map((candidate) => {
                      const selected = isSelected(candidate.id)
                      const position = getPosition(candidate.id)

                      return (
                        <div
                          key={candidate.id}
                          onClick={() => {
                            // Select in first available position
                            const firstAvailable = positions.find(
                              p => !selectedCandidates[p.key]
                            )
                            if (firstAvailable && !selected) {
                              handleSelectCandidate(firstAvailable.key, candidate.id)
                            }
                          }}
                          className={`card p-4 cursor-pointer transition-all duration-200 ${selected
                              ? 'ring-2 ring-primary-500 bg-primary-50'
                              : 'hover:shadow-lg hover:scale-[1.02]'
                            }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              {candidate.name.charAt(0)}
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-display font-bold text-gray-900">
                                {candidate.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {candidate.municipality}
                              </p>
                            </div>
                            {selected && (
                              <div className="flex items-center space-x-2">
                                <span className="badge badge-primary text-xs">
                                  {position}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const pos = Object.keys(selectedCandidates).find(
                                      key => selectedCandidates[key] === candidate.id
                                    )
                                    if (pos) {
                                      setSelectedCandidates(prev => ({
                                        ...prev,
                                        [pos]: null
                                      }))
                                    }
                                  }}
                                  className="p-1 hover:bg-red-100 rounded-full transition-colors"
                                >
                                  <X size={16} className="text-red-500" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Selection Panel */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-20">
                <h2 className="text-xl font-display font-bold mb-4">
                  Tu Top 5
                </h2>

                {/* Positions */}
                <div className="space-y-3 mb-6">
                  {positions.map((position) => {
                    const candidateId = selectedCandidates[position.key]
                    const candidate = candidates?.find(c => c.id === candidateId)

                    return (
                      <div
                        key={position.key}
                        className={`p-3 border-2 rounded-lg transition-all ${candidate
                            ? getColorClasses(position.color)
                            : 'border-gray-200 bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm">
                            {position.label}
                          </span>
                          {candidate ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">
                                {candidate.name}
                              </span>
                              <button
                                onClick={() => handleSelectCandidate(position.key, candidateId)}
                                className="p-1 hover:bg-white/50 rounded-full"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">
                              Sin seleccionar
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label label-required">
                      Tu Nombre
                    </label>
                    <input
                      type="text"
                      value={voterName}
                      onChange={(e) => setVoterName(e.target.value)}
                      className="input"
                      placeholder="Ej: Juan Pérez"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      Email (Opcional)
                    </label>
                    <input
                      type="email"
                      value={voterEmail}
                      onChange={(e) => setVoterEmail(e.target.value)}
                      className="input"
                      placeholder="tu@email.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Para notificaciones futuras
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="submit"
                      disabled={!isFormValid() || isSubmitting}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="spinner mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <VoteIcon size={20} className="mr-2" />
                          Enviar Predicción
                        </>
                      )}
                    </button>

                    {Object.values(selectedCandidates).some(v => v !== null) && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="btn-outline w-full"
                      >
                        Limpiar Selección
                      </button>
                    )}
                  </div>
                </form>

                {/* Progress */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-bold text-primary-600">
                      {Object.values(selectedCandidates).filter(v => v !== null).length}/5
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(Object.values(selectedCandidates).filter(v => v !== null).length / 5) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Vote