import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BrandHeader from '@/components/BrandHeader';
import FindBooking from '@/components/FindBooking';
import { PhotoTag, SectionTitle } from '@/components/kit';
import { useScrollTop } from '@/components/ScrollTop';
import Segmented from '@/components/Segmented';
import { Button, Photo, PressableScale } from '@/components/ui';
import { fmtShort, guestsLabel, money, plural } from '@/lib/stay';
import { tabOf, useBooking, type Tab } from '@/state/booking';
import { C, F, FONTS, S, T, shadow, tabBarSpace } from '@/theme';

const STATUS = { upcoming: 'Upcoming', past: 'Completed', cancelled: 'Cancelled' } as const;

// "My bookings" from the web account page.
export default function Trips() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { lookup } = useLocalSearchParams<{ lookup?: string }>();
  const { bookings, user } = useBooking();
  const { ref, onScroll } = useScrollTop();
  const [tab, setTab] = useState<Tab>('upcoming');
  const list = bookings.filter((b) => tabOf(b) === tab);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView ref={ref} onScroll={onScroll} scrollEventThrottle={64} contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: tabBarSpace(insets.bottom), paddingHorizontal: S.gutter }} showsVerticalScrollIndicator={false}>
        <View style={{ marginHorizontal: -S.gutter }}>
          <BrandHeader />
        </View>
        <Text style={[T.eyebrow, { marginTop: 24 }]}>{user ? `${user.firstName} ${user.lastName}` : 'Your stays'}</Text>
        <Text style={[T.h1, { marginTop: 4 }]}>Trips</Text>
        <Text style={[T.small, { marginTop: 4 }]}>
          {plural(bookings.filter((b) => tabOf(b) === 'upcoming').length, 'upcoming stay')} · {plural(bookings.length, 'booking')} in total
        </Text>

        {!user && (
          <View style={styles.signin}>
            <View style={styles.signinIcon}>
              <Ionicons name="person-outline" size={20} color={C.pine} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.signTitle} numberOfLines={1}>Keep your trips</Text>
              <Text style={[T.small, { marginTop: 1 }]} numberOfLines={2}>Sign in to save every booking.</Text>
            </View>
            <Pressable onPress={() => router.push('/login')} style={({ pressed }) => [styles.signinBtn, pressed && { opacity: 0.85 }]} accessibilityRole="button">
              <Text style={styles.signinBtnText}>Sign in</Text>
            </Pressable>
          </View>
        )}

        <FindBooking autoOpen={lookup === '1'} />

        <SectionTitle title="Your bookings" sub="Tap a stay to see details or cancel" style={{ marginTop: 26 }} />
        <View style={{ marginTop: 12, marginBottom: 16 }}>
          <Segmented
            value={tab}
            onChange={setTab}
            options={[
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'past', label: 'Past' },
              { key: 'cancelled', label: 'Cancelled' },
            ]}
          />
        </View>

        {list.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="calendar-outline" size={22} color={C.pine} />
            </View>
            <Text style={styles.emptyTitle}>
              {tab === 'upcoming' ? 'No upcoming stays' : tab === 'past' ? 'No past stays yet' : 'No cancelled bookings'}
            </Text>
            {tab === 'upcoming' && (
              <>
                <Text style={[T.small, { textAlign: 'center', marginTop: 6 }]}>When you book, your stays appear here.</Text>
                <Button label="Plan a stay" style={{ marginTop: 22, alignSelf: 'stretch' }} onPress={() => router.push({ pathname: '/stay', params: { tab: 'dates', next: 'apartments' } })} />
              </>
            )}
          </View>
        ) : (
          <View style={{ gap: 14 }}>
            {list.map((b) => (
              <PressableScale key={b.reference} onPress={() => router.push(`/booking/${b.reference}`)} scaleTo={0.98} style={styles.card}>
                <View>
                  <Photo src={b.type.images[0]} style={styles.photo} />
                  <View style={styles.tags}>
                    <PhotoTag label={STATUS[tabOf(b)]} icon={tabOf(b) === 'cancelled' ? 'close-circle-outline' : tabOf(b) === 'past' ? 'checkmark-circle-outline' : 'time-outline'} />
                    <PhotoTag label={b.reference} />
                  </View>
                </View>
                <View style={{ paddingHorizontal: 8, paddingTop: 12, paddingBottom: 6 }}>
                  <Text numberOfLines={1} style={styles.name}>{b.type.name}</Text>
                  <View style={styles.metaRow}>
                    <Ionicons name="calendar-outline" size={13} color={C.ink55} />
                    <Text style={styles.meta}>{fmtShort(b.stay.checkIn)} – {fmtShort(b.stay.checkOut)} · {plural(b.price.nights, 'night')}</Text>
                  </View>
                  <View style={styles.foot}>
                    <Text style={styles.meta}>{guestsLabel(b.stay.adults, b.stay.children)}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Text style={styles.total}>{money(b.price.grandTotal)}</Text>
                      <Ionicons name="chevron-forward" size={15} color={C.ink40} />
                    </View>
                  </View>
                </View>
              </PressableScale>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  signin: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 18, padding: 14, borderRadius: S.card, backgroundColor: C.pureWhite, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, ...shadow.card },
  signinIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.sand, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  signinBtn: { paddingHorizontal: 16, height: 36, borderRadius: 999, backgroundColor: C.pine, justifyContent: 'center' },
  signinBtnText: { color: C.cream, fontFamily: FONTS.uiBold, fontSize: 13 },
  signTitle: { fontFamily: FONTS.uiBold, fontSize: 15.5, color: C.ink },
  empty: { alignItems: 'center', padding: 26, backgroundColor: C.pureWhite, borderRadius: S.card, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.sand, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontFamily: FONTS.uiBold, fontSize: 17, color: C.ink, marginTop: 14 },
  card: { padding: 8, backgroundColor: C.pureWhite, borderRadius: 24, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, ...shadow.card },
  photo: { width: '100%', aspectRatio: 2, borderRadius: 17 },
  tags: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', gap: 6 },
  name: { fontFamily: FONTS.uiBold, fontSize: 18, lineHeight: 22, color: C.ink },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  meta: { fontFamily: FONTS.ui, fontSize: 12.5, color: C.ink55 },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  total: { fontFamily: FONTS.uiBold, fontSize: 15, color: C.ink, fontVariant: ['tabular-nums'] },
});
