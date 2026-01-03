# MBA Competition Probability Calculator - User Stories

## Project Overview
A web application to calculate the likelihood of reaching semifinals/finals for teams at the John Molson MBA Case Competition using Monte Carlo simulation.

**Tech Stack:**
- Frontend: React + Vite
- Styling: Tailwind CSS
- Hosting: Vercel (free tier)
- Calculations: Client-side JavaScript
- Deployment: Auto-deploy from GitHub

---

## EPIC: MBA Competition Probability Calculator

### **DAY 0: MVP - Single Team View**

#### **TASK 1: Project Setup**
**Priority:** P0 (Blocker)
**Story Points:** 1

**Tasks:**
- [ ] Initialize Vite + React project
- [ ] Install Tailwind CSS
- [ ] Set up ESLint + Prettier
- [ ] Create GitHub repository structure
- [ ] Connect to Vercel
- [ ] Set up auto-deployment
- [ ] Create basic folder structure (components, utils, hooks)
- [ ] Add README with project description

**Definition of Done:**
- Project runs locally with `npm run dev`
- Tailwind CSS working
- Git repository initialized
- Vercel connected (deployment can happen later)

---

#### **STORY 1: Data Input Interface**
**Priority:** P0 (Blocker)
**Story Points:** 3

**User Story:**
```
As a competing team member
I want to input current tournament standings
So that I can see my team's advancement probabilities
```

**Acceptance Criteria:**
- [ ] Form to select my team from dropdown (30 teams)
- [ ] Input field for current round # (1-5)
- [ ] Input fields for my team's current record:
  - Wins (0-5)
  - Losses (0-5)
  - Total match points
  - Division (1-5)
- [ ] Input fields for division standings (all 6 teams in division):
  - Each team's wins/losses/match points
- [ ] "Calculate Probabilities" button
- [ ] Form validation:
  - Wins + losses ≤ current round #
  - Match points are non-negative integers
  - All required fields filled
- [ ] Clear error messages for invalid inputs
- [ ] Ability to reset form

**Technical Notes:**
- Use React Hook Form for form management
- Create reusable input components
- Store form state in React useState

**Definition of Done:**
- User can input all required data
- Form validates correctly
- Data structure ready for Monte Carlo engine

---

#### **STORY 2: Monte Carlo Simulation Engine**
**Priority:** P0 (Blocker)
**Story Points:** 8

**User Story:**
```
As a developer
I want to implement a Monte Carlo simulation engine
So that I can calculate advancement probabilities
```

**Acceptance Criteria:**
- [ ] Function to simulate a single match:
  - Generate random score differential (normal distribution, mean=0, std=15)
  - Determine match point split based on differential:
    - ≤3.0: 6-5 split + 20 bonus to winner, 10 to loser
    - 3.5-10.0: 7-4 split + 30 bonus to winner
    - 10.5-20.0: 8-3 split + 30 bonus to winner
    - 20.5-35.0: 9-2 split + 30 bonus to winner
    - ≥35.5: 10-1 split + 30 bonus to winner
  - 50-50 probability for each future match (coin flip for winner)

- [ ] Function to simulate remaining round-robin matches:
  - Simulate all remaining matches in all divisions
  - Track wins and match points for all teams

- [ ] Divisional winner determination:
  - Team with most wins in division
  - Tiebreaker: head-to-head result
  - Tiebreaker: highest match points

- [ ] Wildcard selection:
  - Top 4 non-divisional-winners by match points
  - Exception: If non-qualifying team has more wins than wildcard, they replace lowest wildcard

- [ ] Run simulation N times (configurable, default 10,000)
- [ ] Aggregate results and calculate probabilities:
  - % times team won division
  - % times team made wildcard
  - % times team made semifinals (division OR wildcard)
  - Distribution of final match points (for percentile calculations)

**Technical Notes:**
- Create `simulateMatch()` function
- Create `simulateRoundRobin()` function
- Create `determineQualifiers()` function
- Create `runSimulations()` main function
- Use Web Workers if performance becomes an issue (future optimization)
- Add unit tests for edge cases

