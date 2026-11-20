import { Image, type ImageStyle } from 'expo-image';
import { Check, ChevronLeft, Minus, Plus, X } from '@/components/icons';
import { memo, useEffect, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { Text } from '@/components/Text';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { photo } from '@/data/photos';
import { C, F, FONTS, S, T, shadow } from '@/theme';

export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

// ── Text ─────────────────────────────────────────────────────────────────
export function Caps({ children, style, color }: { children: ReactNode; style?: StyleProp<TextStyle>; color?: string }) {
  return <Text style={[T.caps, color ? { color } : null, style]}>{children}</Text>;
}

export function Display({ children, size = 30, style, color, upper }: { children: ReactNode; size?: number; style?: StyleProp<TextStyle>; color?: string; upper?: boolean }) {
  return (
    <Text style={[T.display, { fontSize: size, lineHeight: Math.round(size * 1.12), letterSpacing: upper ? size * 0.06 : 0 }, upper && { textTransform: 'uppercase' }, color ? { color } : null, style]}>
      {children}
    </Text>
  );
}

/** Small caps label followed by a hairline, the web's section opener. */
export function Label({ children, color = C.ink, style }: { children: ReactNode; color?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 14 }, style]}>
      <Caps color={color}>{children}</Caps>
      <View style={{ height: StyleSheet.hairlineWidth * 2, width: 44, backgroundColor: color, opacity: 0.35 }} />
    </View>
  );
}

export const Rule = ({ style }: { style?: StyleProp<ViewStyle> }) => <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: C.lineStrong }, style]} />;

// ── Media ────────────────────────────────────────────────────────────────
// Bundled photos via expo-image: cached in memory and on disk, recycled in lists, a short fade on first decode.
export const Photo = memo(function Photo({ src, style, contain }: { src: string; style?: StyleProp<ImageStyle>; contain?: boolean }) {
  return (
    <Image
      source={photo(src)}
      recyclingKey={src}
      cachePolicy="memory-disk"
      style={[{ backgroundColor: C.snow }, style]}
      contentFit={contain ? 'contain' : 'cover'}
      transition={150}
    />
  );
});

// ── Press feedback: a quiet scale, no glow ───────────────────────────────
// Layout props that must sit on the outer Pressable (so `flex`, `alignSelf` and margins work in a row or column).
const OUTER_KEYS = ['flex', 'flexGrow', 'flexShrink', 'flexBasis', 'alignSelf', 'width', 'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginHorizontal', 'marginVertical'] as const;

export function PressableScale({ children, onPress, style, disabled, scaleTo = 0.97 }: { children: ReactNode; onPress?: () => void; style?: StyleProp<ViewStyle>; disabled?: boolean; scaleTo?: number }) {
  const s = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.get() }] }));
  const flat = (StyleSheet.flatten(style) ?? {}) as Record<string, unknown>;
  const outer: Record<string, unknown> = {};
  const inner: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(flat)) ((OUTER_KEYS as readonly string[]).includes(k) ? outer : inner)[k] = v;
  if (outer.width !== undefined) inner.width = '100%';
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={outer as ViewStyle}
      onPressIn={() => s.set(withTiming(scaleTo, { duration: 120 }))}
      onPressOut={() => s.set(withSpring(1, { damping: 18, stiffness: 260 }))}>
      <Animated.View style={[inner as ViewStyle, a, disabled && { opacity: 0.45 }]}>{children}</Animated.View>
    </Pressable>
  );
}

export function Button({ label, onPress, variant = 'primary', icon, style, disabled }: { label: string; onPress?: () => void; variant?: 'primary' | 'secondary' | 'light'; icon?: ReactNode; style?: StyleProp<ViewStyle>; disabled?: boolean }) {
  const bg = variant === 'primary' ? C.pine : variant === 'light' ? C.pureWhite : C.pureWhite;
  const fg = variant === 'primary' ? C.cream : C.ink;
  return (
    <PressableScale onPress={onPress} disabled={disabled} style={[styles.btn, { backgroundColor: bg, borderColor: variant === 'primary' ? bg : C.line }, style]}>
      {icon}
      <Text style={[styles.btnText, { color: fg }]}>{label}</Text>
    </PressableScale>
  );
}

