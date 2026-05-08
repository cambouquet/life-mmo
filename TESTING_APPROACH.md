# Testing Approach: Unit Tests + Playground

This document explains the testing philosophy and workflow.

## Philosophy: Keep It Simple

Instead of complex mocking or separate test environment, we use:
1. **Real game** - Run actual game code, not mocks
2. **Browser automation** - Playwright controls real player input
3. **Playground** - In-game admin menu for quick testing
4. **Terminal runner** - Full test suite with reporting

This gives us confidence that tests match real behavior while keeping setup minimal.

## Two Sides of the Coin

### 1. **Unit Tests** (For CI/CD and automation)
- File: `tests/game-interactions.spec.js`
- Focus: Individual mechanics
- Run: `npm test -- game-interactions.spec.js`
- Use: Automated validation, CI pipeline, regression detection

### 2. **Playground** (For development)
- Access: ⚙ button in game
- Focus: Quick testing, exploration
- Use: Manual testing, debugging, feature development
- Display: Categorized test list

## Test Structure

### Game Tests Organization

```
Unit Tests (Isolated)
├── Movement
│   ├── Move right (D)
│   ├── Move left (A)
│   ├── Move up (W)
│   └── Move down (S)
├── Collision
│   └── Boundaries
├── Proximity
│   └── Near mirrors
└── UI
    └── Log system

Integration Tests (Combined)
├── Room Navigation
│   ├── Start → Corridor
│   └── Multi-room traversal
├── Character Flow
│   ├── Colors persistence
│   ├── Birth data
│   └── Name setting
├── Map Editing
│   ├── Tile exploration
│   └── Layer edits
└── Complete Playthrough
    └── Full exploration cycle
```

## Test Development Workflow

### Adding a New Test

#### Step 1: Create test skeleton
```javascript
test('should [behavior]', async ({ page }) => {
  await focusGameCanvas(page)
  
  // Arrange - set up state
  const initial = await getPlayerPos(page)
  
  // Act - perform action
  await movePlayerDirection(page, 'right', 500)
  
  // Assert - verify result
  const final = await getPlayerPos(page)
  expect(final.x).toBeGreaterThan(initial.x)
})
```

#### Step 2: Add helper if needed
```javascript
// In game-test-helpers.js
export async function myNewHelper(page) {
  // Helper implementation
}
```

#### Step 3: Test locally
```bash
# Run single test
npm test -- --grep "should \[behavior\]"

# Or use debug UI
npm test -- --ui
```

#### Step 4: Add to admin menu (optional)
Update `src/components/HUD/AdminMenu.jsx` if it's a new test file.

## Playground vs Terminal

### When to use Playground (⚙ button)
- Quick manual testing
- Debugging a specific flow
- Visual verification
- During development
- Learning the game mechanics

### When to use Terminal
- Regression testing
- CI/CD pipelines
- Batch testing
- Performance measurement
- Headless environments

### Example: Testing a New Feature

1. **Develop** - Write game code
2. **Manual Test** - Use admin menu to explore
3. **Write Unit Test** - `game-interactions.spec.js`
4. **Write Integration Test** - `game-scenarios.spec.js`
5. **Run Full Suite** - `npm test`
6. **Ship** - Confident in changes

## Helper Functions Philosophy

Helpers are **not mocks** - they're utilities for:
- Common setup (clearing state, focusing canvas)
- Position tracking (getting/setting coordinates)
- Character data (colors, birth data)
- Navigation helpers (move in directions)

They interact with the **real game** like a human would.

## Test Categories

### Mechanics (Unit)
Test individual game systems:
- Input handling
- Collision detection
- Proximity checks
- State management

**File:** `game-interactions.spec.js`

Example:
```javascript
test('player should respect walls', async ({ page }) => {
  // Move continuously left from start
  // Verify x >= 0 (no negative coordinates)
})
```

### Scenarios (Integration)
Test realistic gameplay sequences:
- Character creation
- Exploration flows
- State persistence
- Multi-step interactions

**File:** `game-scenarios.spec.js`

Example:
```javascript
test('should complete exploration cycle', async ({ page }) => {
  // Move right → down → left → up
  // Verify each step changed position appropriately
})
```

### UI (App Tests)
Test layout and rendering:
- Element visibility
- Viewport fitting
- Overflow detection
- Responsive design

**Files:** Various layout tests

## Data Flow

### Test → Game → Result

```
Test Code
  ↓
Playwright API
  ↓
Browser Input Events (KeyPress, etc.)
  ↓
Game Code Processes Input
  ↓
Player State Updates
  ↓
Render Loop
  ↓
Test Reads Result (playerPos, etc.)
  ↓
Assert
```

