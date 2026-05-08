# Game Tests Setup

This document describes the new game testing infrastructure added to life-mmo.

## What Was Added

### 1. **Two Tiers of Testing**

#### App Tests (Existing)
Tests for UI/layout/styling - already in place, now categorized:
- Layout tests (various viewport sizes)
- Overflow detection
- Sprite picker
- Map backup/restore

#### Game Tests (New)
Tests for core game mechanics and interactions:
- **Unit tests** (`game-interactions.spec.js`) - isolated mechanics
- **Integration tests** (`game-scenarios.spec.js`) - complex scenarios

### 2. **Game Testing Files**

#### `tests/game-interactions.spec.js`
Unit tests for basic game mechanics:
- Player movement (WASD)
- Collision boundaries
- Proximity detection
- Log system integration

**Run:** `npm test -- game-interactions.spec.js`

#### `tests/game-scenarios.spec.js`
Integration tests for complex gameplay:
- Room navigation
- Character customization flow
- Map editing
- Complete exploration cycles

**Run:** `npm test -- game-scenarios.spec.js`

#### `tests/game-test-helpers.js`
Reusable helper functions for game testing:
- `waitForGameReady()` - Wait for game initialization
- `getPlayerPos()` - Get current player position
- `movePlayerDirection()` - Move player via keyboard
- `focusGameCanvas()` - Focus game for input
- `setCharColor()` / `getCharColor()` - Character customization
- `clearGameState()` - Reset localStorage
- `getExploredTiles()` - Check exploration tracking

### 3. **Admin Menu Integration**

The admin menu (⚙ button) now displays tests organized by category:

```
Admin Menu
├── Game Tests
│   ├── game-interactions
│   └── game-scenarios
└── App Tests
    ├── layout
    ├── layout-small
    ├── layout-vscode
    ├── layout-mobile
    ├── layout-debug
    ├── sprite-picker-no-scroll
    ├── document-scroll-test
    ├── vscode-preview-sizes
    ├── find-overflow
    ├── find-overflow-detailed
    ├── find-overflow-320
    ├── mapBackup
    └── mapBackupRestore
```

### 4. **API Exposure for Testing**

The game now exposes testing APIs via `window`:

```javascript
window.__gameRef           // Game component ref (playerPos method)
window.__exploredTiles     // Set of explored tile keys
```

This enables Playwright to interact with the game state during tests.

## Test Examples

### Simple Movement Test
```javascript
test('player should move right', async ({ page }) => {
  await focusGameCanvas(page)
  const startPos = await getPlayerPos(page)
  
  await movePlayerDirection(page, 'right', 500)
  const endPos = await getPlayerPos(page)
  
  expect(endPos.x).toBeGreaterThan(startPos.x)
})
```

### Character Customization Test
```javascript
test('should set character colors', async ({ page }) => {
  await setCharColor(page, 'hair', '#ff0000')
  const color = await getCharColor(page, 'hair')
  
  expect(color).toBe('#ff0000')
})
```

### Exploration Test
```javascript
test('should track explored tiles', async ({ page }) => {
  await focusGameCanvas(page)
  await movePlayerDirection(page, 'right', 1000)
  
  const tiles = await getExploredTiles(page)
  expect(tiles.length).toBeGreaterThan(0)
})
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run game tests only
```bash
npm test -- game-
```

### Run specific test file
```bash
npm test -- game-interactions.spec.js
```

### Run specific test suite
```bash
npm test -- --grep "Player Movement"
```

### Debug mode (opens UI)
```bash
npm test -- --ui
```

### Headed mode (see browser)
```bash
npm test -- --headed
```

### Watch mode (re-run on changes)
```bash
npm test -- --watch
```

## Structure

```
tests/
├── game-interactions.spec.js      # Unit tests for game mechanics
├── game-scenarios.spec.js          # Integration tests for complex flows
├── game-test-helpers.js            # Reusable helper functions
├── README.md                        # Comprehensive test documentation
├── (existing app tests...)
└── mapBackup.spec.js
```

## Writing New Game Tests

### 1. **Create test file** (or add to existing)
```javascript
import { test, expect } from '@playwright/test'
import { 
  waitForGameReady, 
  getPlayerPos, 
  movePlayerDirection,
  focusGameCanvas 
} from './game-test-helpers.js'
```

### 2. **Set up test**
```javascript
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173')
  await page.waitForLoadState('networkidle')
  await waitForGameReady(page)
})
```

### 3. **Write test**
```javascript
test('should do something', async ({ page }) => {
  await focusGameCanvas(page)
  
  // Arrange - set up initial state
  const startPos = await getPlayerPos(page)
  
  // Act - perform action
  await movePlayerDirection(page, 'right', 500)
  
  // Assert - verify result
  const endPos = await getPlayerPos(page)
  expect(endPos.x).toBeGreaterThan(startPos.x)
})
```

### 4. **Add to admin menu** (optional)
Update `src/components/HUD/AdminMenu.jsx` TESTS list to include new test file.

## Next Steps for Enhancement

### Possible additions:
1. **Interaction tests** - Test mirror interactions, NPC dialogs
2. **Door/collision tests** - Verify door mechanics, wall collisions
3. **Combat tests** - Test enemy encounters (if added)
4. **Animation tests** - Verify character animations
5. **Save/load tests** - Test persistence across sessions
6. **Performance tests** - Track rendering performance

### Suggested improvements:
1. Create game action helpers (interact, open mirror, etc.)
2. Add scenario replaying (like playback engine)
3. Visual regression testing for rendered scenes
4. Performance benchmarking
5. Automated test data generation

## Files Modified

### New Files
- `tests/game-interactions.spec.js` - Unit tests for game mechanics
- `tests/game-scenarios.spec.js` - Integration tests
- `tests/game-test-helpers.js` - Helper functions
- `tests/README.md` - Comprehensive test documentation
- `GAME_TESTS_SETUP.md` - This file

### Modified Files
- `src/components/App.jsx` - Added window API exposure for tests
- `src/components/HUD/AdminMenu.jsx` - Organized tests by category
- `src/components/HUD/AdminMenu.scss` - Added category styling

## Benefits

✅ **Unit Testing** - Test individual game mechanics in isolation
✅ **Integration Testing** - Test complex multi-step scenarios
✅ **Playground** - Run and debug tests from admin menu
✅ **Documentation** - Tests serve as usage examples
✅ **Regression Detection** - Catch unintended changes
✅ **Confidence** - Know your game works as expected

## Notes

- Tests run in headless Chrome by default
- Game canvas requires focus for keyboard input
- Position changes take time - be generous with durations
- Use helpers to avoid duplicating setup code
- Tests clean up localStorage to ensure isolation
- All tests use the live game (no mocking)

## Troubleshooting

### Tests timing out
- Increase movement duration: `movePlayerDirection(page, 'right', 2000)`
- Add explicit waits: `await page.waitForTimeout(500)`

### Position not changing
- Ensure canvas is focused: `await focusGameCanvas(page)`
- Check collision detection isn't blocking movement

### Element not found
- Verify selector matches actual HTML structure
- Use browser dev tools to inspect elements

### Game reference is undefined
- Ensure `waitForGameReady(page)` is called
- Check browser console for errors
