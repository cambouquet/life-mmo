export const PAGES_FULL = ['chart', 'location', 'character']
export const PAGES_LIMITED = ['character']

export function getPageSequence(limited) {
  return limited ? PAGES_LIMITED : PAGES_FULL
}

export const DEFAULT_COLORS = {
  hair: '#6030d0',
  skin: '#f8c898',
  eyes: '#8040e8',
  outfit: '#4a1090',
  stick: '#60a8ff',
}