// ── Navigation chrome ────────────────────────────────────────────────────
export function BackBar({ onBack, title, right, light }: { onBack: () => void; title?: string; right?: ReactNode; light?: boolean }) {
  const insets = useSafeAreaInsets();
  const fg = light ? C.sand : C.ink;
  return (
    <View style={[styles.backBar, { paddingTop: insets.top + 6 }]}>
      <Pressable onPress={onBack} hitSlop={12} accessibilityLabel="Back" style={[styles.round, styles.roundFloat, light && { backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.4)' }]}>
        <ChevronLeft size={19} color={light ? C.pureWhite : C.ink} strokeWidth={1.75} />
      </Pressable>
      {title ? <Text style={[styles.barTitle, { color: fg }]} numberOfLines={1}>{title}</Text> : <View style={{ flex: 1 }} />}
      <View style={{ minWidth: 38, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

// ── Booking funnel progress ──────────────────────────────────────────────
const STEPS = ['Selection', 'Details', 'Confirmed'];
export function BookingSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done = n < current || current === 3;
          const active = n === current;
          return (
            <View key={label} style={[{ flexDirection: 'row', alignItems: 'center', gap: 8 }, n < 3 ? { flex: 1, minWidth: 0 } : { flexShrink: 0 }]}>
              <View style={[styles.step, { flexShrink: 0 }, done ? { backgroundColor: C.pine, borderColor: C.pine } : active ? { borderColor: C.ink } : { borderColor: C.line }]}>
                {done ? <Check size={13} color={C.cream} /> : <Text style={{ fontFamily: FONTS.uiBold, fontSize: 11.5, color: active ? C.ink : C.ink40 }}>{n}</Text>}
              </View>
              {n < 3 && <View style={{ flex: 1, height: StyleSheet.hairlineWidth * 2, backgroundColor: done ? C.pine : C.line }} />}
            </View>
          );
        })}
      </View>
      <Text style={{ fontFamily: FONTS.uiSemi, fontSize: 12, color: C.ink55, marginTop: 10 }}>
        Step {current} of 3 · {STEPS[current - 1]}
      </Text>
    </View>
  );
}

// ── Guest stepper ────────────────────────────────────────────────────────
export function Stepper({ label, hint, value, min, max, onChange }: { label: string; hint?: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <View style={styles.stepperRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.stepLabel}>{label}</Text>
        {hint && <Text style={[T.small, { marginTop: 2 }]}>{hint}</Text>}
      </View>
      <View style={styles.capsule}>
        <PressableScale disabled={value <= min} onPress={() => onChange(value - 1)} style={styles.stepBtn}>
          <Minus size={16} color={C.ink} strokeWidth={1.75} />
        </PressableScale>
        <Text style={styles.stepValue}>{value}</Text>
        <PressableScale disabled={value >= max} onPress={() => onChange(value + 1)} style={styles.stepBtn}>
          <Plus size={16} color={C.ink} strokeWidth={1.75} />
        </PressableScale>
      </View>
    </View>
  );
}

// ── Bottom sheet: backdrop fades, panel glides up ────────────────────────
export function Sheet({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(open);
  const p = useSharedValue(0);

  useEffect(() => {
    if (open) {
      setMounted(true);
      p.set(withTiming(1, { duration: 420, easing: EASE }));
    } else if (mounted) {
      p.set(withTiming(0, { duration: 260, easing: Easing.in(Easing.quad) }));
      const t = setTimeout(() => setMounted(false), 270);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const backdrop = useAnimatedStyle(() => ({ opacity: p.get() }));
  const panel = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - p.get()) * 700 }] }));

  if (!mounted) return null;
  return (
    <Modal transparent visible statusBarTranslucent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(20,30,27,0.45)' }, backdrop]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }, panel]}>
        <View style={styles.grabber} />
        <View style={styles.sheetHead}>
          <View style={{ width: 38 }} />
          <Text style={styles.sheetTitle}>{title}</Text>
          <Pressable onPress={onClose} hitSlop={12} style={[styles.round, { borderColor: C.line, backgroundColor: C.pureWhite }]}>
            <X size={16} color={C.ink} strokeWidth={1.5} />
          </Pressable>
        </View>
        {children}
        {footer && <View style={{ paddingHorizontal: S.gutter, paddingTop: 12 }}>{footer}</View>}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, height: 52, paddingHorizontal: 24, borderWidth: 1, borderRadius: 999 },
  btnText: { fontFamily: FONTS.uiBold, fontSize: 15, letterSpacing: 0.1 },
  barTitle: { flex: 1, textAlign: 'center', fontFamily: FONTS.uiSemi, fontSize: 15.5 },
  roundFloat: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.pureWhite, borderColor: 'rgba(255,255,255,0.9)', ...shadow.card },
  stepLabel: { fontFamily: FONTS.uiSemi, fontSize: 15.5, color: C.ink },
  stepValue: { minWidth: 34, textAlign: 'center', fontFamily: FONTS.uiBold, fontSize: 16, color: C.ink, fontVariant: ['tabular-nums'] },
  capsule: { flexDirection: 'row', alignItems: 'center', height: 44, paddingHorizontal: 4, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: C.pureWhite },
  sheetTitle: { flex: 1, textAlign: 'center', fontFamily: FONTS.uiSemi, fontSize: 16, color: C.ink },
  backBar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 8 },
  round: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  step: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepperRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  stepBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '92%', backgroundColor: C.sand, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  grabber: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: C.lineStrong, marginTop: 10 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.gutter, paddingTop: 14, paddingBottom: 10 },
});
