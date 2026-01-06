# ConcourCast – AI Agent Guide

- **Mission**: Client-side React/Vite app that estimates semifinal odds for the John Molson MBA 2026 competition via Monte Carlo simulation and presents strategic insights.

- **Core data flow**: Tournament data is fetched from [public/tournament-data.json](public/tournament-data.json) → standings are derived via [src/utils/tournamentData.js](src/utils/tournamentData.js) → simulations run in [src/utils/simulator.js](src/utils/simulator.js) → UI renders through [src/App.jsx](src/App.jsx) and child components.

- **Team and match shapes**: Teams use `name` as `id` throughout; structure `{ name, division, wins, losses, matchPoints, gamesPlayed }`. Matches are `{ round, team1, team2, team1Score|null, team2Score|null }`. Keep these keys stable when extending features.

- **Match points**: Allocation rules live in [src/utils/matchPoints.js](src/utils/matchPoints.js) (6-5+20/10, 7-4+30, 8-3+30, 9-2+30, 10-1+30). Reuse `calculateMatchPoints` and `getMatchPointThresholds` rather than duplicating logic.

- **Simulation engine**: `runSimulation` in [src/utils/simulator.js](src/utils/simulator.js) prefers `remainingMatches` from schedule; falls back to legacy round-robin if missing. Score differential is sampled via Box–Muller (mean 0, σ=15). Qualification: top division winners (wins then match points) plus 4 wildcards by match points, with an override if a non-qualifier has more wins than the weakest wildcard. Output includes probabilities and percentile match-point stats.

- **Strategic insights**: [src/utils/strategicAnalysis.js](src/utils/strategicAnalysis.js) runs smaller simulations to rank your remaining games, best/worst cases, and “games to watch”. Forced outcomes use average point adds (win ≈ +37/+40, loss ≈ +4/+1). Maintain these assumptions unless the scoring model changes.

- **UI surface**: [src/App.jsx](src/App.jsx) toggles calculator vs admin view (`import.meta.env.DEV` gates Admin). Key components: input form ([TeamInputForm.jsx](src/components/TeamInputForm.jsx)) loads data + standings, results ([ResultsDisplay.jsx](src/components/ResultsDisplay.jsx)) shows probabilities/percentiles, match point reference ([MatchPointCalculator.jsx](src/components/MatchPointCalculator.jsx)) mirrors utility thresholds, insights panel ([StrategicInsights.jsx](src/components/StrategicInsights.jsx)) renders analysis tabs.

- **Tournament data workflow**: Admin panel ([src/components/AdminPanel.jsx](src/components/AdminPanel.jsx)) parses Excel with `Teams` (columns: `TeamName`, `Division` A–E or 1–5) and `Schedule` (`Round`, `Team1`, `Team2`, optional `Team1Score`, `Team2Score`). It computes `currentRound` from completed matches and emits JSON; replace [public/tournament-data.json](public/tournament-data.json) with the download/clipboard output. This panel only appears in dev builds.

- **Build/run**: `npm install`; `npm run dev` (Vite); `npm run build`; `npm run preview`. Vercel auto-deploys on push per [vercel.json](vercel.json).

- **Testing**: No formal test runner; ad-hoc checks via `node src/utils/simulator.test.js` exercise match-point math and a sample simulation. Keep runtime light—strategic analysis uses reduced iterations for responsiveness.

- **Gotchas**: Use `remainingMatches` with names (not ids) when simulating; `runSimulation` already matches by `id` or `name`. Keep `currentRound`/`totalRounds` consistent with data. Avoid blocking the UI—long work is wrapped in `setTimeout` to let React render spinners.

- **Useful constants/assumptions**: 5 divisions × 6 teams, 5 round-robin rounds, 9 teams advance (5 winners + 4 wildcards), 10k iterations default for main calculator, 50–50 win probability baseline.

- **Style**: Tailwind in [src/index.css](src/index.css); keep component classNames aligned with existing palette (blue primary, gray neutrals) and container widths (`max-w-6xl`).

Please suggest updates if any part of these instructions is unclear or incomplete.