**Definition of Done:**
- Simulation runs 10,000 times in <3 seconds
- Probabilities sum correctly (division + wildcard ≤ 100%)
- Results match hand-calculated test cases
- Code is well-commented and documented

---

#### **STORY 3: Probability Display Dashboard**
**Priority:** P0 (Blocker)
**Story Points:** 5

**User Story:**
```
As a competing team member
I want to see my advancement probabilities
So that I understand my chances of reaching semifinals
```

**Acceptance Criteria:**
- [ ] Display results in clear, visual format:
  - **"% chance of winning division"** - Large, prominent number
  - **"% chance of wildcard berth"** - Large, prominent number
  - **"% overall chance of semifinals"** - LARGEST number, hero stat

- [ ] Additional statistics:
  - Expected final match points (median from simulations)
  - Match points needed for 75% chance (75th percentile)
  - Match points needed for 95% chance (95th percentile)

- [ ] Visual indicators:
  - Progress bars for each probability
  - Color coding:
    - Green (≥70%): Strong chance
    - Yellow (40-69%): Moderate chance
    - Orange (15-39%): Slim chance
    - Red (<15%): Very unlikely

- [ ] Loading state during simulation:
  - Spinner or progress indicator
  - "Running 10,000 simulations..." message

- [ ] Results section:
  - Clear heading: "Your Advancement Chances"
  - Team name displayed
  - Current record displayed (X-Y, Z match points)
  - Ability to recalculate with different inputs

**Technical Notes:**
- Create ResultsCard component
- Create ProgressBar component
- Use Tailwind for styling
- Consider adding simple chart (optional for MVP)

**Definition of Done:**
- Results display within 1 second of simulation completion
- All probabilities clearly visible
- Mobile responsive
- Color coding works correctly

---

#### **STORY 4: Basic UI & Styling**
**Priority:** P1 (Important)
**Story Points:** 3

**User Story:**
```
As a user
I want a clean, professional interface
So that I can easily use the calculator
```

**Acceptance Criteria:**
- [ ] Responsive design:
  - Mobile (320px+)
  - Tablet (768px+)
  - Desktop (1024px+)

- [ ] Layout:
  - Header with title "MBA Competition Probability Calculator"
  - Subtitle with competition name and year
  - Input section (left on desktop, top on mobile)
  - Results section (right on desktop, bottom on mobile)

- [ ] Styling:
  - Tailwind CSS utility classes
  - Consistent spacing and typography
  - Readable fonts (system font stack)
  - Sufficient contrast for accessibility

- [ ] Branding (if appropriate):
  - John Molson colors (research official colors)
  - Professional, academic look

- [ ] Help & Instructions:
  - Brief explanation at top: "Calculate your chances..."
  - Tooltips or help icons for complex fields
  - Link to competition rules

- [ ] Footer:
  - Credits: "Built for JMSB MBA Case Competition 2026"
  - Disclaimer: "Probabilities are estimates based on simulations"
  - GitHub link (optional)

**Technical Notes:**
- Use Tailwind's responsive utilities
- Create layout components (Header, Footer, Container)
- Ensure accessibility (semantic HTML, ARIA labels where needed)

**Definition of Done:**
- App looks professional on all screen sizes
- No layout breaks or overflow issues
- All text is readable
- User testing confirms it's intuitive

---

#### **STORY 5: Match Point Calculator Utility**
**Priority:** P1 (Nice to have for Day 0)
**Story Points:** 2

**User Story:**
```
As a team member
I want to quickly calculate match points from a score differential
So that I can understand the point system
```

**Acceptance Criteria:**
- [ ] Simple calculator section on the page (can be below main calculator)
- [ ] Input: Score differential (0-100)
- [ ] Calculate button (or auto-calculate on input)
- [ ] Output display:
  - "A 15-point win gives you:"
  - Winner: 8 + 30 = 38 points
  - Loser: 3 points

