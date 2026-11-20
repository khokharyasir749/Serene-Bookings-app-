import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useSyncExternalStore, type ComponentProps, type ComponentRef, type RefObject } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import GlassSurface from '@/components/GlassSurface';
import { scrollActiveToTop, useScrollTopVisible } from '@/components/ScrollTop';
import { Text } from '@/components/Text';
import { C, FONTS, S } from '@/theme';

// Floating glass dock, ported from the Serene Groups app (src/core/components/FloatingDock.tsx): clear glass with a
// specular hairline, a sheer white active pill with Pine icon + label, and a 32 px up-arrow above its right edge
// once the page is scrolled past 140 px.

type Glyph = ComponentProps<typeof Ionicons>['name'];
export type DockProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  descriptors: Record<string, { options: { title?: string } }>;
  navigateToTab: (routeKey: string) => void;
};

const ICON: Record<string, Glyph> = { index: 'compass-outline', apartments: 'bed-outline', trips: 'calendar-outline' };
const DOCK_RADIUS = 32;

// The navigator hands over fresh props on every render; keep the newest outside React and only re-render the dock
// when the active tab or the routes change.
let latest: DockProps | null = null;
let snapshot: DockProps | null = null;
let signature = '';
const listeners = new Set<() => void>();
const sig = (p: DockProps) => `${p.state.index}|${p.state.routes.map((r) => r.key).join(',')}`;

function publish(next: DockProps) {
  latest = next;
  const s = sig(next);
  if (s === signature) return;
  signature = s;
  snapshot = { state: next.state, descriptors: next.descriptors, navigateToTab: (key) => (latest ?? next).navigateToTab(key) };
  listeners.forEach((l) => l());
}

const useDock = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
    () => snapshot,
  );

/** Rendered as the navigator's tab bar: syncs props to the store, draws nothing itself. */
export function DockBridge(props: DockProps) {
  useEffect(() => {
    publish(props);
  });
  return null;
}

function Item({ icon, label, focused, onPress }: { icon: Glyph; label: string; focused: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(scale, { toValue: v, speed: 40, bounciness: 6, useNativeDriver: true }).start();
  const tint = focused ? C.pine : C.dockInactive;
  return (
    <Pressable onPress={onPress} onPressIn={() => to(0.92)} onPressOut={() => to(1)} accessibilityRole="tab" accessibilityState={{ selected: focused }} accessibilityLabel={label} style={styles.item}>
      <Animated.View style={[styles.pill, focused && styles.pillOn, { transform: [{ scale }] }]}>
        <Ionicons name={icon} size={21} color={tint} />
        <Text style={[styles.label, { color: tint }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

/** The dock itself, rendered beside (not inside) the BlurTargetView so it can blur the page behind it. */
export function FloatingDock({ blurTarget }: { blurTarget?: RefObject<ComponentRef<typeof View> | null> }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dock = useDock();
  const showTop = useScrollTopVisible();
  if (!dock) return null;
  const { state, descriptors, navigateToTab } = dock;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + 10 }]}>
      <GlassSurface blurTarget={blurTarget} radius={DOCK_RADIUS} style={styles.dock}>
        {state.routes.map((r, i) => {
          const icon = ICON[r.name];
          if (!icon) return null;
          const focused = state.index === i;
          return <Item key={r.key} icon={icon} label={(descriptors[r.key]?.options.title ?? r.name).toUpperCase()} focused={focused} onPress={() => !focused && navigateToTab(r.key)} />;
        })}
        <Item icon="menu-outline" label="MENU" focused={false} onPress={() => router.push('/menu')} />
      </GlassSurface>
      {showTop && (
        <GlassSurface blurTarget={blurTarget} radius={16} intensity={30} style={styles.top}>
          <Pressable onPress={scrollActiveToTop} style={styles.topHit} accessibilityRole="button" accessibilityLabel="Scroll to top">
            <Ionicons name="chevron-up-outline" size={15} color={C.pine} />
          </Pressable>
        </GlassSurface>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 20, right: 20 },
  top: { position: 'absolute', right: 0, top: -42, width: 32, height: 32 },
  topHit: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  dock: { flexDirection: 'row', alignItems: 'center', height: S.tabBar, paddingHorizontal: 8 },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  pill: { alignItems: 'center', justifyContent: 'center', gap: 1, paddingHorizontal: 6, minWidth: 66, height: 48, borderRadius: 999, borderWidth: 1, borderColor: 'transparent' },
  pillOn: { backgroundColor: C.dockActive, borderColor: C.dockBorder },
  label: { fontSize: 10, fontFamily: FONTS.uiBold, letterSpacing: 1.2 },
});
