import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { BackHandler, Keyboard, Linking, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/Text';
import { CONTACT } from '@/data/contact';
import { C, FONTS, S } from '@/theme';

type Item = { n: string; label: string; sub: string; go: () => void };

// Full-screen navigation overlay on Deep Forest Pine: numbered serif destinations, the way the web's menu reads.
export default function Menu() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [hot, setHot] = useState<string | null>(null);

  // Curtain, as on the web (globals.css .menu-in: clip-path inset(0 0 100% 0) → inset(0), 0.8 s, cubic-bezier(0.77, 0, 0.18, 1)).
  // Transform-only so it stays on the GPU: the Pine layer slides down from above while the content is counter-shifted,
  // which leaves the content still and reveals it from the top downward. Closing lifts it back up.
  const { height } = useWindowDimensions();
  const H = height + 80;
  const p = useSharedValue(0);
  const closing = useRef(false);
  const [closingState, setClosingState] = useState(false);
  const [lightBar, setLightBar] = useState(false);
  const curtain = useAnimatedStyle(() => ({ transform: [{ translateY: -(1 - p.get()) * H }] }));
  const inner = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - p.get()) * H }] }));

  useEffect(() => {
    p.set(withTiming(1, { duration: 760, easing: Easing.bezier(0.77, 0, 0.18, 1) }));
    const t = setTimeout(() => setLightBar(true), 260); // white status-bar icons once the Pine covers the top edge
    return () => clearTimeout(t);
  }, [p]);

  /** Lift the curtain, then leave the screen and (optionally) carry on to a destination. */
  const closeThen = (then?: () => void) => {
    if (closing.current) return;
    closing.current = true;
    setClosingState(true);
    Keyboard.dismiss();
    p.set(withTiming(0, { duration: 560, easing: Easing.bezier(0.77, 0, 0.18, 1) }));
    setTimeout(() => setLightBar(false), 300);
    setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      }
      if (then) setTimeout(then, 60);
    }, 580);
  };

  // Android's back button lifts the curtain too.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      closeThen();
      return true;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tab destinations: lift the curtain, then switch tab. Sub-screens open on top, so back returns to the menu.
  const toTab = (path: '/' | '/apartments') => () =>
    closeThen(() => {
      if (path !== '/') {
        router.navigate(path);
      }
    });

  const items: Item[] = [
    { n: '01', label: 'Home', sub: 'Discover Serene Heights', go: toTab('/') },
    { n: '02', label: 'Apartments', sub: 'Five one-bedroom layouts', go: toTab('/apartments') },
    { n: '03', label: 'Amenities', sub: '50+ resort facilities', go: () => router.push('/amenities') },
    { n: '04', label: 'Floor plans', sub: 'Find your apartment', go: () => router.push('/floor-plans') },
    { n: '05', label: 'Location & contact', sub: 'Getting here, call or WhatsApp', go: () => router.push('/location') },
    {
      n: '06',
      label: 'Find a booking', sub: 'No account needed',
      go: () => {
        Keyboard.dismiss();
        router.push('/find-booking');
      },
    },
  ];

  const quick = [CONTACT.lines[0], CONTACT.lines[1]];

  return (
    <View style={styles.stage} pointerEvents={closingState ? 'none' : 'auto'}>
      <StatusBar style={lightBar ? 'light' : 'dark'} />
      <Animated.View style={[styles.curtain, curtain]}>
      <Animated.View style={[styles.root, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 16 }, inner]}>
      <View style={styles.top}>
        <Text style={styles.place}>Serene Heights · Nathia Gali</Text>
        <Pressable onPress={() => closeThen()} hitSlop={14} style={styles.close} accessibilityRole="button" accessibilityLabel="Close menu">
          <Text style={styles.closeText}>Close</Text>
          <Ionicons name="close-outline" size={18} color={C.cream} />
        </Pressable>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: 18, paddingBottom: 12 }} showsVerticalScrollIndicator={false}>
        {items.map((it, i) => {
          const on = hot === it.n;
          return (
            <Animated.View key={it.n} entering={FadeInDown.delay(250 + i * 60).duration(700).easing(Easing.bezier(0.22, 1, 0.36, 1))}>
              <Pressable
                onPress={it.go}
                onPressIn={() => setHot(it.n)}
                onPressOut={() => setHot(null)}
                accessibilityRole="link"
                accessibilityLabel={it.label}
                style={styles.item}>
                <Text style={[styles.num, on && { color: C.cream }]}>{it.n}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, on && { color: C.gold }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
                    {it.label}
                  </Text>
                  <Text style={styles.sub} numberOfLines={1}>{it.sub}</Text>
                </View>
                <View style={[styles.go, on && styles.goOn]}>
                  <Ionicons name="arrow-forward-outline" size={16} color={on ? C.pine : C.cream} />
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>

      <View style={styles.foot}>
        {quick.map((q) => (
          <Pressable key={q.label} onPress={() => void Linking.openURL(q.href).catch(() => {})} style={({ pressed }) => [styles.quick, pressed && { opacity: 0.7 }]} accessibilityRole="link" accessibilityLabel={`${q.label}: ${q.value}`}>
            <Ionicons name={q.icon as never} size={17} color={C.gold} />
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.quickLabel}>{q.label}</Text>
              <Text style={styles.quickValue} numberOfLines={1}>{q.value}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      <Text style={styles.small}>Serene Heights · DM Consortium · since 2017</Text>
      </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, backgroundColor: 'transparent' },
  curtain: { flex: 1, overflow: 'hidden', backgroundColor: C.pine },
  root: { flex: 1, backgroundColor: C.pine, paddingHorizontal: S.gutter + 2 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.goldLine },
  place: { color: C.cream70, fontFamily: FONTS.uiSemi, fontSize: 13 },
  close: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingLeft: 14, paddingRight: 10, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(236, 238, 237, 0.3)' },
  closeText: { color: C.cream, fontFamily: FONTS.uiSemi, fontSize: 13 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(236, 238, 237, 0.14)' },
  num: { width: 24, color: C.gold, fontFamily: FONTS.uiBold, fontSize: 12, fontVariant: ['tabular-nums'] },
  label: { color: C.cream, fontFamily: FONTS.display, fontSize: 32, lineHeight: 36 },
  sub: { color: C.cream45, fontFamily: FONTS.ui, fontSize: 12.5, marginTop: 1 },
  go: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: 'rgba(236, 238, 237, 0.25)', alignItems: 'center', justifyContent: 'center' },
  goOn: { backgroundColor: C.gold, borderColor: C.gold },
  foot: { flexDirection: 'row', gap: 10, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.goldLine },
  quick: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, height: 56, paddingHorizontal: 14, borderRadius: 18, backgroundColor: 'rgba(236, 238, 237, 0.07)', borderWidth: 1, borderColor: 'rgba(236, 238, 237, 0.14)' },
  quickLabel: { color: C.cream45, fontFamily: FONTS.uiSemi, fontSize: 11 },
  quickValue: { color: C.cream, fontFamily: FONTS.uiSemi, fontSize: 13, marginTop: 1, fontVariant: ['tabular-nums'] },
  small: { color: C.cream45, fontFamily: FONTS.ui, fontSize: 11, marginTop: 14 },
});