- [ ] Reference table showing all split thresholds:
  ```
  Differential | Winner | Loser
  ≤3.0        | 6+20=26| 5+10=15
  3.5-10.0    | 7+30=37| 4
  10.5-20.0   | 8+30=38| 3
  20.5-35.0   | 9+30=39| 2
  ≥35.5       | 10+30=40| 1
  ```

- [ ] Visual styling consistent with main calculator

**Technical Notes:**
- Create `calculateMatchPoints()` utility function
- Reuse this function in Monte Carlo simulation
- Consider making it a collapsible section (accordion)

**Definition of Done:**
- Calculations match official rules exactly
- Reference table is accurate
- Helps users understand the point system

---

### **DAY 1: Full Tournament View**

#### **STORY 6: Web Scraping from Matchups Page**
**Priority:** P1
**Story Points:** 5

**User Story:**
```
As a developer
I want to attempt scraping data from the competition website
So that users don't have to manually input all 30 teams
```

**Acceptance Criteria:**
- [ ] Attempt to fetch https://mbacasecomp.com/competition/matchups-2026/
- [ ] Parse HTML to extract:
  - Team names
  - Divisions
  - Current match results
  - Current standings (wins, losses, match points)

- [ ] Handle errors gracefully:
  - 403 errors
  - Network failures
  - Malformed HTML

- [ ] Fallback options:
  - "Paste HTML" text area (user copies page source)
  - "Upload HTML file" button (user saves page and uploads)
  - Manual entry (existing functionality)

- [ ] Auto-calculate match points from score differentials if available
- [ ] Pre-populate form with scraped data
- [ ] Allow user to edit scraped data before calculating

**Technical Notes:**
- Use Fetch API or axios
- Consider using CORS proxy if needed (cors-anywhere or similar)
- Parse HTML with DOMParser (client-side)
- Store scraped data in state
- Add "Refresh Data" button

**Definition of Done:**
- Successfully scrapes data (when website allows)
- Graceful fallback when scraping fails
- User can verify/edit scraped data
- Reduces manual entry burden

---

#### **STORY 7: Full Tournament Standings View**
**Priority:** P1
**Story Points:** 5

**User Story:**
```
As a spectator or organizer
I want to see all 30 teams' standings and probabilities
So that I can understand the full tournament picture
```

**Acceptance Criteria:**
- [ ] Table showing all 30 teams with columns:
  - Rank
  - Team Name
  - Division
  - Wins
  - Losses
  - Match Points
  - Division Rank
  - Semifinal Probability

- [ ] Sortable columns (click header to sort)
- [ ] Default sort: By match points (descending)
- [ ] Color coding:
  - Division 1: Blue
  - Division 2: Green
  - Division 3: Orange
  - Division 4: Purple
  - Division 5: Red

- [ ] Visual indicators:
  - Bold text for divisional leaders
  - Green highlight for teams "in" semifinals (top 9)
  - Yellow highlight for bubble teams (10-13)

- [ ] Filter options:
  - "Show all teams"
  - "Division 1 only", "Division 2 only", etc.
  - "Semifinal contenders only"

- [ ] Responsive table (scrollable on mobile)

**Technical Notes:**
- Create StandingsTable component
- Use React state for sorting
- Consider using a table library (react-table) or custom implementation
- Ensure performance with 30 rows

**Definition of Done:**
- All 30 teams displayed correctly
- Sorting works for all columns
- Filters work correctly
- Mobile responsive

---

#### **STORY 8: Wildcard Race Tracker**
**Priority:** P1
**Story Points:** 3

**User Story:**
```
As a user
I want to see the wildcard race in real-time
So that I can see which non-division-winners are likely to advance
```

**Acceptance Criteria:**
- [ ] Separate section: "Wildcard Race"
- [ ] List top 10 non-divisional-winners by match points
- [ ] Visual breakdown:
  - Top 4: Green box with "ADVANCING" label
  - 5th-7th: Yellow box with "BUBBLE" label
  - 8th-10th: Gray box with "OUTSIDE" label

