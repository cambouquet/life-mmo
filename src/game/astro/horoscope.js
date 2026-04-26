import { getAllPositions, longitudeToSign, longitudeToSymbol, degreesInSign } from './ephemeris.js'
import { findAspects, findTransitToNatal } from './aspects.js'

export const SIGN_META = {
  Aries:       { element: 'Fire',  mode: 'Cardinal', quality: 'bold and pioneering'       },
  Taurus:      { element: 'Earth', mode: 'Fixed',    quality: 'grounded and patient'       },
  Gemini:      { element: 'Air',   mode: 'Mutable',  quality: 'quick and curious'          },
  Cancer:      { element: 'Water', mode: 'Cardinal', quality: 'intuitive and protective'   },
  Leo:         { element: 'Fire',  mode: 'Fixed',    quality: 'generous and dramatic'      },
  Virgo:       { element: 'Earth', mode: 'Mutable',  quality: 'precise and discerning'     },
  Libra:       { element: 'Air',   mode: 'Cardinal', quality: 'balanced and diplomatic'    },
  Scorpio:     { element: 'Water', mode: 'Fixed',    quality: 'intense and transformative' },
  Sagittarius: { element: 'Fire',  mode: 'Mutable',  quality: 'adventurous and free'       },
  Capricorn:   { element: 'Earth', mode: 'Cardinal', quality: 'ambitious and disciplined'  },
  Aquarius:    { element: 'Air',   mode: 'Fixed',    quality: 'innovative and detached'    },
  Pisces:      { element: 'Water', mode: 'Mutable',  quality: 'dreamy and compassionate'   },
}

const PLANET_DOMAIN = {
  Sun:     'vitality and purpose',
  Moon:    'emotion and instinct',
  Mercury: 'mind and communication',
  Venus:   'love and beauty',
  Mars:    'will and desire',
  Jupiter: 'expansion and fortune',
  Saturn:  'discipline and time',
}

// Transit planet onto natal planet — keyed "tTransit:aspect:nNatal"
const TRANSIT_NATAL_LINES = {
  'Sun:Conjunction:Sun':       "The Sun returns to your birth position — a solar return. New intentions set now carry unusual power.",
  'Sun:Conjunction:Moon':      "Your sense of purpose illuminates your emotional core today. Inner and outer life align.",
  'Sun:Trine:Moon':            "Vitality and feeling move in easy harmony. A good day to act on what your heart already knows.",
  'Sun:Square:Moon':           "Tension between who you are becoming and your deep instincts asks for honest reflection.",
  'Sun:Conjunction:Venus':     "Warmth and beauty flow to you effortlessly. Love and creative work are especially favoured.",
  'Sun:Trine:Mars':            "Your will and your natal drive align — energy is high, action comes with confidence.",
  'Sun:Square:Mars':           "Friction between the current solar energy and your natal drive. Channel it, don't suppress it.",
  'Sun:Conjunction:Jupiter':   "A moment of expansion and grace. Something you've been building gains visibility.",
  'Sun:Square:Saturn':         "The present asks more of you than feels comfortable. The effort you make now endures.",
  'Moon:Conjunction:Moon':     "The Moon returns to your natal position — emotions run deep and true today.",
  'Moon:Conjunction:Sun':      "Your emotional tides illuminate your core identity. Feelings are a reliable guide now.",
  'Moon:Trine:Venus':          "Warmth and tenderness arise naturally. Connections made today carry real depth.",
  'Moon:Square:Mars':          "Impulse and instinct collide. Pause before letting raw feeling drive action.",
  'Moon:Conjunction:Saturn':   "A sober mood settles in. Old responsibilities resurface — face them with patience.",
  'Venus:Conjunction:Sun':     "Grace moves through your sense of self. Others are drawn to your presence today.",
  'Venus:Trine:Mars':          "Desire and beauty work together. Creative and romantic energy flows easily.",
  'Venus:Square:Saturn':       "Love and pleasure meet resistance or delay. Patience is its own form of devotion.",
  'Venus:Conjunction:Venus':   "Venus returns to her natal place in your chart — a day charged with beauty and feeling.",
  'Mars:Conjunction:Sun':      "A surge of vitality activates your natal purpose. Act boldly on what matters most.",
  'Mars:Square:Moon':          "Drive and instinct are at odds. Act, but check the impulse before it becomes a wound.",
  'Mars:Trine:Mars':           "Your natal will is energised and flowing. This is a time to push forward with confidence.",
  'Mars:Square:Saturn':        "Effort meets a wall. Patience and strategy will outlast force here.",
  'Jupiter:Conjunction:Sun':   "A season of expansion opens around your core self. Aim higher than you think you can reach.",
  'Jupiter:Trine:Moon':        "Optimism lifts the tides of feeling. Trust the larger arc of where your life is moving.",
  'Jupiter:Conjunction:Venus': "Abundance and affection multiply. Receive without guilt — this is a genuine opening.",
  'Jupiter:Square:Saturn':     "Growth strains against your natal structures. What no longer fits must give way.",
  'Saturn:Conjunction:Sun':    "Saturn tests your identity and purpose. This is a defining season — what survives is real.",
  'Saturn:Square:Moon':        "Emotional weight presses down. Old patterns that no longer serve ask to be released.",
  'Saturn:Return:Saturn':      "Saturn completes its cycle and returns. A major life reckoning — who have you become?",
  'Saturn:Trine:Saturn':       "The structures you have built are affirmed. Steady effort is paying its quiet dividend.",
}

