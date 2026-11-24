import { StyleSheet, View } from 'react-native';

import SereneLogoMark, { BRAND_FG, BRAND_PINE, BRAND_SLATE, BRAND_SNOW } from '@/components/SereneLogoMark';
import { Text } from '@/components/Text';
import { FONTS } from '@/theme';

const CREST = 42;

/**
 * The Serene brand lockup, as in the Serene Management app's header: the crest, then a stacked wordmark —
 * "SERENE" over the product name, no box around it. On light backgrounds it is the slate crest with dark text.
 * Over photography, pass `onPhoto`: the same lockup in white with a soft dark shadow, so it stays sharp over sky.
 */
export default function BrandLockup({ sub = 'BOOKINGS', onPhoto }: { sub?: string; onPhoto?: boolean }) {
  return (
    <View style={styles.row}>
      {onPhoto ? (
        <View style={{ width: (CREST * 34) / 42, height: CREST }}>
          {/* A soft dark copy of the crest, offset by a pixel, is the shadow (SVG can't take an Android elevation). */}
          <View style={[StyleSheet.absoluteFill, { top: 1, opacity: 0.38 }]}>
            <SereneLogoMark size={CREST} color="#000000" snow="#000000" />
          </View>
          <SereneLogoMark size={CREST} color="#FFFFFF" snow={BRAND_SLATE} />
        </View>
      ) : (
        <SereneLogoMark size={CREST} color={BRAND_SLATE} snow={BRAND_SNOW} />
      )}
      <View style={{ flexShrink: 1, minWidth: 0 }}>
        <Text style={[styles.name, onPhoto ? styles.nameOn : { color: BRAND_FG }]} numberOfLines={1}>SERENE</Text>
        <Text style={[styles.sub, onPhoto ? styles.subOn : { color: BRAND_PINE }]} numberOfLines={1}>{sub}</Text>
      </View>
    </View>
  );
}

const shadowText = { textShadowColor: 'rgba(0, 0, 0, 0.45)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 } as const;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1, minWidth: 0 },
  name: { fontFamily: FONTS.uiBold, fontSize: 13, letterSpacing: 1.6 },
  nameOn: { color: '#FFFFFF', ...shadowText },
  sub: { fontFamily: FONTS.uiBold, fontSize: 8, letterSpacing: 1.6, marginTop: 1 },
  subOn: { color: '#FFFFFF', ...shadowText },
});
