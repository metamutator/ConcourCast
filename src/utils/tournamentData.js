import { calculateMatchPoints } from './matchPoints';

/**
 * Loads tournament data from the JSON file
 */
export async function loadTournamentData() {
  try {
    const response = await fetch('/tournament-data.json');
    if (!response.ok) {
      throw new Error('Failed to load tournament data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading tournament data:', error);
    return null;
  }
}

/**
 * Calculates current standings from completed matches
 */
export function calculateStandings(teams, matches) {
  // Initialize team records
  const standings = teams.map(team => ({
    id: team.name,
    name: team.name,
    division: team.division,
    wins: 0,
    losses: 0,
    matchPoints: 0,
    gamesPlayed: 0,
  }));

  // Create a map for quick lookup
  const standingsMap = new Map(standings.map(s => [s.name, s]));

  // Process completed matches
  matches.forEach(match => {
    if (match.team1Score !== null && match.team2Score !== null) {
      const team1Standing = standingsMap.get(match.team1);
      const team2Standing = standingsMap.get(match.team2);

      if (!team1Standing || !team2Standing) {
        console.warn(`Team not found in match: ${match.team1} vs ${match.team2}`);
        return;
      }

      // Calculate match points based on actual game scores
      const { winnerPoints, loserPoints } = match.team1Score > match.team2Score
        ? calculateMatchPoints(match.team1Score, match.team2Score)
        : calculateMatchPoints(match.team2Score, match.team1Score);

      // Determine winner and update standings
      if (match.team1Score > match.team2Score) {
        team1Standing.wins++;
        team2Standing.losses++;
        team1Standing.matchPoints += winnerPoints;
        team2Standing.matchPoints += loserPoints;
      } else {
        team2Standing.wins++;
        team1Standing.losses++;
        team2Standing.matchPoints += winnerPoints;
        team1Standing.matchPoints += loserPoints;
      }

      team1Standing.gamesPlayed++;
      team2Standing.gamesPlayed++;
    }
  });

  return standings;
}

/**
 * Gets remaining matches for a specific team
 */
export function getRemainingMatches(teamName, matches) {
  return matches.filter(
    match =>
      (match.team1 === teamName || match.team2 === teamName) &&
      (match.team1Score === null || match.team2Score === null)
  );
}

/**
 * Gets all remaining matches (incomplete)
 */
export function getAllRemainingMatches(matches) {
  return matches.filter(
    match => match.team1Score === null || match.team2Score === null
  );
}

/**
 * Gets completed matches
 */
export function getCompletedMatches(matches) {
  return matches.filter(
    match => match.team1Score !== null && match.team2Score !== null
  );
}
