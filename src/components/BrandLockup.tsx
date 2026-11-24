import { StyleSheet, View } from 'react-native';

import SereneLogoMark, { BRAND_SLATE, BRAND_SNOW } from '@/components/SereneLogoMark';
import { Text } from '@/components/Text';
import { FONTS } from '@/theme';

/**
 * The Serene brand lockup: the Pine Green crest (#314A43, #ECEEED snow) and a stacked "SERENE" / product-name wordmark.
 * Same size everywhere, no background box. On light screens the text is Pine Green; over dark photos pass `onPhoto` and
 * the text turns white with a soft shadow, and the crest's outer ring turns snow.
 */
export default function BrandLockup({ sub = 'BOOKINGS', onPhoto }: { sub?: string; onPhoto?: boolean }) {
  return (
    <View style={styles.row}>
      <SereneLogoMark size={42} color={BRAND_SLATE} snow={BRAND_SNOW} ring={onPhoto ? BRAND_SNOW : undefined} />
      <View style={{ flexShrink: 1, minWidth: 0 }}>
        <Text style={[styles.name, onPhoto && styles.onPhoto]} numberOfLines={1}>SERENE</Text>
        <Text style={[styles.sub, onPhoto && styles.onPhoto]} numberOfLines={1}>{sub}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1, minWidth: 0 },
  name: { fontFamily: FONTS.uiBold, fontSize: 13, letterSpacing: 1.6, color: BRAND_SLATE },
  sub: { fontFamily: FONTS.uiBold, fontSize: 8, letterSpacing: 1.6, marginTop: 1, color: BRAND_SLATE },
  onPhoto: { color: '#FFFFFF', textShadowColor: 'rgba(0, 0, 0, 0.65)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 5 },
});
