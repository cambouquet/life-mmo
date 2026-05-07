import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import App from '../components/App.jsx'

describe('Layout - Right side elements visibility', () => {
  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    })
  })

  it('record button should be visible and within viewport', () => {
    render(<App />)
    const recordWrap = document.querySelector('.record-wrap-with-tools')

    expect(recordWrap).toBeInTheDocument()

    const rect = recordWrap.getBoundingClientRect()
    expect(rect.right).toBeLessThanOrEqual(window.innerWidth)
    expect(rect.left).toBeGreaterThanOrEqual(0)
    expect(rect.right).toBeGreaterThan(0)
  })

  it('menu bar should be visible and within viewport', () => {
    render(<App />)
    const menuBar = document.querySelector('.menu-bar')

    expect(menuBar).toBeInTheDocument()

    const rect = menuBar.getBoundingClientRect()
    expect(rect.right).toBeLessThanOrEqual(window.innerWidth)
    expect(rect.left).toBeGreaterThanOrEqual(0)
    expect(rect.right).toBeGreaterThan(0)
  })

  it('HUD should not exceed viewport width', () => {
    render(<App />)
    const hud = document.querySelector('.hud')

    expect(hud).toBeInTheDocument()

    const rect = hud.getBoundingClientRect()
    expect(rect.width).toBeLessThanOrEqual(window.innerWidth)
  })

  it('game-wrap should not exceed viewport', () => {
    render(<App />)
    const gameWrap = document.querySelector('.game-wrap')

    expect(gameWrap).toBeInTheDocument()

    const rect = gameWrap.getBoundingClientRect()
    expect(rect.width).toBeLessThanOrEqual(window.innerWidth)
  })

  it('no horizontal scrollbar should be visible', () => {
    render(<App />)

    const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth
    expect(hasHorizontalScroll).toBe(false)
  })
})
