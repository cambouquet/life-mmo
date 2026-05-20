const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
const SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

export function longitudeToSign(lon) { return SIGNS[Math.floor(lon / 30)] }
export function longitudeToSymbol(lon) { return SYMBOLS[Math.floor(lon / 30)] }
export function degreesInSign(lon) { return lon % 30 }
