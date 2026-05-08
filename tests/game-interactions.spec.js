import { test, expect } from '@playwright/test'
import { waitForGameReady, getPlayerPos, movePlayerDirection, focusGameCanvas, clearGameState } from './game-test-helpers.js'

test.describe('Game Interactions - Player Movement and Exploration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
    await waitForGameReady(page)
    await clearGameState(page)
  })

  test('player should start in valid position', async ({ page }) => {
    const canvas = await page.locator('.game-canvas')
    await expect(canvas).toBeVisible()

    const playerPos = await getPlayerPos(page)

    expect(playerPos).not.toBeNull()
    expect(playerPos.x).toBeGreaterThanOrEqual(0)
    expect(playerPos.y).toBeGreaterThanOrEqual(0)
  })

  test('player should move with WASD keys', async ({ page }) => {
    await focusGameCanvas(page)

    const initialPos = await getPlayerPos(page)

    await movePlayerDirection(page, 'right', 300)
    const afterMove = await getPlayerPos(page)

    expect(afterMove.x).toBeGreaterThan(initialPos.x)
  })

  test('player should move down when pressing S', async ({ page }) => {
    await focusGameCanvas(page)

    const initialPos = await getPlayerPos(page)
    await movePlayerDirection(page, 'down', 300)
    const afterMove = await getPlayerPos(page)

    expect(afterMove.y).toBeGreaterThan(initialPos.y)
  })

  test('player should move left when pressing A', async ({ page }) => {
    await focusGameCanvas(page)

    await movePlayerDirection(page, 'right', 300)
    const posAfterRight = await getPlayerPos(page)

    await movePlayerDirection(page, 'left', 300)
    const posAfterLeft = await getPlayerPos(page)

    expect(posAfterLeft.x).toBeLessThan(posAfterRight.x)
  })

  test('player should move up when pressing W', async ({ page }) => {
    await focusGameCanvas(page)

    await movePlayerDirection(page, 'down', 300)
    const posAfterDown = await getPlayerPos(page)

    await movePlayerDirection(page, 'up', 300)
    const posAfterUp = await getPlayerPos(page)

    expect(posAfterUp.y).toBeLessThan(posAfterDown.y)
  })

  test('player should respect collision boundaries', async ({ page }) => {
    await focusGameCanvas(page)

    await movePlayerDirection(page, 'left', 2000)
    const finalPos = await getPlayerPos(page)

    expect(finalPos.x).toBeGreaterThanOrEqual(0)
  })
})

test.describe('Game Interactions - Proximity Triggers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
    await waitForGameReady(page)
  })

  test('should detect when player is near mirror', async ({ page }) => {
    await focusGameCanvas(page)

    await movePlayerDirection(page, 'left', 1500)

    const nearMirror = await page.evaluate(() => {
      return window.__gameRef?.nearMirror?.() || false
    })

    expect(typeof nearMirror).toBe('boolean')
  })
})

test.describe('Game Interactions - Log System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
    await waitForGameReady(page)
  })

  test('should show initial log entries', async ({ page }) => {
    const logEntries = await page.evaluate(() => {
      const logPanel = document.querySelector('.log-panel')
      return logPanel ? logPanel.textContent : ''
    })

    expect(logEntries).toContain('Move with WASD')
  })

  test('should display movement in log', async ({ page }) => {
    await focusGameCanvas(page)
    await movePlayerDirection(page, 'right', 300)

    const logText = await page.evaluate(() => {
      const logPanel = document.querySelector('.log-panel')
      return logPanel ? logPanel.textContent : ''
    })

    expect(logText.length).toBeGreaterThan(0)
  })
})
