import { useState } from 'react'
import { Download, X } from 'lucide-react'
import Button from '../ui/Button'
import { exportResultsToCSV, exportVotesToCSV } from '../../utils/exportToCSV'
import { exportResultsToExcel, exportVotesToExcel } from '../../utils/exportToExcel'


// ============================================================================
// Utilities
// ============================================================================


/*
Sanitiza el nombre del archivo para eliminar caracteres especiales y espacios
*/
const sanitizeFilename = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}


/* 
Construye un mapa candidateId -> candidateName para usar en exports de votos
*/
const buildCandidateMap = (results) => {
  const map = {}
  if (results?.results) {
    results.results.forEach((r) => {
      map[r.candidateId] = r.candidateName
    })
  }
  return map
}


// ============================================================================
// Subcomponents
// ============================================================================


/*
Cabecera del dropdown
*/
const DropdownHeader = ({ onClose }) => (
  <div className="flex items-center justify-between pb-3 border-b">
    <h3 className="text-lg font-display font-semibold text-gray-900">Exportar Datos</h3>
    <button
      onClick={onClose}
      className="btn-ghost p-2 rounded-full"
      aria-label="Close export dialog"
    >
      <X size={18} aria-hidden="true" />
    </button>
  </div>
)


/* 
Opcion de radio reutilizable 
*/
const RadioOption = ({ name, value, checked, onChange, disabled, label }) => (
  <label
    className={`flex items-center space-x-3 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="w-4 h-4 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
    />
    <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>{label}</span>
  </label>
)


/* 
Selector de contenido (Resultados o Votos individuales)
*/
const ContentSelector = ({
  selectedContent,
  onChange,
  hasResults,
  hasVotes,
}) => (
  <div>
    <label className="label font-semibold text-left mt-6">Contenido:</label>
    <div className="space-y-2 mt-6 mb-6">
      <RadioOption
        name="content"
        value="results"
        checked={selectedContent === 'results'}
        onChange={onChange}
        disabled={!hasResults}
        label="Resultados"
      />
      <RadioOption
        name="content"
        value="votes"
        checked={selectedContent === 'votes'}
        onChange={onChange}
        disabled={!hasVotes}
        label="Votos individuales"
      />
    </div>
  </div>
)


/* 
Selector de formato (CSV o Excel)
*/
const FormatSelector = ({ selectedFormat, onChange }) => (
  <div>
    <label className="label font-semibold text-left ">Formato:</label>
    <div className="space-y-2 mt-6 mb-2">
      <RadioOption
        name="format"
        value="csv"
        checked={selectedFormat === 'csv'}
        onChange={onChange}
        label="CSV"
      />
      <RadioOption
        name="format"
        value="excel"
        checked={selectedFormat === 'excel'}
        onChange={onChange}
        label="Excel (.xlsx)"
      />
    </div>
  </div>
)


// ============================================================================
// Main Component
// ============================================================================


const ExportButton = ({ results = null, votes = [], eventName = 'evento' }) => {

  // State local
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState('csv')
  const [selectedContent, setSelectedContent] = useState('results')

  // Validaciones para habilitar/deshabilitar opciones
  const hasResults = results?.results?.length > 0
  const hasVotes = votes?.length > 0
  const canExport =
    (selectedContent === 'results' && hasResults) || (selectedContent === 'votes' && hasVotes)

  // Handle para manejar la exportacion de datos segun las opciones seleccionadas
  const handleExport = async () => {
    setIsExporting(true)
    try {
      const filename = sanitizeFilename(eventName)

      if (selectedContent === 'results') {
        const exportFn = selectedFormat === 'csv' ? exportResultsToCSV : exportResultsToExcel
        exportFn(results, `resultados_${filename}`)
      } else {
        const candidateMap = buildCandidateMap(results)
        const exportFn = selectedFormat === 'csv' ? exportVotesToCSV : exportVotesToExcel
        exportFn(votes, `votos_${filename}`, candidateMap)
      }

      setIsOpen(false)
    } catch (err) {
      console.error('Export error:', err)
      alert('Error al exportar datos. Por favor intenta nuevamente.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="relative inline-block">

      {/* Boton principal */}
      <Button
        className="btn-primary text-lg px-8 py-4"
        icon={<Download size={18} aria-hidden="true" />}
        onClick={() => setIsOpen(!isOpen)}
      >
        Exportar
      </Button>

      {/* Dialogo de exportacion */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="card absolute right-0 mt-2 w-80 z-20 animate-slide-down">
            <div className="p-4 space-y-4">

              {/* Cabecera */}
              <DropdownHeader onClose={() => setIsOpen(false)} />

              {/* Selector de contenido*/}
              <ContentSelector
                selectedContent={selectedContent}
                onChange={(e) => setSelectedContent(e.target.value)}
                hasResults={hasResults}
                hasVotes={hasVotes}
              />

              {/* Selector de formato */}
              <FormatSelector
                selectedFormat={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
              />

              {/* Boton para descargar */}
              <Button
                className="btn-primary text-md px-6 py-3"
                fullWidth
                loading={isExporting}
                onClick={handleExport}
                disabled={!canExport || isExporting}
              >
                {isExporting ? 'Exportando...' : 'Descargar Archivo'}
              </Button>

              {/* Mensaje de error */}
              {!canExport && (
                <p className="text-xs text-center text-gray-500">
                  No hay datos disponibles para exportar
                </p>
              )}

            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ExportButton
