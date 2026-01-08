import { runSimulation } from './simulator';
import { getRemainingMatches } from './tournamentData';

/**
 * Analyzes strategic scenarios for a team
 *
 * @param {object} params
 * @param {string} params.teamName - The target team
 * @param {Array} params.teams - Current standings
 * @param {object} params.tournamentData - Tournament data
 * @returns {object} Strategic analysis results
 */
export function analyzeStrategicScenarios({ teamName, teams, tournamentData }) {
  const yourRemainingMatches = getRemainingMatches(teamName, tournamentData.matches);
  const allRemainingMatches = tournamentData.matches.filter(
    m => m.team1Score === null || m.team2Score === null
  );

  // Get current baseline probability
  const baselineResults = runSimulation({
    teams,
    currentRound: tournamentData.tournament.currentRound,
    remainingMatches: allRemainingMatches,
    iterations: 5000, // Use fewer iterations for speed
    targetTeamId: teamName,
  });

  // Analyze each of your remaining games
  const yourGamesAnalysis = yourRemainingMatches.map(match => {
    const opponent = match.team1 === teamName ? match.team2 : match.team1;

    // Simulate winning this game
    const winScenario = simulateMatchOutcome({
      teams,
      tournamentData,
      match,
      teamName,
      outcome: 'win',
    });

    // Simulate losing this game
    const loseScenario = simulateMatchOutcome({
      teams,
      tournamentData,
      match,
      teamName,
      outcome: 'lose',
    });

    return {
      round: match.round,
      opponent,
      winProbability: winScenario.probabilities.semifinals,
      loseProbability: loseScenario.probabilities.semifinals,
      impact: winScenario.probabilities.semifinals - loseScenario.probabilities.semifinals,
    };
  });

  // Sort by impact (most important games first)
  yourGamesAnalysis.sort((a, b) => b.impact - a.impact);

  // Analyze best/worst case scenarios
  const bestCase = simulateAllOutcomes({
    teams,
    tournamentData,
    teamName,
    scenario: 'best',
  });

  const worstCase = simulateAllOutcomes({
    teams,
    tournamentData,
    teamName,
    scenario: 'worst',
  });

  // Find critical games to watch (games between other contenders)
  const gamesToWatch = analyzeGamesToWatch({
    teams,
    tournamentData,
    teamName,
    baselineProbability: baselineResults.probabilities.semifinals,
  });

  return {
    baseline: baselineResults.probabilities.semifinals,
    yourGames: yourGamesAnalysis,
    bestCase: bestCase.probabilities.semifinals,
    worstCase: worstCase.probabilities.semifinals,
    gamesToWatch: gamesToWatch.slice(0, 10), // Top 10 games
  };
}

/**
 * Simulate outcome of a specific match
 */
function simulateMatchOutcome({ teams, tournamentData, match, teamName, outcome }) {
  const allRemainingMatches = tournamentData.matches.filter(
    m => m.team1Score === null || m.team2Score === null
  );

  // Update teams with the forced outcome
  const updatedTeams = teams.map(t => ({ ...t }));
  const team = updatedTeams.find(t => t.name === teamName);
  const opponent = updatedTeams.find(t =>
    t.name === (match.team1 === teamName ? match.team2 : match.team1)
  );

  if (outcome === 'win') {
    team.wins += 1;
    team.matchPoints += 37; // Average win points
    opponent.losses += 1;
    opponent.matchPoints += 4; // Average loss points
  } else {
    team.losses += 1;
    team.matchPoints += 4;
    opponent.wins += 1;
    opponent.matchPoints += 37;
  }

  // Remove this match from remaining matches
  const remainingMatches = allRemainingMatches.filter(
    m => !(m.team1 === match.team1 && m.team2 === match.team2)
  );

  return runSimulation({
    teams: updatedTeams,
    currentRound: tournamentData.tournament.currentRound,
    remainingMatches,
    iterations: 3000,
    targetTeamId: teamName,
  });
}

/**
 * Simulate all remaining matches with best/worst outcomes
 */
