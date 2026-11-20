import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useSyncExternalStore, type ComponentProps, type ComponentRef, type RefObject } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { scrollActiveToTop, useScrollTopVisible } from '@/components/ScrollTop';
import { Text } from '@/components/Text';
import { C, FONTS, S, shadow } from '@/theme';

type Glyph = ComponentProps<typeof Ionicons>['name'];
export type DockProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  descriptors: Record<string, { options: { title?: string } }>;
  navigateToTab: (routeKey: string) => void;
};

const ICON_MAP: Record<string, { active: Glyph; inactive: Glyph; label: string }> = {
  index: { active: 'compass', inactive: 'compass-outline', label: 'Discover' },
  apartments: { active: 'bed', inactive: 'bed-outline', label: 'Stay' },
  trips: { active: 'calendar', inactive: 'calendar-outline', label: 'Trips' },
};

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
  snapshot = {
    state: next.state,
    descriptors: next.descriptors,
    navigateToTab: (key) => (latest ?? next).navigateToTab(key),
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
export function DockBridge(props: DockProps) {
  useEffect(() => {
    publish(props);
  });
  return null;
}

function DockItem({
  iconActive,
  iconInactive,
  label,
  focused,
  onPress,
}: {
  iconActive: Glyph;
  iconInactive: Glyph;
  label: string;
  focused: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) =>
    Animated.spring(scale, { toValue: v, speed: 45, bounciness: 6, useNativeDriver: true }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => to(0.92)}
      onPressOut={() => to(1)}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      style={styles.item}
    >
      <Animated.View
        style={[
          styles.pill,
          focused ? styles.pillActive : styles.pillInactive,
          { transform: [{ scale }] },
        ]}
      >
        <Ionicons
          name={focused ? iconActive : iconInactive}
          size={focused ? 19 : 22}
          color={focused ? C.pine : C.dockInactive}
        />
        {focused && (
          <Text style={styles.activeLabel} numberOfLines={1}>
            {label}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

/** The Shakuro floating dark capsule dock */
export function FloatingDock({ blurTarget }: { blurTarget?: RefObject<ComponentRef<typeof View> | null> }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dock = useDock();
  const showTop = useScrollTopVisible();
  if (!dock) return null;
  const { state, descriptors, navigateToTab } = dock;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: Math.max(14, insets.bottom + 6) }]}>
      <View style={styles.dock}>
        {state.routes.map((r, i) => {
          const cfg = ICON_MAP[r.name];
          if (!cfg) return null;
          const focused = state.index === i;
          const label = descriptors[r.key]?.options.title ?? cfg.label;
          return (
            <DockItem
              key={r.key}
              iconActive={cfg.active}
              iconInactive={cfg.inactive}
              label={label}
              focused={focused}
              onPress={() => !focused && navigateToTab(r.key)}
            />
          );
        })}
        {/* Menu item */}
        <DockItem
          iconActive="menu"
          iconInactive="menu-outline"
          label="Menu"
          focused={false}
          onPress={() => router.push('/menu')}
        />
      </View>

      {showTop && (
        <View style={styles.top}>
          <Pressable
            onPress={scrollActiveToTop}
            style={styles.topHit}
            accessibilityRole="button"
            accessibilityLabel="Scroll to top"
          >
            <Ionicons name="chevron-up" size={17} color={C.pureWhite} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    paddingHorizontal: 10,
    borderRadius: 36,
    backgroundColor: C.pine,
    width: '100%',
    ...shadow.dock,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  pillActive: {
    backgroundColor: C.pureWhite,
    paddingHorizontal: 16,
    paddingVertical: 9,
    gap: 6,
    ...shadow.pill,
  },
  pillInactive: {
    backgroundColor: 'transparent',
    width: 48,
    height: 48,
  },
  activeLabel: {
    fontSize: 13,
    fontFamily: FONTS.uiBold,
    color: C.pine,
  },
  top: {
    position: 'absolute',
    right: 4,
    top: -46,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.pine,
    ...shadow.pill,
  },
  topHit: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
