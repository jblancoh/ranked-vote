import { Heart, Calendar, MapPin, Award, Users, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const About = () => {
  const timeline = [
    {
      year: '1960s',
      title: 'Inicios del Certamen',
      description: 'Nace la tradición del Certamen Flor de Tabasco como parte de las festividades de la Feria Tabasco.',
      icon: '🌱'
    },
    {
      year: '1970s-1980s',
      title: 'Consolidación',
      description: 'El certamen se consolida como uno de los eventos más esperados de la temporada de Pre-feria.',
      icon: '🌸'
    },
    {
      year: '1990s-2000s',
      title: 'Era Moderna',
      description: 'Mayor cobertura mediática y participación de todos los municipios del estado.',
      icon: '🗳️'
    },
    {
      year: '2010s-Presente',
      title: 'Tradición Viva',
      description: 'El certamen continúa siendo un símbolo de identidad cultural tabasqueña.',
      icon: '💐'
    },
  ]

  const municipalities = [
    'Centro', 'Cárdenas', 'Comalcalco', 'Huimanguillo', 'Macuspana',
    'Nacajuca', 'Paraíso', 'Tacotalpa', 'Teapa', 'Jalpa de Méndez',
    'Cunduacán', 'Balancán', 'Centla', 'Emiliano Zapata', 'Jalapa',
    'Jonuta', 'Tenosique'
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-20 animate-slide-up">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="text-6xl mb-6">🗳️</div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Certamen Flor de Tabasco
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Una tradición que celebra la belleza, cultura y representación
              de los municipios de nuestro estado
            </p>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16 animate-slide-in-left">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
              Historia del Certamen
            </h2>

            <div className="card p-8 mb-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                El <strong>Certamen Flor de Tabasco</strong> es una tradición que
                forma parte de las festividades de la <strong>Feria Tabasco</strong>,
                uno de los eventos culturales más importantes del estado.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                Durante la época de <strong>Pre-feria</strong>, las embajadoras
                municipales participan en diversos eventos que incluyen:
              </p>
              <ul className="list-none space-y-3 mb-4">
                <li className="flex items-start">
                  <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Presentación oficial de candidatas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Imposición de bandas municipales</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Desfile de carros alegóricos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Eventos culturales y de beneficencia</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Noche de coronación</span>
                </li>
              </ul>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                La <strong>Flor de Tabasco</strong> se convierte en embajadora del
                estado durante todo el año, representando a Tabasco en diversos
                eventos nacionales e internacionales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <h2 className="text-3xl font-display font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            Línea de Tiempo
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-6 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center text-3xl">
                      {item.icon}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-1 h-full bg-primary-200 dark:bg-primary-900/50 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="card p-6 hover:shadow-lg transition-shadow">
                      <span className="badge-primary mb-2">
                        {item.year}
                      </span>
                      <h3 className="text-xl font-display font-bold mb-2 text-gray-900 dark:text-gray-100">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Municipios Participantes */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950 animate-slide-in-right">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <MapPin className="mx-auto text-primary-600 dark:text-primary-400 mb-4" size={48} />
            <h2 className="text-3xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
              17 Municipios Participantes
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Cada municipio de Tabasco envía a su embajadora municipal
              para competir por el título de Flor de Tabasco
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {municipalities.map((municipality) => (
                <div
                  key={municipality}
                  className="card p-3 text-center hover:shadow-md transition-shadow"
                >
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {municipality}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Valores del Certamen */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <h2 className="text-3xl font-display font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            Valores del Certamen
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card p-6 text-center animate-stagger-1">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-display font-bold mb-2 text-gray-900 dark:text-gray-100">
                Identidad Cultural
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Celebración de nuestras raíces, tradiciones y orgullo tabasqueño
              </p>
            </div>

            <div className="card p-6 text-center animate-stagger-2">
              <div className="w-16 h-16 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-display font-bold mb-2 text-gray-900 dark:text-gray-100">
                Representación
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Cada municipio tiene voz a través de su embajadora
              </p>
            </div>

            <div className="card p-6 text-center animate-stagger-3">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-display font-bold mb-2 text-gray-900 dark:text-gray-100">
                Belleza Integral
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No solo física, sino también intelectual, cultural y social
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Ranked Vote */}
      <section className="py-16 bg-primary-50 dark:bg-gray-900 animate-slide-up">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="mx-auto text-primary-600 dark:text-primary-400 mb-4" size={48} />
            <h2 className="text-3xl font-display font-bold mb-6 text-gray-900 dark:text-gray-100">
              Sobre Ranked Vote
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              <strong>Ranked Vote</strong> es una plataforma comunitaria de código
              abierto que permite a los tabasqueños participar activamente haciendo
              sus predicciones sobre el resultado del certamen.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              Inspirado en el tradicional sistema de votación que realizaba el
              periódico <strong>Tabasco Hoy</strong>, donde los lectores enviaban
              sus predicciones por correo, ahora llevamos esta tradición a la era digital.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Este proyecto es desarrollado por <strong>Dev Night Talk Villahermosa</strong>,
              una comunidad de desarrolladores comprometidos con la tecnología y
              la preservación de nuestras tradiciones culturales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/vote" className="btn-primary text-lg px-8 py-4">
                Hacer mi Predicción
              </Link>
              <a
                href="https://github.com/dev-night-talk/vota-flor"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-lg px-8 py-4"
              >
                Ver en GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Fun Facts */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <h2 className="text-3xl font-display font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            Datos Curiosos
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="card p-6">
              <div className="text-4xl mb-3">👑</div>
              <h3 className="font-display font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">
                Reinas Emblemáticas
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Varias Flores de Tabasco han representado al estado en
                certámenes nacionales e internacionales.
              </p>
            </div>

            <div className="card p-6">
              <div className="text-4xl mb-3">🎭</div>
              <h3 className="font-display font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">
                Eventos Culturales
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Durante Pre-feria se realizan más de 20 eventos culturales
                con las candidatas.
              </p>
            </div>

            <div className="card p-6">
              <div className="text-4xl mb-3">📸</div>
              <h3 className="font-display font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">
                Momento Icónico
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                La imposición de bandas es uno de los momentos más
                emotivos del certamen.
              </p>
            </div>

            <div className="card p-6">
              <div className="text-4xl mb-3">🎪</div>
              <h3 className="font-display font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">
                Parte de la Feria
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                El certamen es parte integral de la Feria Tabasco,
                una de las más importantes del sureste mexicano.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 gradient-primary text-white">
        <div className="container-custom text-center">
          <Calendar className="mx-auto mb-4" size={48} />
          <h2 className="text-3xl font-display font-bold mb-4">
            Flor de Tabasco 2026
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Forma parte de esta hermosa tradición tabasqueña
          </p>
          <Link to="/vote" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
            Participar Ahora
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About