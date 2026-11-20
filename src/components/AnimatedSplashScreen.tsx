import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { ClipPath, Defs, G, Path, Polygon, Rect } from 'react-native-svg';

import { CREST_H, CREST_W, INNER, OUTER, PEAK, RIDGE_L, RIDGE_R } from '@/components/SereneLogoMark';
import { C, FONTS } from '@/theme';

const ARect = Animated.createAnimatedComponent(Rect);
const APath = Animated.createAnimatedComponent(Path);
const APolygon = Animated.createAnimatedComponent(Polygon);

const RING_LEN = 2 * (OUTER.h - OUTER.w) + Math.PI * OUTER.w + 2;
const RIDGE_LEN = 30;
const EASE = Easing.bezier(0.22, 1, 0.36, 1);
const SIZE = 118;

// Launch sequence on Deep Forest Pine: the gold ring draws itself, the ivory crest settles in, the ridges trace
// across it, the wordmark opens up, then the crest rushes forward and the overlay dissolves. ~2.9 s.
export default function AnimatedSplashScreen({ onFinish }: { onFinish: () => void }) {
  const ring = useSharedValue(0);
  const field = useSharedValue(0);
  const ridge = useSharedValue(0);
  const word = useSharedValue(0);
  const zoom = useSharedValue(1);
  const fade = useSharedValue(1);

  useEffect(() => {
    ring.set(withTiming(1, { duration: 900, easing: EASE }));
    field.set(withDelay(600, withTiming(1, { duration: 450, easing: EASE })));
    ridge.set(withDelay(850, withTiming(1, { duration: 700, easing: EASE })));
    word.set(withDelay(1100, withTiming(1, { duration: 800, easing: EASE })));
    zoom.set(withDelay(2050, withSequence(withTiming(0.94, { duration: 180, easing: Easing.out(Easing.quad) }), withTiming(16, { duration: 700, easing: Easing.in(Easing.cubic) }))));
    fade.set(withDelay(2400, withTiming(0, { duration: 480, easing: Easing.out(Easing.quad) })));
    const t = setTimeout(onFinish, 2950);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ringProps = useAnimatedProps(() => ({ strokeDashoffset: RING_LEN * (1 - ring.get()) }));
  const fieldProps = useAnimatedProps(() => ({ opacity: field.get() }));
  const ridgeProps = useAnimatedProps(() => ({ strokeDashoffset: RIDGE_LEN * (1 - ridge.get()) }));
  const peakProps = useAnimatedProps(() => ({ opacity: ridge.get() }));

  const crestStyle = useAnimatedStyle(() => ({ transform: [{ scale: zoom.get() }] }));
  const wordStyle = useAnimatedStyle(() => ({
    opacity: word.get() * Math.max(0, 2 - zoom.get()),
    letterSpacing: 3 + word.get() * 5,
    transform: [{ translateY: (1 - word.get()) * 10 }],
  }));
  const subStyle = useAnimatedStyle(() => ({ opacity: word.get() * Math.max(0, 2 - zoom.get()) }));
  const rootStyle = useAnimatedStyle(() => ({ opacity: fade.get() }));

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.root, rootStyle]}>
      <View style={styles.center}>
        <Animated.View style={crestStyle}>
          <Svg width={(SIZE * CREST_W) / CREST_H} height={SIZE} viewBox={`0 0 ${CREST_W} ${CREST_H}`}>
            <Defs>
              <ClipPath id="splash-crest">
                <Rect x={INNER.x} y={INNER.y} width={INNER.w} height={INNER.h} rx={INNER.r} />
              </ClipPath>
            </Defs>
            <ARect x={OUTER.x} y={OUTER.y} width={OUTER.w} height={OUTER.h} rx={OUTER.r} fill="none" stroke={C.gold} strokeWidth={1.2} strokeDasharray={[RING_LEN, RING_LEN]} animatedProps={ringProps} />
            <ARect x={INNER.x} y={INNER.y} width={INNER.w} height={INNER.h} rx={INNER.r} fill={C.cream} animatedProps={fieldProps} />
            <G clipPath="url(#splash-crest)">
              <APath d={RIDGE_L} fill="none" stroke={C.pine} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={[RIDGE_LEN, RIDGE_LEN]} animatedProps={ridgeProps} />
              <APath d={RIDGE_R} fill="none" stroke={C.pine} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={[RIDGE_LEN, RIDGE_LEN]} animatedProps={ridgeProps} />
              <APolygon points={PEAK} fill={C.pine} animatedProps={peakProps} />
            </G>
          </Svg>
        </Animated.View>
        <Animated.Text style={[styles.word, wordStyle]}>SERENE HEIGHTS</Animated.Text>
        <Animated.Text style={[styles.sub, subStyle]}>BOOKINGS · NATHIA GALI</Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: C.pine, zIndex: 100 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  word: { marginTop: 34, color: C.cream, fontFamily: FONTS.display, fontSize: 28 },
  sub: { marginTop: 10, color: C.gold, fontFamily: FONTS.uiBold, fontSize: 10, letterSpacing: 3 },
});
