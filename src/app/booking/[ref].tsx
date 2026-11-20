import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { Easing, FadeInDown, useAnimatedProps, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { Card, PhotoTag, SectionTitle, type IconName } from '@/components/kit';
import { Text } from '@/components/Text';
import { BackBar, BookingSteps, Button, EASE, Photo, Sheet } from '@/components/ui';
import { PROPERTY } from '@/data/catalog';
import { fmtDate, guestsLabel, money, plural } from '@/lib/stay';
import { freeCancelUntil, tabOf, useBooking } from '@/state/booking';
import { C, FONTS, S, T } from '@/theme';

const ACircle = Animated.createAnimatedComponent(Circle);
const APath = Animated.createAnimatedComponent(Path);

const STATUS: Record<string, string> = { upcoming: 'Upcoming', past: 'Completed', cancelled: 'Cancelled' };

export default function BookingScreen() {
  const { ref, new: isNewParam } = useLocalSearchParams<{ ref: string; new?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { bookings, cancelBooking } = useBooking();
  const b = bookings.find((x) => x.reference === ref);
  const [confirm, setConfirm] = useState(false);
  const [reason, setReason] = useState('');

  if (!b) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: S.gutter, backgroundColor: C.sand }}>
        <Text style={T.h2}>Booking not found</Text>
        <Button label="My bookings" style={{ marginTop: 20 }} onPress={() => router.replace('/trips')} />
      </View>
    );
  }

  const isNew = isNewParam === '1' && b.status === 'CONFIRMED';
  const tab = tabOf(b);
  const until = freeCancelUntil(b);
  const canCancel = tab === 'upcoming';
  const cancelIsFree = until != null && until >= new Date().toISOString().slice(0, 10);

  return (
    <View style={{ flex: 1, backgroundColor: C.sand }}>
      <View style={[styles.barBg, { height: insets.top + 58 }]} />
      <BackBar onBack={() => (router.canGoBack() ? router.back() : router.replace('/trips'))} title="Booking details" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 74, paddingBottom: insets.bottom + 40, paddingHorizontal: S.gutter }}>
        {isNew && (
          <>
            <BookingSteps current={3} />
            <Card style={styles.confirmed} pad={24}>
              <DrawnCheck />
              <Animated.Text entering={FadeInDown.delay(700).duration(700).easing(EASE)} style={styles.confTitle}>Your booking is confirmed</Animated.Text>
              <Animated.Text entering={FadeInDown.delay(850).duration(700).easing(EASE)} style={[T.body, { textAlign: 'center', marginTop: 8 }]}>
                Thank you, {b.guest.firstName}. Keep your reference to manage your booking. You’ll pay at the property.
              </Animated.Text>
            </Card>
          </>
        )}

        <Animated.View entering={FadeInDown.delay(isNew ? 1000 : 0).duration(650).easing(EASE)}>
          {/* Reference */}
          <Card style={{ marginTop: isNew ? 14 : 0 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.kicker}>Booking reference</Text>
              <View style={[styles.status, tab === 'cancelled' && { backgroundColor: 'rgba(180, 35, 24, 0.08)' }]}>
                <Text style={[styles.statusText, tab === 'cancelled' && { color: C.danger }]}>{STATUS[tab]}</Text>
              </View>
            </View>
            <Text style={styles.ref} selectable>{b.reference}</Text>
            <Text style={[T.small, { marginTop: 2 }]}>Booked {fmtDate(b.createdAt)} · {b.status === 'CANCELLED' ? 'Cancelled' : 'Pay at the property'}</Text>
          </Card>

          {/* Stay */}
          <Card style={{ marginTop: 14 }} pad={8}>
            <View>
              <Photo src={b.type.images[0]} style={styles.photo} />
              <View style={{ position: 'absolute', top: 10, left: 10 }}>
                <PhotoTag label={b.plan.name} icon="pricetag-outline" />
              </View>
            </View>
            <View style={{ paddingHorizontal: 8, paddingTop: 14, paddingBottom: 6 }}>
              <Text style={styles.name} onPress={() => router.push(`/room/${b.type.slug}`)}>{b.type.name}</Text>
              <Text style={[T.small, { marginTop: 3 }]}>{b.type.bedType} · {b.type.outdoorSpace}</Text>
              <View style={styles.items}>
                <Item icon="log-in-outline" label="Check-in" value={fmtDate(b.stay.checkIn)} sub="From 2:00 PM" />
                <Item icon="log-out-outline" label="Check-out" value={fmtDate(b.stay.checkOut)} sub="Until 12:00 PM" />
                <Item icon="people-outline" label="Guests" value={guestsLabel(b.stay.adults, b.stay.children)} sub={`${plural(b.stay.rooms, 'apartment')} · ${plural(b.price.nights, 'night')}`} />
                {b.arrivalTime && <Item icon="time-outline" label="Arrival" value={b.arrivalTime} />}
              </View>
            </View>
          </Card>

          {b.status === 'CANCELLED' && (
            <View style={styles.cancelled}>
              <Text style={styles.cardTitle}>This booking was cancelled</Text>
              <Text style={[T.small, { marginTop: 4 }]}>The apartment has been released.</Text>
            </View>
          )}

          {/* Price */}
          <SectionTitle title="Price details" style={styles.section} />
          <Card style={{ marginTop: 12 }}>
            <View style={{ gap: 9 }}>
              <Row label="Apartments × nights" value={money(b.price.roomSubtotal)} />
              {b.price.discountTotal > 0 && <Row label="Discount" value={`− ${money(b.price.discountTotal)}`} />}
              {b.price.breakfastTotal > 0 && <Row label="Breakfast" value={money(b.price.breakfastTotal)} />}
              <Row label="Taxes" value={money(b.price.taxTotal)} />
            </View>
            <View style={styles.total}>
              <Text style={styles.cardTitle}>Total</Text>
              <Text style={styles.totalValue}>{money(b.price.grandTotal)}</Text>
            </View>
            <Text style={[T.small, { fontSize: 12, marginTop: 6 }]}>Pay at the property · {b.status === 'CANCELLED' ? 'Cancelled' : 'Not paid yet'}</Text>
          </Card>

          {/* Guest */}
          <SectionTitle title="Lead guest" style={styles.section} />
          <Card style={{ marginTop: 12 }}>
            <Text style={styles.cardTitle}>{b.guest.firstName} {b.guest.lastName}</Text>
            <Text style={[T.small, { marginTop: 3 }]}>{b.guest.email} · {b.guest.phone}</Text>
            {b.specialRequests && (
              <Text style={styles.requests}>
                <Text style={{ fontFamily: FONTS.uiBold, color: C.ink }}>Special requests: </Text>
                {b.specialRequests}
              </Text>
            )}
          </Card>

          {/* Cancellation */}
          <SectionTitle title="Cancellation policy" style={styles.section} />
          <Card style={{ marginTop: 12 }}>
            {b.plan.refundable && until ? (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Ionicons name="shield-checkmark-outline" size={17} color={C.pine} style={{ marginTop: 1 }} />
                <Text style={[T.small, { flex: 1, color: C.ink70 }]}>Free cancellation until {fmtDate(until)}, 2:00 PM (Pakistan time).</Text>
              </View>
            ) : (
              <Text style={T.small}>Non-refundable rate. If you cancel, the full amount is payable.</Text>
            )}
            {canCancel && b.status === 'CONFIRMED' && <Button variant="secondary" label="Cancel booking" style={{ marginTop: 14 }} onPress={() => setConfirm(true)} />}
          </Card>

          {/* Getting there */}
          <SectionTitle title="Getting there" style={styles.section} />
          <Card style={{ marginTop: 12 }}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Ionicons name="location-outline" size={17} color={C.ink55} style={{ marginTop: 1 }} />
              <Text style={[T.small, { flex: 1, color: C.ink70 }]}>{PROPERTY.address}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <Ionicons name="call-outline" size={17} color={C.ink55} style={{ marginTop: 1 }} />
              <Text style={[T.small, { color: C.ink70 }]}>Front desk: {PROPERTY.phone}</Text>
            </View>
          </Card>

          {isNew && (
            <View style={{ gap: 10, marginTop: 26 }}>
              <Button label="View my trips" onPress={() => router.replace('/trips')} />
              <Button variant="secondary" label="Back to Serene Heights" onPress={() => router.replace('/')} />
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <Sheet
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Cancel this booking?"
        footer={
          <View style={{ gap: 10 }}>
            <Button
              label="Yes, cancel"
              style={{ backgroundColor: C.danger, borderColor: C.danger }}
              onPress={() => {
                cancelBooking(b.reference);
                setConfirm(false);
              }}
            />
            <Button variant="secondary" label="Keep booking" onPress={() => setConfirm(false)} />
          </View>
        }>
        <View style={{ paddingHorizontal: S.gutter }}>
          <Text style={T.body}>
            {cancelIsFree
              ? 'You’re within the free cancellation window. Nothing will be charged.'
              : b.plan.refundable
                ? 'The free cancellation window has passed. The front desk will contact you about any charge.'
                : 'This is a non-refundable rate. The full amount remains payable.'}
          </Text>
          <Text style={styles.label}>Reason (optional)</Text>
          <TextInput value={reason} onChangeText={setReason} multiline maxLength={300} style={styles.input} placeholderTextColor={C.ink40} />
        </View>
      </Sheet>
    </View>
  );
}

// A ring and tick that draw themselves, then rest.
function DrawnCheck() {
  const ring = useSharedValue(0);
  const tick = useSharedValue(0);
  useEffect(() => {
    ring.set(withTiming(1, { duration: 700, easing: Easing.bezier(0.65, 0, 0.35, 1) }));
    tick.set(withDelay(450, withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const R = 30;
  const CIRC = 2 * Math.PI * R;
  const ringProps = useAnimatedProps(() => ({ strokeDashoffset: CIRC * (1 - ring.get()) }));
  const tickProps = useAnimatedProps(() => ({ strokeDashoffset: 40 * (1 - tick.get()) }));
  return (
    <Svg width={72} height={72} viewBox="0 0 72 72">
      <ACircle cx={36} cy={36} r={R} stroke={C.pine} strokeWidth={1.75} fill="none" strokeDasharray={[CIRC, CIRC]} animatedProps={ringProps} rotation={-90} origin="36,36" />
      <APath d="M24 37 L32 45 L48 28" stroke={C.pine} strokeWidth={2.25} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={[40, 40]} animatedProps={tickProps} />
    </Svg>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
      <Text style={{ fontFamily: FONTS.ui, fontSize: 13.5, color: C.ink70 }}>{label}</Text>
      <Text style={{ fontFamily: FONTS.uiSemi, fontSize: 13.5, color: C.ink, fontVariant: ['tabular-nums'] }}>{value}</Text>
    </View>
  );
}

function Item({ icon, label, value, sub }: { icon: IconName; label: string; value: string; sub?: string }) {
  return (
    <View style={styles.item}>
      <View style={styles.itemIcon}>
        <Ionicons name={icon} size={16} color={C.pine} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={styles.itemValue}>{value}</Text>
        {sub && <Text style={[T.small, { fontSize: 11.5, marginTop: 1 }]}>{sub}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barBg: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 15, backgroundColor: C.sand, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  confirmed: { alignItems: 'center', marginTop: 18 },
  confTitle: { fontFamily: FONTS.display, fontSize: 28, lineHeight: 32, color: C.ink, marginTop: 14, textAlign: 'center' },
  kicker: { fontFamily: FONTS.uiSemi, fontSize: 12.5, color: C.ink55 },
  status: { paddingHorizontal: 10, height: 24, borderRadius: 12, justifyContent: 'center', backgroundColor: C.sand, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  statusText: { fontFamily: FONTS.uiBold, fontSize: 11.5, color: C.pine },
  ref: { fontFamily: FONTS.uiBold, fontSize: 28, color: C.ink, marginTop: 8, letterSpacing: 2.5, fontVariant: ['tabular-nums'] },
  photo: { width: '100%', aspectRatio: 16 / 9, borderRadius: 16 },
  name: { fontFamily: FONTS.display, fontSize: 25, lineHeight: 28, color: C.ink },
  items: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, paddingTop: 6, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  item: { flexDirection: 'row', gap: 10, width: '50%', paddingTop: 10, paddingRight: 8 },
  itemIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.sand, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  itemLabel: { fontFamily: FONTS.ui, fontSize: 11.5, color: C.ink55 },
  itemValue: { fontFamily: FONTS.uiSemi, fontSize: 13.5, color: C.ink, marginTop: 1 },
  cancelled: { marginTop: 14, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(180, 35, 24, 0.3)', backgroundColor: 'rgba(180, 35, 24, 0.05)' },
  section: { marginTop: 24 },
  cardTitle: { fontFamily: FONTS.uiBold, fontSize: 15.5, color: C.ink },
  total: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  totalValue: { fontFamily: FONTS.uiBold, fontSize: 22, color: C.ink, fontVariant: ['tabular-nums'] },
  requests: { marginTop: 12, fontFamily: FONTS.ui, fontSize: 13, color: C.ink70, backgroundColor: C.sand, borderRadius: 12, padding: 12, overflow: 'hidden' },
  label: { fontFamily: FONTS.uiSemi, fontSize: 13, color: C.ink, marginTop: 18, marginBottom: 8 },
  input: { fontFamily: FONTS.uiMedium, borderWidth: 1, borderColor: C.line, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: C.ink, backgroundColor: C.pureWhite, borderRadius: 14, minHeight: 80, textAlignVertical: 'top' },
});
