import { useState } from 'react';
import { getMatchPointDescription, getMatchPointThresholds } from '../utils/matchPoints';

function MatchPointCalculator() {
  const [winnerScore, setWinnerScore] = useState('8');
  const [loserScore, setLoserScore] = useState('3');
  const [showTable, setShowTable] = useState(false);

  const thresholds = getMatchPointThresholds();
  const description = (winnerScore && loserScore) ? getMatchPointDescription(parseFloat(winnerScore), parseFloat(loserScore)) : '';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Match Point Calculator
      </h2>
      <p className="text-gray-600 mb-4 text-sm">
        Understand how match points are allocated based on game scores
      </p>

      <div className="space-y-4">
        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Winner's Score
            </label>
            <input
              type="number"
              value={winnerScore}
              onChange={(e) => setWinnerScore(e.target.value)}
              min="0"
              max="10"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 8"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loser's Score
            </label>
            <input
              type="number"
              value={loserScore}
              onChange={(e) => setLoserScore(e.target.value)}
              min="0"
              max="10"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 3"
            />
          </div>
        </div>

        {/* Result */}
        {winnerScore && loserScore && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm font-medium text-blue-900 mb-1">
              Result for {winnerScore}-{loserScore}:
            </p>
            <p className="text-blue-800">{description}</p>
          </div>
        )}

        {/* Toggle Table */}
        <button
          onClick={() => setShowTable(!showTable)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {showTable ? '▼ Hide' : '▶ Show'} Complete Point Allocation Table
        </button>

        {/* Reference Table */}
        {showTable && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Differential Range
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Winner Bonus
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loser Bonus
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Example
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {thresholds.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">
                      {row.range}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                      +{row.bonusWinner}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                      {row.bonusLoser > 0 ? `+${row.bonusLoser}` : '-'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                      {row.example}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          <p className="mb-1"><strong>Note:</strong> Winning teams typically earn 26-40 match points per win, depending on the score margin.</p>
          <p>Close games (≤3 points) award bonus points to both teams (26 vs 15).</p>
        </div>
      </div>
    </div>
  );
}

export default MatchPointCalculator;