This is **real** game execution, not simulated.

## Why No Mocks?

### Mocks Hide Problems
If you mock movement, you won't catch actual movement bugs.

### Mocks Are Fragile
Mock expectations break when code refactors, even if functionality stays same.

### Mocks Need Maintenance
Every time you change internals, update mocks. Extra work.

### Tests Should Verify Behavior
Users see behavior, not implementation. Test what users see.

## Confidence Levels

### Unit Tests (High Confidence)
```javascript
test('D moves player right', async ({ page }) => {
  expect(newX > oldX)
})
```
✅ Guaranteed to catch regressions

### Integration Tests (Higher Confidence)
```javascript
test('can navigate multiple rooms', async ({ page }) => {
  // Complex sequence
  expect(exploration > 0)
})
```
✅ Tests realistic usage

### Playground (Perfect Confidence)
You're playing the game in real-time.
✅ You see exactly what the player sees

## Test File Organization

```
tests/
├── game-interactions.spec.js    (12 unit tests)
├── game-scenarios.spec.js       (5 integration tests)
├── game-test-helpers.js         (9 helper functions)
├── layout*.spec.js              (existing app tests)
├── find-overflow*.spec.js       (existing app tests)
├── mapBackup*.spec.js           (existing app tests)
└── README.md                    (comprehensive guide)
```

## Running Different Test Suites

```bash
# All tests
npm test

# Only game tests
npm test -- game-

# Only unit tests (interactions)
npm test -- game-interactions

# Only integration tests (scenarios)
npm test -- game-scenarios

# Only app/layout tests
npm test -- layout

# Specific test by name
npm test -- --grep "player should move"

# Single file
npm test -- game-interactions.spec.js

# With UI
npm test -- --ui

# Headed (see browser)
npm test -- --headed

# Watch (re-run on changes)
npm test -- --watch
```

## Debugging Failed Tests

### 1. Run with UI
```bash
npm test -- --ui
```
Click on failed test, inspect step-by-step.

### 2. Run headed
```bash
npm test -- game-interactions.spec.js --headed
```
Watch what actually happens in browser.

### 3. Add timeout
```javascript
test.setTimeout(60000) // Extend to 60s if slow
```

### 4. Debug specific test
```javascript
test.only('failing test', async ({ page }) => {
  // Run only this test
})
```

### 5. Check error context
Playwright saves error details in `test-results/` directory.

## Extending Tests

### Add More Unit Tests
Expand `game-interactions.spec.js` with:
- Door mechanics
- Item interactions
- NPC dialogue
- Combat (if added)

### Add More Integration Tests
Expand `game-scenarios.spec.js` with:
- Full quest flows
- Save/load cycles
- Performance scenarios
- Edge case combinations

### Add More Helpers
Expand `game-test-helpers.js` with:
- Interaction helpers (openMirror, talkNpc, etc.)
- State verification (isNearDoor, etc.)
- Advanced navigation (pathfinding, etc.)

## Best Practices

1. **One Assertion Per Test** (mostly)
   - Makes failure clear

2. **Use Helpers** 
   - Reduces boilerplate
   - Easier to maintain

3. **Descriptive Names**
   - `test('should move right when D pressed')`
   - Not `test('movement works')`

4. **Arrange-Act-Assert**
   - Setup → Do → Verify
   - Clear structure

5. **Independent Tests**
   - Each test can run alone
   - No test depends on others
   - Use beforeEach for setup

6. **Meaningful Assertions**
   ```javascript
   // Good - clear what's being tested
   expect(newPos.x).toBeGreaterThan(oldPos.x)
   
   // Bad - too vague
   expect(newPos).toBeDefined()
   ```

## Metrics to Measure

Track over time:
- Test pass rate (should be 100%)
- Test count (should grow with features)
- Test execution time (should stay fast)
- Coverage of game features (should increase)

## Next: Game Interaction API

Consider expanding test capabilities with:
- Interact (press E on objects)
- Open mirror
- Talk to NPC
- Change equipment
- Cast spells
- Fight enemies

These would unlock more comprehensive integration tests.

## Summary

**We test the real game** using a simple approach:
- ✅ Real browser
- ✅ Real game code
- ✅ Playwright for automation
- ✅ Helpers for common operations
- ✅ Admin menu for playground
- ✅ Terminal for CI/CD
- ✅ No mocks needed

**Result:** Tests you can trust to catch real bugs.
