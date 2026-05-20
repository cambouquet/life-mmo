import { SIGN_META } from './signMeta.js'

export function buildZodiac(natalPlacements) {
  const rising = natalPlacements.Ascendant
  return {
    name: natalPlacements.Sun.sign,
    symbol: natalPlacements.Sun.symbol,
    rising: rising ? rising.sign : null,
    risingSymbol: rising ? rising.symbol : null,
  }
}

export function buildCosmic(natalPlacements, transitPlacements) {
  const tSunSign = transitPlacements.Sun.sign
  const natalSunSign = natalPlacements.Sun.sign
  if (tSunSign === natalSunSign) {
    return `The Sun moves through your natal sign, ${natalSunSign} — your sense of purpose burns at its brightest.`
  }
  const sunMeta = SIGN_META[natalSunSign]
  return `The Sun passes through ${tSunSign} while your natal Sun rests in ${natalSunSign}, casting ${SIGN_META[tSunSign]?.element?.toLowerCase() ?? 'celestial'} light on your ${sunMeta?.quality ?? ''} nature.`
}

export function buildMoonline(natalPlacements, transitPlacements) {
  const tMoonSign = transitPlacements.Moon.sign
  const nMoonSign = natalPlacements.Moon.sign
  if (tMoonSign === nMoonSign) {
    return `The Moon passes through your natal ${nMoonSign} — emotional memory and present feeling merge.`
  }
  return `The Moon moves through ${tMoonSign}, touching your natal ${nMoonSign} instincts from a ${SIGN_META[tMoonSign]?.quality ?? ''} angle.`
}
