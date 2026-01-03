function ResultsDisplay({ results, teamName }) {
  if (!results) return null;

  const { probabilities, statistics } = results;

  // Color coding based on probability
  const getColor = (prob) => {
    if (prob >= 70) return 'text-green-600 bg-green-50 border-green-200';
    if (prob >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (prob >= 15) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getProgressColor = (prob) => {
    if (prob >= 70) return 'bg-green-500';
    if (prob >= 40) return 'bg-yellow-500';
    if (prob >= 15) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Your Advancement Chances
        </h2>
        {teamName && (
          <p className="text-gray-600 mt-1">Team: {teamName}</p>
        )}
      </div>

      {/* Main Probability - Hero Stat */}
      <div className={`p-6 rounded-lg border-2 ${getColor(probabilities.semifinals)}`}>
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wide mb-2">
            Overall Chance of Reaching Semifinals
          </p>
          <p className="text-6xl font-bold mb-2">
            {probabilities.semifinals.toFixed(1)}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${getProgressColor(probabilities.semifinals)}`}
              style={{ width: `${Math.min(probabilities.semifinals, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Divisional Win */}
        <div className={`p-4 rounded-lg border ${getColor(probabilities.divisionalWin)}`}>
          <p className="text-sm font-medium uppercase tracking-wide mb-1">
            Winning Your Division
          </p>
          <p className="text-4xl font-bold mb-2">
            {probabilities.divisionalWin.toFixed(1)}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${getProgressColor(probabilities.divisionalWin)}`}
              style={{ width: `${Math.min(probabilities.divisionalWin, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Wildcard */}
        <div className={`p-4 rounded-lg border ${getColor(probabilities.wildcard)}`}>
          <p className="text-sm font-medium uppercase tracking-wide mb-1">
            Getting a Wildcard Spot
          </p>
          <p className="text-4xl font-bold mb-2">
            {probabilities.wildcard.toFixed(1)}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${getProgressColor(probabilities.wildcard)}`}
              style={{ width: `${Math.min(probabilities.wildcard, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Match Point Projections</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-600 uppercase mb-1">25th Percentile</p>
            <p className="text-2xl font-bold text-gray-800">
              {statistics.expectedMatchPoints.p25}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase mb-1">Median (50th)</p>
            <p className="text-2xl font-bold text-gray-800">
              {statistics.expectedMatchPoints.median}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase mb-1">75th Percentile</p>
            <p className="text-2xl font-bold text-gray-800">
              {statistics.expectedMatchPoints.p75}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase mb-1">95th Percentile</p>
            <p className="text-2xl font-bold text-gray-800">
              {statistics.expectedMatchPoints.p95}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          These represent your expected final match points across 10,000 simulated tournaments
        </p>
      </div>

      {/* Insights */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 What This Means</h3>
        <ul className="space-y-1 text-sm text-blue-800">
          {probabilities.divisionalWin > probabilities.wildcard ? (
            <li>• Your best path to semifinals is <strong>winning your division</strong></li>
          ) : (
            <li>• Your best path to semifinals is through a <strong>wildcard berth</strong></li>
          )}
          {probabilities.semifinals >= 70 && (
            <li>• You're in a <strong>strong position</strong> to advance!</li>
          )}
          {probabilities.semifinals < 30 && (
            <li>• You'll need strong performances in remaining matches to advance</li>
          )}
          <li>• Based on 10,000 Monte Carlo simulations with 50-50 match probabilities</li>
        </ul>
      </div>

      {/* Metadata */}
      <div className="text-xs text-gray-500 text-center border-t pt-3">
        Simulated {results.metadata.iterations.toLocaleString()} tournaments •
        Current Round: {results.metadata.currentRound} of 5
      </div>
    </div>
  );
}

export default ResultsDisplay;
