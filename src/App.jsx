import { useState } from 'react'
import TeamInputForm from './components/TeamInputForm'
import ResultsDisplay from './components/ResultsDisplay'
import MatchPointCalculator from './components/MatchPointCalculator'
import { runSimulation } from './utils/simulator'

function App() {
  const [results, setResults] = useState(null)
  const [teamName, setTeamName] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)

  const handleCalculate = ({ teams, currentRound, targetTeamId, teamName: name }) => {
    setIsCalculating(true)
    setTeamName(name)

    // Run simulation in a setTimeout to allow UI to update
    setTimeout(() => {
      const simulationResults = runSimulation({
        teams,
        currentRound,
        completedMatches: [], // For MVP, we'll assume matches haven't been tracked individually
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
          <h1 className="text-3xl font-bold">MBA Competition Probability Calculator</h1>
          <p className="text-blue-200 mt-2">John Molson MBA International Case Competition 2026</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
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
          <div id="results" className="mb-8">
            <ResultsDisplay results={results} teamName={teamName} />
          </div>
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
      </main>

      <footer className="bg-gray-800 text-gray-300 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm mb-2">
            Built for JMSB MBA Case Competition 2026
          </p>
          <p className="text-xs text-gray-400">
            Probabilities are estimates based on Monte Carlo simulations • Not affiliated with official competition organizers
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
