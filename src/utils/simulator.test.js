import { runSimulation } from './simulator';
import { calculateMatchPoints, getMatchPointDescription } from './matchPoints';

/**
 * Test the match points calculation
 */
export function testMatchPoints() {
  console.log('=== Testing Match Points Calculation ===\n');

  const testCases = [
    { winScore: 6, loseScore: 5, expected: { winner: 26, loser: 15 } },
    { winScore: 7, loseScore: 4, expected: { winner: 37, loser: 4 } },
    { winScore: 8, loseScore: 3, expected: { winner: 38, loser: 3 } },
    { winScore: 9, loseScore: 2, expected: { winner: 39, loser: 2 } },
    { winScore: 10, loseScore: 1, expected: { winner: 40, loser: 1 } },
  ];

  testCases.forEach(({ winScore, loseScore, expected }) => {
    const result = calculateMatchPoints(winScore, loseScore);
    const desc = getMatchPointDescription(winScore, loseScore);
    console.log(`Score ${winScore}-${loseScore}: ${desc}`);
    console.log(`  Expected: W=${expected.winner}, L=${expected.loser}`);
    console.log(`  Got: W=${result.winnerPoints}, L=${result.loserPoints}`);
    console.log(`  ✓ ${result.winnerPoints === expected.winner && result.loserPoints === expected.loser ? 'PASS' : 'FAIL'}\n`);
  });
}

/**
 * Test a simple simulation scenario
 */
export function testSimulation() {
  console.log('=== Testing Monte Carlo Simulation ===\n');

  // Create a simple scenario: 30 teams, 5 divisions
  const teams = [];
  for (let division = 1; division <= 5; division++) {
    for (let teamNum = 1; teamNum <= 6; teamNum++) {
      teams.push({
        id: `D${division}T${teamNum}`,
        name: `Division ${division} Team ${teamNum}`,
        division,
        wins: 0,
        losses: 0,
        matchPoints: 0,
      });
    }
  }

  // Run simulation for first team
  const targetTeamId = 'D1T1';

  console.log(`Running 1000 simulations for ${targetTeamId}...\n`);

  const result = runSimulation({
    teams,
    currentRound: 1, // Start of tournament
    completedMatches: [],
    iterations: 1000,
    targetTeamId,
  });

  console.log('Results:');
  console.log(`  Probability of winning division: ${result.probabilities.divisionalWin.toFixed(2)}%`);
  console.log(`  Probability of wildcard: ${result.probabilities.wildcard.toFixed(2)}%`);
  console.log(`  Probability of semifinals: ${result.probabilities.semifinals.toFixed(2)}%`);
  console.log(`\nExpected match points:`);
  console.log(`  Median: ${result.statistics.expectedMatchPoints.median}`);
  console.log(`  25th percentile: ${result.statistics.expectedMatchPoints.p25}`);
  console.log(`  75th percentile: ${result.statistics.expectedMatchPoints.p75}`);
  console.log(`  95th percentile: ${result.statistics.expectedMatchPoints.p95}`);

  // Sanity checks
  const totalProb = result.probabilities.divisionalWin + result.probabilities.wildcard;
  console.log(`\nSanity checks:`);
  console.log(`  ✓ Div Win + Wildcard should be close to Semifinals: ${totalProb.toFixed(2)}% vs ${result.probabilities.semifinals.toFixed(2)}%`);
  console.log(`  ✓ Probability should be ~30% (9/30 teams advance): ${result.probabilities.semifinals.toFixed(2)}%`);
}

/**
 * Run all tests
 */
export function runTests() {
  testMatchPoints();
  console.log('\n' + '='.repeat(50) + '\n');
  testSimulation();
}

// If running in Node.js (not browser)
if (typeof window === 'undefined') {
  runTests();
}
