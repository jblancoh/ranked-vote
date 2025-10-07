import { useState, useEffect } from 'react'
import { TrendingUp, Users, Trophy, RefreshCw, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
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

  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6']

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshResults()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  // Preparar datos para gráfica
  const getChartData = () => {
    if (!results || !results.topCandidates) return []

    return results.topCandidates.slice(0, 8).map(item => ({
      name: item.candidate.name.split(' ')[0], // Solo primer nombre
      puntos: item.totalPoints,
      votos: item.breakdown.first + item.breakdown.second + item.breakdown.third +
        item.breakdown.fourth + item.breakdown.fifth,
    }))
  }

  // Preparar datos para gráfica de pie
  const getPieData = () => {
    if (!results || !results.results) return []

    const positionKey = selectedPosition === 'all' ? 'first' : selectedPosition
    const positionData = results.results[`${positionKey}Place`] || []

    return positionData.slice(0, 5).map(item => ({
      name: item.candidate.name,
      value: item.votes,
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Cargando resultados...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="card p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-display font-bold mb-2">
              Error al Cargar
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={handleRefresh} className="btn-primary">
              Reintentar
            </button>
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
            📊 Resultados en Tiempo Real
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Predicciones de la comunidad para el Certamen Flor de Tabasco 2025
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Votos</p>
                <p className="text-3xl font-display font-bold text-primary-600">
                  {results?.totalVotes || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="text-primary-600" size={24} />
              </div>
            </div>
          </div>

          <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Candidatas</p>
                <p className="text-3xl font-display font-bold text-secondary-600">
                  {results?.topCandidates?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                <Trophy className="text-secondary-600" size={24} />
              </div>
            </div>
          </div>

          <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Última Actualización</p>
                <p className="text-sm font-medium text-gray-900">
                  {results?.lastUpdated
                    ? new Date(results.lastUpdated).toLocaleString('es-MX')
                    : 'Hace un momento'}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
              >
                <RefreshCw
                  className={`text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`}
                  size={24}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Top Candidates - Left Panel */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h2 className="text-xl font-display font-bold mb-4 flex items-center">
                <Trophy className="mr-2 text-yellow-500" size={24} />
                Top Candidatas
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Basado en sistema de puntos
              </p>

              <div className="space-y-3">
                {results?.topCandidates?.slice(0, 10).map((item, index) => (
                  <div
                    key={item.candidateId}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-orange-600' :
                              'bg-primary-500'
                        }`}>
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-gray-900">
                          {item.candidate.name}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {item.candidate.municipality}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600">
                          {item.totalPoints}
                        </p>
                        <p className="text-xs text-gray-500">puntos</p>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="mt-3 grid grid-cols-5 gap-1">
                      {['first', 'second', 'third', 'fourth', 'fifth'].map((pos, idx) => (
                        <div key={pos} className="text-center">
                          <div className={`text-xs font-bold ${idx === 0 ? 'text-yellow-600' :
                              idx === 1 ? 'text-gray-600' :
                                idx === 2 ? 'text-orange-600' :
                                  idx === 3 ? 'text-blue-600' :
                                    'text-green-600'
                            }`}>
                            {item.breakdown[pos]}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {idx + 1}°
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts - Right Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bar Chart */}
            <div className="card p-6">
              <h2 className="text-xl font-display font-bold mb-4 flex items-center">
                <BarChart3 className="mr-2 text-primary-600" size={24} />
                Comparación de Puntos
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
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
                <h2 className="text-xl font-display font-bold">
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
              <h2 className="text-xl font-display font-bold mb-4">
                Resultados Detallados
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-2 font-display text-sm">Pos</th>
                      <th className="text-left py-3 px-2 font-display text-sm">Candidata</th>
                      <th className="text-left py-3 px-2 font-display text-sm">Municipio</th>
                      <th className="text-center py-3 px-2 font-display text-sm">1°</th>
                      <th className="text-center py-3 px-2 font-display text-sm">2°</th>
                      <th className="text-center py-3 px-2 font-display text-sm">3°</th>
                      <th className="text-center py-3 px-2 font-display text-sm">4°</th>
                      <th className="text-center py-3 px-2 font-display text-sm">5°</th>
                      <th className="text-right py-3 px-2 font-display text-sm">Puntos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results?.topCandidates?.map((item, index) => (
                      <tr
                        key={item.candidateId}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-2 text-sm font-bold text-gray-700">
                          {index + 1}
                        </td>
                        <td className="py-3 px-2 text-sm font-medium text-gray-900">
                          {item.candidate.name}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">
                          {item.candidate.municipality}
                        </td>
                        <td className="py-3 px-2 text-center text-sm text-yellow-600 font-medium">
                          {item.breakdown.first}
                        </td>
                        <td className="py-3 px-2 text-center text-sm text-gray-600 font-medium">
                          {item.breakdown.second}
                        </td>
                        <td className="py-3 px-2 text-center text-sm text-orange-600 font-medium">
                          {item.breakdown.third}
                        </td>
                        <td className="py-3 px-2 text-center text-sm text-blue-600 font-medium">
                          {item.breakdown.fourth}
                        </td>
                        <td className="py-3 px-2 text-center text-sm text-green-600 font-medium">
                          {item.breakdown.fifth}
                        </td>
                        <td className="py-3 px-2 text-right text-sm font-bold text-primary-600">
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
        <div className="mt-12 text-center card p-8">
          <h3 className="text-2xl font-display font-bold mb-4">
            ¿Aún no has votado?
          </h3>
          <p className="text-gray-600 mb-6">
            Participa en la predicción del Certamen Flor de Tabasco 2025
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