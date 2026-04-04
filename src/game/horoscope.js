// ── Zodiac sign boundaries ────────────────────────────────────────────────────
const ZODIAC = [
  { name: 'Capricorn',    symbol: '♑', from: [12, 22], to: [1,  19] },
  { name: 'Aquarius',     symbol: '♒', from: [1,  20], to: [2,  18] },
  { name: 'Pisces',       symbol: '♓', from: [2,  19], to: [3,  20] },
  { name: 'Aries',        symbol: '♈', from: [3,  21], to: [4,  19] },
  { name: 'Taurus',       symbol: '♉', from: [4,  20], to: [5,  20] },
  { name: 'Gemini',       symbol: '♊', from: [5,  21], to: [6,  20] },
  { name: 'Cancer',       symbol: '♋', from: [6,  21], to: [7,  22] },
  { name: 'Leo',          symbol: '♌', from: [7,  23], to: [8,  22] },
  { name: 'Virgo',        symbol: '♍', from: [8,  23], to: [9,  22] },
  { name: 'Libra',        symbol: '♎', from: [9,  23], to: [10, 22] },
  { name: 'Scorpio',      symbol: '♏', from: [10, 23], to: [11, 21] },
  { name: 'Sagittarius',  symbol: '♐', from: [11, 22], to: [12, 21] },
]

function getZodiac(date) {
  const m = date.getMonth() + 1
  const d = date.getDate()
  for (const z of ZODIAC) {
    const [fm, fd] = z.from
    const [tm, td] = z.to
    if (fm <= tm) {
      if ((m === fm && d >= fd) || (m > fm && m < tm) || (m === tm && d <= td)) return z
    } else {
      // spans year boundary (Capricorn: Dec 22 – Jan 19)
      if ((m === fm && d >= fd) || m > fm || m < tm || (m === tm && d <= td)) return z
    }
  }
  return ZODIAC[3] // fallback
}

// ── Seeded PRNG (LCG) — deterministic per calendar day ───────────────────────
function seededRand(seed) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

// ── Content pools ─────────────────────────────────────────────────────────────
const COSMIC = [
  'The celestial tides shift in your favour today.',
  'Venus and Mars dance close — passion stirs in hidden places.',
  'Mercury sharpens your tongue and your mind alike.',
  'The moon swells with silver promise this night.',
  'A grand trine forms above, opening doors you could not see.',
  'Saturn\'s steady gaze tests the steel of your ambitions.',
  'Jupiter expands whatever you dare to dream today.',
  'The north node pulls you closer to your truest path.',
  'An eclipse looms on the horizon — transformation is near.',
  'The morning star rises bright at your eastern sky.',
  'Neptune thins the veil between what is and what could be.',
  'Chiron draws an old wound back into the light.',
]

const GUIDANCE = [
  'Speak your truth before the sun sets this day.',
  'Seek counsel from those who have walked the longer road.',
  'Release what no longer serves your highest self.',
  'A stranger you meet today carries a message meant for you.',
  'Stillness now will bring profound clarity tomorrow.',
  'Trust the thin thread of intuition — it will not fray.',
  'What you plant in silence will bloom in full light.',
  'Courage wears the quietest face today — wear it well.',
  'The path bends here, but it does not break.',
  'Rest is not retreat; it is preparation for what comes.',
  'What seems like an end is merely a great turning.',
  'Do not mistake the obstacle for the destination.',
]

const LUCKY = [
  { element: 'Stone',  value: 'Moonstone'                   },
  { element: 'Hour',   value: 'The third hour past midnight' },
  { element: 'Colour', value: 'Deep violet'                  },
  { element: 'Stone',  value: 'Obsidian'                     },
  { element: 'Hour',   value: 'Dusk'                         },
  { element: 'Colour', value: 'Twilight indigo'              },
  { element: 'Stone',  value: 'Amethyst'                     },
  { element: 'Hour',   value: 'High noon'                    },
  { element: 'Colour', value: 'Ember gold'                   },
  { element: 'Number', value: 'Seven'                        },
  { element: 'Stone',  value: 'Rose quartz'                  },
  { element: 'Colour', value: 'Forest green'                 },
]

// ── Public API ────────────────────────────────────────────────────────────────
export function generateHoroscope(date = new Date()) {
  const zodiac = getZodiac(date)
  const seed   = (date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()) >>> 0
  const rand   = seededRand(seed)
  const cosmic   = COSMIC[ Math.floor(rand() * COSMIC.length)   ]
  const guidance = GUIDANCE[Math.floor(rand() * GUIDANCE.length)]
  const lucky    = LUCKY[   Math.floor(rand() * LUCKY.length)   ]
  return { zodiac, cosmic, guidance, lucky }
}
