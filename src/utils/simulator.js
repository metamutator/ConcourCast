import { calculateMatchPoints } from './matchPoints';

/**
 * Generate a random score differential using normal distribution
 * Mean = 0 (50-50 chance), Standard Deviation = 15
 *
 * Uses Box-Muller transform to generate normally distributed random numbers
 *
 * @returns {number} Score differential
 */
function generateScoreDifferential() {
  // Box-Muller transform for normal distribution
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

  // Mean = 0, StdDev = 15
  return z0 * 15;
}

/**
 * Simulate a single match between two teams
 *
 * @param {object} team1 - Team object with id, wins, losses, matchPoints
 * @param {object} team2 - Team object with id, wins, losses, matchPoints
 * @returns {object} { winner, loser, team1Points, team2Points, differential }
 */
function simulateMatch(team1, team2) {
  // 50-50 coin flip for winner
  const differential = generateScoreDifferential();
  const { winnerPoints, loserPoints } = calculateMatchPoints(Math.abs(differential));

  if (differential >= 0) {
    // Team 1 wins
    return {
      winner: team1.id,
      loser: team2.id,
      team1Points: winnerPoints,
      team2Points: loserPoints,
      differential: Math.abs(differential),
    };
  } else {
    // Team 2 wins
    return {
      winner: team2.id,
      loser: team1.id,
      team1Points: loserPoints,
      team2Points: winnerPoints,
      differential: Math.abs(differential),
    };
  }
}

/**
 * Create a deep copy of teams data
 *
 * @param {Array} teams - Array of team objects
 * @returns {Array} Deep copy of teams
 */
function cloneTeams(teams) {
  return teams.map(team => ({
    ...team,
    wins: team.wins,
    losses: team.losses,
    matchPoints: team.matchPoints,
  }));
}

/**
 * Get teams in a specific division
 *
 * @param {Array} teams - Array of team objects
 * @param {number} division - Division number (1-5)
 * @returns {Array} Teams in that division
 */
function getTeamsInDivision(teams, division) {
  return teams.filter(team => team.division === division);
}

/**
 * Simulate remaining matches based on actual tournament schedule
 *
 * @param {Array} teams - Array of all 30 teams with current standings
 * @param {Array} remainingMatches - Array of remaining match objects from tournament data
 * @returns {Array} Updated teams array after simulation
 */
function simulateRemainingMatches(teams, remainingMatches) {
  const teamsCopy = cloneTeams(teams);

  // Simulate each remaining match
  for (const match of remainingMatches) {
    const team1 = teamsCopy.find(t => t.id === match.team1 || t.name === match.team1);
    const team2 = teamsCopy.find(t => t.id === match.team2 || t.name === match.team2);

    if (!team1 || !team2) {
      console.warn(`Team not found in match: ${match.team1} vs ${match.team2}`);
      continue;
    }

    // Simulate the match
    const result = simulateMatch(team1, team2);

    // Update team records
    const team1Index = teamsCopy.findIndex(t => t.id === team1.id);
    const team2Index = teamsCopy.findIndex(t => t.id === team2.id);

    if (result.winner === team1.id) {
      teamsCopy[team1Index].wins++;
      teamsCopy[team1Index].matchPoints += result.team1Points;
      teamsCopy[team2Index].losses++;
      teamsCopy[team2Index].matchPoints += result.team2Points;
    } else {
      teamsCopy[team2Index].wins++;
      teamsCopy[team2Index].matchPoints += result.team2Points;
      teamsCopy[team1Index].losses++;
      teamsCopy[team1Index].matchPoints += result.team1Points;
    }
  }

  return teamsCopy;
}

/**
 * Legacy function for backward compatibility - simulates round-robin matches
 * @deprecated Use simulateRemainingMatches with actual tournament data instead
 */
function simulateRoundRobin(teams, currentRound, completedMatches = []) {
  const teamsCopy = cloneTeams(teams);

  // For each division, simulate remaining matches
  for (let division = 1; division <= 5; division++) {
    const divisionTeams = getTeamsInDivision(teamsCopy, division);

    // Generate all possible pairings
    for (let i = 0; i < divisionTeams.length; i++) {
      for (let j = i + 1; j < divisionTeams.length; j++) {
        const team1 = divisionTeams[i];
        const team2 = divisionTeams[j];

        // Create match ID (sorted to ensure consistency)
        const matchId = [team1.id, team2.id].sort().join('-');

        // Skip if match already completed
        if (completedMatches.includes(matchId)) {
          continue;
        }

        // Simulate the match
        const result = simulateMatch(team1, team2);

        // Update team records
        const team1Index = teamsCopy.findIndex(t => t.id === team1.id);
        const team2Index = teamsCopy.findIndex(t => t.id === team2.id);

        if (result.winner === team1.id) {
          teamsCopy[team1Index].wins++;
          teamsCopy[team1Index].matchPoints += result.team1Points;
          teamsCopy[team2Index].losses++;
          teamsCopy[team2Index].matchPoints += result.team2Points;
        } else {
          teamsCopy[team2Index].wins++;
          teamsCopy[team2Index].matchPoints += result.team2Points;
          teamsCopy[team1Index].losses++;
          teamsCopy[team1Index].matchPoints += result.team1Points;
        }
      }
    }
  }

  return teamsCopy;
}

/**
 * Determine the 9 teams that advance to semifinals
 *
 * Rules:
 * - 5 divisional winners (most wins in division)
 * - 4 wildcards (highest match points among non-winners)
 * - Exception: If non-qualifying team has more wins than wildcard, they replace lowest wildcard
 *
 * @param {Array} teams - Array of all teams after round-robin
 * @returns {object} { qualifiers, divisionalWinners, wildcards }
 */
