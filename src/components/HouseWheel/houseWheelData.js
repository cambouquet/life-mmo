export const SIGN_NAMES = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']

export const ORBITS = [
  { id: 'Sun',           r: 30 },
  { id: 'Moon',          r: 37 },
  { id: 'Mercury',       r: 44 },
  { id: 'Venus',         r: 51 },
  { id: 'Mars',          r: 58 },
  { id: 'NorthNode',     r: 65 },
  { id: 'Jupiter',       r: 72 },
  { id: 'Saturn',        r: 79 },
  { id: 'Chiron',        r: 86 },
  { id: 'Uranus',        r: 93 },
  { id: 'Neptune',       r: 100 },
  { id: 'Pluto',         r: 107 },
  { id: 'Lilith',        r: 114 },
  { id: 'PartOfFortune', r: 121 },
]

export const PLANET_RINGS = ORBITS.reduce((acc, o) => ({ ...acc, [o.id]: o.r }), {})

export const HOUSE_THEMES = {
  1:'Identity', 2:'Abundance', 3:'Expression', 4:'Foundations', 5:'Creation',
  6:'Synthesis', 7:'Balance', 8:'Evolution', 9:'Wisdom',
  10:'Legacy', 11:'Connection', 12:'Transcendence'
}

export const HOUSE_NAMES = {
  1:'House of Identity', 2:'House of Abundance', 3:'House of Expression', 4:'House of Foundations',
  5:'House of Creation', 6:'House of Synthesis', 7:'House of Balance',
  8:'House of Evolution', 9:'House of Wisdom', 10:'House of Legacy',
  11:'House of Connection', 12:'House of Transcendence'
}

export const HOUSE_LONG = {
  1:"Defines the ego, self-image, and your natural approach to the world.",
  2:"Governs material security, earnable income, and self-worth.",
  3:"Rules the logical mind, siblings, and how you exchange information daily.",
  4:"Represents your roots, family history, and inner sense of security.",
  5:"The sector of self-expression, artistic pursuits, and risk-taking.",
  6:"Focuses on service to others, physical well-being, and work habits.",
  7:"Rules one-to-one connections, contracts, and what you seek in a companion.",
  8:"The house of profound change, intimacy, shared wealth, and the occult.",
  9:"Governs the quest for meaning, higher education, and travel.",
  10:"Represents your highest achievements and professional reputation.",
  11:"Focuses on networking, humanitarian efforts, and long-term hopes.",
  12:"The sector of secrets, dreams, karma, and dissolution of the ego.",
}

export const SIGN_DESC_LONG = {
  Aries:"Aries sharpens energy into impulse and initiative. There is speed, directness, and a need to be first.",
  Taurus:"Taurus slows energy into something steady and embodied. There is persistence, sensuality, and a need for security.",
  Gemini:"Gemini disperses energy across ideas and connections. There is wit, restlessness, and a need to communicate.",
  Cancer:"Cancer turns energy inward and protective. There is empathy, memory, and a need to belong and nurture.",
  Leo:"Leo channels energy into self-expression and generosity. There is pride, creativity, and a need to be seen.",
  Virgo:"Virgo focuses energy into analysis and refinement. There is discernment, humility, and a need to be useful.",
  Libra:"Libra distributes energy between self and other. There is grace, indecision, and a need for fairness.",
  Scorpio:"Scorpio concentrates energy into transformation. There is power, suspicion, and a need to uncover what is hidden.",
  Sagittarius:"Sagittarius expands energy toward meaning and horizon. There is optimism, excess, and a need for truth.",
  Capricorn:"Capricorn structures energy into long-term achievement. There is patience, control, and a need to build something lasting.",
  Aquarius:"Aquarius breaks energy away from convention. There is brilliance, coldness, and a need to serve a larger idea.",
  Pisces:"Pisces dissolves energy into the boundless. There is compassion, escapism, and a need to transcend the ordinary.",
}

export const PLANET_SUMMARY = {
  Sun:"Your core self — who you are becoming.", Moon:"Your inner world — how you feel and need.",
  Mercury:"Your mind — how you think and speak.", Venus:"Your heart — what you love and desire.",
  Mars:"Your drive — how you act and fight.", Jupiter:"Your growth — where life opens up.",
  Saturn:"Your discipline — where you are tested.", Uranus:"Your rebellion — where you break the mould.",
  Neptune:"Your dissolution — where you dream.", Pluto:"Your transformation — death and rebirth.",
  Chiron:"Your wound — and your path to healing.", NorthNode:"Your destiny — soul direction.",
  SouthNode:"Your past — the karma you were born with.", Lilith:"Your shadow — raw instinct.",
  Ascendant:"Your mask — how others first see you.", Descendant:"Your mirror — what you seek.",
  Midheaven:"Your calling — how you are seen in the world.", IC:"Your roots — what sustains you.",
  Vertex:"Your fate point — destined encounters.", PartOfFortune:"Your joy — where circumstance aligns.",
}
