# Testing Quick Start

Want to test your game? You have two approaches:

## 🎮 In-Game Test Runner (Interactive)

**Best for:** Development, quick feedback, visual testing

Run tests while playing:
1. Click ⚙ (Admin Menu) - bottom right
2. Click 🎮 Game Test Runner
3. Choose Unit / Integration / Combined
4. Click "▶ Run [category] tests"
5. Watch results appear in real-time

**No terminal needed.** Everything in the game.

[See detailed guide →](INGAME_TEST_RUNNER.md)

### Example

```
🎮 Game Test Runner
▶ Run unit tests

✓ Player starts at valid position      45ms
✓ World has required properties        23ms
✓ Collision map exists                 34ms
✓ Player position is within bounds     28ms
...

4 / 5 passed  0.52s
```

---

## 🖥️ Playwright Tests (Automated)

**Best for:** CI/CD, regression testing, automated validation

Run from terminal:
```bash
npm test                              # Run all tests
npm test -- game-                     # Run only game tests
npm test -- game-interactions         # Specific file
npm test -- --grep "movement"         # Specific test
npm test -- --ui                      # Visual debugger
```

[See detailed guide →](tests/README.md)

---

## When to Use Each

### Use In-Game Test Runner When...
- ✅ Developing a new feature
- ✅ Quick sanity check (< 1 min)
- ✅ Debugging a specific issue
- ✅ Testing interaction flows
- ✅ Visual verification needed

### Use Playwright Tests When...
- ✅ Running automated checks
- ✅ CI/CD pipeline
- ✅ Full regression suite
- ✅ Batch testing multiple commits
- ✅ Performance benchmarking

---

## Test Structure

### Unit Tests (Quick - 1-3s)
Individual mechanics in isolation:
- Player initialization
- World structure
- Collision detection
- Component validation

### Integration Tests (Medium - 5-15s)
Gameplay mechanics combined:
- Player movement
- Navigation
- Boundary detection
- State updates

### Combined Tests (Full - 20-40s)
Realistic gameplay scenarios:
- Multi-room exploration
- Complex movement sequences
- State persistence

---

## Writing Tests

### In-Game Tests

File: `src/game/test/TestRunner.js`

```javascript
await runner.run('Player can move right', async () => {
  const start = getPlayerPos()
  await movePlayer('right', 1000)
  const end = getPlayerPos()
  
  runner.assertGreater(end.x, start.x, 'Moved right')
})
```

### Playwright Tests

File: `tests/game-interactions.spec.js`

```javascript
test('player should move right', async ({ page }) => {
  await focusGameCanvas(page)
  const start = await getPlayerPos(page)
  
  await movePlayerDirection(page, 'right', 500)
  const end = await getPlayerPos(page)
  
  expect(end.x).toBeGreaterThan(start.x)
})
```

---

## Test Results

### ✅ All Pass
Great! Your game is working correctly.

### ❌ Some Fail
1. Read the error message
2. Check what the test expects
3. Verify game behavior
4. Fix the issue or the test
5. Re-run

Example error:
```
✗ Mirrors are separated by 50px
  Expected 45 to be > 50
```

This means mirror distance is 45px but test expects > 50px.

---

## Common Test Scenarios

### "Did I break something?"
Run unit tests: `npm test -- game-interactions`

### "Does my new feature work?"
Use in-game test runner, run each category.

### "Is everything integrated?"
Run combined tests: full exploration scenario.

### "Before I commit?"
Quick unit tests (30 sec), then integrate with full suite.

---

## Files

| File | Purpose |
|------|---------|
| `src/game/test/TestRunner.js` | Test framework & test definitions |
| `src/components/DebugButton/GameTestPanel.jsx` | In-game test UI |
| `tests/game-interactions.spec.js` | Playwright unit tests |
| `tests/game-scenarios.spec.js` | Playwright integration tests |
| `tests/game-test-helpers.js` | Playwright test utilities |

---

## Debug Tips

### Test runs but shows wrong results
- Run again (timing can vary)
- Check game is fully loaded
- Verify game isn't paused

### In-game test panel doesn't appear
- Click ⚙ Admin Menu button
- Make sure you're in debug mode
- Check browser console (F12) for errors

### Terminal tests fail
- Make sure dev server running: `npm run dev`
- Check port 5173 is available
- Try: `npm test -- --headed` to see browser

### Want to debug a specific test
- Playwright: `npm test -- --debug`
- In-game: Check error message in panel, look at test code

---

## Next Steps

1. **Try in-game runner** - Click ⚙, then 🎮
2. **Run unit tests** - Takes ~1 second
3. **Watch results** - See what passes/fails
4. **Write new tests** - As you add features
5. **Keep testing** - Before every commit

---

## Getting Help

- **In-game tests:** See [INGAME_TEST_RUNNER.md](INGAME_TEST_RUNNER.md)
- **Playwright tests:** See [tests/README.md](tests/README.md)
- **Testing approach:** See [TESTING_APPROACH.md](TESTING_APPROACH.md)
- **Setup details:** See [GAME_TESTS_SETUP.md](GAME_TESTS_SETUP.md)

---

## TL;DR

Want quick test feedback **while developing**?
```
Click ⚙ → 🎮 → Pick category → ▶ Run
```

Want automated testing **in CI/CD**?
```
npm test
```

Want to **write your own test**?
- In-game: Edit `src/game/test/TestRunner.js`
- Playwright: Create file in `tests/`

Happy testing! 🎮
