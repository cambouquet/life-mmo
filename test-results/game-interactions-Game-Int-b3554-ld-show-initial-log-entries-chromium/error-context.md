# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: game-interactions.spec.js >> Game Interactions - Log System >> should show initial log entries
- Location: tests\game-interactions.spec.js:105:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "Move with WASD"
Received string:    ""
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - img [ref=e6]:
      - generic [ref=e7]: XII
      - generic [ref=e8]: I
      - generic [ref=e9]: II
      - generic [ref=e10]: III
      - generic [ref=e11]: IV
      - generic [ref=e12]: V
      - generic [ref=e13]: VI
      - generic [ref=e14]: VII
      - generic [ref=e15]: VIII
      - generic [ref=e16]: IX
      - generic [ref=e17]: X
      - generic [ref=e18]: XI
    - img [ref=e23]
  - generic [ref=e25]:
    - generic [ref=e27]:
      - img
      - generic [ref=e28]:
        - generic [ref=e29]: The
        - generic [ref=e30]: Life
        - generic [ref=e31]: Game
    - generic [ref=e34]:
      - generic [ref=e35]: "?"
      - generic [ref=e36]: Novice · Lv 1
    - generic [ref=e41]: 07:05:29
  - button "Toggle Debug Console" [ref=e44] [cursor=pointer]:
    - img [ref=e45]
  - generic [ref=e53]:
    - button "⚙" [ref=e55] [cursor=pointer]
    - generic [ref=e56]:
      - button "●" [ref=e57] [cursor=pointer]
      - button "⬡" [ref=e58] [cursor=pointer]
    - button "Toggle map edit mode" [ref=e59] [cursor=pointer]:
      - img [ref=e60]
```

# Test source

```ts
  11  | 
  12  |   test('player should start in valid position', async ({ page }) => {
  13  |     const canvas = await page.locator('.game-canvas')
  14  |     await expect(canvas).toBeVisible()
  15  | 
  16  |     const playerPos = await getPlayerPos(page)
  17  | 
  18  |     expect(playerPos).not.toBeNull()
  19  |     expect(playerPos.x).toBeGreaterThanOrEqual(0)
  20  |     expect(playerPos.y).toBeGreaterThanOrEqual(0)
  21  |   })
  22  | 
  23  |   test('player should move with WASD keys', async ({ page }) => {
  24  |     await focusGameCanvas(page)
  25  | 
  26  |     const initialPos = await getPlayerPos(page)
  27  | 
  28  |     await movePlayerDirection(page, 'right', 300)
  29  |     const afterMove = await getPlayerPos(page)
  30  | 
  31  |     expect(afterMove.x).toBeGreaterThan(initialPos.x)
  32  |   })
  33  | 
  34  |   test('player should move down when pressing S', async ({ page }) => {
  35  |     await focusGameCanvas(page)
  36  | 
  37  |     const initialPos = await getPlayerPos(page)
  38  |     await movePlayerDirection(page, 'down', 300)
  39  |     const afterMove = await getPlayerPos(page)
  40  | 
  41  |     expect(afterMove.y).toBeGreaterThan(initialPos.y)
  42  |   })
  43  | 
  44  |   test('player should move left when pressing A', async ({ page }) => {
  45  |     await focusGameCanvas(page)
  46  | 
  47  |     await movePlayerDirection(page, 'right', 300)
  48  |     const posAfterRight = await getPlayerPos(page)
  49  | 
  50  |     await movePlayerDirection(page, 'left', 300)
  51  |     const posAfterLeft = await getPlayerPos(page)
  52  | 
  53  |     expect(posAfterLeft.x).toBeLessThan(posAfterRight.x)
  54  |   })
  55  | 
  56  |   test('player should move up when pressing W', async ({ page }) => {
  57  |     await focusGameCanvas(page)
  58  | 
  59  |     await movePlayerDirection(page, 'down', 300)
  60  |     const posAfterDown = await getPlayerPos(page)
  61  | 
  62  |     await movePlayerDirection(page, 'up', 300)
  63  |     const posAfterUp = await getPlayerPos(page)
  64  | 
  65  |     expect(posAfterUp.y).toBeLessThan(posAfterDown.y)
  66  |   })
  67  | 
  68  |   test('player should respect collision boundaries', async ({ page }) => {
  69  |     await focusGameCanvas(page)
  70  | 
  71  |     await movePlayerDirection(page, 'left', 2000)
  72  |     const finalPos = await getPlayerPos(page)
  73  | 
  74  |     expect(finalPos.x).toBeGreaterThanOrEqual(0)
  75  |   })
  76  | })
  77  | 
  78  | test.describe('Game Interactions - Proximity Triggers', () => {
  79  |   test.beforeEach(async ({ page }) => {
  80  |     await page.goto('http://localhost:5173')
  81  |     await page.waitForLoadState('networkidle')
  82  |     await waitForGameReady(page)
  83  |   })
  84  | 
  85  |   test('should detect when player is near mirror', async ({ page }) => {
  86  |     await focusGameCanvas(page)
  87  | 
  88  |     await movePlayerDirection(page, 'left', 1500)
  89  | 
  90  |     const nearMirror = await page.evaluate(() => {
  91  |       return window.__gameRef?.nearMirror?.() || false
  92  |     })
  93  | 
  94  |     expect(typeof nearMirror).toBe('boolean')
  95  |   })
  96  | })
  97  | 
  98  | test.describe('Game Interactions - Log System', () => {
  99  |   test.beforeEach(async ({ page }) => {
  100 |     await page.goto('http://localhost:5173')
  101 |     await page.waitForLoadState('networkidle')
  102 |     await waitForGameReady(page)
  103 |   })
  104 | 
  105 |   test('should show initial log entries', async ({ page }) => {
  106 |     const logEntries = await page.evaluate(() => {
  107 |       const logElement = document.querySelector('.log-entry-list')
  108 |       return logElement ? logElement.textContent : ''
  109 |     })
  110 | 
> 111 |     expect(logEntries).toContain('Move with WASD')
      |                        ^ Error: expect(received).toContain(expected) // indexOf
  112 |   })
  113 | 
  114 |   test('should display movement in log', async ({ page }) => {
  115 |     await focusGameCanvas(page)
  116 |     await movePlayerDirection(page, 'right', 300)
  117 | 
  118 |     const logText = await page.evaluate(() => {
  119 |       const logElement = document.querySelector('.log-entry-list')
  120 |       return logElement ? logElement.textContent : ''
  121 |     })
  122 | 
  123 |     expect(logText.length).toBeGreaterThan(0)
  124 |   })
  125 | })
  126 | 
```