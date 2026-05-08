# In-Game Test Runner

Run game tests directly within the game without leaving the application.

## Accessing the Test Runner

1. Open the game (`npm run dev`)
2. Click the **⚙ Admin Menu** button (bottom right)
3. Click **🎮 Game Test Runner** button
4. The test panel will appear in the bottom right corner

## Test Categories

### Unit Tests
Quick tests of individual mechanics:
- Player position validation
- World structure verification
- Collision system checks
- Component initialization

**Typical run time:** 1-2 seconds

```
✓ Player starts at valid position
✓ Player position is within bounds
✓ Player has valid facing direction
✓ Player velocity is initialized
✓ World has required properties
... (9 total)
```

### Integration Tests
Tests that involve actual gameplay:
- Getting player position
- Movement input handling
- Navigation around world
- Boundary checking
- Interaction system readiness

**Typical run time:** 5-10 seconds

Tests move the player in all directions and verify responses.

### Combined Tests
Complex multi-step scenarios:
- Complete exploration sequences
- Room navigation
- Multi-directional movement chains

**Typical run time:** 20-30 seconds

These test realistic gameplay patterns combining multiple mechanics.

## Test Results

Each test shows:
- **Status icon:**
  - ✓ Passed
  - ✗ Failed
  - ⏳ Running
- **Test name** - What is being tested
- **Duration** - How long the test took in milliseconds
- **Error message** - What went wrong (if failed)

**Color coding:**
- 🟢 Green - Test passed
- 🔴 Red - Test failed
- 🟡 Yellow - Test running

## Reading Results

At the top of the panel:
- **"4 / 5 passed"** - Ratio of passed to total tests
- **Duration** - Total time for all tests combined

### Example Output
```
Game Tests
▶ Run unit tests

4 / 5 passed
0.52s

✓ Player starts at valid position     45ms
✓ World has required properties       23ms
✗ Mirrors are separated by 50px       12ms
  Mirrors are separated by > 50 pixels: expected 45, got 200
✓ Collision map exists                34ms
✓ Rooms are properly defined          28ms
```

## When to Use Each

### Unit Tests
- **During development** - Test new mechanics quickly
- **Before committing** - Verify nothing broke
- **Debugging** - Isolate which system has the issue

### Integration Tests
- **After implementing features** - Verify they work in context
- **Testing gameplay** - Ensure features interact correctly
- **Stress testing** - Move player extensively

### Combined Tests
- **Full QA** - Comprehensive gameplay verification
- **Before release** - Make sure everything works together
- **Regression testing** - Catch unexpected changes

## Example Workflow

1. **Implement new feature** (e.g., new room)
2. **Run unit tests** - Verify basic structure (30 seconds)
   - If world has required properties, basic structure is OK
3. **Run integration tests** - Verify gameplay (2 minutes)
   - If navigation works, player can move through new room
4. **Run combined tests** - Full scenario (3 minutes)
   - If exploration sequence works, everything integrates
5. **Commit** - Confident change works

## Writing New Tests

Tests are defined in `src/game/test/TestRunner.js`:

```javascript
await runner.run('Test name', () => {
  runner.assert(condition, 'error message')
})
```

### Available Assertions

```javascript
// Basic assertion
runner.assert(player.x > 0, 'Player x is positive')

// Equality
runner.assertEqual(facing, 'down', 'Player faces down')

// Greater than
runner.assertGreater(pos.x, 100, 'Player moved right')

// Less than
runner.assertLess(pos.x, 500, 'Player is in bounds')
```

### Example Test

```javascript
await runner.run('Can navigate between rooms', async () => {
  const start = getPlayerPos()
  
  // Move right to next room
  await movePlayer('right', 5000)
  const end = getPlayerPos()
  
  // Verify significant movement
  runner.assertGreater(
    Math.abs(end.x - start.x),
    500,
    'Moved across room boundary'
  )
})
```

## Troubleshooting

### Test runs forever
- Some tests involve movement timing - give them time
- Check the duration counter in top right
- If > 2 minutes for unit tests, something may be stuck

### All tests fail
- Check browser console for errors (F12)
- Make sure game loaded properly
- Try refreshing the page

### Movement tests don't work
- Movement requires keyboard events being processed by the game
- Game loop must be running (not paused)
- Make sure game canvas is in focus

### Tests show wrong results
- Run again - sometimes timing varies
- Check if anything else is running (recording, etc.)
- Verify game state (player position, collisions work)

## Tips

- **Run unit tests first** - Fast feedback on basic health
- **Run during development** - Quick regression check
- **Run after big changes** - Catch integration issues early
- **Combine with play-testing** - Tests + manual play = confidence
- **Check error messages** - They tell you exactly what failed

## Next Steps

Consider adding tests for:
- Mirror interactions
- NPC dialogue
- Combat mechanics (when added)
- Save/load persistence
- Animation sequences
- Performance metrics

## Files

- `src/game/test/TestRunner.js` - Test framework and test definitions
- `src/components/DebugButton/GameTestPanel.jsx` - Test UI component
- `src/components/DebugButton/GameTestPanel.scss` - Test UI styling
- `src/components/HUD/AdminMenu.jsx` - Menu with test runner button

## Performance

Test execution times (approximate):
- Unit tests: 1-3 seconds
- Integration tests: 5-15 seconds  
- Combined tests: 20-40 seconds
- All tests: < 1 minute

Fast enough for development workflow - can run multiple times per minute.
