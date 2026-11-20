import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';
import { PressableScale } from '@/components/ui';
import { fmtDay, guestsLabel, plural, type Stay } from '@/lib/stay';
import { C, FONTS, shadow } from '@/theme';

// Shakuro-style rounded pill search bar: dates and party at a glance, tune button on the right.
export default function StayBar({ stay, onPress }: { stay: Stay; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} scaleTo={0.99} style={styles.bar}>
      <Ionicons name="search-outline" size={19} color="#8E95A2" style={{ marginLeft: 4 }} />
      <View style={styles.text}>
        <Text style={styles.val} numberOfLines={1}>
          {fmtDay(stay.checkIn)} – {fmtDay(stay.checkOut)}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {guestsLabel(stay.adults, stay.children)} · {plural(stay.rooms, 'apartment')}
        </Text>
      </View>
      <View style={styles.go}>
        <Ionicons name="options-outline" size={17} color={C.ink} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    height: 54,
    borderRadius: 27,
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: '#E8EAEB',
    ...shadow.pill,
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  val: {
    fontFamily: FONTS.uiBold,
    fontSize: 13.5,
    color: C.ink,
  },
  sub: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    color: C.ink55,
    marginTop: 1,
  },
  go: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.fill,
  },
});
