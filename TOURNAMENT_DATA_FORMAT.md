# Tournament Data Format

This document describes the JSON format for tournament data used by ConcourCast.

## JSON Structure

```json
{
  "lastUpdated": "ISO 8601 timestamp",
  "tournament": {
    "name": "Tournament name",
    "totalRounds": 5,
    "currentRound": 1
  },
  "teams": [
    {
      "name": "Team Name",
      "division": 1
    }
  ],
  "matches": [
    {
      "round": 1,
      "team1": "Team A",
      "team2": "Team B",
      "team1Score": 85,
      "team2Score": 78
    }
  ]
}
```

## Excel Template Format

When uploading an Excel file, use two sheets:

### Sheet 1: "Teams"
| TeamName | Division |
|----------|----------|
| Team A | 1 |
| Team B | 1 |
| ... | ... |

### Sheet 2: "Schedule"
| Round | Team1 | Team2 | Team1Score | Team2Score |
|-------|-------|-------|------------|------------|
| 1 | Team A | Team B | 85 | 78 |
| 1 | Team C | Team D | | |
| 2 | Team A | Team C | | |

**Notes:**
- Leave scores blank for upcoming matches
- Team names must match exactly between Teams and Schedule sheets
- 30 teams total, 6 per division (divisions 1-5)
- 5 rounds total, 15 matches per round (75 total matches)
