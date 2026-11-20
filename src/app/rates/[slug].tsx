import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, SectionTitle } from '@/components/kit';
import ModalHeader from '@/components/ModalHeader';
import { Text } from '@/components/Text';
import { Photo } from '@/components/ui';
import { RATE_PLANS, roomType, type RatePlan } from '@/data/catalog';
import { availability, fmtDay, fromISO, guestsLabel, money, plural, quote } from '@/lib/stay';
import { useBooking } from '@/state/booking';
import { C, FONTS, S, T, shadow } from '@/theme';

type Glyph = ComponentProps<typeof Ionicons>['name'];
const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Full-screen rate choice. Reads top to bottom: what you picked (apartment, dates, guests) → the three rates → one action.
export default function RatesModal() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stay } = useBooking();
  const type = roomType(slug ?? '');
  const [code, setCode] = useState<RatePlan['code']>('FLEX');

  if (!type) {
    return (
      <View style={{ flex: 1, backgroundColor: C.sand }}>
        <ModalHeader title="Choose your rate" onClose={() => router.back()} />
        <Text style={[T.body, { padding: S.gutter }]}>This apartment isn’t available.</Text>
      </View>
    );
  }

  const plan = RATE_PLANS.find((p) => p.code === code)!;
  const q = quote(type, plan, stay);
  const av = availability(type, stay);
  const bookable = !av.soldOut && av.fitsParty;
  const ci = fromISO(stay.checkIn);
  const co = fromISO(stay.checkOut);

  return (
    <View style={{ flex: 1, backgroundColor: C.sand }}>
      <ModalHeader title="Choose your rate" onClose={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: S.gutter, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        {/* Your selection */}
        <Text style={styles.lead}>Your stay is a tap away</Text>
        <Text style={[T.small, { marginTop: 4 }]}>Review your apartment and dates, then choose how you would like to pay.</Text>

        <Card style={{ marginTop: 18 }} pad={12}>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <Photo src={type.images[0]} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.roomName} numberOfLines={2}>{type.name}</Text>
              <Text style={styles.roomSpecs} numberOfLines={1}>{type.bedType} · {type.outdoorSpace}</Text>
            </View>
          </View>

          <View style={styles.dates}>
            <DateCell label="Check-in" top={WEEKDAY[ci.getDay()]} value={fmtDay(stay.checkIn)} />
            <DateCell label="Check-out" top={WEEKDAY[co.getDay()]} value={fmtDay(stay.checkOut)} />
          </View>

          <View style={styles.summaryFoot}>
            <View style={styles.footChip}>
              <Ionicons name="moon-outline" size={13} color={C.ink70} />
              <Text style={styles.footChipText}>{plural(q.nights, 'night')}</Text>
            </View>
            <View style={styles.footChip}>
              <Ionicons name="people-outline" size={13} color={C.ink70} />
              <Text style={styles.footChipText} numberOfLines={1}>{guestsLabel(stay.adults, stay.children)} · {plural(stay.rooms, 'apt')}</Text>
            </View>
            <Pressable onPress={() => router.push({ pathname: '/stay', params: { type: type.slug } })} hitSlop={8} style={styles.change} accessibilityRole="button" accessibilityLabel="Change dates and guests">
              <Text style={styles.changeText}>Change</Text>
            </Pressable>
          </View>
        </Card>

        {!bookable ? (
          <View style={styles.notice}>
            <Text style={T.h3}>{av.soldOut ? 'Sold out for these dates' : 'Too many guests for one apartment'}</Text>
            <Text style={[T.small, { marginTop: 4 }]}>{av.soldOut ? 'Try other dates.' : `Sleeps up to ${type.maxOccupancy}. Add another apartment.`}</Text>
          </View>
        ) : (
          <>
            <SectionTitle title="Select your rate" sub="Totals for your whole stay, taxes included. Nothing is charged now." style={{ marginTop: 28, marginBottom: 14 }} />

            {RATE_PLANS.map((rp) => (
              <RateCard key={rp.code} rp={rp} on={rp.code === code} onPress={() => setCode(rp.code)} q={quote(type, rp, stay)} />
            ))}
          </>
        )}
      </ScrollView>

      {/* Footer: the running total and the one action */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.footLabel} numberOfLines={1}>{plan.name}</Text>
          <Text style={styles.footTotal}>{money(q.grandTotal)}</Text>
          <Text style={styles.footNote}>Total incl. taxes</Text>
        </View>
        <Pressable
          disabled={!bookable}
          onPress={() => router.replace({ pathname: '/book/[slug]', params: { slug: type.slug, rate: plan.code } })}
          accessibilityRole="button"
          accessibilityLabel="Continue"
          style={({ pressed }) => [styles.cta, !bookable && { opacity: 0.4 }, pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] }]}>
          <Text style={styles.ctaText}>Continue</Text>
          <Ionicons name="arrow-forward-outline" size={18} color={C.cream} />
        </Pressable>
      </View>
    </View>
  );
}

function DateCell({ label, top, value }: { label: string; top: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.cellLabel}>{label}</Text>
      <View style={styles.cellBox}>
        <Ionicons name="calendar-outline" size={16} color={C.ink55} />
        <Text style={styles.cellValue} numberOfLines={1}>{top}, {value}</Text>
      </View>
    </View>
  );
}