const ASPECT_NATURE_LINES = {
  intense:    "A powerful convergence activates your natal chart. Intensity is both your instrument and your test.",
  harmonious: "A harmonious transit flows through your birth positions. Ease arrives where you have been working hardest.",
  tense:      "A challenging transit presses on your natal chart. The friction here is asking something of you.",
  flowing:    "A trining current of grace passes through your natal sky. Trust what comes naturally now.",
  polarizing: "An opposition illuminates a polarity in your chart. What you push away holds a key.",
}

const ELEMENT_LINES = {
  Fire:  "Fiery transits dominate your chart today — initiative and passion are your instruments.",
  Earth: "Earthy transits ground the sky above your birth positions — practical steps carry the most weight.",
  Air:   "Airy transits sweep through your natal chart — ideas and connections are the day's currency.",
  Water: "Watery transits move through your birth sky — intuition speaks louder than reason today.",
}

const LUCKY_BY_ELEMENT = {
  Fire:  { element: 'Colour', value: 'Ember gold'                  },
  Earth: { element: 'Stone',  value: 'Obsidian'                     },
  Air:   { element: 'Hour',   value: 'The third hour past midnight' },
  Water: { element: 'Stone',  value: 'Moonstone'                    },
}

function enrichPlacements(rawPositions) {
  const placements = {}
  for (const [planet, lon] of Object.entries(rawPositions)) {
    const sign = longitudeToSign(lon)
    placements[planet] = {
      longitude: lon,
      sign,
      symbol:    longitudeToSymbol(lon),
      degrees:   degreesInSign(lon),
      element:   SIGN_META[sign]?.element ?? '?',
    }
  }
  return placements
}

function dominantElement(placements) {
  const tally = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  for (const p of Object.values(placements)) {
    if (SIGN_META[p.sign]) tally[SIGN_META[p.sign].element]++
  }
  return Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0]
}

function bestTransitLine(aspects) {
  for (const asp of aspects) {
    const key = `${asp.transit}:${asp.aspect.name}:${asp.natal}`
    if (TRANSIT_NATAL_LINES[key]) return { text: TRANSIT_NATAL_LINES[key], source: asp }
  }
  if (aspects.length > 0) {
    return { text: ASPECT_NATURE_LINES[aspects[0].aspect.nature], source: aspects[0] }
  }
  return null
}