function simulateAllOutcomes({ teams, tournamentData, teamName, scenario, iterations = 3000 }) {
  const yourRemainingMatches = getRemainingMatches(teamName, tournamentData.matches);
  const allRemainingMatches = tournamentData.matches.filter(
    m => m.team1Score === null || m.team2Score === null
  );

  const updatedTeams = teams.map(t => ({ ...t }));
  const team = updatedTeams.find(t => t.name === teamName);

  // Apply all your remaining games
  yourRemainingMatches.forEach(match => {
    const opponent = updatedTeams.find(t =>
      t.name === (match.team1 === teamName ? match.team2 : match.team1)
    );

    if (scenario === 'best') {
      // You win all games decisively
      team.wins += 1;
      team.matchPoints += 40; // Maximum win points
      opponent.losses += 1;
      opponent.matchPoints += 1; // Minimum loss points
    } else {
      // You lose all games
      team.losses += 1;
      team.matchPoints += 4; // Average loss points
      opponent.wins += 1;
      opponent.matchPoints += 37; // Average win points
    }
  });

  // Remove your matches from remaining
  const remainingMatches = allRemainingMatches.filter(
    m => !(m.team1 === teamName || m.team2 === teamName)
  );

  return runSimulation({
    teams: updatedTeams,
    currentRound: tournamentData.tournament.currentRound,
    remainingMatches,
    iterations,
    targetTeamId: teamName,
  });
}

// Lightweight export for bulk dashboards (best/worst cases without full strategic panel)
export function getExtremeScenarioProbabilities({ teamName, teams, tournamentData, iterations = 1200 }) {
  const best = simulateAllOutcomes({ teams, tournamentData, teamName, scenario: 'best', iterations });
  const worst = simulateAllOutcomes({ teams, tournamentData, teamName, scenario: 'worst', iterations });

  return {
    best: best.probabilities.semifinals,
    worst: worst.probabilities.semifinals,
  };
}

/**
 * Find games to watch that would most affect your chances
 */
function analyzeGamesToWatch({ teams, tournamentData, teamName, baselineProbability }) {
  const yourTeam = teams.find(t => t.name === teamName);
  const allRemainingMatches = tournamentData.matches.filter(
    m => (m.team1Score === null || m.team2Score === null) &&
        m.team1 !== teamName && m.team2 !== teamName
  );

  // Focus on games in your division and games involving top contenders
  const relevantMatches = allRemainingMatches.filter(match => {
    const team1 = teams.find(t => t.name === match.team1);
    const team2 = teams.find(t => t.name === match.team2);

    // Same division games
    const sameDivision = team1.division === yourTeam.division || team2.division === yourTeam.division;

    // Games involving teams with similar or better records
    const isContender = (team1.matchPoints >= yourTeam.matchPoints - 20) ||
                       (team2.matchPoints >= yourTeam.matchPoints - 20);

    return sameDivision || isContender;
  }).slice(0, 15); // Limit to 15 for performance

  const gamesWithImpact = relevantMatches.map(match => {
    // This is a simplified heuristic - in production you'd run simulations
    const team1 = teams.find(t => t.name === match.team1);
    const team2 = teams.find(t => t.name === match.team2);

    // Higher impact if teams are in your division or have similar standings
    let impact = 0;

    if (team1.division === yourTeam.division) impact += 10;
    if (team2.division === yourTeam.division) impact += 10;

    const pointDiff1 = Math.abs(team1.matchPoints - yourTeam.matchPoints);
    const pointDiff2 = Math.abs(team2.matchPoints - yourTeam.matchPoints);

    impact += Math.max(0, 20 - pointDiff1);
    impact += Math.max(0, 20 - pointDiff2);

    return {
      round: match.round,
      team1: match.team1,
      team2: match.team2,
      team1Record: `${team1.wins}-${team1.losses}`,
      team2Record: `${team2.wins}-${team2.losses}`,
      team1Points: team1.matchPoints,
      team2Points: team2.matchPoints,
      impact,
      preferredOutcome: determinePreferredOutcome(yourTeam, team1, team2),
    };
  });

  gamesWithImpact.sort((a, b) => b.impact - a.impact);
  return gamesWithImpact;
}

/**
 * Determine which outcome would be better for your team
 */
function determinePreferredOutcome(yourTeam, team1, team2) {
  // If one team is in your division and stronger, you want them to lose
  if (team1.division === yourTeam.division && team1.matchPoints > yourTeam.matchPoints) {
    return `${team2.name} win`;
  }
  if (team2.division === yourTeam.division && team2.matchPoints > yourTeam.matchPoints) {
    return `${team1.name} win`;
  }

  // Otherwise, you generally want the stronger team to win (to separate the pack)
  return team1.matchPoints > team2.matchPoints ? `${team1.name} win` : `${team2.name} win`;
}
