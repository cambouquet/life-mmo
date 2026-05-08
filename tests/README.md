# Game and App Tests

This directory contains Playwright tests for both **app/UI tests** and **game interaction tests**.

## Test Organization

### App Tests (UI/Layout)
Tests that verify the application UI, layout, and styling:
- `layout.spec.js` - Main layout and element visibility
- `layout-small.spec.js` - Small viewport layouts
- `layout-vscode.spec.js` - VS Code preview layout
- `layout-mobile.spec.js` - Mobile viewport testing
- `layout-debug.spec.js` - Debug mode layouts
- `sprite-picker-no-scroll.spec.js` - Sprite picker functionality
- `document-scroll-test.spec.js` - Document scroll behavior
- `vscode-preview-sizes.spec.js` - VS Code preview sizes
- `find-overflow.spec.js` - Overflow detection
- `find-overflow-detailed.spec.js` - Detailed overflow checks
- `find-overflow-320.spec.js` - 320px viewport overflow
- `mapBackup.spec.js` - Map backup/restore functionality
- `mapBackupRestore.spec.js` - Map restoration flow

### Game Tests (Mechanics/Interactions)
Tests that verify core game mechanics and player interactions:
- `game-interactions.spec.js` - Player movement, collisions, and basic interactions
  - Player movement (WASD)
  - Collision detection
  - Proximity triggers
  - Log system
- `game-scenarios.spec.js` - Complex game scenarios and integration tests
  - Room navigation
  - Character customization
  - Map editing
  - Complete playthroughs

## Test Helpers

Use `game-test-helpers.js` for common game testing operations:

```javascript
import {
  waitForGameReady,        // Wait for game to initialize
  getPlayerPos,            // Get current player position
  movePlayerDirection,     // Move player in a direction
  movePlayerTo,            // Move player to specific coordinates
  focusGameCanvas,         // Focus the game canvas
  setCharColor,            // Set character color
  getCharColor,            // Get character color
  clearGameState,          // Clear localStorage game state
  getExploredTiles,        // Get explored tile count
} from './game-test-helpers.js'
```

## Writing Game Tests

### Basic Test Structure
```javascript
import { test, expect } from '@playwright/test'
import { waitForGameReady, getPlayerPos, movePlayerDirection, focusGameCanvas } from './game-test-helpers.js'

test.describe('My Game Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
    await waitForGameReady(page)
  })

  test('should do something', async ({ page }) => {
    await focusGameCanvas(page)
    const startPos = await getPlayerPos(page)
    
    await movePlayerDirection(page, 'right', 500)
    const endPos = await getPlayerPos(page)
    
    expect(endPos.x).toBeGreaterThan(startPos.x)
  })
})
```

### Unit Tests (Simple interactions)
For isolated game mechanics - movement, collision, proximity detection.

**File:** `game-interactions.spec.js`

```javascript
test('player should move right when pressing D', async ({ page }) => {
  await focusGameCanvas(page)
  const initialPos = await getPlayerPos(page)
  
  await movePlayerDirection(page, 'right', 300)
  const afterMove = await getPlayerPos(page)
  
  expect(afterMove.x).toBeGreaterThan(initialPos.x)
})
```

### Integration Tests (Combined interactions)
For complex scenarios - multi-room navigation, character creation flows.

**File:** `game-scenarios.spec.js`

```javascript
test('should complete a full exploration cycle', async ({ page }) => {
  await focusGameCanvas(page)
  const startPos = await getPlayerPos(page)
  
  // Move through all directions
  await movePlayerDirection(page, 'right', 1500)
  const pos1 = await getPlayerPos(page)
  
  // Verify exploration path
  expect(pos1.x).toBeGreaterThan(startPos.x)
})
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific test file
```bash
npm test -- game-interactions.spec.js
```

### Run specific test suite
```bash
npm test -- --grep "Player Movement"
```

### Run in UI mode (debug)
```bash
npm test -- --ui
```

### Run in headed mode (see browser)
```bash
npm test -- --headed
```

## Test Patterns

### Movement Testing
```javascript
// Simple direction movement
await movePlayerDirection(page, 'right', 500)

// Verify position change
const oldPos = await getPlayerPos(page)
await movePlayerDirection(page, 'up', 300)
const newPos = await getPlayerPos(page)
expect(newPos.y).toBeLessThan(oldPos.y)
```

### State Testing
```javascript
// Set and verify character data
await setCharColor(page, 'hair', '#ff0000')
const color = await getCharColor(page, 'hair')
expect(color).toBe('#ff0000')
```

### Explored Tiles
```javascript
// Move around and check exploration tracking
await movePlayerDirection(page, 'right', 1000)
const tiles = await getExploredTiles(page)
expect(tiles.length).toBeGreaterThan(0)
```

## Admin Menu Integration

Access tests from the in-game admin menu (⚙ button):
- Tests are grouped by category (Game Tests, App Tests)
- Click a test to open it and see results
- Run via terminal: `npm test -- [testname]`

## Debugging Tests

### Enable debug logging
```javascript
test.only('specific test', async ({ page }) => {
  // Only this test runs
})
```

### Add explicit waits
```javascript
await page.waitForTimeout(500) // Simple wait
await page.waitForFunction(() => condition) // Wait for condition
```

### Take screenshots
```javascript
await page.screenshot({ path: 'debug.png' })
```

### Use Playwright Inspector
```bash
npx playwright test --debug
```

## Best Practices

1. **Keep tests isolated** - Use `beforeEach` to reset state
2. **Use helpers** - Leverage `game-test-helpers.js` for common operations
3. **Test one thing** - Each test should verify a single behavior
4. **Meaningful assertions** - Use clear `expect()` statements
5. **Descriptive names** - Test names should explain what they test
6. **Avoid hardcoding delays** - Use `waitForFunction` instead of `setTimeout`
7. **Group related tests** - Use `describe()` to organize test suites

## Common Issues

### Game not ready
```javascript
// Make sure to wait for game to initialize
await waitForGameReady(page)
```

### Canvas not focused
```javascript
// Always focus canvas before keyboard input
await focusGameCanvas(page)
```

### Flaky position tests
```javascript
// Movement takes time - use longer duration
await movePlayerDirection(page, 'right', 1000) // Increase from 300
```

## Adding New Tests

1. Create test in appropriate file (`game-interactions.spec.js` or `game-scenarios.spec.js`)
2. Use helpers from `game-test-helpers.js`
3. Follow naming convention: `should [behavior]`
4. Add to AdminMenu test list if user-facing
5. Run locally: `npm test -- [filename.spec.js]`
