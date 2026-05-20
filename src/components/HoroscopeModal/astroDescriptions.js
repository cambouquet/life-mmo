export const PLANET_NAMES = {
  NorthNode:'North Node', SouthNode:'South Node', PartOfFortune:'Part of Fortune',
  IC: 'Imum Coeli', Ascendant: 'Ascendant', Midheaven: 'Midheaven'
}

export const PLANET_ORDER = [
  'Sun', 'Ascendant', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn',
  'Uranus', 'Neptune', 'Pluto', 'Chiron', 'NorthNode', 'SouthNode', 'Lilith',
  'Descendant', 'Midheaven', 'IC', 'Vertex', 'PartOfFortune'
]

export const PLANET_DESC = {
  Sun:       { summary: "Your core self — who you are becoming.", detail: "The Sun is your conscious identity, the ego you build across a lifetime. It shows what you are here to master and express." },
  Ascendant: { summary: "Your mask — how others first see you.", detail: "The Ascendant is the zodiac sign rising on the eastern horizon at your birth. It colours your appearance, demeanour, and the instinctive role you play in new situations." },
  Moon:      { summary: "Your inner world — how you feel and need.", detail: "The Moon governs your emotional instincts, memory, and what makes you feel safe. It is the part of you that reacts before thinking." },
  Mercury:   { summary: "Your mind — how you think and speak.", detail: "Mercury rules your perception, reasoning, and communication style. It shapes how fast you process ideas and how you express them to others." },
  Venus:     { summary: "Your heart — what you love and desire.", detail: "Venus governs attraction, beauty, and values. It reveals what draws you in and how you behave in close relationships." },
  Mars:      { summary: "Your drive — how you act and fight.", detail: "Mars is raw energy and will. It shows how you pursue goals, handle conflict, and assert yourself when something matters." },
  Jupiter:   { summary: "Your growth — where life opens up for you.", detail: "Jupiter expands whatever it touches. It points to the area of life where you find abundance, optimism, and the urge to seek meaning." },
  Saturn:    { summary: "Your discipline — where you are tested.", detail: "Saturn brings structure through challenge. The sign it occupies reveals where you must work hardest — and where mastery is most rewarding." },
  Uranus:    { summary: "Your rebellion — where you break the mould.", detail: "Uranus moves slowly and shapes a generation. In your chart it marks the area where you hunger for freedom, disruption, and original thought." },
  Neptune:   { summary: "Your dissolution — where you dream and dissolve.", detail: "Neptune blurs boundaries and heightens sensitivity. It shows where you seek transcendence — and where you are most susceptible to illusion." },
  Pluto:     { summary: "Your transformation — where you die and are reborn.", detail: "Pluto moves over decades. Its sign colours generational power. Its degree in your chart marks where deep, irreversible change operates on your soul." },
  Chiron:    { summary: "Your wound — and your path to healing it.", detail: "Chiron marks where you carry a deep, formative wound — one that never fully closes, but which, through working with it, becomes your greatest source of wisdom and healing for others." },
  NorthNode: { summary: "Your destiny — the direction your soul is growing toward.", detail: "The North Node is not a planet but a point of karmic direction. It shows the unfamiliar territory you are here to grow into, even if it feels uncomfortable." },
  SouthNode: { summary: "Your past — the talents and karma you were born with.", detail: "The South Node (directly opposite the North Node) represents your past-life comfort zone, innate talents, and habits you are moving away from to achieve balance." },
  Lilith:    { summary: "Your shadow — raw, undomesticated instinct.", detail: "Black Moon Lilith is the lunar apogee, the Moon's farthest point. It marks where you refuse to submit, where primal energy operates outside social rules — powerful but easily suppressed or over-expressed." },
  Midheaven: { summary: "Your calling — how you are seen in the world.", detail: "The Midheaven (MC) is the highest point of the chart. It represents your public role, vocation, and the legacy you are building in the eyes of others." },
  IC:        { summary: "Your roots — where you come from and what sustains you.", detail: "The IC (Imum Coeli) is the lowest point of the chart, directly opposite the Midheaven. It speaks of home, ancestry, private foundations, and the psychological bedrock beneath your public life." },
  Vertex:    { summary: "Your fate point — encounters that feel destined.", detail: "The Vertex is a sensitive point on the prime vertical. It marks the kind of people and events that enter your life as if fated — encounters that feel larger than coincidence and tend to change you." },
  PartOfFortune: { summary: "Your joy — where body, soul, and circumstance align.", detail: "The Part of Fortune is an Arabic lot derived from Sun, Moon, and Ascendant. It marks the area of life where you are most naturally lucky and where effort feels effortlessly." },
}

export const SIGN_DESC = {
  Aries:       { short: "expressed with boldness and urgency",        long: "Aries sharpens energy into impulse and initiative. There is speed, directness, and a need to be first." },
  Taurus:      { short: "expressed with patience and groundedness",    long: "Taurus slows energy into something steady and embodied. There is persistence, sensuality, and a need for security." },
  Gemini:      { short: "expressed with curiosity and versatility",    long: "Gemini disperses energy across ideas and connections. There is wit, restlessness, and a need to communicate." },
  Cancer:      { short: "expressed through feeling and instinct",      long: "Cancer turns energy inward and protective. There is empathy, memory, and a need to belong and nurture." },
  Leo:         { short: "expressed with warmth and self-assurance",    long: "Leo channels energy into self-expression and generosity. There is pride, creativity, and a need to be seen." },
  Virgo:       { short: "expressed through precision and service",     long: "Virgo focuses energy into analysis and refinement. There is discernment, humility, and a need to be useful." },
  Libra:       { short: "expressed through harmony and relationship",  long: "Libra distributes energy between self and other. There is grace, indecision, and a need for fairness." },
  Scorpio:     { short: "expressed with intensity and depth",          long: "Scorpio concentrates energy into transformation. There is power, suspicion, and a need to uncover what is hidden." },
  Sagittarius: { short: "expressed with freedom and vision",           long: "Sagittarius expands energy toward meaning and horizon. There is optimism, excess, and a need for truth." },
  Capricorn:   { short: "expressed with discipline and ambition",      long: "Capricorn structures energy into long-term achievement. There is patience, control, and a need to build something lasting." },
  Aquarius:    { short: "expressed through originality and detachment",long: "Aquarius breaks energy away from convention. There is brilliance, coldness, and a need to serve a larger idea." },
  Pisces:      { short: "expressed with sensitivity and imagination",  long: "Pisces dissolves energy into the boundless. There is compassion, escapism, and a need to transcend the ordinary." },
}

export const HOUSE_DESC = {
  1:  { name: "House of Self",          short: "identity, appearance, how you begin things" },
  2:  { name: "House of Resources",     short: "money, possessions, self-worth" },
  3:  { name: "House of Mind",          short: "communication, siblings, short journeys" },
  4:  { name: "House of Home",          short: "roots, family, private foundations" },
  5:  { name: "House of Pleasure",      short: "creativity, romance, play, children" },
  6:  { name: "House of Service",       short: "daily work, health, routines, duty" },
  7:  { name: "House of Partnership",   short: "marriage, close relationships, open enemies" },
  8:  { name: "House of Transformation",short: "death, rebirth, shared resources, the occult" },
  9:  { name: "House of Expansion",     short: "philosophy, travel, higher learning, beliefs" },
  10: { name: "House of Career",        short: "vocation, public reputation, authority" },
  11: { name: "House of Community",     short: "friends, groups, hopes, collective ideals" },
  12: { name: "House of the Hidden",    short: "the unconscious, isolation, karma, undoing" },
}
