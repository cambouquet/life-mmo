function norm(deg) { return ((deg % 360) + 360) % 360 }
function rad(deg)  { return deg * Math.PI / 180 }
function sin_(d)   { return Math.sin(rad(d)) }
function cos_(d)   { return Math.cos(rad(d)) }
function tan_(d)   { return Math.tan(rad(d)) }
function atan2d(y,x){ return Math.atan2(y,x)*180/Math.PI }
const eps=23.4409, lat=48.83, RAMC=171.73

// The correct Placidus uses the ACTUAL semiarc fractions per cusp:
// For H2: OA_setting = RAMC + DSA(H2)/3 + 60   [from HA analysis: 1/3 NSA = 1/3*(180-DSA) = 60 - DSA/3, and HA_setting = DSA, so total HA = DSA + 60 - DSA/3 = 2*DSA/3 + 60, RA = RAMC - HA = RAMC - 2*DSA/3 - 60, OA_setting = RA + AD]
// This is self-referential. The targets 70 and 120 are empirically derived from this chart.
// For a general implementation, use the HA-based iterative formula:
// H2: HA = 2*DSA/3 + 60  (= DSA + NSA/3)
// H3: HA = DSA/3 + 120   (= DSA + 2*NSA/3)
// H11: HA = 360 - 2*DSA/3  (= 360 - DSA + NSA/3... no: from MC, 1/3 DSA toward ASC: HA = DSA/3)
// H12: HA = 2*DSA/3

// Wait — let me recheck: H11 with HA = DSA/3:
// RA(H11) = RAMC - DSA/3. Let's verify this matches OA_rising = RAMC+30:
// OA_rising = RA - AD = (RAMC - DSA/3) - AD = RAMC - (DSA/3 + AD) = RAMC - (90+AD)/3 + something?
// DSA = 90 + AD, so DSA/3 = 30 + AD/3. RA = RAMC - 30 - AD/3. OA_rising = RA - AD = RAMC - 30 - 4*AD/3.
// For this to = RAMC+30: -30 - 4*AD/3 = 30 => AD = -45. Only works for specific dec.
// So the OA_rising=RAMC+30 is an approximation, and HA=DSA/3 is the CORRECT definition.
// Similarly for H2: HA = DSA + NSA/3.

function solveCuspHA(haFn, guess) {
  let L = guess
  for(let i=0;i<80;i++) {
    const dec=Math.asin(Math.min(1,Math.max(-1,sin_(eps)*sin_(L))))*180/Math.PI
    const t=Math.tan(rad(dec))*Math.tan(rad(lat))
    const DSA=Math.abs(t)>=1?89.9:Math.acos(Math.max(-1,Math.min(1,-t)))*180/Math.PI
    const NSA=180-DSA
    const HA=haFn(DSA,NSA)
    const RA_new=norm(RAMC-HA)
    const L_new=norm(atan2d(sin_(RA_new)*cos_(eps)+Math.tan(rad(dec))*sin_(eps),cos_(RA_new)))
    if(Math.abs(norm(L_new-L+180)-180)<0.0001){L=L_new;break}
    L=0.6*L+0.4*L_new
  }
  return L
}

const mc  = norm(atan2d(sin_(RAMC), cos_(RAMC)*cos_(eps)))
const asc = norm(atan2d(cos_(RAMC), -(sin_(RAMC)*cos_(eps) + tan_(lat)*sin_(eps))))
const ic  = norm(mc+180), dsc=norm(asc+180)

// H11: 1/3 DSA past MC (going toward ASC)
// HA increases from 0(MC) toward DSA(setting) toward 180(IC) toward 360-DSA(rising) toward 360(=MC again)
// WAIT: I need to get the direction right.
// From MC: going toward ASC (H12, H11 are between MC and ASC in the sky)
// The ASC is on the RISING side (east), so from MC going EAST: HA decreases (or wraps from 360).
// HA increases westward. East of MC = HA in (360-DSA, 360).
// H11 is between MC(HA=0) and ASC(HA=360-DSA): at 1/3 DSA from MC toward ASC.
// Going from MC(HA=0) to ASC(HA=360-DSA) means HA goes from 0 BACKWARD to 360-DSA = going through negative/high values.
// OR: from HA=0, going to HA=360-DSA means passing through 360(same as 0)...
// That means H11 is at HA = 360 - DSA/3 (1/3 of the way from MC to ASC going eastward).
// H12: HA = 360 - 2*DSA/3
// H1(ASC): HA = 360 - DSA (= -DSA in signed convention)
// H2: 1/3 of NSA past ASC going below horizon:
//     From ASC(HA=360-DSA), going further east (HA decreasing toward 360-DSA-NSA = 180+DSA-... hmm
//     Actually below horizon: from ASC going WEST (HA increasing past 360-DSA):
//     H2: HA = 360 - DSA + NSA/3 (but this may exceed 360)
//     = 360 - DSA + (180-DSA)/3 = 360 - DSA + 60 - DSA/3 = 420 - 4*DSA/3 => norm = 60 - 4*DSA/3... negative for large DSA
//     Hmm. Let me try a completely different approach:

// From the HA = DSA/3 formula for H11 (measured from upper meridian, positive westward, so H11 is EAST = large HA):
// H11: HA = 360 - DSA/3 (east of MC, between MC and rising)... or DSA/3?
// Let me just test empirically which HA formula gives the correct houses.

// Known working (from OA approach): H11 OA_rising = RAMC+30, H12 = RAMC+60
// OA_rising = RA - AD. RA = RAMC - HA. So: RAMC - HA - AD = RAMC + 30 => HA = -30 - AD = -(30+AD)
// AD depends on dec which depends on L. For H11 at ~Libra 15 (dec~-6°, AD~-7°):
// HA = -(30 + (-7)) = -23. norm(-23) = 337. So H11 HA = 337.

// H12 at ~Scorpio 7 (dec~-17°, AD~-21°): HA = -(60+(-21)) = -39. norm = 321.

// H2: OA_setting = RA + AD. RAMC - HA + AD = RAMC+70 => HA = AD - 70.
// For H2 at ~Capricorn 1 (dec~-23°, AD~-29°): HA = -29 - 70 = -99. norm = 261. ✓

// H3: RAMC+120 => HA = AD - 120.
// For H3 at ~Aquarius 7 (dec~-19°, AD~-23°): HA = -23-120 = -143. norm = 217. ✓

// So the HA-based formula for each cusp:
// H11: HA(fn of DSA,NSA) such that OA_rising = RAMC+30 => HA = -(30+AD) per cusp
// This is just a restatement of the OA formula. The HA-based approach with DSA/NSA fractions
// gives DIFFERENT answers because DSA of H11 != constant.

// CONCLUSION: The OA targets that work are:
// H11: RAMC+30 (rising), H12: RAMC+60 (rising), H2: RAMC+70 (setting), H3: RAMC+120 (setting)
// These are empirically verified for this chart. The question is: are they universally correct?
// The standard academic Placidus uses RAMC+30/60/120/150. We need RAMC+70 and +120 instead.
// The 70 and 120 do NOT follow the classical 30-step pattern.

// Let me check what the TRUE HA fractions imply for this chart:
const L_h11 = solveCuspHA((D,N) => norm(360-D/3), mc+30)
const L_h12 = solveCuspHA((D,N) => norm(360-2*D/3), mc+60)
const L_h2  = solveCuspHA((D,N) => D+N/3, 275)
const L_h3  = solveCuspHA((D,N) => D+2*N/3, 320)

const SIGNS=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const cusps_ha=[asc,L_h2,L_h3,ic,norm(L_h11+180),norm(L_h12+180),dsc,norm(L_h2+180),norm(L_h3+180),mc,L_h11,L_h12]
console.log('HA-fraction Cusps:')
cusps_ha.forEach((c,i)=>{const n=norm(c);console.log('H'+(i+1)+': '+n.toFixed(2)+' '+SIGNS[Math.floor(n/30)]+' '+(n%30).toFixed(2))})

function getHouse(lon, cusps) {
  for(let i=0;i<12;i++){const s=norm(cusps[i]),e=norm(cusps[(i+1)%12]);if(s<=e?(lon>=s&&lon<e):(lon>=s||lon<e))return i+1}
  return 1
}
const gh = lon => getHouse(lon, cusps_ha)
console.log('')
console.log('Sun (306.38): H'+gh(306.38)+' should H2')
console.log('Moon (50.91): H'+gh(50.91)+' should H6')
console.log('Neptune (278.73): H'+gh(278.73)+' should H2')
console.log('Mercury (324.87): H'+gh(324.87)+' should H3')
console.log('Venus (343.91): H'+gh(343.91)+' should H3')
console.log('Jupiter (22.74): H'+gh(22.74)+' should H5')
console.log('Pluto (218.04): H'+gh(218.04)+' should H12')
console.log('Chiron (83.79): H'+gh(83.79)+' should H7')
console.log('Lilith (138.04): H'+gh(138.04)+' should H9')
console.log('POF (134.80): H'+gh(134.80)+' should H9')
console.log('Vertex (102.31): H'+gh(102.31)+' should H8')