- [ ] For each team show:
  - Rank (among wildcards)
  - Team name
  - Current match points
  - Probability of holding wildcard spot
  - Gap to 4th place wildcard

- [ ] Update automatically when simulations run
- [ ] "Cutoff line" visual (horizontal line after 4th place)

**Technical Notes:**
- Filter divisional winners from full standings
- Sort remaining teams by match points
- Calculate probabilities for wildcard positions
- Create WildcardTracker component

**Definition of Done:**
- Accurately shows wildcard standings
- Probabilities match simulation results
- Visually clear who's in/out
- Updates when data changes

---

#### **STORY 9: Semifinal Seeding Preview**
**Priority:** P2 (Nice to have)
**Story Points:** 5

**User Story:**
```
As a user
I want to see likely semifinal groupings
So that I can anticipate matchups
```

**Acceptance Criteria:**
- [ ] Section: "Projected Semifinal Bracket"
- [ ] Show three groups based on match point seeding:
  - Group A: Seeds 1, 6, 9
  - Group B: Seeds 2, 5, 8
  - Group C: Seeds 3, 4, 7

- [ ] Display:
  - Most likely teams in each group (based on current standings)
  - Probability of each team landing in each group
  - "Your team most likely lands in Group B (67% chance)"

- [ ] Visual bracket:
  - Three columns (Group A, B, C)
  - Three boxes per column (seeds)
  - Arrow pointing to finals

- [ ] Handle uncertainty:
  - "If current standings hold..."
  - Show alternatives if close races

**Technical Notes:**
- Sort qualified teams by match points
- Assign to groups based on seeding rules
- Calculate distribution from simulations
- Create BracketPreview component

**Definition of Done:**
- Accurately reflects seeding rules
- Shows most likely matchups
- Helps users visualize potential paths
- Clear visual design

---

#### **STORY 10: Scenario Explorer**
**Priority:** P2 (Day 2+)
**Story Points:** 8

**User Story:**
```
As a team strategist
I want to explore "what if" scenarios
So that I can plan for different outcomes
```

**Acceptance Criteria:**
- [ ] Interactive scenario controls:
  - "What if we WIN our next match?" button
  - "What if we LOSE our next match?" button
  - Slider for score margin (-40 to +40 points)

- [ ] Real-time recalculation:
  - Instantly update probabilities
  - Show before/after comparison
  - Highlight changes (green = improvement, red = decline)

- [ ] Advanced scenarios:
  - "What if Team X wins their next match?"
  - "What if there's an upset in Division 3?"
  - Multiple scenario chaining

- [ ] Goal calculator:
  - "What do we need to guarantee advancement?"
  - "Minimum match points for 90% chance"
  - "Can we still make it if we lose out?"

- [ ] Save/compare scenarios:
  - Side-by-side comparison
  - "Best case" vs "Worst case" view

**Technical Notes:**
- Create scenario state management
- Modify simulation inputs based on scenarios
- Create ScenarioExplorer component
- Consider using useReducer for complex state

**Definition of Done:**
- Scenarios calculate instantly (<1 second)
- Comparisons are clear and accurate
- Helps teams make strategic decisions
- Intuitive UX

---

### **TECHNICAL TASKS**

#### **TASK 2: Deployment & Testing**
**Priority:** P1
**Story Points:** 2

**Tasks:**
- [ ] Deploy to Vercel:
  - Connect GitHub repository
  - Configure build settings
  - Set up custom domain (optional)
  - Enable automatic deployments on push

- [ ] Testing:
  - Test on mobile devices (iOS Safari, Android Chrome)
  - Test on desktop browsers (Chrome, Firefox, Safari, Edge)
  - Test Monte Carlo accuracy:
    - Hand-calculate example scenarios
    - Verify simulation results match expected probabilities
  - Performance testing:
    - 10,000 simulations should complete in <3 seconds
    - UI should remain responsive

