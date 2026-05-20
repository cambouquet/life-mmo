import DialogModal from '../DialogModal/DialogModal.jsx'
import HoroscopeModal from '../HoroscopeModal/HoroscopeModal.jsx'
import CharacterEditor from '../CharacterEditor/CharacterEditor.jsx'
import VideoGallery from '../VideoGallery/VideoGallery.jsx'

export function AppModals({ showDialog, setShowDialog, showHoroscope, setShowHoroscope, showEditor, showGallery, setShowGallery, charColors, setCharColors, charName, birthData, editorPage, editorLimited, closeEditor, syncCharToStorage, recordings }) {
  return (
    <>
      {showDialog && <DialogModal onClose={() => setShowDialog(false)} onHoroscope={() => { setShowDialog(false); setShowHoroscope(true) }} />}
      {showHoroscope && <HoroscopeModal birthData={birthData} onClose={() => setShowHoroscope(false)} />}
      {showEditor && (
        <CharacterEditor
          initialColors={charColors}
          initialBirthData={birthData}
          initialName={charName}
          scrollPage={editorPage}
          limited={editorLimited}
          onClose={() => { console.action('Closing Mirror'); closeEditor() }}
          onChange={(next) => {
            const changed = Object.keys(next).find(k => next[k] !== charColors[k])
            if (changed) console.action(`Changing ${changed} to ${next[changed]}`)
            setCharColors(next)
          }}
          onSave={(colors, data, name) => {
            console.action('Saving character data')
            syncCharToStorage(colors, data, name)
            closeEditor()
          }}
        />
      )}
      {showGallery && <VideoGallery videos={recordings} onClose={() => setShowGallery(false)} />}
    </>
  )
}
