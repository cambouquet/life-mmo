# Test Suite Overview

## Current Tests

Kept only the essential, meaningful tests. Removed debug/logging-only tests.

### Layout Tests (5 tests)
Validate UI rendering and responsiveness across different viewports.

| Test | Purpose |
|------|---------|
| `layout.spec.js` | Main layout - element visibility, positioning, viewport fitting |
| `layout-small.spec.js` | Small viewport (800px) - responsive layout |
| `layout-vscode.spec.js` | VS Code preview size - extension compatibility |
| `layout-mobile.spec.js` | Mobile viewport (375px) - mobile responsiveness |
| `layout-debug.spec.js` | Debug mode layout - debug panel integration |

**Run all layout tests:**
```bash
npm test -- layout
```

### Feature Tests (2 tests)
Test critical game features.

| Test | Purpose |
|------|---------|
| `mapBackup.spec.js` | Map backup functionality - save state to localStorage |
| `mapBackupRestore.spec.js` | Map restore functionality - load saved state |

**Run all feature tests:**
```bash
npm test -- map
```

## Removed Tests

Deleted tests that were:
- ❌ Debug/logging only (no assertions)
- ❌ Redundant with other tests
- ❌ Too specific/fragile

**Removed:**
- `find-overflow.spec.js` - Just logged overflowing elements
- `find-overflow-detailed.spec.js` - Redundant detail version
- `find-overflow-320.spec.js` - Same at 320px (redundant)
- `document-scroll-test.spec.js` - Redundant with layout tests
- `hud-widths.spec.js` - Just logged widths, no validation
- `vscode-preview-sizes.spec.js` - Redundant with layout-vscode test
- `sprite-picker-no-scroll.spec.js` - Too specific, fragile selector

## Running Tests

```bash
# Run all tests
npm test

# Run specific suite
npm test -- layout           # All layout tests
npm test -- map             # All map/backup tests

# Run specific test file
npm test -- layout.spec.js

# Run with UI
npm test -- --ui

# Run headed (see browser)
npm test -- --headed

# Watch mode
npm test -- --watch
```

## Test Categories

### Essentials (7 tests total)
- **Layout validation** - Ensure UI works across viewports
- **Feature functionality** - Ensure critical features work

### How to Add More Tests

1. Create file in `tests/` directory
2. Name it `feature-name.spec.js`
3. Use Playwright syntax with meaningful assertions
4. Add to AdminMenu if it should appear in test list

Example:
```javascript
import { test, expect } from '@playwright/test'

test('should do important thing', async ({ page }) => {
  await page.goto('http://localhost:5173')
  const element = await page.locator('.important')
  await expect(element).toBeVisible()
})
```

## Philosophy

- **Keep only what matters** - Essential features and layouts
- **Real assertions** - Not just logging/debugging
- **Fast feedback** - All tests run in < 30 seconds
- **Maintainable** - Not fragile to minor DOM changes

## CI/CD Integration

These tests are designed to run in CI pipelines:
```bash
# In your CI workflow
npm run build
npm test
```

All tests must pass before merging to main.
