import { CalendarDays, Search, Users } from '@/components/icons';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';

import { PressableScale } from '@/components/ui';
import { fmtDay, plural, type Stay } from '@/lib/stay';
import { C, F } from '@/theme';

// The search summary pill (dates · guests). Columns flex and truncate so they never collide.
export default function StayBar({ stay, onPress }: { stay: Stay; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} scaleTo={0.985} style={styles.bar}>
      <View style={[styles.cell, { flex: 1.3 }]}>
        <CalendarDays size={16} color={C.ink55} strokeWidth={1.5} />
        <View style={styles.text}>
          <Text style={styles.label}>Dates</Text>
          <Text style={styles.val} numberOfLines={1}>
            {fmtDay(stay.checkIn)} – {fmtDay(stay.checkOut)}
          </Text>
        </View>
      </View>
      <View style={styles.div} />
      <View style={[styles.cell, { flex: 1 }]}>
        <Users size={16} color={C.ink55} strokeWidth={1.5} />
        <View style={styles.text}>
          <Text style={styles.label}>Guests</Text>
          <Text style={styles.val} numberOfLines={1}>
            {stay.adults + stay.children} · {plural(stay.rooms, 'apt')}
          </Text>
        </View>
      </View>
      <View style={styles.go}>
        <Search size={17} color={C.sand} strokeWidth={1.75} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', paddingLeft: 14, paddingRight: 6, paddingVertical: 6, borderRadius: 999, backgroundColor: C.white, borderWidth: StyleSheet.hairlineWidth, borderColor: C.lineStrong },
  cell: { minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 6 },
  text: { flex: 1, minWidth: 0 },
  label: { fontSize: 10.5, fontWeight: '600', letterSpacing: 1.2, color: C.ink55, textTransform: 'uppercase' },
  val: { fontFamily: F.display, fontSize: 14, color: C.ink, marginTop: 2 },
  div: { width: StyleSheet.hairlineWidth, alignSelf: 'stretch', marginHorizontal: 10, marginVertical: 6, backgroundColor: C.lineStrong },
  go: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginLeft: 8, backgroundColor: C.pine },
});

