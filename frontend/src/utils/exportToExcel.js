/*
 * Exporta datos a formato Excel usando la librería xlsx
 * Utiliza la estructura devuelta por /api/results/calculate y /api/votes
 * Sanitiza datos y maneja caracteres especiales con codificación UTF-8
 */

import * as XLSX from 'xlsx'
import { maskIP, maskEmail, formatPercentage, recalculatePercentages, getDateString } from './exportHelpers'


// ============================================================================
// Utilities
// ============================================================================


/**
 * Sanitiza valores para prevenir inyección de fórmulas en Excel
 */
const sanitizeExcelValue = (value) => {
  if (value === null || value === undefined) return 'N/A'

  let sanitized = String(value)

  // Prevenir inyección de fórmulas Excel (valores que inician con = + - @)
  if (sanitized.match(/^[=+\-@]/)) {
    sanitized = "'" + sanitized
  }

  return sanitized
}


// ============================================================================
// Excel export functions
// ============================================================================


/**
 * Exporta resultados a Excel
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
export const exportResultsToExcel = (resultsData, filename = 'resultados') => {
  if (!resultsData || !resultsData.results || resultsData.results.length === 0) {
    alert('No hay resultados para exportar')
    return
  }

  // Recalcular porcentajes correctamente
  const correctedResults = recalculatePercentages(resultsData.results)

  // Transformar datos
  const data = correctedResults.map((result) => ({
    Posición: sanitizeExcelValue(result.position || 0),
    Nombre: sanitizeExcelValue(result.candidateName || 'N/A'),
    Municipio: sanitizeExcelValue(result.municipality || 'N/A'),
    'Puntos Totales': sanitizeExcelValue(result.totalPoints || 0),
    'Votos 1er Lugar': sanitizeExcelValue(result.votes?.firstPlace || 0),
    'Votos 2do Lugar': sanitizeExcelValue(result.votes?.secondPlace || 0),
    'Votos 3er Lugar': sanitizeExcelValue(result.votes?.thirdPlace || 0),
    'Votos 4to Lugar': sanitizeExcelValue(result.votes?.fourthPlace || 0),
    'Votos 5to Lugar': sanitizeExcelValue(result.votes?.fifthPlace || 0),
    Porcentaje: sanitizeExcelValue(formatPercentage(result.percentage)),
  }))

  // Crear worksheet
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Formato de columnas (ancho)
  worksheet['!cols'] = [
    { wch: 10 }, // Posición
    { wch: 30 }, // Nombre
    { wch: 25 }, // Municipio
    { wch: 15 }, // Puntos
    { wch: 15 }, // 1er lugar
    { wch: 15 }, // 2do lugar
    { wch: 15 }, // 3er lugar
    { wch: 15 }, // 4to lugar
    { wch: 15 }, // 5to lugar
    { wch: 12 }, // Porcentaje
  ]

  // Crear workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados')
  XLSX.writeFile(workbook, `${filename}_${getDateString()}.xlsx`)
}

/**
 * Exporta votos individuales a Excel
 * Espera un arreglo de objetos voto
 * @param {Array} votes - Arreglo de votos
 * @param {string} filename - Nombre base para el archivo exportado
 * @param {Object} candidateMap - Mapa opcional candidateId -> candidateName
 */
export const exportVotesToExcel = (votes, filename = 'votos', candidateMap = {}) => {
  if (!votes || votes.length === 0) {
    alert('No hay votos para exportar')
    return
  }

  // Transformar datos con enmascaramiento de privacidad y nombres de candidatas
  const data = votes.map((vote) => ({
    'ID Voto': sanitizeExcelValue(vote.id?.substring(0, 8) || 'N/A'),
    'Fecha/Hora': sanitizeExcelValue(
      vote.createdAt ? new Date(vote.createdAt).toLocaleString('es-MX') : 'N/A'
    ),
    IP: sanitizeExcelValue(maskIP(vote.voterIp)),
    Email: sanitizeExcelValue(maskEmail(vote.voterEmail)),
    '1er Lugar': sanitizeExcelValue(candidateMap[vote.firstPlace] || vote.firstPlace || 'N/A'),
    '2do Lugar': sanitizeExcelValue(candidateMap[vote.secondPlace] || vote.secondPlace || 'N/A'),
    '3er Lugar': sanitizeExcelValue(candidateMap[vote.thirdPlace] || vote.thirdPlace || 'N/A'),
    '4to Lugar': sanitizeExcelValue(candidateMap[vote.fourthPlace] || vote.fourthPlace || 'N/A'),
    '5to Lugar': sanitizeExcelValue(candidateMap[vote.fifthPlace] || vote.fifthPlace || 'N/A'),
  }))

  // Creación del worksheet
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Formato de columnas (ancho)
  worksheet['!cols'] = [
    { wch: 12 }, // ID
    { wch: 20 }, // Fecha
    { wch: 18 }, // IP
    { wch: 25 }, // Email
    { wch: 30 }, // 1er lugar
    { wch: 30 }, // 2do lugar
    { wch: 30 }, // 3er lugar
    { wch: 30 }, // 4to lugar
    { wch: 30 }, // 5to lugar
  ]

  // Creación del workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Votos')
  XLSX.writeFile(workbook, `${filename}_${getDateString()}.xlsx`)
}


export default {
  exportResultsToExcel,
  exportVotesToExcel,
}
