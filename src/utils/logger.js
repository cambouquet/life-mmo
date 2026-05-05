// Simple logger with copy-to-clipboard and filtering
const LogStore = {
  logs: [],
  filteredLogs: [],
  filters: new Set(),

  log(emoji, message, data = null) {
    const entry = { emoji, message, data, time: new Date().toLocaleTimeString() }
    this.logs.push(entry)

    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs.shift()
    }

    this.updateFiltered()
    this.printToConsole(entry)
  },

  updateFiltered() {
    this.filteredLogs = this.logs.filter(log => {
      if (this.filters.size === 0) return true
      return !this.filters.has(log.emoji)
    })
  },

  printToConsole(entry) {
    const dataStr = entry.data ? JSON.stringify(entry.data) : ''
    console.log(`${entry.emoji} ${entry.message}`, dataStr)
  },

  toggleFilter(emoji) {
    if (this.filters.has(emoji)) {
      this.filters.delete(emoji)
    } else {
      this.filters.add(emoji)
    }
    this.updateFiltered()
  },

  copyToClipboard() {
    const text = this.filteredLogs.map(log => {
      const dataStr = log.data ? '\n  ' + JSON.stringify(log.data, null, 2).split('\n').join('\n  ') : ''
      return `${log.time} ${log.emoji} ${log.message}${dataStr}`
    }).join('\n\n')

    navigator.clipboard.writeText(text).then(() => {
      console.log('✅ Logs copied to clipboard!')
    }).catch(err => {
      console.error('❌ Failed to copy logs:', err)
    })
  },

  getStats() {
    const counts = {}
    this.logs.forEach(log => {
      counts[log.emoji] = (counts[log.emoji] || 0) + 1
    })
    return counts
  },

  printStats() {
    const counts = this.getStats()
    console.log('📊 Log stats:', counts)
    console.log('Filtered emojis:', Array.from(this.filters).join(', ') || 'none')
    console.log('Total logs:', this.logs.length, '| Visible:', this.filteredLogs.length)
  },
}

// Expose in window for console access
if (typeof window !== 'undefined') {
  window.logs = LogStore
  window.logStats = () => LogStore.printStats()
  window.logCopy = () => LogStore.copyToClipboard()
  window.logFilter = (emoji) => LogStore.toggleFilter(emoji)
  window.logClear = () => { LogStore.logs = []; LogStore.filteredLogs = []; console.log('Logs cleared') }
}

export default LogStore
