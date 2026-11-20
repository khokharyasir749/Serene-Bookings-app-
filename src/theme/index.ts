import { StyleSheet } from 'react-native';

// Design tokens aligned with the Serene luxury brand system and Dribbble layout:
//   Deep Forest Pine  #123524 / #1B4332   brand, primary actions, titles, floating dock
//   Champagne Gold    #C8A46A             luxury accents, crest rings, active badges
//   Warm Alabaster    #FAF8F4             warm canvas
//   Sand              #F5F2EB             subtle background wells
//   Ivory             #FFFDF9             card surfaces and modals
//   Pure White        #FFFFFF             pure white cards & active pills
//   Stone             #ECE6DA             quiet fills, inactive chips
//   Stone Line        #E4DDD0             crisp hairlines
//   Snow              #ECEEED             text on pine

const PINE = '#123524';
const FOREST = '#1B4332';
const GOLD = '#C8A46A';
const ALABASTER = '#FAF8F4';
const SAND = '#F5F2EB';
const IVORY = '#FFFDF9';
const STONE = '#ECE6DA';
const STONE_LINE = '#E4DDD0';
const SNOW = '#ECEEED';
const CORAL = '#C8A46A'; // aligned to brand gold accent

const pine = (a: number) => `rgba(18, 53, 36, ${a})`;
const snow = (a: number) => `rgba(236, 238, 237, ${a})`;
const gold = (a: number) => `rgba(200, 164, 106, ${a})`;
const white = (a: number) => `rgba(255, 255, 255, ${a})`;

export const C = {
  sand: ALABASTER,
  canvas: ALABASTER,
  warmSand: SAND,
  pine: PINE,
  pineDeep: '#0D2419',
  forest: FOREST,
  snow: STONE,
  white: IVORY,
  pureWhite: '#FFFFFF',
  fill: STONE,
  ink: PINE,
  ink70: pine(0.78),
  ink55: pine(0.60),
  ink40: pine(0.42),
  line: STONE_LINE,
  lineStrong: pine(0.20),
  cream: SNOW,
  cream70: snow(0.80),
  cream45: snow(0.45),
  gold: GOLD,
  goldSoft: gold(0.16),
  goldLine: gold(0.45),
  coral: GOLD,
  coralSoft: gold(0.16),
  positive: '#1B6A47',
  danger: '#B42318',
  // Floating dock tokens
  dockBg: PINE,
  dockGlass: PINE,
  dockActive: '#FFFFFF',
  dockBorder: gold(0.45),
  dockInactive: 'rgba(236, 238, 237, 0.70)',
} as const;

// Plus Jakarta Sans for UI, Cormorant Garamond for luxury editorial headings
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

export const S = {
  gutter: 20,
  radius: 16,
  card: 24,
  photo: 20,
  pill: 999,
  tabBar: 64,
};

/** Bottom padding a tab screen needs so its last item clears the floating dock. */
export const tabBarSpace = (bottomInset: number) => S.tabBar + bottomInset + 20;

export const shadow = {
  card: {
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  cardHover: {
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 22,
    elevation: 6,
  },
  dock: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  pill: {
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
} as const;

export const T = StyleSheet.create({
  h1: { fontFamily: FONTS.display, fontSize: 32, lineHeight: 36, letterSpacing: -0.4, color: C.ink },
  h2: { fontFamily: FONTS.display, fontSize: 25, lineHeight: 30, letterSpacing: -0.3, color: C.ink },
  h3: { fontFamily: FONTS.uiBold, fontSize: 19, lineHeight: 24, letterSpacing: -0.2, color: C.ink },
  eyebrow: { fontFamily: FONTS.uiSemi, fontSize: 13, lineHeight: 17, color: C.ink55 },
  caps: { fontFamily: FONTS.uiBold, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: C.ink },
  display: { fontFamily: FONTS.display, color: C.ink },
  body: { fontFamily: FONTS.ui, fontSize: 15, lineHeight: 22, color: C.ink70 },
  small: { fontFamily: FONTS.ui, fontSize: 13, lineHeight: 18, color: C.ink55 },
  price: { fontFamily: FONTS.uiBold, fontSize: 18, lineHeight: 23, letterSpacing: -0.2, color: C.ink, fontVariant: ['tabular-nums'] },
});
