export function createBackupHandlers(setBackups) {
  return {
    createBackup: () => {
      setBackups(prev => {
        const backup = { id: Date.now(), timestamp: new Date().toLocaleString() }
        return [backup, ...prev].slice(0, 5)
      })
    },
    restoreBackup: () => {
      // backup restore implementation
    },
    deleteBackup: (id) => {
      setBackups(prev => prev.filter(b => b.id !== id))
    }
  }
}
