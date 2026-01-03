import { useState } from 'react';

function TeamInputForm({ onCalculate }) {
  const [formData, setFormData] = useState({
    teamName: '',
    division: '1',
    currentRound: '1',
    wins: '0',
    losses: '0',
    matchPoints: '0',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    const wins = parseInt(formData.wins);
    const losses = parseInt(formData.losses);
    const currentRound = parseInt(formData.currentRound);
    const matchPoints = parseInt(formData.matchPoints);

    if (wins + losses > currentRound) {
      alert('Total games played (wins + losses) cannot exceed current round number');
      return;
    }

    if (wins < 0 || losses < 0 || matchPoints < 0) {
      alert('All numbers must be non-negative');
      return;
    }

    // For MVP: create a simple dataset
    // In reality, we'd need all 30 teams' data, but for now we'll generate dummy data
    const teams = generateDummyTeams(parseInt(formData.division), {
      wins,
      losses,
      matchPoints,
    });

    onCalculate({
      teams,
      currentRound,
      targetTeamId: 'MY_TEAM',
      teamName: formData.teamName || 'My Team',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Enter Your Team's Standings
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team Name (optional)
          </label>
          <input
            type="text"
            name="teamName"
            value={formData.teamName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Harvard Business School"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Division *
          </label>
          <select
            name="division"
            value={formData.division}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1">Division 1</option>
            <option value="2">Division 2</option>
            <option value="3">Division 3</option>
            <option value="4">Division 4</option>
            <option value="5">Division 5</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Round *
          </label>
          <select
            name="currentRound"
            value={formData.currentRound}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1">Round 1 (just started)</option>
            <option value="2">Round 2</option>
            <option value="3">Round 3</option>
            <option value="4">Round 4</option>
            <option value="5">Round 5 (final round)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Match Points *
          </label>
          <input
            type="number"
            name="matchPoints"
            value={formData.matchPoints}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 74"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wins *
          </label>
          <input
            type="number"
            name="wins"
            value={formData.wins}
            onChange={handleChange}
            required
            min="0"
            max="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Losses *
          </label>
          <input
            type="number"
            name="losses"
            value={formData.losses}
            onChange={handleChange}
            required
            min="0"
            max="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 0"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">Note for MVP:</p>
        <p>This simplified version assumes average performance for other teams in your division. For more accurate results, all 30 teams' data would be needed.</p>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-900 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-200"
      >
        Calculate My Chances
      </button>
    </form>
  );
}

/**
 * Generate dummy data for 30 teams (simplified for MVP)
 * In production, this would come from real tournament data
 */
function generateDummyTeams(userDivision, userStats) {
  const teams = [];

  // Generate teams for all 5 divisions
  for (let division = 1; division <= 5; division++) {
    for (let teamNum = 1; teamNum <= 6; teamNum++) {
      const isUserTeam = division === userDivision && teamNum === 1;

      if (isUserTeam) {
        // User's team
        teams.push({
          id: 'MY_TEAM',
          name: 'My Team',
          division,
          wins: userStats.wins,
          losses: userStats.losses,
          matchPoints: userStats.matchPoints,
        });
      } else {
        // Generate realistic stats for other teams
        // Average team: ~2.5 wins, ~2.5 losses per 5 games
        // Match points: typically 36-40 per win, 3-15 per loss
        // So ~2.5 wins × 37 avg + 2.5 losses × 8 avg = ~110 points after 5 rounds

        const randomWins = Math.floor(Math.random() * 3); // 0-2 wins so far (conservative)
        const randomLosses = Math.floor(Math.random() * 3); // 0-2 losses so far
        const avgPointsPerWin = 36 + Math.random() * 4; // 36-40
        const avgPointsPerLoss = 3 + Math.random() * 12; // 3-15
        const randomMatchPoints = Math.floor(
          randomWins * avgPointsPerWin + randomLosses * avgPointsPerLoss
        );

        teams.push({
          id: `D${division}T${teamNum}`,
          name: `Division ${division} Team ${teamNum}`,
          division,
          wins: randomWins,
          losses: randomLosses,
          matchPoints: randomMatchPoints,
        });
      }
    }
  }

  return teams;
}

export default TeamInputForm;
