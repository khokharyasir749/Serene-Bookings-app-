import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';

import { PressableScale } from '@/components/ui';
import { fmtDay, plural, type Stay } from '@/lib/stay';
import { C, FONTS, shadow } from '@/theme';

/**
 * Luxury StayBar: Dates & Guests search pill
 * Warm Ivory surface, Champagne Gold icon accents, and Deep Forest Pine search button.
 */
export default function StayBar({ stay, onPress }: { stay: Stay; onPress: () => void }) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.985}
      style={styles.bar}
      accessibilityRole="button"
      accessibilityLabel={`Stay dates: ${fmtDay(stay.checkIn)} to ${fmtDay(stay.checkOut)}, guests: ${stay.adults + stay.children}`}
    >
      {/* Dates Cell */}
      <View style={[styles.cell, { flex: 1.25 }]}>
        <View style={styles.iconWell}>
          <Ionicons name="calendar-outline" size={15} color={C.gold} />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.label}>DATES</Text>
          <Text style={styles.val} numberOfLines={1}>
            {fmtDay(stay.checkIn)} – {fmtDay(stay.checkOut)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Guests Cell */}
      <View style={[styles.cell, { flex: 1 }]}>
        <View style={styles.iconWell}>
          <Ionicons name="people-outline" size={15} color={C.gold} />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.label}>GUESTS</Text>
          <Text style={styles.val} numberOfLines={1}>
            {stay.adults + stay.children} · {plural(stay.rooms, 'apt')}
          </Text>
        </View>
      </View>

      {/* Search Button */}
      <View style={styles.go}>
        <Ionicons name="search" size={16} color={C.cream} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.32)',
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  cell: {
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
  },
  iconWell: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(200, 164, 106, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 9,
    fontFamily: FONTS.uiBold,
    letterSpacing: 1.3,
    color: C.ink55,
  },
  val: {
    fontFamily: FONTS.uiSemi,
    fontSize: 13,
    color: C.pine,
    marginTop: 1.5,
  },
  divider: {
    width: 1,
    height: 24,
    marginHorizontal: 8,
    backgroundColor: 'rgba(200, 164, 106, 0.25)',
  },
  go: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    backgroundColor: C.pine,
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
});
