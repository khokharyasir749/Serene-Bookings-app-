import { StyleSheet, View } from 'react-native';

import SereneLogoMark, { BRAND_FG, BRAND_PINE, BRAND_SLATE, BRAND_SNOW } from '@/components/SereneLogoMark';
import { Text } from '@/components/Text';
import { FONTS } from '@/theme';

/**
 * The Serene brand lockup, as in the Serene Management app's header: the crest at 34 × 42, then a stacked wordmark —
 * "SERENE" (bold, 13 px, tracked 1.6, deep charcoal-green) over the product name (8 px, bold, tracked 1.6, brand pine).
 * `onPhoto` flips it for use over photography: white crest, white wordmark, soft white subline.
 */
export default function BrandLockup({ sub = 'BOOKINGS', onPhoto }: { sub?: string; onPhoto?: boolean }) {
  return (
    <View style={styles.row}>
      <SereneLogoMark size={42} color={onPhoto ? '#FFFFFF' : BRAND_SLATE} snow={onPhoto ? BRAND_SLATE : BRAND_SNOW} />
      <View style={{ flexShrink: 1, minWidth: 0 }}>
        <Text style={[styles.name, { color: onPhoto ? '#FFFFFF' : BRAND_FG }]} numberOfLines={1}>SERENE</Text>
        <Text style={[styles.sub, { color: onPhoto ? 'rgba(255,255,255,0.85)' : BRAND_PINE }]} numberOfLines={1}>{sub}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1, minWidth: 0 },
  name: { fontFamily: FONTS.uiBold, fontSize: 13, letterSpacing: 1.6 },
  sub: { fontFamily: FONTS.uiBold, fontSize: 8, letterSpacing: 1.6, marginTop: 1 },
});
