import { useState, useEffect } from 'react';
import { analyzeStrategicScenarios } from '../utils/strategicAnalysis';

export default function StrategicInsights({ teamName, teams, tournamentData }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('yourGames'); // 'yourGames', 'scenarios', 'gamesToWatch'

  useEffect(() => {
    async function runAnalysis() {
      setLoading(true);
      // Run analysis in a setTimeout to not block UI
      setTimeout(() => {
        const results = analyzeStrategicScenarios({
          teamName,
          teams,
          tournamentData,
        });
        setAnalysis(results);
        setLoading(false);
      }, 100);
    }

    runAnalysis();
  }, [teamName, teams, tournamentData]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Strategic Analysis</h2>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mb-3"></div>
          <p className="text-gray-600">Analyzing strategic scenarios...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const hasRemainingGames = analysis.yourGames.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Strategic Analysis</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('yourGames')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'yourGames'
              ? 'text-blue-900 border-b-2 border-blue-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Your Games ({analysis.yourGames.length})
        </button>
        <button
          onClick={() => setActiveTab('scenarios')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'scenarios'
              ? 'text-blue-900 border-b-2 border-blue-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Best/Worst Case
        </button>
        <button
          onClick={() => setActiveTab('gamesToWatch')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'gamesToWatch'
              ? 'text-blue-900 border-b-2 border-blue-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Games to Watch
        </button>
      </div>

      {/* Your Games Tab */}
      {activeTab === 'yourGames' && (
        <div>
          {!hasRemainingGames ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-blue-800">All your games have been completed! Check the Best/Worst Case scenarios to see your final chances.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                Your remaining games ranked by importance (impact on semifinals chances):
              </p>
              <div className="space-y-3">
                {analysis.yourGames.map((game, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-sm text-gray-500">Round {game.round}</span>
                        <h3 className="text-lg font-semibold text-gray-800">
                          vs {game.opponent}
                        </h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        game.impact > 30
                          ? 'bg-red-100 text-red-800'
                          : game.impact > 15
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {game.impact > 30 ? 'Must Win' : game.impact > 15 ? 'Important' : 'Moderate'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">If you win:</span>
                        <span className="ml-2 font-semibold text-green-700">
                          {game.winProbability.toFixed(1)}% chance
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">If you lose:</span>
                        <span className="ml-2 font-semibold text-red-700">
                          {game.loseProbability.toFixed(1)}% chance
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="text-gray-600">Impact:</span>
                      <span className="ml-2 font-semibold text-gray-800">
                        {game.impact > 0 ? '+' : ''}{game.impact.toFixed(1)}% swing
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Scenarios Tab */}
      {activeTab === 'scenarios' && (
        <div>
          <p className="text-gray-600 mb-6">
            Playoff chances based on extreme outcomes:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">
                Best Case Scenario
              </h3>
              <p className="text-sm text-green-700 mb-4">
                You win all remaining games decisively
              </p>
              <div className="text-center">
                <div className="text-5xl font-bold text-green-900 mb-2">
                  {analysis.bestCase.toFixed(1)}%
                </div>
                <div className="text-sm text-green-700">Chance of semifinals</div>
              </div>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3">
                Worst Case Scenario
              </h3>
              <p className="text-sm text-red-700 mb-4">
                You lose all remaining games
              </p>
              <div className="text-center">
                <div className="text-5xl font-bold text-red-900 mb-2">
                  {analysis.worstCase.toFixed(1)}%
                </div>
                <div className="text-sm text-red-700">Chance of semifinals</div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Current baseline:</strong> {analysis.baseline.toFixed(1)}% chance (assuming all teams have equal skill in remaining games)
            </p>
          </div>
        </div>
      )}

      {/* Games to Watch Tab */}
      {activeTab === 'gamesToWatch' && (
        <div>
          <p className="text-gray-600 mb-4">
            Key matchups to watch that could affect your playoff chances:
          </p>
          {analysis.gamesToWatch.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-600">No critical games to watch at this time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {analysis.gamesToWatch.map((game, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <span className="text-sm text-gray-500">Round {game.round}</span>
                      <h3 className="text-md font-semibold text-gray-800">
                        {game.team1} vs {game.team2}
                      </h3>
                    </div>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-2">
                    <div>
                      <span className="text-gray-600">{game.team1}:</span>
                      <span className="ml-1 font-medium">{game.team1Record}, {game.team1Points} pts</span>
                    </div>
                    <div>
                      <span className="text-gray-600">{game.team2}:</span>
                      <span className="ml-1 font-medium">{game.team2Record}, {game.team2Points} pts</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded px-3 py-2 text-sm">
                    <span className="text-gray-700">Best for you:</span>
                    <span className="ml-2 font-semibold text-blue-900">{game.preferredOutcome}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
