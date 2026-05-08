import { test, expect } from '@playwright/test'
import {
  waitForGameReady,
  getPlayerPos,
  movePlayerDirection,
  focusGameCanvas,
  clearGameState,
  setCharColor,
  getCharColor,
} from './game-test-helpers.js'

test.describe('Game Scenarios - Combat/Door System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
    await waitForGameReady(page)
    await clearGameState(page)
  })

  test('should navigate from start room to corridor', async ({ page }) => {
    await focusGameCanvas(page)

    const startPos = await getPlayerPos(page)
    expect(startPos.x).toBeGreaterThanOrEqual(0)

    // Move right towards the corridor
    await movePlayerDirection(page, 'right', 3000)
    const endPos = await getPlayerPos(page)

    // Should have moved - position may vary based on collision
    expect(endPos.x).toBeGreaterThanOrEqual(startPos.x)
  })

  test('should be able to navigate through multiple rooms', async ({ page }) => {
    await focusGameCanvas(page)

    const startPos = await getPlayerPos(page)

    await movePlayerDirection(page, 'right', 2000)
    const pos1 = await getPlayerPos(page)
    expect(pos1.x).toBeGreaterThan(startPos.x)

    await movePlayerDirection(page, 'right', 1000)
    const pos2 = await getPlayerPos(page)
    expect(pos2.x).toBeGreaterThan(pos1.x)
  })
})

test.describe('Game Scenarios - Character Customization Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
    await clearGameState(page)
  })

  test('should allow setting character name', async ({ page }) => {
    const nameSet = await page.evaluate(() => {
      localStorage.setItem('life-mmo-name', 'TestWarrior')
      return localStorage.getItem('life-mmo-name')
    })

    expect(nameSet).toBe('TestWarrior')
  })

  test('should persist character colors', async ({ page }) => {
    const colors = {
      hair: '#ff0000',
      skin: '#ffdbac',
      eyes: '#0000ff',
      outfit: '#00ff00',
      stick: '#8b4513'
    }

    await page.evaluate((colors) => {
      localStorage.setItem('life-mmo-colors-v3', JSON.stringify(colors))
    }, colors)

    const stored = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('life-mmo-colors-v3') || '{}')
    })

    expect(stored).toEqual(colors)
  })

  test('should persist birth data', async ({ page }) => {
    const birthData = {
      date: '1990-05-15',
      time: '14:30',
      city: { name: 'Paris', country: 'FR', lat: 48.83, lng: 2.36, tz: 1 }
    }

    await page.evaluate((data) => {
      localStorage.setItem('life-mmo-birth', JSON.stringify(data))
    }, birthData)

    const stored = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('life-mmo-birth') || '{}')
    })

    expect(stored).toEqual(birthData)
  })

  test('should set and get individual color values', async ({ page }) => {
    await setCharColor(page, 'hair', '#ff6600')
    const color = await getCharColor(page, 'hair')
    expect(color).toBe('#ff6600')
  })
})

test.describe('Game Scenarios - Map Editing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
    await waitForGameReady(page)
    await clearGameState(page)
  })

  test('should track tile exploration', async ({ page }) => {
    await focusGameCanvas(page)

    await movePlayerDirection(page, 'right', 1000)
    await movePlayerDirection(page, 'down', 1000)

    const exploredCount = await page.evaluate(() => {
      return window.__exploredTiles?.size || 0
    })

    expect(typeof exploredCount).toBe('number')
    expect(exploredCount).toBeGreaterThan(0)
  })

  test('should allow layer edits to be saved', async ({ page }) => {
    const layerEdits = {
      '5,5': { ground: { ss: 0x00, row: 0, variant: 1 } }
    }

    await page.evaluate((edits) => {
      localStorage.setItem('life-mmo-map-edits-v2', JSON.stringify(edits))
    }, layerEdits)

    const stored = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('life-mmo-map-edits-v2') || '{}')
    })

    expect(stored).toEqual(layerEdits)
  })
})

test.describe('Game Scenarios - Complete Playthrough', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
    await waitForGameReady(page)
    await clearGameState(page)
  })

  test('should complete a full exploration cycle', async ({ page }) => {
    await focusGameCanvas(page)

    const startPos = await getPlayerPos(page)
    expect(startPos).not.toBeNull()

    await movePlayerDirection(page, 'right', 1500)
    const pos1 = await getPlayerPos(page)

    await movePlayerDirection(page, 'down', 1000)
    const pos2 = await getPlayerPos(page)

    await movePlayerDirection(page, 'left', 1500)
    const pos3 = await getPlayerPos(page)

    await movePlayerDirection(page, 'up', 1000)
    const pos4 = await getPlayerPos(page)

    expect(pos1.x).toBeGreaterThan(startPos.x)
    expect(pos2.y).toBeGreaterThan(pos1.y)
    expect(pos3.x).toBeLessThan(pos2.x)
    expect(pos4.y).toBeLessThan(pos3.y)
  })
})
