import { useState } from 'react'
import './AdminMenu.scss'

const TESTS = [
  { name: 'layout.spec.js', category: 'app' },
  { name: 'layout-small.spec.js', category: 'app' },
  { name: 'layout-vscode.spec.js', category: 'app' },
  { name: 'layout-mobile.spec.js', category: 'app' },
  { name: 'layout-debug.spec.js', category: 'app' },
  { name: 'sprite-picker-no-scroll.spec.js', category: 'app' },
  { name: 'document-scroll-test.spec.js', category: 'app' },
  { name: 'vscode-preview-sizes.spec.js', category: 'app' },
  { name: 'find-overflow.spec.js', category: 'app' },
  { name: 'find-overflow-detailed.spec.js', category: 'app' },
  { name: 'find-overflow-320.spec.js', category: 'app' },
  { name: 'mapBackup.spec.js', category: 'app' },
  { name: 'mapBackupRestore.spec.js', category: 'app' },
  { name: 'game-interactions.spec.js', category: 'game' },
  { name: 'game-scenarios.spec.js', category: 'game' },
]

export default function AdminMenu() {
  const [open, setOpen] = useState(false)
  const [selectedTest, setSelectedTest] = useState(null)
  const [running, setRunning] = useState(false)

  const runTest = async (testName) => {
    setRunning(true)
    try {
      // Open test in new window/tab
      window.open(`http://localhost:5173?test=${testName}`, '_blank')
      alert(`To see ${testName} results, run in terminal:\nnpm test -- ${testName}`)
    } finally {
      setRunning(false)
    }
  }

  // Group tests by category
  const gameTests = TESTS.filter(t => t.category === 'game')
  const appTests = TESTS.filter(t => t.category === 'app')

  return (
    <div className="admin-menu">
      <button
        className="admin-menu__toggle"
        onClick={() => setOpen(!open)}
        title="Admin Tests"
      >
        ⚙
      </button>

      {open && (
        <div className="admin-menu__panel">
          <div className="admin-menu__header">Unit Tests</div>

          {gameTests.length > 0 && (
            <>
              <div className="admin-menu__category">Game Tests</div>
              {gameTests.map(test => (
                <button
                  key={test.name}
                  className="admin-menu__item"
                  onClick={() => runTest(test.name)}
                  disabled={running}
                  title={`Run ${test.name}`}
                >
                  {test.name.replace('.spec.js', '')}
                </button>
              ))}
            </>
          )}

          {appTests.length > 0 && (
            <>
              <div className="admin-menu__category">App Tests</div>
              {appTests.map(test => (
                <button
                  key={test.name}
                  className="admin-menu__item"
                  onClick={() => runTest(test.name)}
                  disabled={running}
                  title={`Run ${test.name}`}
                >
                  {test.name.replace('.spec.js', '')}
                </button>
              ))}
            </>
          )}

          <div className="admin-menu__footer">
            Run tests in terminal:<br/>
            <code>npm test</code><br/>
            Or run all: <code>npm test</code>
          </div>
        </div>
      )}
    </div>
  )
}
