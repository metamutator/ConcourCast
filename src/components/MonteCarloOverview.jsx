import { useEffect, useMemo, useState } from 'react';
import { runSimulation } from '../utils/simulator';
import { getExtremeScenarioProbabilities } from '../utils/strategicAnalysis';

const getColor = (prob) => {
  if (prob >= 70) return 'text-green-700 bg-green-50 border-green-200';
  if (prob >= 40) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
  if (prob >= 15) return 'text-orange-700 bg-orange-50 border-orange-200';
  return 'text-red-700 bg-red-50 border-red-200';
};

const getBadge = (prob) => {
  if (prob >= 70) return 'bg-green-100 text-green-800';
  if (prob >= 40) return 'bg-yellow-100 text-yellow-800';
  if (prob >= 15) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
};

const formatRecord = (team) => `${team.wins}-${team.losses}`;

export default function MonteCarloOverview({ teams, tournamentData }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'bubble'

  useEffect(() => {
    if (!teams?.length || !tournamentData?.matches?.length) return;

    setLoading(true);
    const timeout = setTimeout(() => {
      const remainingMatches = tournamentData.matches.filter(
        (m) => m.team1Score === null || m.team2Score === null
      );
      const currentRound = tournamentData.tournament?.currentRound || 1;

      const baseIterations = 2000;
      const extremeIterations = 900;

      const computed = teams.map((team) => {
        const base = runSimulation({
          teams,
          currentRound,
          remainingMatches,
          iterations: baseIterations,
          targetTeamId: team.name,
        });

        let bestProb = base.probabilities.semifinals;
        let worstProb = base.probabilities.semifinals;

        // Only meaningful if there are matches left to play
        if (remainingMatches.length > 0) {
          const extremes = getExtremeScenarioProbabilities({
            teamName: team.name,
            teams,
            tournamentData,
            iterations: extremeIterations,
          });
          bestProb = extremes.best;
          worstProb = extremes.worst;
        }

        return {
          name: team.name,
          division: team.division,
          wins: team.wins,
          losses: team.losses,
          matchPoints: team.matchPoints,
          currentProb: base.probabilities.semifinals,
          divisionalProb: base.probabilities.divisionalWin,
          wildcardProb: base.probabilities.wildcard,
          bestProb,
          worstProb,
        };
      });

      // Sort by current semifinal probability
      computed.sort((a, b) => b.currentProb - a.currentProb);

      setRows(computed);
      setLoading(false);
    }, 80);

    return () => clearTimeout(timeout);
  }, [teams, tournamentData]);

  const bubbleRows = useMemo(
    () => rows.filter((r) => r.currentProb >= 10 && r.currentProb <= 80).sort((a, b) => b.currentProb - a.currentProb),
    [rows]
  );

  if (!teams?.length || !tournamentData?.matches?.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Monte Carlo Overview</h2>
          <p className="text-gray-600 text-sm mt-1">
            Runs quick simulations for every team to surface semifinal odds, best/worst cases, and bubble teams.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              activeTab === 'all'
                ? 'bg-blue-900 text-white border-blue-900'
                : 'bg-white text-blue-900 border-blue-200 hover:border-blue-400'
            }`}
          >
            All Teams
          </button>
          <button
            onClick={() => setActiveTab('bubble')}
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              activeTab === 'bubble'
                ? 'bg-blue-900 text-white border-blue-900'
                : 'bg-white text-blue-900 border-blue-200 hover:border-blue-400'
            }`}
          >
            Bubble Zone
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900 mb-3"></div>
          <p className="text-gray-600">Running multi-team simulations...</p>
          <p className="text-gray-500 text-xs mt-1">~2k iterations per team, ~900 for best/worst bands</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2 pr-3">Team</th>
                  <th className="py-2 pr-3">Div</th>
                  <th className="py-2 pr-3">Record</th>
                  <th className="py-2 pr-3">Match Pts</th>
                  <th className="py-2 pr-3">Semis</th>
                  <th className="py-2 pr-3">Best</th>
                  <th className="py-2 pr-3">Worst</th>
                  <th className="py-2">Path</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(activeTab === 'all' ? rows : bubbleRows).map((row) => (
                  <tr key={row.name} className="hover:bg-gray-50">
                    <td className="py-3 pr-3">
                      <div className="font-semibold text-gray-800 flex items-center gap-2">
                        {row.name}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadge(row.currentProb)}`}>
                          {row.currentProb.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-gray-600">{row.division}</td>
                    <td className="py-3 pr-3 text-gray-700">{formatRecord(row)}</td>
                    <td className="py-3 pr-3 text-gray-700">{row.matchPoints}</td>
                    <td className="py-3 pr-3">
                      <div className={`inline-flex items-center px-2 py-1 rounded-md border text-xs font-semibold ${getColor(row.currentProb)}`}>
                        {row.currentProb.toFixed(1)}%
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-gray-700">{row.bestProb.toFixed(1)}%</td>
                    <td className="py-3 pr-3 text-gray-700">{row.worstProb.toFixed(1)}%</td>
                    <td className="py-3 pr-3 text-gray-700">
                      <div className="flex gap-1 text-xs">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                          Div {row.divisionalProb.toFixed(1)}%
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                          WC {row.wildcardProb.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
            <p><strong>Color coding:</strong> Green >=70%, Yellow >=40%, Orange >=15%, Red &lt;15%.</p>
            <p className="mt-1">Sim counts are lighter than the main calculator to keep this fast; rerun your team-specific calc for the precise 10k run.</p>
          </div>
        </div>
      )}
    </div>
  );
}
