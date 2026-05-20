import { useState } from 'react'

export function useUIState() {
  const [showDialog, setShowDialog] = useState(false)
  const [showHoroscope, setShowHoroscope] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [editorPage, setEditorPage] = useState(0)
  const [editorLimited, setEditorLimited] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [showGameTests, setShowGameTests] = useState(false)
  const [debugActive, setDebugActive] = useState(false)

  const closeEditor = () => {
    setShowEditor(false)
    setEditorPage(0)
    setEditorLimited(false)
  }

  const resetUI = () => {
    setShowDialog(false)
    setShowHoroscope(false)
    setShowEditor(false)
    setEditorPage(0)
    setEditorLimited(false)
    setShowGallery(false)
  }

  return {
    showDialog, setShowDialog,
    showHoroscope, setShowHoroscope,
    showEditor, setShowEditor,
    editorPage, setEditorPage,
    editorLimited, setEditorLimited,
    showGallery, setShowGallery,
    showGameTests, setShowGameTests,
    debugActive, setDebugActive,
    closeEditor, resetUI
  }
}
