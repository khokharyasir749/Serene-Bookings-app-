import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import { EASE } from '@/components/ui';
import type { RatePlan } from '@/data/catalog';
import { fmtDate, fmtShort, guestsLabel, money, plural, type Quote, type Stay } from '@/lib/stay';
import { C, FONTS, S, T } from '@/theme';

export default function PriceSummary({ stay, roomName, plan, q }: { stay: Stay; roomName: string; plan: RatePlan; q: Quote }) {
  const [nights, setNights] = useState(false);
  return (
    <Animated.View layout={LinearTransition.duration(320).easing(EASE)} style={styles.box}>
      <View style={styles.head}>
        <Text style={styles.kicker}>Your stay</Text>
        <Text style={styles.room}>{roomName}</Text>
        <Text style={[T.small, { marginTop: 2 }]}>{plan.name}</Text>
      </View>
      <View style={styles.dates}>
        <View style={styles.cell}>
          <Text style={styles.cellLabel}>Check-in</Text>
          <Text style={styles.date}>{fmtDate(stay.checkIn)}</Text>
          <Text style={[T.small, { fontSize: 11.5 }]}>From 2:00 PM</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellLabel}>Check-out</Text>
          <Text style={styles.date}>{fmtDate(stay.checkOut)}</Text>
          <Text style={[T.small, { fontSize: 11.5 }]}>Until 12:00 PM</Text>
        </View>
      </View>
      <View style={styles.guests}>
        <Text style={styles.cellLabel}>Guests</Text>
        <Text style={styles.guestText}>
          {guestsLabel(stay.adults, stay.children)} · {plural(stay.rooms, 'apartment')} · {plural(q.nights, 'night')}
        </Text>
      </View>
      <View style={[styles.top, { padding: 18, gap: 9 }]}>
        <Row label={`${plural(stay.rooms, 'apartment')} × ${plural(q.nights, 'night')}`} value={money(q.roomSubtotal)} />
        <Pressable onPress={() => setNights((s) => !s)} hitSlop={8}>
          <Text style={styles.toggle}>{nights ? 'Hide' : 'Show'} nightly rates</Text>
        </Pressable>
        {nights && (
          <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(150)} style={styles.nightly}>
            {q.nightly.map((n) => (
              <View key={n.date} style={styles.nightRow}>
                <Text style={[T.small, { fontSize: 12 }]}>{fmtShort(n.date)}</Text>
                <Text style={[T.small, { fontSize: 12 }]}>{money(n.rate)} per apartment</Text>
              </View>
            ))}
          </Animated.View>
        )}
        {q.discountTotal > 0 && <Row label={`Saver discount (${plan.discountPercent}%)`} value={`− ${money(q.discountTotal)}`} color={C.positive} />}
        {q.breakfastTotal > 0 && <Row label="Breakfast" value={money(q.breakfastTotal)} />}
        <Row label={`Taxes (${q.taxPercent}%)`} value={money(q.taxTotal)} />
        <View style={styles.total}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{money(q.grandTotal)}</Text>
        </View>
        <Text style={[T.small, { fontSize: 12 }]}>Payable at the property in Pakistani rupees.</Text>
      </View>
    </Animated.View>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
      <Text style={{ fontFamily: FONTS.ui, fontSize: 13.5, color: color ?? C.ink70 }}>{label}</Text>
      <Text style={{ fontFamily: FONTS.uiSemi, fontSize: 13.5, color: color ?? C.ink, fontVariant: ['tabular-nums'] }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: C.pureWhite, borderRadius: S.card, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  head: { padding: 18, paddingBottom: 14 },
  kicker: { fontFamily: FONTS.uiSemi, fontSize: 12, color: C.ink55 },
  room: { fontFamily: FONTS.display, fontSize: 24, lineHeight: 27, color: C.ink, marginTop: 4 },
  dates: { flexDirection: 'row', gap: 10, paddingHorizontal: 18 },
  cell: { flex: 1, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: C.sand },
  cellLabel: { fontFamily: FONTS.uiSemi, fontSize: 11.5, color: C.ink55 },
  date: { fontFamily: FONTS.uiSemi, fontSize: 14, color: C.ink, marginTop: 4, marginBottom: 1 },
  guests: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 4 },
  guestText: { fontFamily: FONTS.uiMedium, fontSize: 14, color: C.ink, marginTop: 3 },
  top: { marginTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  toggle: { fontFamily: FONTS.uiSemi, fontSize: 12.5, color: C.pine, textDecorationLine: 'underline' },
  nightly: { backgroundColor: C.sand, paddingHorizontal: 12, borderRadius: 12 },
  nightRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  total: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  totalLabel: { fontFamily: FONTS.uiBold, fontSize: 16, color: C.ink },
  totalValue: { fontFamily: FONTS.uiBold, fontSize: 22, color: C.ink, fontVariant: ['tabular-nums'] },
});
