import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname, useRouter as useRawRouter } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useRef, useSyncExternalStore, type ComponentProps } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Path, Stop, LinearGradient as SvgGradient } from 'react-native-svg';

import GlassSurface from '@/components/GlassSurface';
import { scrollActiveToTop, useScrollTopVisible } from '@/components/ScrollTop';
import { useRouter } from '@/lib/nav';
import { C, S, shadow } from '@/theme';

// Liquid-notch dock: four equal slots in one clear glass pill. The active icon rises into a clear glass ball that sits in
// a smooth notch in the bar's top edge. The notch is one static SVG strip, two bars wide, that
// slides inside the clipped pill, so nothing is redrawn while it moves: only transform and opacity, on the UI thread.

type Glyph = ComponentProps<typeof Ionicons>['name'];
type Item = { name: string; path: '/' | '/apartments' | '/trips' | '/menu'; label: string; icon: Glyph; filled: Glyph };
const ITEMS: Item[] = [
  { name: 'index', path: '/', label: 'Discover', icon: 'compass-outline', filled: 'compass' },
  { name: 'apartments', path: '/apartments', label: 'Stay', icon: 'bed-outline', filled: 'bed' },
  { name: 'trips', path: '/trips', label: 'Trips', icon: 'calendar-outline', filled: 'calendar' },
  { name: 'menu', path: '/menu', label: 'Menu', icon: 'menu-outline', filled: 'menu' },
];
const MENU = ITEMS.length - 1;

const PINE = '#0F2A1E'; // a deeper Pine than the brand's, to read through clear glass

const H = S.tabBar;
const SIDE = 20;
const ICON = 22;
const ICON_Y = 30; // resting icon centre
const RISE = -16;
const BADGE = 44;
const BADGE_Y = ICON_Y + RISE; // badge centre
const RIM = [3, 5, 7, 9, 11, 13, 15]; // soft light along the inside of the glass edge
const GLOW = 18; // margin for the painted shadow
const SPRING = { damping: 21, stiffness: 250, mass: 0.8 };

/** The bar's top edge with its notch centred on `c`: a soft shoulder, an arc 4.5 px outside the badge, a soft shoulder. */
const topEdge = (c: number, width: number) =>
  `M0 0.5H${c - 43}C${c - 34} 0.5 ${c - 28} 7.3 ${c - 26.1} 18.1A26.5 26.5 0 0 0 ${c + 26.1} 18.1C${c + 28} 7.3 ${c + 34} 0.5 ${c + 43} 0.5H${width}`;

// ── Active tab, synced from the navigator ────────────────────────────────
let activeName = 'index';
const listeners = new Set<() => void>();
const useActiveName = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
    () => activeName,
  );

/** Rendered as the navigator's tab bar: reports the active tab, draws nothing itself. */
export function DockBridge({ state }: { state: { index: number; routes: readonly { name: string }[] } }) {
  const name = state.routes[state.index]?.name ?? 'index';
  useEffect(() => {
    if (name === activeName) return;
    activeName = name;
    listeners.forEach((l) => l());
  }, [name]);
  return null;
}

/** The glass: a static strip with one notch, moved under a pill-shaped clip. */
const Glass = memo(function Glass({ barW, x }: { barW: number; x: SharedValue<number> }) {
  const stripW = barW * 2;
  const c = stripW / 2;
  const edge = topEdge(c, stripW);
  // Sides and bottom of the pill, up round the shoulders; the rest of the top edge belongs to the sliding strip.
  const R = H / 2 - 0.5;
  const k = H / 2 - R * Math.SQRT1_2;
  const outline = `M${k} ${k}A${R} ${R} 0 0 0 ${H / 2} ${H - 0.5}H${barW - H / 2}A${R} ${R} 0 0 0 ${barW - k} ${k}`;
  const slide = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() - c }] }));
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* Soft static shadow along the sides and bottom only, so the notch itself stays clear. */}
      <Svg width={barW + GLOW * 2} height={H + GLOW * 2} style={styles.glow}>
        {[2, 5, 8, 11].map((w) => (
          <Path key={w} d={outline} transform={`translate(${GLOW} ${GLOW + 3})`} fill="none" stroke="#0B1F15" strokeOpacity={0.013} strokeWidth={w} strokeLinecap="round" />
        ))}
      </Svg>
      <View style={styles.clip}>
        <Animated.View renderToHardwareTextureAndroid style={[styles.strip, { width: stripW }, slide]}>
          <Svg width={stripW} height={H}>
            <Defs>
              {/* Clear glass: almost no body, a little light at the top and bottom. */}
              <SvgGradient id="dock-glass" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.24} />
                <Stop offset="0.45" stopColor="#FFFFFF" stopOpacity={0.07} />
                <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0.16} />
              </SvgGradient>
            </Defs>
            <Path d={`${edge}V${H}H0Z`} fill="url(#dock-glass)" />
            {RIM.map((w) => (
              <Path key={w} d={edge} fill="none" stroke="#FFFFFF" strokeOpacity={0.045} strokeWidth={w} strokeLinecap="round" />
            ))}
            <Path d={edge} fill="none" stroke="#FFFFFF" strokeWidth={1.25} />
          </Svg>
        </Animated.View>
      </View>
      <Svg width={barW} height={H} style={StyleSheet.absoluteFill}>
        {RIM.map((w) => (
          <Path key={w} d={outline} fill="none" stroke="#FFFFFF" strokeOpacity={0.045} strokeWidth={w} strokeLinecap="round" />
        ))}
        <Path d={outline} fill="none" stroke="#FFFFFF" strokeWidth={1.25} />
      </Svg>
    </View>
  );
});

