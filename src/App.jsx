import { useEffect, useState } from 'react'
import TeamInputForm from './components/TeamInputForm'
import ResultsDisplay from './components/ResultsDisplay'
import MatchPointCalculator from './components/MatchPointCalculator'
import AdminPanel from './components/AdminPanel'
import StrategicInsights from './components/StrategicInsights'
import MonteCarloOverview from './components/MonteCarloOverview'
import { runSimulation } from './utils/simulator'
import { loadTournamentData, calculateStandings } from './utils/tournamentData'

function App() {
  const [results, setResults] = useState(null)
  const [teamName, setTeamName] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)
  const [currentView, setCurrentView] = useState('calculator') // 'calculator' | 'overview' | 'admin'
  const [tournamentData, setTournamentData] = useState(null)
  const [teams, setTeams] = useState([])
  const [dataLoading, setDataLoading] = useState(false)
  const [dataError, setDataError] = useState('')

  useEffect(() => {
    async function bootstrapData() {
      setDataLoading(true)
      setDataError('')
      const data = await loadTournamentData()
      if (!data) {
        setDataError('No tournament data found. Upload via Admin or ensure public/tournament-data.json exists.')
        setDataLoading(false)
        return
      }
      const currentStandings = calculateStandings(data.teams, data.matches)
      setTournamentData(data)
      setTeams(currentStandings)
      setDataLoading(false)
    }

    bootstrapData()
  }, [])

  const handleCalculate = ({ teams, currentRound, targetTeamId, teamName: name, tournamentData }) => {
    setIsCalculating(true)
    setTeamName(name)
    setTournamentData(tournamentData)
    setTeams(teams)

    // Run simulation in a setTimeout to allow UI to update
    setTimeout(() => {
      // Get remaining matches from tournament data
      const remainingMatches = tournamentData
        ? tournamentData.matches.filter(m => m.team1Score === null || m.team2Score === null)
        : [];

      const simulationResults = runSimulation({
        teams,
        currentRound,
        remainingMatches: remainingMatches.length > 0 ? remainingMatches : null,
        completedMatches: [], // Legacy fallback
        iterations: 10000,
        targetTeamId,
      })

      setResults(simulationResults)
      setIsCalculating(false)

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">ConcourCast</h1>
              <p className="text-blue-200 mt-2">John Molson MBA International Case Competition 2026</p>
            </div>
            <nav className="flex gap-4">
              <button
                onClick={() => setCurrentView('calculator')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'calculator'
                    ? 'bg-white text-blue-900 font-semibold'
                    : 'bg-blue-800 text-blue-100 hover:bg-blue-700'
                }`}
              >
                Calculator
              </button>
              <button
                onClick={() => setCurrentView('overview')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'overview'
                    ? 'bg-white text-blue-900 font-semibold'
                    : 'bg-blue-800 text-blue-100 hover:bg-blue-700'
                }`}
              >
                Monte Carlo Overview
              </button>
              {/* Only show Admin panel in development mode */}
              {import.meta.env.DEV && (
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'admin'
                      ? 'bg-white text-blue-900 font-semibold'
                      : 'bg-blue-800 text-blue-100 hover:bg-blue-700'
                  }`}
                >
                  Admin
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {currentView === 'admin' && import.meta.env.DEV ? (
          <AdminPanel />
        ) : currentView === 'overview' ? (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Monte Carlo Overview</h2>
              <p className="text-gray-600 text-sm">
                Quick multi-team simulations using the latest tournament data. This view is independent of any selected team.
              </p>
            </div>

            {dataLoading && (
              <div className="bg-white rounded-lg shadow-md p-10 text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900 mb-3"></div>
                <p className="text-gray-600">Loading tournament data...</p>
              </div>
            )}

            {dataError && !dataLoading && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800 font-semibold mb-2">Tournament data not found</p>
                <p className="text-yellow-700 text-sm">{dataError}</p>
              </div>
            )}

            {tournamentData && teams.length > 0 && !dataLoading && (
              <MonteCarloOverview teams={teams} tournamentData={tournamentData} />
            )}
          </>
        ) : (
          <>
            {/* Introduction */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Calculate Your Chances of Reaching the Semifinals
              </h2>
              <p className="text-gray-600 mb-2">
                This calculator uses <strong>Monte Carlo simulation</strong> to estimate your team's probability of advancing to the semifinals based on current standings.
              </p>
              <p className="text-gray-600 text-sm">
                The simulation runs 10,000 tournaments, assuming all future matches have a 50-50 win probability, and calculates how often your team qualifies (either as a divisional winner or wildcard).
              </p>
            </div>

            {/* Input Form */}
            <div className="mb-8">
              <TeamInputForm onCalculate={handleCalculate} />
            </div>

            {/* Loading State */}
            {isCalculating && (
              <div className="bg-white rounded-lg shadow-md p-12 mb-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-4"></div>
                <p className="text-gray-600 font-medium">Running 10,000 simulations...</p>
                <p className="text-gray-500 text-sm mt-2">This may take a few seconds</p>
              </div>
            )}

            {/* Results */}
            {results && !isCalculating && (
              <>
                <div id="results" className="mb-8">
                  <ResultsDisplay results={results} teamName={teamName} />
                </div>

                {/* Strategic Insights */}
                {tournamentData && (
                  <div className="mb-8">
                    <StrategicInsights
                      teamName={teamName}
                      teams={teams}
                      tournamentData={tournamentData}
                    />
                  </div>
                )}
              </>
            )}

            {/* Match Point Calculator */}
            <div className="mb-8">
              <MatchPointCalculator />
            </div>

            {/* How It Works */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">How It Works</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p><strong>Competition Format:</strong> 30 teams in 5 divisions play 5 round-robin matches each. The top 9 teams advance to semifinals (5 divisional winners + 4 wildcards).</p>
                <p><strong>Monte Carlo Simulation:</strong> We simulate the remaining matches 10,000 times. Each simulation uses random score differentials (normal distribution) to determine winners and allocate match points according to official rules.</p>
                <p><strong>Probability Calculation:</strong> Your advancement probability is the percentage of simulations where your team finishes in the top 9.</p>
                <p><strong>Limitations:</strong> This MVP assumes all teams have equal skill (50-50 match probability). For more accurate predictions, team strength ratings would be needed.</p>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="bg-gray-800 text-gray-300 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm mb-2">
            Proudly built in Singapore 🇸🇬 with a whole lot of math, AI and love
          </p>
          <p className="text-xs text-gray-400 mb-1"></p>
        </div>
      </footer>
    </div>
  )
}

export default App
