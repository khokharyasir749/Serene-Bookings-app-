import { BlurView } from 'expo-blur';
import type { ComponentRef, ReactNode, RefObject } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { C } from '@/theme';

type Props = {
  /** Android blurs a named target view (BlurTargetView in the tabs layout); iOS blurs whatever is behind. */
  blurTarget?: RefObject<ComponentRef<typeof View> | null>;
  radius: number;
  intensity?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/** Crystal glass, as in the Serene Groups app: a light blur, a faint ivory tint and a white specular hairline. */
export default function GlassSurface({ blurTarget, radius, intensity = 55, style, children }: Props) {
  return (
    <View style={[styles.shell, { borderRadius: radius }, style]}>
      <BlurView blurTarget={blurTarget} tint="light" intensity={intensity} style={[StyleSheet.absoluteFill, { borderRadius: radius }]} />
      <View style={[StyleSheet.absoluteFill, styles.tint, { borderRadius: radius }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.92)' },
  tint: { backgroundColor: 'rgba(255, 255, 255, 0.76)' },
});
