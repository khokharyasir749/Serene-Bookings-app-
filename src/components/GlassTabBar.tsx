import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useSyncExternalStore, type ComponentProps, type ComponentRef, type RefObject } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import GlassSurface from '@/components/GlassSurface';
import { scrollActiveToTop, useScrollTopVisible } from '@/components/ScrollTop';
import { Text } from '@/components/Text';
import { C, FONTS, S, shadow } from '@/theme';

// Floating glass dock, ported from the Serene Groups app (src/core/components/FloatingDock.tsx): clear glass with a
// specular hairline, a sheer white active pill with Pine icon + label, and a 32 px up-arrow above its right edge
// once the page is scrolled past 140 px.

type Glyph = ComponentProps<typeof Ionicons>['name'];
export type DockProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  descriptors: Record<string, { options: { title?: string } }>;
  navigation?: any;
  navigateToTab?: (routeKey: string, routeName?: string) => void;
};

const ICON: Record<string, Glyph> = { index: 'compass-outline', apartments: 'bed-outline', trips: 'calendar-outline' };
const DOCK_RADIUS = 32;

// The navigator hands over fresh props on every render; keep the newest outside React and only re-render the dock
// when the active tab or the routes change.
let latest: any = null;
let snapshot: any = null;
let signature = '';
const listeners = new Set<() => void>();
const sig = (p: any) => `${p?.state?.index ?? 0}|${p?.state?.routes?.map((r: any) => r.key).join(',') ?? ''}`;

function publish(next: any) {
  latest = next;
  const s = sig(next);
  if (s === signature) return;
  signature = s;
  snapshot = {
    state: next.state,
    descriptors: next.descriptors,
    navigation: next.navigation,
    navigateToTab: (routeKey: string, routeName?: string) => {
      const active = latest ?? next;
      const nav = active?.navigation;
      if (!nav) return;
      const targetRoute = active.state?.routes?.find((r: any) => r.key === routeKey || r.name === routeName);
      const name = targetRoute ? targetRoute.name : routeName;
      const key = targetRoute ? targetRoute.key : routeKey;

      const event = nav.emit?.({
        type: 'tabPress',
        target: key,
        canPreventDefault: true,
      });
      if (!event?.defaultPrevented && name) {
        nav.navigate(name);
      }
    },
  };
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
export function DockBridge(props: any) {
  useEffect(() => {
    publish(props);
  });
  return null;
}

function Item({ icon, label, focused, onPress }: { icon: Glyph; label: string; focused: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(scale, { toValue: v, speed: 40, bounciness: 6, useNativeDriver: true }).start();
  const iconColor = focused ? C.pine : C.dockInactive;
  const textColor = focused ? C.pine : C.dockInactive;
  return (
    <Pressable onPress={onPress} onPressIn={() => to(0.92)} onPressOut={() => to(1)} accessibilityRole="tab" accessibilityState={{ selected: focused }} accessibilityLabel={label} style={styles.item}>
      <Animated.View style={[styles.pill, focused && styles.pillOn, { transform: [{ scale }] }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

/** The dock itself, rendered beside the tabs navigator with frosted glass surface. */
export function FloatingDock({ blurTarget }: { blurTarget?: RefObject<ComponentRef<typeof View> | null> }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dock = useDock();
  const showTop = useScrollTopVisible();
  if (!dock) return null;
  const { state, descriptors, navigateToTab } = dock;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + 10 }]}>
      <View pointerEvents="box-none" style={styles.dockShadow}>
        <GlassSurface blurTarget={blurTarget} radius={DOCK_RADIUS} intensity={60} style={styles.dock}>
          {state.routes.map((r: any, i: number) => {
            const icon = ICON[r.name];
            if (!icon) return null;
            const focused = state.index === i;
            return (
              <Item
                key={r.key}
                icon={icon}
                label={(descriptors[r.key]?.options?.title ?? r.name).toUpperCase()}
                focused={focused}
                onPress={() => !focused && navigateToTab?.(r.key, r.name)}
              />
            );
          })}
          <Item icon="menu-outline" label="MENU" focused={false} onPress={() => router.push('/menu')} />
        </GlassSurface>
      </View>
      {showTop && (
        <View pointerEvents="box-none" style={styles.topShadow}>
          <GlassSurface blurTarget={blurTarget} radius={16} intensity={60} style={styles.top}>
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
  wrap: { position: 'absolute', left: 20, right: 20 },
  dockShadow: { borderRadius: DOCK_RADIUS, backgroundColor: 'transparent', ...shadow.dock },
  topShadow: { position: 'absolute', right: 0, top: -42, borderRadius: 16, backgroundColor: 'transparent', ...shadow.pill },
  top: { width: 32, height: 32 },
  topHit: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  dock: { flexDirection: 'row', alignItems: 'center', height: S.tabBar, paddingHorizontal: 8 },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  pill: { alignItems: 'center', justifyContent: 'center', gap: 2, paddingHorizontal: 8, minWidth: 66, height: 48, borderRadius: 999, borderWidth: 1, borderColor: 'transparent' },
  pillOn: { backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: 'rgba(255, 255, 255, 0.95)', ...shadow.pill },
  label: { fontSize: 10, fontFamily: FONTS.uiBold, letterSpacing: 1.2 },
});
