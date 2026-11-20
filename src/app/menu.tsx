import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { BackHandler, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/Text';
import { CONTACT } from '@/data/contact';
import { C, FONTS, S } from '@/theme';

type Item = { n: string; label: string; go: () => void };

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
    p.set(withTiming(0, { duration: 560, easing: Easing.bezier(0.77, 0, 0.18, 1) }));
    setTimeout(() => setLightBar(false), 300);
    setTimeout(() => {
      router.back();
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
  const toTab = (path: '/' | '/apartments') => () => closeThen(() => router.navigate(path));

  const items: Item[] = [
    { n: '01', label: 'Home', go: toTab('/') },
    { n: '02', label: 'Apartments', go: toTab('/apartments') },
    { n: '03', label: 'Amenities', go: () => router.push('/amenities') },
    { n: '04', label: 'Floor plans', go: () => router.push('/floor-plans') },
    { n: '05', label: 'Location & contact', go: () => router.push('/location') },
    {
      n: '06',
      label: 'Find a booking',
      go: () => router.push('/find-booking'),
    },
  ];

  const quick = [CONTACT.lines[0], CONTACT.lines[1]];

  return (
    <View style={styles.stage}>
      <StatusBar style={lightBar ? 'light' : 'dark'} />
      <Animated.View style={[styles.curtain, curtain]}>
      <Animated.View style={[styles.root, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 16 }, inner]}>
      <View style={styles.top}>
        <Text style={styles.place}>NATHIA GALI</Text>
        <Pressable onPress={() => closeThen()} hitSlop={14} style={styles.close} accessibilityRole="button" accessibilityLabel="Close menu">
          <Text style={styles.closeText}>CLOSE</Text>
          <Ionicons name="close-outline" size={18} color={C.cream} />
        </Pressable>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
                  <Text style={[styles.label, on && { color: C.gold }]} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>
                    {it.label.toUpperCase()}
                  </Text>
                  <Ionicons name="arrow-forward-outline" size={20} color={C.gold} style={{ opacity: on ? 1 : 0 }} />
                </Pressable>
              </Animated.View>
            );
          })}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.foot}>
        {quick.map((q) => (
          <Pressable key={q.label} onPress={() => void Linking.openURL(q.href).catch(() => {})} style={({ pressed }) => [styles.quick, pressed && { opacity: 0.7 }]} accessibilityRole="link" accessibilityLabel={`${q.label}: ${q.value}`}>
            <Ionicons name={q.icon as never} size={16} color={C.gold} />
            <View>
              <Text style={styles.quickLabel}>{q.label.toUpperCase()}</Text>
              <Text style={styles.quickValue}>{q.value}</Text>
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
  place: { color: C.cream70, fontFamily: FONTS.uiBold, fontSize: 11, letterSpacing: 2.4 },
  close: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4 },
  closeText: { color: C.cream, fontFamily: FONTS.uiBold, fontSize: 11, letterSpacing: 2 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 17, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(236, 238, 237, 0.14)' },
  num: { width: 26, color: C.gold, fontFamily: FONTS.uiBold, fontSize: 11, letterSpacing: 1.4, fontVariant: ['tabular-nums'] },
  label: { flex: 1, color: C.cream, fontFamily: FONTS.display, fontSize: 36, lineHeight: 40, letterSpacing: 0.8 },
  foot: { flexDirection: 'row', gap: 12, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.goldLine },
  quick: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  quickLabel: { color: C.cream45, fontFamily: FONTS.uiBold, fontSize: 9, letterSpacing: 1.3 },
  quickValue: { color: C.cream, fontFamily: FONTS.uiSemi, fontSize: 13, marginTop: 1, fontVariant: ['tabular-nums'] },
  small: { color: C.cream45, fontFamily: FONTS.ui, fontSize: 11, marginTop: 14 },
});
