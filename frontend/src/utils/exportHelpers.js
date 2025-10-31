/*
 * Helpers compartidos para exportación de datos
 * Utilidades reutilizables entre exportToCSV.js y exportToExcel.js
 */


// ============================================================================
// Privacy helpers
// ============================================================================


/**
 * Enmascara la dirección IP (muestra solo los dos primeros octetos)
 */
export const maskIP = (ip) => {
  if (!ip) return 'N/A'

  const parts = ip.split('.')
  return parts.length === 4 ? `${parts[0]}.${parts[1]}.xxx.xxx` : 'N/A'
}


/**
 * Enmascara el email (muestra solo la primera letra del local y el dominio)
 */
export const maskEmail = (email) => {
  if (!email) return 'N/A'

  const [local, domain] = email.split('@')
  return local && domain ? `${local[0]}***@${domain}` : 'N/A'
}


// ============================================================================
// Percentage helpers
// ============================================================================


/**
 * Formatea el valor de porcentaje a string con 2 decimales y sufijo %
 */
export const formatPercentage = (value) => {
  if (value === null || value === undefined || value === '') return '0.00%'

  // Convertir posibles comas decimales y remover '%' si existe
  let num
  if (typeof value === 'string') {
    const cleaned = value.trim().replace('%', '').replace(',', '.')
    num = parseFloat(cleaned)
  } else {
    num = Number(value)
  }

  if (Number.isNaN(num)) return '0.00%'

  // Si viene como fracción (<= 1) convertir a porcentaje
  if (num > 0 && num <= 1) num = num * 100

  return `${num.toFixed(2)}%`
}


/**
 * Recalcula porcentajes para votación rankeada
 * El backend divide por totalVotos * 5
 * Aquí se divide por la suma total de puntos distribuidos
 */
export const recalculatePercentages = (results) => {
  // Calcular total de puntos distribuidos
  const totalPoints = results.reduce((sum, r) => sum + (r.totalPoints || 0), 0)
  
  if (totalPoints === 0) return results

  // Recalcular porcentaje para cada resultado
  return results.map((result) => ({
    ...result,
    percentage: ((result.totalPoints || 0) / totalPoints) * 100,
  }))
}


// ============================================================================
// File helpers
// ============================================================================


/**
 * Obtiene string de fecha formateada para nombre de archivo (YYYY-MM-DD)
 */
export const getDateString = () => {
  const now = new Date()
  return now.toISOString().split('T')[0]
}
