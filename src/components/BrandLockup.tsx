import { StyleSheet, View } from 'react-native';

import SereneLogoMark, { BRAND_FG, BRAND_PINE, BRAND_SLATE, BRAND_SNOW } from '@/components/SereneLogoMark';
import { Text } from '@/components/Text';
import { FONTS, shadow } from '@/theme';

/**
 * The Serene brand lockup, as in the Serene Management app's header: the crest, then a stacked wordmark —
 * "SERENE" (bold, tracked, deep charcoal-green) over the product name (small, bold, tracked, brand pine).
 * It is always the original coloured logo. Over photography, pass `glass`: the same lockup sits in a frosted ivory pill
 * (hairline border, soft shadow) sized to match the round buttons beside it.
 */
export default function BrandLockup({ sub = 'BOOKINGS', glass }: { sub?: string; glass?: boolean }) {
  const lockup = (
    <View style={styles.row}>
      <SereneLogoMark size={glass ? 32 : 42} color={BRAND_SLATE} snow={BRAND_SNOW} />
      <View style={{ flexShrink: 1, minWidth: 0 }}>
        <Text style={[styles.name, { color: BRAND_FG }]} numberOfLines={1}>SERENE</Text>
        <Text style={[styles.sub, { color: BRAND_PINE }]} numberOfLines={1}>{sub}</Text>
      </View>
    </View>
  );
  return glass ? <View style={styles.glass}>{lockup}</View> : lockup;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1, minWidth: 0 },
  name: { fontFamily: FONTS.uiBold, fontSize: 13, letterSpacing: 1.6 },
  sub: { fontFamily: FONTS.uiBold, fontSize: 8, letterSpacing: 1.6, marginTop: 1 },
  glass: {
    alignSelf: 'flex-start',
    height: 44,
    paddingLeft: 10,
    paddingRight: 16,
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(250, 248, 244, 0.88)',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    ...shadow.pill,
  },
});