function RateCard({ rp, on, onPress, q }: { rp: RatePlan; on: boolean; onPress: () => void; q: ReturnType<typeof quote> }) {
  const perNight = Math.round(q.grandTotal / Math.max(1, q.nights));
  const perks: { icon: Glyph; text: string; tone?: 'good' | 'plain' }[] = [
    ...(rp.breakfastIncluded ? [{ icon: 'cafe-outline' as Glyph, text: 'Breakfast included' }] : []),
    rp.refundable ? { icon: 'shield-checkmark-outline' as Glyph, text: 'Free cancellation' } : { icon: 'lock-closed-outline' as Glyph, text: 'Non-refundable', tone: 'plain' as const },
    { icon: 'card-outline' as Glyph, text: 'Pay at property' },
  ];
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={`${rp.name}, ${money(q.grandTotal)}`} style={[styles.rate, on ? styles.rateOn : styles.rateOff]}>
      <View style={styles.rateTop}>
        <View style={[styles.radio, on && styles.radioOn]}>{on && <Ionicons name="checkmark-outline" size={14} color={C.cream} />}</View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rateName}>{rp.name}</Text>
          {rp.discountPercent > 0 && (
            <View style={styles.save}>
              <Ionicons name="pricetag-outline" size={11} color={C.cream} />
              <Text style={styles.saveText}>SAVE {rp.discountPercent}%</Text>
            </View>
          )}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          {q.discountTotal > 0 && <Text style={styles.strike}>{money(q.undiscountedTotal)}</Text>}
          <Text style={styles.total}>{money(q.grandTotal)}</Text>
          <Text style={styles.perNight}>{money(perNight)} / night</Text>
        </View>
      </View>
      <View style={styles.perks}>
        {perks.map((p) => (
          <View key={p.text} style={[styles.perk, p.tone === 'plain' && styles.perkPlain]}>
            <Ionicons name={p.icon} size={12} color={p.tone === 'plain' ? C.ink55 : C.pine} />
            <Text style={[styles.perkText, p.tone === 'plain' && { color: C.ink55 }]}>{p.text}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  lead: { fontFamily: FONTS.uiBold, fontSize: 20, color: C.ink, letterSpacing: -0.2 },
  thumb: { width: 68, height: 68, borderRadius: 14 },
  roomName: { color: C.ink, fontFamily: FONTS.display, fontSize: 22, lineHeight: 25 },
  roomSpecs: { color: C.ink55, fontFamily: FONTS.ui, fontSize: 12.5, marginTop: 3 },
  dates: { flexDirection: 'row', gap: 10, marginTop: 14 },
  cellLabel: { color: C.ink, fontFamily: FONTS.uiSemi, fontSize: 12.5, marginBottom: 6 },
  cellBox: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 48, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: C.pureWhite },
  cellValue: { flex: 1, color: C.ink, fontFamily: FONTS.uiSemi, fontSize: 14, fontVariant: ['tabular-nums'] },
  summaryFoot: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  footChip: { flexShrink: 1, flexDirection: 'row', alignItems: 'center', gap: 5, height: 30, paddingHorizontal: 10, borderRadius: 999, backgroundColor: C.sand, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  footChipText: { flexShrink: 1, fontFamily: FONTS.uiMedium, fontSize: 12, color: C.ink70 },
  change: { marginLeft: 'auto', paddingHorizontal: 12, height: 30, borderRadius: 15, borderWidth: 1, borderColor: C.pine, justifyContent: 'center' },
  changeText: { color: C.pine, fontFamily: FONTS.uiBold, fontSize: 12 },
  notice: { marginTop: 24, padding: 18, borderRadius: S.card, backgroundColor: C.pureWhite },
  rate: { padding: 16, marginBottom: 12, borderRadius: S.card, backgroundColor: C.pureWhite },
  rateOff: { borderWidth: 1, borderColor: C.line },
  rateOn: { borderWidth: 2, borderColor: C.pine, ...shadow.card, shadowOpacity: 0.1, shadowRadius: 12, elevation: 3 },
  rateTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: C.lineStrong, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  radioOn: { backgroundColor: C.pine, borderColor: C.pine },
  rateName: { color: C.ink, fontFamily: FONTS.uiBold, fontSize: 16, lineHeight: 21 },
  save: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginTop: 6, paddingHorizontal: 8, height: 20, borderRadius: 10, backgroundColor: C.pine },
  saveText: { color: C.cream, fontFamily: FONTS.uiBold, fontSize: 9.5, letterSpacing: 0.8 },
  strike: { color: C.danger, fontFamily: FONTS.ui, fontSize: 12, textDecorationLine: 'line-through', opacity: 0.85, fontVariant: ['tabular-nums'] },
  total: { color: C.ink, fontFamily: FONTS.uiBold, fontSize: 19, letterSpacing: -0.2, fontVariant: ['tabular-nums'] },
  perNight: { color: C.ink55, fontFamily: FONTS.ui, fontSize: 11.5, marginTop: 1, fontVariant: ['tabular-nums'] },
  perks: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 14, paddingLeft: 36 },
  perk: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, height: 26, borderRadius: 13, borderWidth: 1, borderColor: C.line, backgroundColor: C.pureWhite },
  perkPlain: { backgroundColor: C.sand },
  perkText: { color: C.ink70, fontFamily: FONTS.uiMedium, fontSize: 11.5 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: S.gutter, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line, backgroundColor: C.pureWhite },
  footLabel: { color: C.ink55, fontFamily: FONTS.uiSemi, fontSize: 12 },
  footTotal: { color: C.ink, fontFamily: FONTS.uiBold, fontSize: 20, letterSpacing: -0.2, marginTop: 1, fontVariant: ['tabular-nums'] },
  footNote: { color: C.ink55, fontFamily: FONTS.ui, fontSize: 11.5 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 52, paddingHorizontal: 26, borderRadius: 999, backgroundColor: C.pine },
  ctaText: { color: C.cream, fontFamily: FONTS.uiBold, fontSize: 15 },
});