function determineQualifiers(teams) {
  const divisionalWinners = [];

  // Determine divisional winners
  for (let division = 1; division <= 5; division++) {
    const divisionTeams = getTeamsInDivision(teams, division);

    // Sort by wins (desc), then match points (desc)
    divisionTeams.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.matchPoints - a.matchPoints;
    });

    divisionalWinners.push(divisionTeams[0]);
  }

  // Get non-divisional winners
  const nonWinners = teams.filter(
    team => !divisionalWinners.find(winner => winner.id === team.id)
  );

  // Sort non-winners by match points (desc), then wins (desc)
  nonWinners.sort((a, b) => {
    if (b.matchPoints !== a.matchPoints) return b.matchPoints - a.matchPoints;
    return b.wins - a.wins;
  });

  // Top 4 are wildcards
  let wildcards = nonWinners.slice(0, 4);

  // Exception: Check if any non-qualifying team has more wins than a wildcard
  const nonQualifiers = nonWinners.slice(4);
  for (const nonQualifier of nonQualifiers) {
    // Find wildcard with fewest wins
    const weakestWildcard = wildcards.reduce((min, card) =>
      card.wins < min.wins ? card : min
    );

    // If non-qualifier has more wins, replace the weakest wildcard
    if (nonQualifier.wins > weakestWildcard.wins) {
      wildcards = wildcards.filter(w => w.id !== weakestWildcard.id);
      wildcards.push(nonQualifier);

      // Re-sort wildcards by match points
      wildcards.sort((a, b) => b.matchPoints - a.matchPoints);
    }
  }

  const qualifiers = [...divisionalWinners, ...wildcards];

  // Sort qualifiers by match points for seeding
  qualifiers.sort((a, b) => b.matchPoints - a.matchPoints);

  return {
    qualifiers,
    divisionalWinners,
    wildcards,
  };
}

/**
 * Run Monte Carlo simulation N times and aggregate results
 *
 * @param {object} config - Configuration object
 * @param {Array} config.teams - Array of all 30 teams with current standings
 * @param {number} config.currentRound - Current round number (1-5)
 * @param {Array} config.completedMatches - Array of completed match IDs (legacy, optional)
 * @param {Array} config.remainingMatches - Array of remaining match objects from tournament data
 * @param {number} config.iterations - Number of simulations to run (default 10000)
 * @param {string} config.targetTeamId - ID of the team to track
 * @returns {object} Simulation results with probabilities
 */
export function runSimulation(config) {
  const {
    teams,
    currentRound,
    completedMatches = [],
    remainingMatches = null,
    iterations = 10000,
    targetTeamId,
  } = config;

  // Results tracking
  const results = {
    divisionalWins: 0,
    wildcardBerths: 0,
    totalQualifications: 0,
    finalMatchPoints: [],
    qualifierMatchPoints: [],
  };

  // Run simulations
  for (let i = 0; i < iterations; i++) {
    let simulatedTeams;

    // Use new match-based simulation if remainingMatches provided, otherwise fall back to legacy
    if (remainingMatches && remainingMatches.length > 0) {
      simulatedTeams = simulateRemainingMatches(teams, remainingMatches);
    } else {
      simulatedTeams = simulateRoundRobin(teams, currentRound, completedMatches);
    }

    const { qualifiers, divisionalWinners, wildcards } = determineQualifiers(simulatedTeams);

    // Find target team in results (support both id and name)
    const targetTeam = simulatedTeams.find(t => t.id === targetTeamId || t.name === targetTeamId);
    const isDivisionalWinner = divisionalWinners.find(w => (w.id === targetTeamId || w.name === targetTeamId)) !== undefined;
    const isWildcard = wildcards.find(w => (w.id === targetTeamId || w.name === targetTeamId)) !== undefined;
    const qualified = qualifiers.find(q => (q.id === targetTeamId || q.name === targetTeamId)) !== undefined;

    if (isDivisionalWinner) results.divisionalWins++;
    if (isWildcard) results.wildcardBerths++;
    if (qualified) {
      results.totalQualifications++;
      results.qualifierMatchPoints.push(targetTeam.matchPoints);
    }

    results.finalMatchPoints.push(targetTeam.matchPoints);
  }

  // Calculate probabilities and statistics
  const probDivisionalWin = (results.divisionalWins / iterations) * 100;
  const probWildcard = (results.wildcardBerths / iterations) * 100;
  const probSemifinals = (results.totalQualifications / iterations) * 100;

  // Sort match points for percentile calculations
  results.finalMatchPoints.sort((a, b) => a - b);
  results.qualifierMatchPoints.sort((a, b) => a - b);

  const getPercentile = (arr, percentile) => {
    if (arr.length === 0) return 0;
    const index = Math.ceil((percentile / 100) * arr.length) - 1;
    return arr[Math.max(0, index)];
  };

  return {
    probabilities: {
      divisionalWin: probDivisionalWin,
      wildcard: probWildcard,
      semifinals: probSemifinals,
    },
    statistics: {
      expectedMatchPoints: {
        median: getPercentile(results.finalMatchPoints, 50),
        p25: getPercentile(results.finalMatchPoints, 25),
        p75: getPercentile(results.finalMatchPoints, 75),
        p95: getPercentile(results.finalMatchPoints, 95),
      },
      qualificationThresholds: {
        median: getPercentile(results.qualifierMatchPoints, 50),
        p25: getPercentile(results.qualifierMatchPoints, 25),
        p75: getPercentile(results.qualifierMatchPoints, 75),
      },
    },
    metadata: {
      iterations,
      targetTeamId,
      currentRound,
    },
  };
}
