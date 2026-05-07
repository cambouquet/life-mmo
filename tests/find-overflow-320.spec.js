import { test } from '@playwright/test'

test('find overflow at 320px width', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 600 })
  await page.goto('http://localhost:5173')
  await page.waitForLoadState('networkidle')

  const info = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth
    const docScrollWidth = document.documentElement.scrollWidth
    
    const elements = []
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect()
      if (rect.right > docWidth + 1) {
        elements.push({
          tag: el.tagName,
          class: el.className,
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          overflow: Math.round(rect.right - docWidth)
        })
      }
    })

    return {
      docWidth,
      docScrollWidth,
      overflowing: elements.slice(0, 30)
    }
  })

  console.log('320px info:', JSON.stringify(info, null, 2))
})
