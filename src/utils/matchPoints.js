/**
 * Calculate match points for both teams based on their scores and differential
 *
 * Rules from competition:
 * - Base points = the team's actual game score
 * - Bonus points awarded to winner based on differential:
 *   - Differential <3: Winner +20, Loser +10
 *   - Differential 3-10: Winner +30, Loser +0
 *   - Differential 11-20: Winner +30, Loser +0
 *   - Differential 21-35: Winner +30, Loser +0
 *   - Differential ≥36: Winner +30, Loser +0
 *
 * @param {number} winnerScore - The winner's game score
 * @param {number} loserScore - The loser's game score
 * @returns {object} { winnerPoints, loserPoints, split }
 */
export function calculateMatchPoints(winnerScore, loserScore) {
  const differential = Math.abs(winnerScore - loserScore);

  let winnerBonus, loserBonus;

  if (differential < 3) {
    winnerBonus = 20;
    loserBonus = 10;
  } else {
    winnerBonus = 30;
    loserBonus = 0;
  }

  const winnerPoints = winnerScore + winnerBonus;
  const loserPoints = loserScore + loserBonus;

  return {
    winnerPoints,
    loserPoints,
    split: `${winnerScore}-${loserScore}`,
    winnerBonus,
    loserBonus,
  };
}

/**
 * Get a human-readable description of the match point allocation
 *
 * @param {number} winnerScore - The winner's game score
 * @param {number} loserScore - The loser's game score
 * @returns {string} Description like "8-3 split + 30 bonus = 38 vs 3 points"
 */
export function getMatchPointDescription(winnerScore, loserScore) {
  const { winnerPoints, loserPoints, split, winnerBonus, loserBonus } = calculateMatchPoints(winnerScore, loserScore);

  if (loserBonus > 0) {
    return `${split} split + ${winnerBonus} bonus to winner, ${loserBonus} to loser = ${winnerPoints} vs ${loserPoints} points`;
  } else {
    return `${split} split + ${winnerBonus} bonus = ${winnerPoints} vs ${loserPoints} points`;
  }
}

/**
 * Get the match point thresholds table for reference
 *
 * @returns {Array} Array of threshold objects
 */
export function getMatchPointThresholds() {
  return [
    { range: '<3', bonusWinner: 20, bonusLoser: 10, example: '6-5 + bonuses = 26 vs 15' },
    { range: '3+', bonusWinner: 30, bonusLoser: 0, example: '8-3 + bonuses = 38 vs 3' },
  ];
}
