import React, { useRef, useEffect, useMemo } from 'react'
import { useEditorState } from './useEditorState'
import { useEditorKeyboard } from './useEditorKeyboard'
import { useBirthDateHandlers } from './useBirthDateHandlers'
import { useNatalChart } from './useNatalChart'
import { getPageSequence } from './editorState'
import { renderPageContent } from './renderPageContent'
import './CharacterEditor.scss'

export { CitySearch } from './CitySearch'
export { AstroSummary } from './AstroSummary'

export default function CharacterEditor({ initialColors, initialBirthData, initialName, scrollPage, limited, onSave, onClose, onChange }) {
  const modalRef = useRef(null)
  const colorsRef = useRef(null)
  const pageSequence = useMemo(() => getPageSequence(limited), [limited])

  const editorState = useEditorState(initialColors, initialBirthData, initialName)
  const { activePage, setActivePage, colors, setColors, previewColors, setPreviewColors, chartDate, chartTime, displayColors, trimmedName, birthDataOutput, birthDate, setBirthDate, birthTime, setBirthTime, hasDate, setHasDate, birthCity, setBirthCity, setPreviewDate, setPreviewTime, name, setName } = editorState

  useEffect(() => {
    colorsRef.current = colors
  }, [colors])

  useEffect(() => {
    if (scrollPage !== undefined && scrollPage >= 0 && scrollPage < pageSequence.length) {
      setActivePage(pageSequence[scrollPage])
    }
  }, [scrollPage, pageSequence, setActivePage])

  useEditorKeyboard(modalRef, pageSequence, activePage, colorsRef, birthDataOutput, trimmedName, onSave, onClose)
  const { handleBirthDateChange, handleBirthTimeChange } = useBirthDateHandlers(birthDate, setBirthDate, setHasDate, setPreviewDate, setPreviewTime, setBirthTime)
  const { natalPlacements, houseCusps } = useNatalChart(hasDate, chartDate, chartTime, birthCity)

  const pageProps = { natalPlacements, houseCusps, birthDate, handleBirthDateChange, birthTime, handleBirthTimeChange, birthCity, setBirthCity, displayColors, colors, setColors, setPreviewColors, initialName, name, setName, limited, birthDataOutput, trimmedName, colorsRef, onSave, onClose, onChange }

  return (
    <div className="char-editor-root">
      {pageSequence.length > 1 && (
        <div className="char-editor-dots" aria-hidden="true">
          {pageSequence.map(page => <span key={page} className={`char-editor-dot${activePage === page ? ' char-editor-dot--active' : ''}`} />)}
        </div>
      )}
      <div className="char-editor-modal" ref={modalRef}>
        <div className="char-editor-content">{renderPageContent(activePage, pageProps)}</div>
      </div>
    </div>
  )
}
