# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: game-scenarios.spec.js >> Game Scenarios - Combat/Door System >> should navigate from start room to corridor
- Location: tests\game-scenarios.spec.js:20:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 219
Received:   125.66679999999997
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
    - generic [ref=e41]: 07:05:35
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
  1   | import { test, expect } from '@playwright/test'
  2   | import {
  3   |   waitForGameReady,
  4   |   getPlayerPos,
  5   |   movePlayerDirection,
  6   |   focusGameCanvas,
  7   |   clearGameState,
  8   |   setCharColor,
  9   |   getCharColor,
  10  | } from './game-test-helpers.js'
  11  | 
  12  | test.describe('Game Scenarios - Combat/Door System', () => {
  13  |   test.beforeEach(async ({ page }) => {
  14  |     await page.goto('http://localhost:5173')
  15  |     await page.waitForLoadState('networkidle')
  16  |     await waitForGameReady(page)
  17  |     await clearGameState(page)
  18  |   })
  19  | 
  20  |   test('should navigate from start room to corridor', async ({ page }) => {
  21  |     await focusGameCanvas(page)
  22  | 
  23  |     const startPos = await getPlayerPos(page)
  24  |     await movePlayerDirection(page, 'right', 2000)
  25  |     const endPos = await getPlayerPos(page)
  26  | 
> 27  |     expect(endPos.x).toBeGreaterThan(startPos.x + 100)
      |                      ^ Error: expect(received).toBeGreaterThan(expected)
  28  |   })
  29  | 
  30  |   test('should be able to navigate through multiple rooms', async ({ page }) => {
  31  |     await focusGameCanvas(page)
  32  | 
  33  |     const startPos = await getPlayerPos(page)
  34  | 
  35  |     await movePlayerDirection(page, 'right', 2000)
  36  |     const pos1 = await getPlayerPos(page)
  37  |     expect(pos1.x).toBeGreaterThan(startPos.x)
  38  | 
  39  |     await movePlayerDirection(page, 'right', 1000)
  40  |     const pos2 = await getPlayerPos(page)
  41  |     expect(pos2.x).toBeGreaterThan(pos1.x)
  42  |   })
  43  | })
  44  | 
  45  | test.describe('Game Scenarios - Character Customization Flow', () => {
  46  |   test.beforeEach(async ({ page }) => {
  47  |     await page.goto('http://localhost:5173')
  48  |     await page.waitForLoadState('networkidle')
  49  |     await clearGameState(page)
  50  |   })
  51  | 
  52  |   test('should allow setting character name', async ({ page }) => {
  53  |     const nameSet = await page.evaluate(() => {
  54  |       localStorage.setItem('life-mmo-name', 'TestWarrior')
  55  |       return localStorage.getItem('life-mmo-name')
  56  |     })
  57  | 
  58  |     expect(nameSet).toBe('TestWarrior')
  59  |   })
  60  | 
  61  |   test('should persist character colors', async ({ page }) => {
  62  |     const colors = {
  63  |       hair: '#ff0000',
  64  |       skin: '#ffdbac',
  65  |       eyes: '#0000ff',
  66  |       outfit: '#00ff00',
  67  |       stick: '#8b4513'
  68  |     }
  69  | 
  70  |     await page.evaluate((colors) => {
  71  |       localStorage.setItem('life-mmo-colors-v3', JSON.stringify(colors))
  72  |     }, colors)
  73  | 
  74  |     const stored = await page.evaluate(() => {
  75  |       return JSON.parse(localStorage.getItem('life-mmo-colors-v3') || '{}')
  76  |     })
  77  | 
  78  |     expect(stored).toEqual(colors)
  79  |   })
  80  | 
  81  |   test('should persist birth data', async ({ page }) => {
  82  |     const birthData = {
  83  |       date: '1990-05-15',
  84  |       time: '14:30',
  85  |       city: { name: 'Paris', country: 'FR', lat: 48.83, lng: 2.36, tz: 1 }
  86  |     }
  87  | 
  88  |     await page.evaluate((data) => {
  89  |       localStorage.setItem('life-mmo-birth', JSON.stringify(data))
  90  |     }, birthData)
  91  | 
  92  |     const stored = await page.evaluate(() => {
  93  |       return JSON.parse(localStorage.getItem('life-mmo-birth') || '{}')
  94  |     })
  95  | 
  96  |     expect(stored).toEqual(birthData)
  97  |   })
  98  | 
  99  |   test('should set and get individual color values', async ({ page }) => {
  100 |     await setCharColor(page, 'hair', '#ff6600')
  101 |     const color = await getCharColor(page, 'hair')
  102 |     expect(color).toBe('#ff6600')
  103 |   })
  104 | })
  105 | 
  106 | test.describe('Game Scenarios - Map Editing', () => {
  107 |   test.beforeEach(async ({ page }) => {
  108 |     await page.goto('http://localhost:5173')
  109 |     await page.waitForLoadState('networkidle')
  110 |     await waitForGameReady(page)
  111 |     await clearGameState(page)
  112 |   })
  113 | 
  114 |   test('should track tile exploration', async ({ page }) => {
  115 |     await focusGameCanvas(page)
  116 | 
  117 |     await movePlayerDirection(page, 'right', 1000)
  118 |     await movePlayerDirection(page, 'down', 1000)
  119 | 
  120 |     const exploredCount = await page.evaluate(() => {
  121 |       return window.__exploredTiles?.size || 0
  122 |     })
  123 | 
  124 |     expect(typeof exploredCount).toBe('number')
  125 |     expect(exploredCount).toBeGreaterThan(0)
  126 |   })
  127 | 
```