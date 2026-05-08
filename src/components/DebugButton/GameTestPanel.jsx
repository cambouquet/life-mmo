import { useState, useCallback, useRef, useEffect } from 'react'
import './GameTestPanel.scss'
import { TestRunner, runGameUnitTests, runGameIntegrationTests, runGameCombinedTests } from '../../game/test/TestRunner.js'

export default function GameTestPanel({ playerStateRef, worldDataRef, onMovePlayer, onInteract }) {
  const [activeTab, setActiveTab] = useState('unit')
  const [results, setResults] = useState(null)
  const [running, setRunning] = useState(false)
  const [testLog, setTestLog] = useState([])
  const runnerRef = useRef(null)

  const runTests = useCallback(async (category) => {
    setRunning(true)
    setResults(null)
    setTestLog([])

    const runner = new TestRunner({
      onProgress: (update) => {
        setTestLog(prev => [...prev, update.test])
      }
    })

    runnerRef.current = runner

    try {
      if (category === 'unit') {
        await runGameUnitTests(runner, playerStateRef.current, worldDataRef.current)
      } else if (category === 'integration') {
        const getPlayerPos = () => playerStateRef.current || { x: 0, y: 0 }
        const movePlayer = (direction, duration) => {
          return new Promise((resolve) => {
            const startTime = Date.now()
            const moveInterval = setInterval(() => {
              if (Date.now() - startTime >= duration) {
                clearInterval(moveInterval)
                resolve()
              } else {
                onMovePlayer?.(direction)
              }
            }, 50)
          })
        }
        await runGameIntegrationTests(runner, getPlayerPos, movePlayer)
      } else if (category === 'combined') {
        const getPlayerPos = () => playerStateRef.current || { x: 0, y: 0 }
        const movePlayer = (direction, duration) => {
          return new Promise((resolve) => {
            const startTime = Date.now()
            const moveInterval = setInterval(() => {
              if (Date.now() - startTime >= duration) {
                clearInterval(moveInterval)
                resolve()
              } else {
                onMovePlayer?.(direction)
              }
            }, 50)
          })
        }
        await runGameCombinedTests(runner, getPlayerPos, movePlayer, onInteract)
      }

      const finalResults = runner.getResults()
      setResults(finalResults)
      setTestLog(runner.results)
    } catch (error) {
      console.error('Test run failed:', error)
      setResults({
        tests: runner.results,
        passed: runner.results.filter(t => t.status === 'passed').length,
        failed: runner.results.filter(t => t.status === 'failed').length,
        total: runner.results.length,
        duration: 0,
        error: error.message
      })
      setTestLog(runner.results)
    } finally {
      setRunning(false)
    }
  }, [playerStateRef, worldDataRef, onMovePlayer, onInteract])

  return (
    <div className="game-test-panel">
      <div className="game-test-panel__header">
        <h3>Game Tests</h3>
        <div className="game-test-panel__tabs">
          <button
            className={`game-test-panel__tab ${activeTab === 'unit' ? 'active' : ''}`}
            onClick={() => setActiveTab('unit')}
            disabled={running}
          >
            Unit
          </button>
          <button
            className={`game-test-panel__tab ${activeTab === 'integration' ? 'active' : ''}`}
            onClick={() => setActiveTab('integration')}
            disabled={running}
          >
            Integration
          </button>
          <button
            className={`game-test-panel__tab ${activeTab === 'combined' ? 'active' : ''}`}
            onClick={() => setActiveTab('combined')}
            disabled={running}
          >
            Combined
          </button>
        </div>
      </div>

      <div className="game-test-panel__content">
        <button
          className="game-test-panel__run-button"
          onClick={() => runTests(activeTab)}
          disabled={running}
        >
          {running ? '⏳ Running...' : `▶ Run ${activeTab} tests`}
        </button>

        {results && (
          <div className="game-test-panel__summary">
            <div className={`game-test-panel__status ${results.failed === 0 ? 'passed' : 'failed'}`}>
              {results.passed} / {results.total} passed
            </div>
            <div className="game-test-panel__duration">
              {(results.duration / 1000).toFixed(2)}s
            </div>
          </div>
        )}

        <div className="game-test-panel__log">
          {testLog.map((test, i) => (
            <div
              key={i}
              className={`game-test-panel__test-item test-${test.status}`}
            >
              <div className="game-test-panel__test-name">
                {test.status === 'passed' ? '✓' : test.status === 'failed' ? '✗' : '⏳'} {test.name}
              </div>
              {test.error && (
                <div className="game-test-panel__test-error">{test.error}</div>
              )}
              <div className="game-test-panel__test-duration">
                {(test.duration).toFixed(0)}ms
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
