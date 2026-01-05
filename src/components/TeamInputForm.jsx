import { useState, useEffect } from 'react';
import { loadTournamentData, calculateStandings } from '../utils/tournamentData';

function TeamInputForm({ onCalculate }) {
  const [tournamentData, setTournamentData] = useState(null);
  const [standings, setStandings] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError('');

      const data = await loadTournamentData();

      if (!data) {
        setError('No tournament data found. Please use the Admin panel to upload tournament data.');
        setLoading(false);
        return;
      }

      setTournamentData(data);
      const currentStandings = calculateStandings(data.teams, data.matches);
      setStandings(currentStandings);
      setLoading(false);
    }

    loadData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedTeam) {
      alert('Please select a team');
      return;
    }

    const teamStanding = standings.find(s => s.name === selectedTeam);
    if (!teamStanding) {
      alert('Team not found');
      return;
    }

    onCalculate({
      teams: standings,
      currentRound: tournamentData.tournament.currentRound,
      targetTeamId: selectedTeam,
      teamName: selectedTeam,
      tournamentData: tournamentData,
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mb-3"></div>
          <p className="text-gray-600">Loading tournament data...</p>
        </div>
      </div>
    );
  }

  if (error || !tournamentData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Tournament Data Not Found</h3>
          <p className="text-yellow-700 mb-4">
            {error || 'Unable to load tournament data. Please upload the tournament schedule and results using the Admin panel.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Group teams by division for easier selection
  const teamsByDivision = standings.reduce((acc, team) => {
    if (!acc[team.division]) {
      acc[team.division] = [];
    }
    acc[team.division].push(team);
    return acc;
  }, {});

  // Sort teams within each division by match points
  Object.keys(teamsByDivision).forEach(division => {
    teamsByDivision[division].sort((a, b) => b.matchPoints - a.matchPoints);
  });

  const selectedTeamData = standings.find(s => s.name === selectedTeam);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Select Your Team
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Current Round: {tournamentData.tournament.currentRound} of {tournamentData.tournament.totalRounds}
          </p>
        </div>
        <div className="text-right text-sm text-gray-500">
          Last updated: {new Date(tournamentData.lastUpdated).toLocaleString()}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Team *
        </label>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Select your team --</option>
          {[1, 2, 3, 4, 5].map(division => (
            <optgroup key={division} label={`Division ${division}`}>
              {teamsByDivision[division]?.map(team => (
                <option key={team.name} value={team.name}>
                  {team.name} ({team.wins}-{team.losses}, {team.matchPoints} pts)
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {selectedTeamData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Current Standing:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-blue-700">Division:</span>
              <span className="ml-2 font-semibold text-blue-900">{selectedTeamData.division}</span>
            </div>
            <div>
              <span className="text-blue-700">Record:</span>
              <span className="ml-2 font-semibold text-blue-900">{selectedTeamData.wins}-{selectedTeamData.losses}</span>
            </div>
            <div>
              <span className="text-blue-700">Match Points:</span>
              <span className="ml-2 font-semibold text-blue-900">{selectedTeamData.matchPoints}</span>
            </div>
            <div>
              <span className="text-blue-700">Games Played:</span>
              <span className="ml-2 font-semibold text-blue-900">{selectedTeamData.gamesPlayed}</span>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!selectedTeam}
        className="w-full bg-blue-900 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Calculate My Chances
      </button>
    </form>
  );
}

export default TeamInputForm;