- [ ] Error handling:
  - Test with invalid inputs
  - Test with edge cases (all teams tied, etc.)
  - Ensure graceful error messages

- [ ] Accessibility audit:
  - Keyboard navigation works
  - Screen reader compatible
  - Sufficient color contrast

**Definition of Done:**
- App deployed and accessible via public URL
- No critical bugs
- Performance meets requirements
- Works across devices and browsers

---

## Sprint Plan

### **Day 0 Sprint (MVP Launch)**
**Goal:** Working single-team probability calculator

**Tasks (in order):**
1. ✅ TASK 1: Project Setup (30 min)
2. ✅ STORY 2: Monte Carlo Engine (4 hours) ← Core logic
3. ✅ STORY 1: Data Input Interface (2 hours)
4. ✅ STORY 3: Probability Display (2 hours)
5. ✅ STORY 4: Basic UI & Styling (1 hour)
6. ✅ STORY 5: Match Point Calculator (1 hour) - if time permits
7. ✅ TASK 2: Deploy to Vercel (30 min)

**Total:** ~8-10 hours

**Definition of Done:**
- User can input their team's data
- Monte Carlo simulation calculates probabilities
- Results display clearly
- Deployed to public URL
- Usable by teams at the competition

---

### **Day 1 Sprint (Enhanced Features)**
**Goal:** Public tournament tracker with full standings

**Tasks (in order):**
1. ✅ STORY 6: Web Scraping (3 hours)
2. ✅ STORY 7: Full Tournament View (3 hours)
3. ✅ STORY 8: Wildcard Tracker (2 hours)

**Total:** ~8 hours

**Definition of Done:**
- All 30 teams' data can be loaded
- Full standings table works
- Wildcard race clearly visible
- Useful for spectators and organizers

---

### **Day 2+ (Future Enhancements)**
**Goal:** Advanced analytics and scenario planning

**Tasks:**
- STORY 9: Semifinal Seeding Preview
- STORY 10: Scenario Explorer
- Additional features based on user feedback

---

## Notes & Assumptions

**Assumptions:**
- 30 teams will participate (as per rules)
- 5 divisions of 6 teams each
- 5 round-robin matches per team
- All future matches are 50-50 (no strength ratings for MVP)
- Score differentials follow normal distribution (mean=0, std=15)
- Competition runs Jan 4-9, 2026

**Out of Scope for MVP:**
- User accounts / authentication
- Database / backend
- Historical data analysis
- Team strength ratings
- Real-time live updates (manual refresh only)
- Mobile app (web only)

**Future Considerations:**
- Add ELO ratings or team strength inputs
- Historical performance data from past competitions
- Integration with official competition scoring system
- Live updates via WebSocket or polling
- Analytics dashboard for organizers
- Export results to PDF/CSV

---

## Success Metrics

**MVP Success:**
- [ ] Deployed and functional by Jan 4, 2026
- [ ] At least one team uses it during competition
- [ ] Probabilities are accurate (verified against actual results)
- [ ] No critical bugs reported

**Long-term Success:**
- [ ] Used by multiple teams/spectators
- [ ] Positive feedback from users
- [ ] Adopted for future competitions (2027+)
- [ ] Organizers consider it valuable tool

---

## Risk Management

**Risks:**
1. **Performance:** 10k simulations too slow
   - Mitigation: Optimize algorithm, use Web Workers, reduce simulation count

2. **Web scraping fails:** Can't get data from website
   - Mitigation: Manual entry fallback, paste HTML option

3. **Rules interpretation:** Misunderstand complex tiebreaker logic
   - Mitigation: Verify with organizers, test with historical data

4. **Timeline:** Competition is in 1-6 days!
   - Mitigation: Focus ruthlessly on MVP, cut scope if needed

---

**Document Version:** 1.0
**Last Updated:** 2026-01-03
**Author:** Claude & User
