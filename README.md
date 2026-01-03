# ConcourCast - MBA Competition Probability Calculator

A web application to calculate the likelihood of reaching the semifinals/finals for teams at the **John Molson MBA International Case Competition 2026**.

## Features

- **Monte Carlo Simulation Engine**: Run 10,000+ simulations to calculate advancement probabilities
- **Real-time Probability Calculations**: See your chances of winning your division or getting a wildcard spot
- **Match Point Calculator**: Understand the complex match point allocation system
- **Scenario Explorer**: Test "what if" scenarios for strategic planning
- **Full Tournament View**: See all 30 teams' standings and probabilities

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
- **Calculations**: Client-side JavaScript (Monte Carlo simulation)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
ConcourCast/
├── src/
│   ├── components/     # React components
│   ├── utils/         # Utility functions (Monte Carlo engine, etc.)
│   ├── hooks/         # Custom React hooks
│   ├── App.jsx        # Main application component
│   ├── main.jsx       # Application entry point
│   └── index.css      # Global styles with Tailwind
├── public/            # Static assets
├── index.html         # HTML entry point
└── USER_STORIES.md    # Detailed feature documentation
```

## How It Works

### Competition Format

- **30 teams** divided into **5 divisions** of 6 teams each
- Each team plays **5 round-robin matches** (1v1 against division opponents)
- **9 teams advance** to semifinals:
  - 5 divisional winners
  - 4 wildcards (highest match points among non-winners)

### Match Point System

When two teams compete, 11 base points are split based on score differential:
- ≤3.0 points: 6-5 split + 20 bonus to winner, 10 to loser
- 3.5-10.0 points: 7-4 split + 30 bonus to winner
- 10.5-20.0 points: 8-3 split + 30 bonus to winner
- 20.5-35.0 points: 9-2 split + 30 bonus to winner
- ≥35.5 points: 10-1 split + 30 bonus to winner

Winning teams typically earn 36-40 match points per win.

### Probability Engine

The app uses **Monte Carlo simulation** to calculate advancement probabilities:

1. Simulate all remaining round-robin matches with 50-50 win probability
2. For each match, randomly generate a score differential (normal distribution)
3. Allocate match points based on the differential
4. Determine divisional winners and wildcards
5. Repeat 10,000+ times and aggregate results

## Roadmap

### Day 0 (MVP) ✅
- [x] Project setup
- [ ] Monte Carlo simulation engine
- [ ] Single team probability calculator
- [ ] Basic UI
- [ ] Deploy to Vercel

### Day 1
- [ ] Web scraping from competition website
- [ ] Full tournament standings view
- [ ] Wildcard race tracker

### Day 2+
- [ ] Semifinal seeding preview
- [ ] Advanced scenario explorer
- [ ] Historical data analysis

## Contributing

This is a project for the 2026 John Molson MBA International Case Competition. Contributions and suggestions are welcome!

## License

MIT

## Acknowledgments

Built for the [John Molson MBA International Case Competition](https://mbacasecomp.com/)
