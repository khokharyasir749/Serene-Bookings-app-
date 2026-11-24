import { ChevronDown } from '@/components/icons';
import { memo, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { C, T } from '@/theme';

// Single-tap collapsible section: title + short summary; the chevron turns and the body fades in.
function Accordion({ title, summary, children, first }: { title: string; summary?: string; children: ReactNode; first?: boolean }) {
  const [open, setOpen] = useState(false);
  const r = useSharedValue(0);
  const chevron = useAnimatedStyle(() => ({ transform: [{ rotate: `${r.get() * 180}deg` }] }));

  const toggle = () => {
    r.set(withTiming(open ? 0 : 1, { duration: 200 }));
    setOpen((o) => !o);
  };

  return (
    <View style={[styles.wrap, first && { borderTopWidth: StyleSheet.hairlineWidth }]}>
      <Pressable onPress={toggle} style={styles.head} accessibilityRole="button" accessibilityState={{ expanded: open }}>
        <View style={{ flex: 1 }}>
          <Text style={T.h3}>{title}</Text>
          {summary && !open && (
            <Text style={[T.small, { marginTop: 2 }]} numberOfLines={1}>
              {summary}
            </Text>
          )}
        </View>
        <Animated.View style={[styles.chev, chevron]}>
          <ChevronDown size={18} color={C.ink} strokeWidth={1.75} />
        </Animated.View>
      </Pressable>
      {open && (
        <Animated.View entering={FadeIn.duration(180)} style={{ paddingBottom: 20 }}>
          {children}
        </Animated.View>
      )}
    </View>
  );
}

export default memo(Accordion);

const styles = StyleSheet.create({
  wrap: { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: C.lineStrong },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 18 },
  chev: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
});