const Slot = memo(function Slot({ i, g, colW }: { i: number; g: SharedValue<number>; colW: number }) {
  const t = ITEMS[i];
  const lift = useAnimatedStyle(() => ({ transform: [{ translateY: RISE * g.get() }] }));
  const outline = useAnimatedStyle(() => ({ opacity: Math.max(0, 1 - g.get() * 1.6) }));
  // The badge glides empty; the icon appears as it lands.
  const filled = useAnimatedStyle(() => ({ opacity: Math.min(1, Math.max(0, (g.get() - 0.55) / 0.4)) }));
  return (
    <Animated.View pointerEvents="none" style={[styles.icon, { left: colW * (i + 0.5) - ICON / 2 }, lift]}>
      <Animated.View style={[StyleSheet.absoluteFill, outline]}>
        <Ionicons name={t.icon} size={ICON} color={PINE} style={styles.halo} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, filled]}>
        <Ionicons name={t.filled} size={ICON} color={PINE} style={styles.halo} />
      </Animated.View>
    </Animated.View>
  );
});

export function FloatingDock() {
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const guarded = useRouter(); // 450 ms guard, for Menu
  const tabs = useRawRouter(); // tab switches can't stack screens, so they are never dropped
  const reduced = useReducedMotion();
  const active = useActiveName();
  const menuOpen = usePathname() === '/menu';
  const index = menuOpen ? MENU : Math.max(0, ITEMS.findIndex((t) => t.name === active));
  const showTop = useScrollTopVisible();

  const barW = Math.min(screenW - SIDE * 2, 440);
  const colW = barW / ITEMS.length;

  const g0 = useSharedValue(index === 0 ? 1 : 0);
  const g1 = useSharedValue(index === 1 ? 1 : 0);
  const g2 = useSharedValue(index === 2 ? 1 : 0);
  const g3 = useSharedValue(index === 3 ? 1 : 0);
  const grow = useMemo(() => [g0, g1, g2, g3], [g0, g1, g2, g3]);
  const x = useSharedValue(colW * (index + 0.5)); // centre of the active slot
  const follow = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));
  const shown = useRef(index);
  const menuAt = useRef(0);

  const moveTo = useCallback(
    (i: number) => {
      shown.current = i;
      const target = colW * (i + 0.5);
      x.set(reduced ? target : withSpring(target, SPRING));
      grow.forEach((g, j) => {
        const to = j === i ? 1 : 0;
        g.set(reduced ? to : withSpring(to, SPRING));
      });
    },
    [colW, grow, reduced, x],
  );

  // Follows the page: the menu opening and closing, a "See all" link, the back button.
  useEffect(() => {
    if (shown.current !== index) moveTo(index);
    // Only the page drives this; a resize re-seats the badge below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // A new window size: re-seat the badge without animating.
  useEffect(() => {
    x.set(colW * (shown.current + 0.5));
  }, [colW, x]);

  const select = useCallback(
    (i: number) => {
      if (Date.now() - menuAt.current < 450) return; // the menu is opening
      if (i === MENU) {
        menuAt.current = Date.now();
        guarded.navigate('/menu'); // the badge follows once the menu is really open
        return;
      }
      if (i === shown.current) return;
      moveTo(i);
      tabs.navigate(ITEMS[i].path);
    },
    [guarded, moveTo, tabs],
  );

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + 10 }]}>
      <View style={[styles.bar, { width: barW }]} accessibilityRole="tablist">
        <Glass barW={barW} x={x} />
        <Animated.View pointerEvents="none" style={[styles.follow, follow]}>
          <View style={styles.badge}>
            <LinearGradient colors={['rgba(255,255,255,0.38)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.24)']} locations={[0, 0.62, 1]} style={StyleSheet.absoluteFill} />
          </View>
        </Animated.View>
        {ITEMS.map((t, i) => (
          <Slot key={t.name} i={i} g={grow[i]} colW={colW} />
        ))}
        {ITEMS.map((t, i) => (
          <Pressable
            key={t.name}
            onPress={() => select(i)}
            hitSlop={{ top: 10 }}
            style={styles.hit}
            accessibilityRole={i === MENU ? 'button' : 'tab'}
            accessibilityState={i === MENU ? undefined : { selected: i === index }}
            accessibilityLabel={t.label}
          />
        ))}
      </View>
      {showTop && (
        <View pointerEvents="box-none" style={styles.topShadow}>
          <GlassSurface radius={16} intensity={60} style={styles.top}>
            <Pressable onPress={scrollActiveToTop} style={styles.topHit} accessibilityRole="button" accessibilityLabel="Scroll to top">
              <Ionicons name="chevron-up-outline" size={15} color={C.pine} />
            </Pressable>
          </GlassSurface>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: SIDE, right: SIDE, alignItems: 'center' },
  bar: { height: H, flexDirection: 'row' },
  glow: { position: 'absolute', left: -GLOW, top: -GLOW },
  clip: { ...StyleSheet.absoluteFill, borderRadius: H / 2, overflow: 'hidden' },
  strip: { position: 'absolute', left: 0, top: 0, height: H },
  follow: { position: 'absolute', left: 0, top: 0, width: 0, height: H },
  badge: {
    position: 'absolute',
    left: -BADGE / 2,
    top: BADGE_Y - BADGE / 2,
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    overflow: 'hidden',
    borderWidth: 1.25,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  icon: { position: 'absolute', top: ICON_Y - ICON / 2, width: ICON, height: ICON },
  // A soft light behind each icon, so Pine stays readable through clear glass on dark photos.
  halo: { padding: 14, margin: -14, textShadowColor: '#FFFFFF', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  hit: { flex: 1, height: H },
  topShadow: { position: 'absolute', right: 0, top: -52, borderRadius: 16, backgroundColor: 'transparent', ...shadow.pill },
  top: { width: 32, height: 32 },
  topHit: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
