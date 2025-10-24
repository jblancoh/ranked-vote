import { Link } from 'react-router-dom'
import Button from './Button'

const NoResults = ({ refresh }) => {
  return (
    <div className="container-custom pt-20 pb-28 2xl:pt-32">
      <div className="max-w-md flex flex-col items-center gap-6 text-center m-auto">
        <span className="material-symbols-outlined text-8xl text-primary">🗳️</span>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-gray-900 dark:text-gray-100 text-2xl font-bold leading-tight tracking-tight">
            Aún no hay votos
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Los resultados aparecerán aquí una vez que se registren las primeras predicciones.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/vote" className="btn-primary w-full">
            <span className="truncate">Hacer mi Prediccion</span>
          </Link>
          <Button variant="outline" onClick={refresh}>
            <span className="truncate">Actualizar</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NoResults
