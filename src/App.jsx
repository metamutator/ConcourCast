import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">MBA Competition Probability Calculator</h1>
          <p className="text-blue-200 mt-2">John Molson MBA International Case Competition 2026</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Calculate Your Chances of Reaching the Semifinals
          </h2>
          <p className="text-gray-600">
            Enter your team's current standings to see your probability of advancing to the semifinals.
          </p>
        </div>
      </main>

      <footer className="bg-gray-800 text-gray-300 py-4 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Built for JMSB MBA Case Competition 2026 • Probabilities are estimates based on Monte Carlo simulations
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
