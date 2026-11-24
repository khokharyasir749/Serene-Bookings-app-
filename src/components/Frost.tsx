import { BlurView } from 'expo-blur';
import type { ComponentProps } from 'react';
import { Platform, View } from 'react-native';

type Props = Pick<ComponentProps<typeof BlurView>, 'intensity' | 'tint' | 'style' | 'blurTarget'>;

/**
 * A frosted-glass layer. iOS and web blur what is behind them. Android's real-time blur re-renders the layer behind it
 * every frame and is a common cause of dropped frames, so there it is a plain translucent surface — same look at a glance,
 * no GPU cost.
 */
export default function Frost({ intensity = 60, tint = 'light', style, blurTarget }: Props) {
  if (Platform.OS === 'android') {
    const dark = tint === 'dark' || tint === 'systemMaterialDark';
    return <View pointerEvents="none" style={[style, { backgroundColor: dark ? 'rgba(14, 26, 19, 0.58)' : 'rgba(255, 253, 249, 0.62)' }]} />;
  }
  return <BlurView blurTarget={blurTarget} intensity={intensity} tint={tint} style={style} />;
}
