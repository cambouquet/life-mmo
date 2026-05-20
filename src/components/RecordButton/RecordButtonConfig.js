export const RECORD_BUTTONS = [
  {
    id: 'mirror',
    title: 'Record: mirror visit',
    label: 'Mirror Visit',
    icon: 'circle-with-arc',
  },
  {
    id: 'gate',
    title: 'Record: gate run',
    label: 'Gate Run',
    icon: 'grid-cross',
  },
  {
    id: 'gallery',
    title: 'Gallery',
    label: 'Gallery',
    icon: 'gallery',
  },
  {
    id: 'stop',
    title: 'Stop recording',
    label: 'Stop',
    icon: 'stop',
    variant: 'stop',
  },
]

export const ICON_SVG = {
  'circle-with-arc': '<circle cx="12" cy="12" r="9" /><path d="M9 8a3 3 0 0 1 6 0" />',
  'grid-cross': '<path d="M7 7h10v10H7z" /><path d="M12 7v10" /><path d="M7 12h10" />',
  'gallery': '<rect x="2" y="7" width="20" height="15" rx="2" /><path d="M16 7v-2a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2v2" />',
  'stop': '<rect x="6" y="4" width="12" height="16" />',
}
