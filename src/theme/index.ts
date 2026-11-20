import { StyleSheet } from 'react-native';

// Design tokens, matched to the Serene Groups app (src/core/constants/theme.ts):
//   Deep Forest Pine  #123524 / #1B4332   brand, ink, executive cards, primary actions
//   Champagne Gold    #C8A46A             accents on Pine, crest rings, badges
//   Warm Alabaster    #FAF8F4             canvas
//   Ivory             #FFFDF9             cards and inputs, with Stone hairlines #E4DDD0
//   Stone             #ECE6DA             quiet fills (chips, icon wells)
//   Snow              #ECEEED             text on Pine
const PINE = '#123524';
const FOREST = '#1B4332';
const GOLD = '#C8A46A';
const ALABASTER = '#FAF8F4';
const IVORY = '#FFFDF9';
const STONE = '#ECE6DA';
const STONE_LINE = '#E4DDD0';
const SNOW = '#ECEEED';

const pine = (a: number) => `rgba(18, 53, 36, ${a})`;
const snow = (a: number) => `rgba(236, 238, 237, ${a})`;
const gold = (a: number) => `rgba(200, 164, 106, ${a})`;
const white = (a: number) => `rgba(255, 255, 255, ${a})`;

// Token names are kept from the first palette so every screen picks the new scheme up unchanged:
// sand = canvas, white = card surface, snow = quiet fill, cream* = text on Pine.
export const C = {
  sand: ALABASTER,
  pine: PINE,
  pineDeep: PINE,
  forest: FOREST,
  snow: STONE,
  white: IVORY,
  pureWhite: '#FFFFFF',
  ink: PINE,
  ink70: pine(0.78),
  ink55: pine(0.6),
  ink40: pine(0.42),
  line: STONE_LINE,
  lineStrong: pine(0.2),
  cream: SNOW,
  cream70: snow(0.8),
  cream45: snow(0.45),
  gold: GOLD,
  goldSoft: gold(0.16),
  goldLine: gold(0.45),
  positive: '#1D7348',
  danger: '#B42318',
  // Glass dock (frosted glassmorphic tokens)
  dockGlass: 'rgba(255, 255, 255, 0.86)',
  dockActive: PINE,
  dockBorder: 'rgba(255, 255, 255, 0.92)',
  dockInactive: pine(0.55),
} as const;

// Cormorant Garamond for editorial display, Plus Jakarta Sans for UI and numerals (loaded in app/_layout.tsx).
export const FONTS = {
  displayMedium: 'CormorantGaramond_500Medium',
  displayItalic: 'CormorantGaramond_500Medium_Italic',
  display: 'CormorantGaramond_600SemiBold',
  displayBold: 'CormorantGaramond_700Bold',
  ui: 'PlusJakartaSans_400Regular',
  uiMedium: 'PlusJakartaSans_500Medium',
  uiSemi: 'PlusJakartaSans_600SemiBold',
  uiBold: 'PlusJakartaSans_700Bold',
} as const;

export const F = { display: FONTS.display, sans: FONTS.ui };

// radius: buttons & inputs · card: cards & photos · tabBar: height of the floating dock.
export const S = { gutter: 20, radius: 14, card: 22, photo: 20, tabBar: 64 };

/** Bottom padding a tab screen needs so its last item clears the floating dock. */
export const tabBarSpace = (bottomInset: number) => S.tabBar + bottomInset + 10 + 36;

export const shadow = {
  card: { shadowColor: '#123524', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 3 },
  cardHover: { shadowColor: '#123524', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 6 },
  pill: { shadowColor: '#123524', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  dock: { shadowColor: '#000000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.28, shadowRadius: 26, elevation: 10 },
} as const;

// One type scale for the whole app:
//   h1 screen titles · h2 section headings · h3 card titles · body copy · small meta · caps labels · price.
// Display sizes are tuned for Cormorant's small x-height; numbers use tabular figures.
export const T = StyleSheet.create({
  h1: { fontFamily: FONTS.display, fontSize: 36, lineHeight: 40, letterSpacing: -0.4, color: C.ink },
  h2: { fontFamily: FONTS.display, fontSize: 27, lineHeight: 31, letterSpacing: -0.3, color: C.ink },
  h3: { fontFamily: FONTS.display, fontSize: 21, lineHeight: 25, color: C.ink },
  eyebrow: { fontFamily: FONTS.uiSemi, fontSize: 10.5, lineHeight: 14, letterSpacing: 1.6, textTransform: 'uppercase', color: C.ink55 },
  caps: { fontFamily: FONTS.uiBold, fontSize: 10.5, letterSpacing: 1.6, textTransform: 'uppercase', color: C.ink },
  display: { fontFamily: FONTS.display, color: C.ink },
  body: { fontFamily: FONTS.ui, fontSize: 15, lineHeight: 22, color: C.ink70 },
  small: { fontFamily: FONTS.ui, fontSize: 13, lineHeight: 18, color: C.ink55 },
  price: { fontFamily: FONTS.uiBold, fontSize: 18, lineHeight: 23, letterSpacing: -0.2, color: C.ink, fontVariant: ['tabular-nums'] },
});
