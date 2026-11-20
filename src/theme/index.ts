import { StyleSheet } from 'react-native';

// Design tokens aligned with the Shakuro Hotel Booking Dribbble concept
// and Serene Heights luxury identity:
//   Pure White       #FFFFFF             primary cards, active tab pill, sheet backgrounds
//   Off-White Canvas #F7F8F9 / #F5F6F8   light clean modern canvas
//   Input Fill       #F4F5F7             search pills, inactive chips, counter wells
//   Dark Ink / Pine  #161E1A / #123524   primary buttons, floating dock, titles, active chips
//   Accent Coral     #FF5B5B             favorite heart, notification badge
//   Amber Star       #F5A623             rating star
//   Subtle Border    #E8EAEB / #EDEDED   hairlines, chip borders

const PINE = '#161E1A';
const FOREST = '#123524';
const GOLD = '#F5A623';
const CANVAS = '#F7F8FA';
const CARD_WHITE = '#FFFFFF';
const FILL_GREY = '#F4F5F7';
const LINE_GREY = '#E8EAEB';
const SNOW = '#FFFFFF';
const CORAL = '#FF5B5B';

const pine = (a: number) => `rgba(22, 30, 26, ${a})`;
const snow = (a: number) => `rgba(255, 255, 255, ${a})`;
const white = (a: number) => `rgba(255, 255, 255, ${a})`;

export const C = {
  sand: CANVAS,
  canvas: CANVAS,
  pine: PINE,
  pineDeep: '#0D1410',
  forest: FOREST,
  snow: FILL_GREY,
  white: CARD_WHITE,
  pureWhite: '#FFFFFF',
  fill: FILL_GREY,
  ink: PINE,
  ink70: pine(0.72),
  ink55: pine(0.55),
  ink40: pine(0.38),
  line: LINE_GREY,
  lineStrong: pine(0.18),
  cream: SNOW,
  cream70: snow(0.8),
  cream45: snow(0.45),
  gold: GOLD,
  goldSoft: 'rgba(245, 166, 35, 0.16)',
  goldLine: 'rgba(245, 166, 35, 0.45)',
  coral: CORAL,
  coralSoft: 'rgba(255, 91, 91, 0.12)',
  positive: '#10B981',
  danger: '#EF4444',
  // Floating dock tokens
  dockBg: '#161E1A',
  dockGlass: '#161E1A',
  dockActive: '#FFFFFF',
  dockBorder: 'rgba(255, 255, 255, 0.12)',
  dockInactive: 'rgba(255, 255, 255, 0.65)',
} as const;

// Plus Jakarta Sans for modern mobile UI, Cormorant Garamond for display headlines
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

// Geometries matching the Dribbble concept
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
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHover: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 20,
    elevation: 6,
  },
  dock: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 10,
  },
  pill: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
} as const;

export const T = StyleSheet.create({
  h1: { fontFamily: FONTS.displayBold, fontSize: 32, lineHeight: 38, letterSpacing: -0.5, color: C.ink },
  h2: { fontFamily: FONTS.displayBold, fontSize: 24, lineHeight: 30, letterSpacing: -0.3, color: C.ink },
  h3: { fontFamily: FONTS.displayBold, fontSize: 20, lineHeight: 25, letterSpacing: -0.2, color: C.ink },
  eyebrow: { fontFamily: FONTS.uiSemi, fontSize: 13, lineHeight: 17, color: C.ink55 },
  caps: { fontFamily: FONTS.uiBold, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: C.ink },
  display: { fontFamily: FONTS.display, color: C.ink },
  body: { fontFamily: FONTS.ui, fontSize: 15, lineHeight: 22, color: C.ink70 },
  small: { fontFamily: FONTS.ui, fontSize: 13, lineHeight: 18, color: C.ink55 },
  price: { fontFamily: FONTS.uiBold, fontSize: 19, lineHeight: 24, letterSpacing: -0.2, color: C.ink, fontVariant: ['tabular-nums'] },
});
