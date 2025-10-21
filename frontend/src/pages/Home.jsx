import { Link } from 'react-router-dom'
import { Vote as VoteIcon, TrendingUp, Users, Heart } from 'lucide-react'

const Home = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              🗳️ Ranked Vote 2026
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Participa en las predicciones del Certamen Flor de Tabasco
            </p>
            <p className="text-lg mb-10 text-white/80">
              Elige tu Top 5 y comparte tus predicciones con la comunidad
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/vote"
                className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4"
              >
                <VoteIcon className="mr-2" size={20} />
                Haz tu Predicción
              </Link>
              <Link
                to="/results"
                className="btn border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4"
              >
                <TrendingUp className="mr-2" size={20} />
                Ver Resultados
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <h2 className="text-3xl font-display font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            ¿Cómo Funciona?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-display font-bold mb-2 text-gray-900 dark:text-gray-100">
                1. Conoce a las Candidatas
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Revisa los perfiles de todas las embajadoras municipales participantes
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <VoteIcon className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-display font-bold mb-2 text-gray-900 dark:text-gray-100">
                2. Vota tu Top 5
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Selecciona tus 5 candidatas favoritas del 1er al 5to lugar
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-display font-bold mb-2 text-gray-900 dark:text-gray-100">
                3. Comparte y Compite
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ve las predicciones de la comunidad y comparte las tuyas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Event Section */}
      <section className="py-16 dark:bg-gray-950">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-6 text-gray-900 dark:text-gray-100">
              Sobre el Certamen Flor de Tabasco
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              El Certamen Flor de Tabasco es una tradición que celebra la belleza,
              cultura y representación de los municipios de nuestro estado. Durante
              la época de Pre-feria, las embajadoras municipales participan en diversos
              eventos culminando en la elección de la Flor de Tabasco.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Este sistema de votación comunitaria te permite participar activamente
              haciendo tus predicciones y compartiéndolas con otros tabasqueños.
            </p>
            <Link to="/about" className="btn-primary">
              Conoce más sobre la tradición
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-50 dark:bg-gray-900">
        <div className="container-custom text-center">
          <Heart className="mx-auto mb-4 text-primary-600 dark:text-primary-400" size={48} />
          <h2 className="text-3xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
            ¿Listo para participar?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a la comunidad y comparte tu predicción para el
            Certamen Flor de Tabasco 2026
          </p>
          <Link to="/vote" className="btn-primary text-lg px-8 py-4">
            Hacer mi Predicción Ahora
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home