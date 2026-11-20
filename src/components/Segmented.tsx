import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { EASE } from '@/components/ui';
import { C, FONTS } from '@/theme';

// Two-or-more option toggle with a sliding thumb. `dark` sits on photography.
export default function Segmented<T extends string>({ options, value, onChange, dark }: { options: { key: T; label: string }[]; value: T; onChange: (v: T) => void; dark?: boolean }) {
  const [w, setW] = useState(0);
  const idx = Math.max(0, options.findIndex((o) => o.key === value));
  const seg = w / options.length;
  const x = useSharedValue(0);
  const tw = useSharedValue(0);
  const placed = useRef(false);

  useEffect(() => {
    if (!seg) return;
    tw.set(seg - 4);
    x.set(placed.current ? withTiming(idx * seg + 2, { duration: 300, easing: EASE }) : idx * seg + 2);
    placed.current = true;
  }, [seg, idx, tw, x]);

  const thumb = useAnimatedStyle(() => ({ width: tw.get(), transform: [{ translateX: x.get() }] }));

  return (
    <View onLayout={(e) => setW(e.nativeEvent.layout.width)} style={[styles.track, dark ? styles.trackDark : styles.trackLight]}>
      {w > 0 && <Animated.View style={[styles.thumb, { backgroundColor: dark ? C.sand : C.pine }, thumb]} />}
      {options.map((o) => {
        const on = o.key === value;
        return (
          <Pressable key={o.key} onPress={() => onChange(o.key)} style={styles.opt} accessibilityRole="button" accessibilityState={{ selected: on }}>
            <Text style={[styles.label, { color: on ? (dark ? C.pine : C.sand) : dark ? C.sand : C.ink70 }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', borderRadius: 999, padding: 2, borderWidth: StyleSheet.hairlineWidth },
  trackDark: { backgroundColor: 'rgba(20,30,27,0.42)', borderColor: C.cream45 },
  trackLight: { backgroundColor: C.pureWhite, borderColor: C.line },
  thumb: { position: 'absolute', top: 2, bottom: 2, borderRadius: 999 },
  opt: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 9, paddingHorizontal: 16 },
  label: { fontSize: 13, fontFamily: FONTS.uiSemi },
});
