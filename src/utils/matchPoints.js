/**
 * Calculate match points for both teams based on score differential
 *
 * Rules from competition:
 * - Differential <3: 6-5 split + 20 bonus to winner, 10 to loser
 * - Differential 3-10: 7-4 split + 30 bonus to winner
 * - Differential 11-20: 8-3 split + 30 bonus to winner
 * - Differential 21-35: 9-2 split + 30 bonus to winner
 * - Differential ≥36: 10-1 split + 30 bonus to winner
 *
 * @param {number} differential - Score differential (positive = team A wins)
 * @returns {object} { winnerPoints, loserPoints, split }
 */
export function calculateMatchPoints(differential) {
  const absDiff = Math.abs(differential);

  let winnerBase, loserBase, winnerBonus, loserBonus;

  if (absDiff < 3) {
    winnerBase = 6;
    loserBase = 5;
    winnerBonus = 20;
    loserBonus = 10;
  } else if (absDiff <= 10) {
    winnerBase = 7;
    loserBase = 4;
    winnerBonus = 30;
    loserBonus = 0;
  } else if (absDiff <= 20) {
    winnerBase = 8;
    loserBase = 3;
    winnerBonus = 30;
    loserBonus = 0;
  } else if (absDiff <= 35) {
    winnerBase = 9;
    loserBase = 2;
    winnerBonus = 30;
    loserBonus = 0;
  } else {
    winnerBase = 10;
    loserBase = 1;
    winnerBonus = 30;
    loserBonus = 0;
  }

  const winnerPoints = winnerBase + winnerBonus;
  const loserPoints = loserBase + loserBonus;

  return {
    winnerPoints,
    loserPoints,
    split: `${winnerBase}-${loserBase}`,
    winnerBonus,
    loserBonus,
  };
}

/**
 * Get a human-readable description of the match point allocation
 *
 * @param {number} differential - Score differential
 * @returns {string} Description like "8-3 split + 30 bonus = 38 vs 3 points"
 */
export function getMatchPointDescription(differential) {
  const { winnerPoints, loserPoints, split, winnerBonus, loserBonus } = calculateMatchPoints(differential);

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
    { range: '<3', winnerBase: 6, loserBase: 5, winnerBonus: 20, loserBonus: 10, winnerTotal: 26, loserTotal: 15 },
    { range: '3-10', winnerBase: 7, loserBase: 4, winnerBonus: 30, loserBonus: 0, winnerTotal: 37, loserTotal: 4 },
    { range: '11-20', winnerBase: 8, loserBase: 3, winnerBonus: 30, loserBonus: 0, winnerTotal: 38, loserTotal: 3 },
    { range: '21-35', winnerBase: 9, loserBase: 2, winnerBonus: 30, loserBonus: 0, winnerTotal: 39, loserTotal: 2 },
    { range: '≥36', winnerBase: 10, loserBase: 1, winnerBonus: 30, loserBonus: 0, winnerTotal: 40, loserTotal: 1 },
  ];
}
