/*
 * Utilidad para exportar datos a CSV
 * Espera la estructura devuelta por /api/results/calculate y /api/votes
 * Sanitiza datos y maneja caracteres especiales con codificación UTF-8
 */

import { maskIP, maskEmail, formatPercentage, recalculatePercentages, getDateString } from './exportHelpers'


// ============================================================================
// Utilities
// ============================================================================


/**
 * Convierte array de objetos a string CSV
 */
const convertToCSV = (data, headers) => {
  if (!data || data.length === 0) return ''

  // Fila de encabezados
  const headerRow = headers.map((h) => `"${h.label}"`).join(',')

  // Filas de datos
  const dataRows = data.map((row) => {
    return headers
      .map((header) => {
        const value = row[header.key]
        const sanitized = sanitizeCSVValue(value)
        return `"${sanitized}"`
      })
      .join(',')
  })

  return [headerRow, ...dataRows].join('\n')
}

/**
 * Sanitiza valores CSV para prevenir inyección
 */
const sanitizeCSVValue = (value) => {
  if (value === null || value === undefined) return ''

  let sanitized = String(value)

  // Remover posibles caracteres de inyección CSV al inicio
  if (sanitized.match(/^[=+\-@]/)) sanitized = "'" + sanitized

  // Escapar comillas dobles
  sanitized = sanitized.replace(/"/g, '""')

  return sanitized
}


/**
 * Helper para descargar archivo
 */
const UTF8_BOM = '\ufeff' // UTF-8 BOM para compatibilidad con Excel

const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([UTF8_BOM + content], { type: mimeType })
  const link = document.createElement('a')

  link.href = URL.createObjectURL(blob)
  link.download = filename

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(link.href)
}


// ============================================================================
// CSV export functions
// ============================================================================


/**
 * Exporta resultados a CSV
 * Espera la estructura devuelta por /api/results/calculate:
 * {
 *   results: [{
 *     position: 1,
 *     candidateName: "Name",
 *     municipality: "Municipality",
 *     totalPoints: 450,
 *     votes: { firstPlace: 30, secondPlace: 25, ... },
 *     percentage: 22.5
 *   }]
 * }
 */
export const exportResultsToCSV = (resultsData, filename = 'resultados') => {
  if (!resultsData || !resultsData.results || resultsData.results.length === 0) {
    alert('No hay resultados para exportar')
    return
  }

  // Recalcular porcentajes correctamente
  const correctedResults = recalculatePercentages(resultsData.results)

  // Definir encabezados CSV
  const headers = [
    { key: 'position', label: 'Posición' },
    { key: 'name', label: 'Nombre' },
    { key: 'municipality', label: 'Municipio' },
    { key: 'totalPoints', label: 'Puntos Totales' },
    { key: 'votes1st', label: 'Votos 1er Lugar' },
    { key: 'votes2nd', label: 'Votos 2do Lugar' },
    { key: 'votes3rd', label: 'Votos 3er Lugar' },
    { key: 'votes4th', label: 'Votos 4to Lugar' },
    { key: 'votes5th', label: 'Votos 5to Lugar' },
    { key: 'percentage', label: 'Porcentaje' },
  ]

  // Transformar datos de resultados al formato esperado
  const data = correctedResults.map((result) => ({
    position: result.position || 0,
    name: result.candidateName || 'N/A',
    municipality: result.municipality || 'N/A',
    totalPoints: result.totalPoints || 0,
    votes1st: result.votes?.firstPlace || 0,
    votes2nd: result.votes?.secondPlace || 0,
    votes3rd: result.votes?.thirdPlace || 0,
    votes4th: result.votes?.fourthPlace || 0,
    votes5th: result.votes?.fifthPlace || 0,
    percentage: formatPercentage(result.percentage),
  }))

  // Generar CSV
  const csv = convertToCSV(data, headers)
  downloadFile(csv, `${filename}_${getDateString()}.csv`, 'text/csv;charset=utf-8;')
}


/**
 * Exporta votos individuales a CSV
 * Espera un arreglo de objetos voto que contienen campos sensibles
 * @param {Array} votes - Arreglo de votos
 * @param {string} filename - Nombre base para el archivo exportado
 * @param {Object} candidateMap - Mapa opcional candidateId -> candidateName
 */
export const exportVotesToCSV = (votes, filename = 'votos', candidateMap = {}) => {
  if (!votes || votes.length === 0) {
    alert('No hay votos para exportar')
    return
  }

  // Definir encabezados CSV
  const headers = [
    { key: 'id', label: 'ID Voto' },
    { key: 'createdAt', label: 'Fecha/Hora' },
    { key: 'voterIp', label: 'IP' },
    { key: 'voterEmail', label: 'Email' },
    { key: 'firstPlace', label: '1er Lugar' },
    { key: 'secondPlace', label: '2do Lugar' },
    { key: 'thirdPlace', label: '3er Lugar' },
    { key: 'fourthPlace', label: '4to Lugar' },
    { key: 'fifthPlace', label: '5to Lugar' },
  ]

  // Transformar datos de votos con enmascaramiento de privacidad
  const data = votes.map((vote) => ({
    id: vote.id?.substring(0, 8) || 'N/A',
    createdAt: vote.createdAt ? new Date(vote.createdAt).toLocaleString('es-MX') : 'N/A',
    voterIp: maskIP(vote.voterIp),
    voterEmail: maskEmail(vote.voterEmail),
    firstPlace: candidateMap[vote.firstPlace] || vote.firstPlace || 'N/A',
    secondPlace: candidateMap[vote.secondPlace] || vote.secondPlace || 'N/A',
    thirdPlace: candidateMap[vote.thirdPlace] || vote.thirdPlace || 'N/A',
    fourthPlace: candidateMap[vote.fourthPlace] || vote.fourthPlace || 'N/A',
    fifthPlace: candidateMap[vote.fifthPlace] || vote.fifthPlace || 'N/A',
  }))

  // Generar CSV
  const csv = convertToCSV(data, headers)
  downloadFile(csv, `${filename}_${getDateString()}.csv`, 'text/csv;charset=utf-8;')
}


export default {
  exportResultsToCSV,
  exportVotesToCSV,
}
