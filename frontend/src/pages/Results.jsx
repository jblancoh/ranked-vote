import { useState } from 'react'
import { Users, Trophy, RefreshCw, BarChart3 } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useResults } from '../hooks/useResults'

const Results = () => {
  const { results, loading, error, refreshResults } = useResults()
  const [selectedPosition, setSelectedPosition] = useState('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const positions = [
    { key: 'all', label: 'Todas las Posiciones' },
    { key: 'first', label: '1er Lugar' },
    { key: 'second', label: '2do Lugar' },
    { key: 'third', label: '3er Lugar' },
    { key: 'fourth', label: '4to Lugar' },
    { key: 'fifth', label: '5to Lugar' },
  ]

  const COLORS = [
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#84cc16',
    '#22c55e',
    '#14b8a6',
    '#06b6d4',
    '#3b82f6',
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshResults()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  // Preparar datos para gráfica
  const getChartData = () => {
    if (!results || !results.results) return []

    return results.results.slice(0, 8).map((item) => ({
      name: item.candidateName.split(' ')[1] || item.candidateName, // Segundo nombre o nombre completo
      puntos: item.totalPoints,
      votos: item.votes.total,
    }))
  }

  // Preparar datos para gráfica de pie
  const getPieData = () => {
    if (!results || !results.results) return []

    const positionKey = selectedPosition === 'all' ? 'firstPlace' : `${selectedPosition}Place`

    return results.results
      .filter((item) => item.votes[positionKey] > 0)
      .slice(0, 5)
      .map((item) => ({
        name: item.candidateName,
        value: item.votes[positionKey],
      }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando resultados...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-md w-full mx-4">
          <div className="card p-8 text-center">
            <div className="text-red-500 dark:text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-display font-bold mb-2">Error al Cargar</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button onClick={handleRefresh} className="btn-primary">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            📊 Resultados en Tiempo Real
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Predicciones de la comunidad para el Certamen Flor de Tabasco 2026
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total de Votos</p>
                <p className="text-3xl font-display font-bold text-primary-600">
                  {results?.totalVotes || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center transition-colors duration-300">
                <Users className="text-primary-600" size={24} />
              </div>
            </div>
          </div>

          <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Candidatas</p>
                <p className="text-3xl font-display font-bold text-secondary-600">
                  {results?.results?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/40 rounded-full flex items-center justify-center transition-colors duration-300">
                <Trophy className="text-secondary-600" size={24} />
              </div>
            </div>
          </div>

          <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Última Actualización
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {results?.calculatedAt
                    ? new Date(results.calculatedAt).toLocaleString('es-MX')
                    : 'Hace un momento'}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
              >
                <RefreshCw
                  className={`text-blue-600 dark:text-blue-300 ${isRefreshing ? 'animate-spin' : ''}`}
                  size={24}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Top Candidates - Left Panel */}
          <div className="lg:col-span-1 animate-slide-in-left">
            <div className="card p-6 sticky top-20">
              <h2 className="text-xl font-display font-bold mb-4 flex items-center text-gray-900 dark:text-gray-100 transition-colors duration-300">
                <Trophy className="mr-2 text-yellow-500 dark:text-yellow-400" size={24} />
                Top Candidatas
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Basado en sistema de puntos
              </p>

              <div className="space-y-3">
                {results?.results?.slice(0, 10).map((item, index) => (
                  <div
                    key={item.candidateId}
                    className={`p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors animate-stagger-${(index % 5) + 1}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0
                            ? 'bg-yellow-500 dark:bg-yellow-400'
                            : index === 1
                              ? 'bg-gray-400 dark:bg-gray-500'
                              : index === 2
                                ? 'bg-orange-600 dark:bg-orange-500'
                                : 'bg-primary-500 dark:bg-primary-400'
                        }`}
                      >
                        {item.position}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">
                          {item.candidateName}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {item.municipality}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600 dark:text-primary-300">
                          {item.totalPoints}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">puntos</p>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="mt-3 grid grid-cols-5 gap-1">
                      {['firstPlace', 'secondPlace', 'thirdPlace', 'fourthPlace', 'fifthPlace'].map(
                        (pos, idx) => (
                          <div key={pos} className="text-center">
                            <div
                              className={`text-xs font-bold ${
                                idx === 0
                                  ? 'text-yellow-600'
                                  : idx === 1
                                    ? 'text-gray-600'
                                    : idx === 2
                                      ? 'text-orange-600'
                                      : idx === 3
                                        ? 'text-blue-600'
                                        : 'text-green-600 dark:text-green-400'
                              }`}
                            >
                              {item.votes[pos]}
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">
                              {idx + 1}°
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts - Right Panel */}
          <div className="lg:col-span-2 space-y-8 animate-slide-in-right">
            {/* Bar Chart */}
            <div className="card p-6">
              <h2 className="text-xl font-display font-bold mb-4 flex items-center text-gray-900 dark:text-gray-100 transition-colors duration-300">
                <BarChart3 className="mr-2 text-primary-600 dark:text-primary-300" size={24} />
                Comparación de Puntos
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="puntos" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Position Filter */}
            <div className="card p-6">
              <div className="flex flex-wrap items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                  Votos por Posición
                </h2>
                <select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="select text-sm"
                >
                  {positions.map((pos) => (
                    <option key={pos.key} value={pos.key}>
                      {pos.label}
                    </option>
                  ))}
                </select>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getPieData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getPieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Results Table */}
            <div className="card p-6">
              <h2 className="text-xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                Resultados Detallados
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-2 font-display text-sm text-gray-700 dark:text-gray-300">
                        Pos
                      </th>
                      <th className="text-left py-3 px-2 font-display text-sm text-gray-700 dark:text-gray-300">
                        Candidata
                      </th>
                      <th className="text-left py-3 px-2 font-display text-sm text-gray-700 dark:text-gray-300">
                        Municipio
                      </th>
                      <th className="text-center py-3 px-2 font-display text-sm text-gray-700 dark:text-gray-300">
                        1°
                      </th>
                      <th className="text-center py-3 px-2 font-display text-sm text-gray-700 dark:text-gray-300">
                        2°
                      </th>
                      <th className="text-center py-3 px-2 font-display text-sm text-gray-700 dark:text-gray-300">
                        3°
                      </th>
                      <th className="text-center py-3 px-2 font-display text-sm text-gray-700 dark:text-gray-300">
                        4°
                      </th>
                      <th className="text-center py-3 px-2 font-display text-sm text-gray-700 dark:text-gray-300">
                        5°
                      </th>
                      <th className="text-right py-3 px-2 font-display text-sm text-gray-700 dark:text-gray-300">
                        Puntos
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results?.results?.map((item, index) => (
                      <tr
                        key={item.candidateId}
                        className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors animate-stagger-${(index % 5) + 1}`}
                      >
                        <td className="py-3 px-2 text-sm font-bold text-gray-700 dark:text-gray-200">
                          {item.position}
                        </td>
                        <td className="py-3 px-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                          {item.candidateName}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400">
                          {item.municipality}
                        </td>
                        <td className="py-3 px-2 text-center text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                          {item.votes.firstPlace}
                        </td>
                        <td className="py-3 px-2 text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {item.votes.secondPlace}
                        </td>
                        <td className="py-3 px-2 text-center text-sm text-orange-600 dark:text-orange-400 font-medium">
                          {item.votes.thirdPlace}
                        </td>
                        <td className="py-3 px-2 text-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {item.votes.fourthPlace}
                        </td>
                        <td className="py-3 px-2 text-center text-sm text-green-600 dark:text-green-400 font-medium">
                          {item.votes.fifthPlace}
                        </td>
                        <td className="py-3 px-2 text-right text-sm font-bold text-primary-600 dark:text-primary-300">
                          {item.totalPoints}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center card p-8 animate-slide-up">
          <h3 className="text-2xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            ¿Aún no has votado?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Participa en la predicción del Certamen Flor de Tabasco 2026
          </p>
          <a href="/vote" className="btn-primary text-lg px-8 py-4">
            Hacer mi Predicción
          </a>
        </div>
      </div>
    </div>
  )
}

export default Results
