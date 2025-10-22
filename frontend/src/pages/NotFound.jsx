import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="max-w-2xl w-full text-center animate-slide-up">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-display font-bold text-primary-600 mb-4">
            404
          </div>
          <div className="text-6xl mb-4">
            🗳️💔
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
          Página No Encontrada
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
          Parece que esta flor se perdió en el camino.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/" className="btn-primary text-lg px-6 py-3">
            <Home size={20} className="mr-2" />
            Volver al Inicio
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline text-lg px-6 py-3"
          >
            <ArrowLeft size={20} className="mr-2" />
            Regresar
          </button>
        </div>

        {/* Helpful Links */}
        <div className="card p-6">
          <div className="flex items-center justify-center mb-4">
            <Search className="text-primary-600 dark:text-primary-300 mr-2" size={24} />
            <h2 className="text-xl font-display font-bold">
              ¿Buscabas algo específico?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <Link
              to="/vote"
              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-200 border-2 border-transparent transition-all duration-200 text-left"
            >
              <div className="text-2xl mb-2">🗳️</div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Votar</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Haz tu predicción
              </p>
            </Link>

            <Link
              to="/results"
              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-200 border-2 border-transparent transition-all duration-200 text-left"
            >
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Resultados</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ver predicciones
              </p>
            </Link>

            <Link
              to="/about"
              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-200 border-2 border-transparent transition-all duration-200 text-left"
            >
              <div className="text-2xl mb-2">ℹ️</div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Acerca de</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Historia del certamen
              </p>
            </Link>

            <a
              href="https://github.com/dev-night-talk/vota-flor"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-200 border-2 border-transparent transition-all duration-200 text-left"
            >
              <div className="text-2xl mb-2">💻</div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">GitHub</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ver el código
              </p>
            </a>
          </div>
        </div>

        {/* Fun Message */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
          Error 404: Esta flor no floreció aquí 🗳️
        </p>
      </div>
    </div>
  )
}

export default NotFound
