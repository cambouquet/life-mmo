import { useState } from 'react'
import './AdminMenu.scss'

const TESTS = [
  'layout.spec.js',
  'layout-small.spec.js',
  'layout-vscode.spec.js',
  'layout-mobile.spec.js',
  'layout-debug.spec.js',
  'sprite-picker-no-scroll.spec.js',
  'document-scroll-test.spec.js',
  'vscode-preview-sizes.spec.js',
  'find-overflow.spec.js',
  'find-overflow-detailed.spec.js',
  'find-overflow-320.spec.js',
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
          <div className="admin-menu__header">Tests</div>

          {TESTS.map(test => (
            <button
              key={test}
              className="admin-menu__item"
              onClick={() => runTest(test)}
              disabled={running}
              title={`Run ${test}`}
            >
              {test.replace('.spec.js', '')}
            </button>
          ))}

          <div className="admin-menu__footer">
            Run tests in terminal:<br/>
            <code>npm test</code>
          </div>
        </div>
      )}
    </div>
  )
}
