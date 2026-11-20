import { CalendarDays, ChevronRight, Users } from '@/components/icons';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';

import { Button, Caps, PressableScale } from '@/components/ui';
import { fmtShort, guestsLabel, nightsBetween, plural, type Stay } from '@/lib/stay';
import { C, F } from '@/theme';

// The primary search: two clearly labelled fields and one obvious action.
export default function SearchCard({ stay, onDates, onGuests, onSearch }: { stay: Stay; onDates: () => void; onGuests: () => void; onSearch: () => void }) {
  const nights = nightsBetween(stay.checkIn, stay.checkOut);
  return (
    <View style={styles.card}>
      <PressableScale onPress={onDates} scaleTo={0.985} style={styles.field}>
        <View style={styles.icon}>
          <CalendarDays size={17} color={C.pine} strokeWidth={1.5} />
        </View>
        <View style={{ flex: 1 }}>
          <Caps color={C.ink55} style={{ fontSize: 9 }}>Check-in — Check-out</Caps>
          <Text style={styles.value}>
            {fmtShort(stay.checkIn)} – {fmtShort(stay.checkOut)}
          </Text>
        </View>
        <Text style={styles.meta}>{plural(nights, 'night')}</Text>
        <ChevronRight size={16} color={C.ink40} strokeWidth={1.5} />
      </PressableScale>
      <View style={styles.div} />
      <PressableScale onPress={onGuests} scaleTo={0.985} style={styles.field}>
        <View style={styles.icon}>
          <Users size={17} color={C.pine} strokeWidth={1.5} />
        </View>
        <View style={{ flex: 1 }}>
          <Caps color={C.ink55} style={{ fontSize: 9 }}>Guests</Caps>
          <Text style={styles.value}>
            {guestsLabel(stay.adults, stay.children)} · {plural(stay.rooms, 'apartment')}
          </Text>
        </View>
        <ChevronRight size={16} color={C.ink40} strokeWidth={1.5} />
      </PressableScale>
      <Button label="Check availability" onPress={onSearch} style={{ marginTop: 12 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: C.white, borderRadius: 22, padding: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  field: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 4 },
  icon: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.snow, alignItems: 'center', justifyContent: 'center' },
  value: { fontFamily: F.display, fontSize: 16.5, color: C.ink, marginTop: 4 },
  meta: { fontSize: 12, color: C.ink55, marginRight: 2 },
  div: { height: StyleSheet.hairlineWidth, backgroundColor: C.lineStrong, marginLeft: 54 },
});