// ── Public API ────────────────────────────────────────────────────────────────
// birthData: { date: 'YYYY-MM-DD', time: 'HH:MM', city: { lat, lng, tz, name, country } }
// All fields optional — more fields = more accurate/personal reading.
export function generateHoroscope(transitDate = new Date(), birthData = null) {
  const rawTransits = getAllPositions(transitDate)
  const transitPlacements = enrichPlacements(rawTransits)

  // No birth data — cannot do a personal reading
  if (!birthData || !birthData.date) {
    return {
      zodiac:    { name: transitPlacements.Sun.sign, symbol: transitPlacements.Sun.symbol },
      cosmic:    null,
      moonline:  null,
      guidance:  null,
      lucky:     null,
      gated:     true,
      _debug: {
        transitPlacements,
        natalPlacements: null,
        transitNatalAspects: [],
        skyAspects: findAspects(rawTransits),
        dominantElement: dominantElement(transitPlacements),
      },
    }
  }

  // Build exact birth UTC Date from date + time + timezone
  const [yr, mo, dy] = birthData.date.split('-').map(Number)
  const timeSplit    = (birthData.time || '12:00').split(':').map(Number)
  const bh = timeSplit[0] || 0
  const bm = timeSplit[1] || 0
  const bs = timeSplit[2] || 0
  const tzOffset     = birthData.city?.tz ?? 0
  const birthUTC     = new Date(Date.UTC(yr, mo - 1, dy, bh - tzOffset, bm, bs))

  const location = birthData.city ? { lat: birthData.city.lat, lng: birthData.city.lng } : null
  const rawNatal = getAllPositions(birthUTC, location)
  const natalPlacements = enrichPlacements(rawNatal)

  const transitNatalAspects = findTransitToNatal(rawTransits, rawNatal)
  const skyAspects          = findAspects(rawTransits)

  // zodiac — natal Sun sign + rising sign if available
  const rising = natalPlacements.Ascendant
  const zodiac = {
    name:    natalPlacements.Sun.sign,
    symbol:  natalPlacements.Sun.symbol,
    rising:  rising ? rising.sign   : null,
    risingSymbol: rising ? rising.symbol : null,
  }

  // cosmic — natal Sun sign + today's Sun position
  const sunMeta   = SIGN_META[natalPlacements.Sun.sign]
  const tSunSign  = transitPlacements.Sun.sign
  const cosmic = tSunSign === natalPlacements.Sun.sign
    ? `The Sun moves through your natal sign, ${natalPlacements.Sun.sign} — your sense of purpose burns at its brightest.`
    : `The Sun passes through ${tSunSign} while your natal Sun rests in ${natalPlacements.Sun.sign}, casting ${SIGN_META[tSunSign]?.element?.toLowerCase() ?? 'celestial'} light on your ${sunMeta?.quality ?? ''} nature.`

  // moonline — today's Moon transiting natal Moon's sign area
  const tMoonSign = transitPlacements.Moon.sign
  const nMoonSign = natalPlacements.Moon.sign
  const moonline = tMoonSign === nMoonSign
    ? `The Moon passes through your natal ${nMoonSign} — emotional memory and present feeling merge.`
    : `The Moon moves through ${tMoonSign}, touching your natal ${nMoonSign} instincts from a ${SIGN_META[tMoonSign]?.quality ?? ''} angle.`

  // guidance — best transit-to-natal aspect
  const best = bestTransitLine(transitNatalAspects)
  const guidance = best?.text ?? ELEMENT_LINES[dominantElement(transitPlacements)]

  // lucky — keyed by natal Moon element (stable, identity-based)
  const natalMoonElement = natalPlacements.Moon.element
  const lucky = LUCKY_BY_ELEMENT[natalMoonElement] ?? LUCKY_BY_ELEMENT.Water

  return {
    zodiac,
    cosmic,
    moonline,
    guidance,
    lucky,
    gated: false,
    _debug: {
      transitPlacements,
      natalPlacements,
      transitNatalAspects,
      skyAspects,
      dominantElement: dominantElement(transitPlacements),
      guidanceSource: best?.source ?? null,
    },
  }
}
