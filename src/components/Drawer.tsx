import { useEffect, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/**
 * Inline reveal: the height opens from 0 to its content's height with a short ease-out and a fade, the way the
 * web's accordions grow in place (grid-template-rows 0fr → 1fr). If the content later grows (an error message),
 * the drawer follows. The content stays mounted so inputs keep their text when it closes.
 */
export default function Drawer({ open, children, style, duration = 320 }: { open: boolean; children: ReactNode; style?: StyleProp<ViewStyle>; duration?: number }) {
  const progress = useSharedValue(open ? 1 : 0);
  const full = useSharedValue(0);

  useEffect(() => {
    progress.set(withTiming(open ? 1 : 0, { duration, easing: EASE }));
  }, [open, duration, progress]);

  const box = useAnimatedStyle(() => ({
    height: full.get() * progress.get(),
    opacity: progress.get(),
    overflow: 'hidden',
  }));

  return (
    <Animated.View style={[box, style]} pointerEvents={open ? 'auto' : 'none'} accessibilityElementsHidden={!open} importantForAccessibility={open ? 'auto' : 'no-hide-descendants'}>
      <View onLayout={(e) => full.set(e.nativeEvent.layout.height)} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        {children}
      </View>
    </Animated.View>
  );
}
