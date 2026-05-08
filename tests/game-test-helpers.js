// Game testing helpers for Playwright tests
// Provides utility functions for testing game interactions

export async function waitForGameReady(page, timeout = 5000) {
  return page.waitForFunction(
    () => window.__gameRef !== undefined,
    { timeout }
  )
}

export async function getPlayerPos(page) {
  return await page.evaluate(() => {
    return window.__gameRef?.playerPos?.() || { x: 0, y: 0 }
  })
}

export async function getExploredTiles(page) {
  return await page.evaluate(() => {
    return Array.from(window.__exploredTiles || new Set())
  })
}

export async function movePlayerDirection(page, direction, durationMs = 500) {
  const keyMap = {
    up: 'KeyW',
    down: 'KeyS',
    left: 'KeyA',
    right: 'KeyD'
  }

  const key = keyMap[direction]
  if (!key) throw new Error(`Invalid direction: ${direction}`)

  const startTime = Date.now()
  while (Date.now() - startTime < durationMs) {
    await page.keyboard.press(key)
    await page.waitForTimeout(50)
  }
}

export async function movePlayerTo(page, targetX, targetY, speed = 10) {
  const startPos = await getPlayerPos(page)
  const dx = targetX - startPos.x
  const dy = targetY - startPos.y

  if (dx > 0) {
    await movePlayerDirection(page, 'right', Math.abs(dx) * speed)
  } else if (dx < 0) {
    await movePlayerDirection(page, 'left', Math.abs(dx) * speed)
  }

  if (dy > 0) {
    await movePlayerDirection(page, 'down', Math.abs(dy) * speed)
  } else if (dy < 0) {
    await movePlayerDirection(page, 'up', Math.abs(dy) * speed)
  }
}

export async function waitForPositionChange(page, timeout = 5000) {
  const startPos = await getPlayerPos(page)
  return page.waitForFunction(
    (start) => {
      const current = window.__gameRef?.playerPos?.() || { x: 0, y: 0 }
      return current.x !== start.x || current.y !== start.y
    },
    startPos,
    { timeout }
  )
}

export async function getCharColor(page, colorKey) {
  return await page.evaluate((key) => {
    try {
      const colors = JSON.parse(localStorage.getItem('life-mmo-colors-v3') || '{}')
      return colors[key]
    } catch {
      return null
    }
  }, colorKey)
}

export async function setCharColor(page, colorKey, colorValue) {
  return await page.evaluate(
    ([key, value]) => {
      try {
        const colors = JSON.parse(localStorage.getItem('life-mmo-colors-v3') || '{}')
        colors[key] = value
        localStorage.setItem('life-mmo-colors-v3', JSON.stringify(colors))
        return true
      } catch {
        return false
      }
    },
    [colorKey, colorValue]
  )
}

export async function clearGameState(page) {
  return await page.evaluate(() => {
    localStorage.removeItem('life-mmo-colors-v3')
    localStorage.removeItem('life-mmo-birth')
    localStorage.removeItem('life-mmo-name')
    localStorage.removeItem('life-mmo-map-edits-v2')
    localStorage.removeItem('life-mmo-sprite-colors-v2')
  })
}

export async function focusGameCanvas(page) {
  const canvas = await page.locator('.game-canvas')
  await canvas.click()
}

export async function distanceBetweenPos(pos1, pos2) {
  const dx = pos2.x - pos1.x
  const dy = pos2.y - pos1.y
  return Math.sqrt(dx * dx + dy * dy)
}
