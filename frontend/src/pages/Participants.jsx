import { useCandidates } from '../hooks/useCandidates'
import { CandidateCard, CardImage, CardContent, CardFooter } from '../components/ui/CandidateCard'
import Loading from '../components/ui/Loading'
import { getVariantsKeys } from '../utils'

const Participants = () => {
  const { candidates, loading } = useCandidates()

  const variantKeys = getVariantsKeys()

  if (loading) {
    return <Loading className="min-h-screen" text="Cargando candidatas..." />
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
      <div className="container-custom">
        {/* Page Header */}
        <div className="px-4 text-center relative z-10 flex justify-between items-center">
          <div className="flex-grow text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-green dark:text-gray-100 tracking-tight">
              Feria Tabasco 2026
            </h1>
            <p className="mt-2 text-xl md:text-2xl font-semibold text-text-light dark:text-text-dark">
              Aspirantes a Embajadoras
            </p>
          </div>
        </div>

        {/* List of participants */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 gap-y-16 mt-16">
          {/* Card */}
          {candidates?.map((candidate) => {
            const variantIndex = Math.floor(Math.random() * variantKeys.length)

            return (
              <CandidateCard
                key={candidate.id}
                hoverable
                elevated
                className={variantKeys[variantIndex]}
              >
                <div className="relative w-48 h-48 mx-auto">
                  <div className="card-photo-gradient absolute inset-0 bg-gradient-to-br rounded-full opacity-20 dark:opacity-40" />
                  <CardImage
                    src={candidate.photoUrl}
                    alt={candidate.name}
                    className="relative z-10 card-photo-clip"
                  />
                </div>
                <CardContent className="text-center">
                  <h3 className="mt-4 text-2xl font-bold text-primary-green text-pretty dark:text-gray-100">
                    {candidate.name}
                  </h3>
                  <p className="text-md text-gray-600 text-pretty dark:text-gray-400">
                    {candidate.municipality}
                  </p>
                </CardContent>
                <CardFooter className="justify-center">
                  <button className="mt-6 bg-primary-green dark:bg-accent-purple text-white uppercase dark:text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-700 dark:hover:bg-purple-700 transition-colors duration-300">
                    Ver Más
                  </button>
                </CardFooter>
              </CandidateCard>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default Participants
