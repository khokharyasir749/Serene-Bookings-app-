import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CalendarPlus, ChevronRight } from '@/components/icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BrandHeader from '@/components/BrandHeader';
import FindBooking from '@/components/FindBooking';
import { useScrollTop } from '@/components/ScrollTop';
import Segmented from '@/components/Segmented';
import StatusPill from '@/components/StatusPill';
import { Button, Photo, PressableScale } from '@/components/ui';
import { fmtShort, guestsLabel, money, plural } from '@/lib/stay';
import { tabOf, useBooking, type Tab } from '@/state/booking';
import { C, F, FONTS, S, T, shadow, tabBarSpace } from '@/theme';

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
              <Text style={[T.h3, { fontSize: 18, lineHeight: 22 }]} numberOfLines={1}>Keep your trips</Text>
              <Text style={[T.small, { marginTop: 1 }]} numberOfLines={2}>Sign in to save every booking.</Text>
            </View>
            <Pressable onPress={() => router.push('/login')} style={({ pressed }) => [styles.signinBtn, pressed && { opacity: 0.85 }]} accessibilityRole="button">
              <Text style={styles.signinBtnText}>Sign in</Text>
            </Pressable>
          </View>
        )}

        <FindBooking autoOpen={lookup === '1'} />

        <View style={{ marginTop: 16, marginBottom: 20 }}>
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
              <CalendarPlus size={22} color={C.pine} strokeWidth={1.5} />
            </View>
            <Text style={[T.h2, { marginTop: 16 }]}>
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
                <Photo src={b.type.images[0]} style={styles.thumb} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <StatusPill tab={tabOf(b)} />
                  </View>
                  <Text numberOfLines={2} style={[T.h3, { marginTop: 7 }]}>{b.type.name}</Text>
                  <Text style={[T.small, { fontSize: 12.5, marginTop: 3 }]}>
                    {fmtShort(b.stay.checkIn)} – {fmtShort(b.stay.checkOut)} · {plural(b.price.nights, 'night')}
                  </Text>
                  <Text style={[T.small, { fontSize: 12.5 }]}>
                    {guestsLabel(b.stay.adults, b.stay.children)} · {money(b.price.grandTotal)}
                  </Text>
                </View>
                <ChevronRight size={18} color={C.ink40} strokeWidth={1.75} />
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
  signinIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.snow, alignItems: 'center', justifyContent: 'center' },
  signinBtn: { paddingHorizontal: 16, height: 36, borderRadius: 999, backgroundColor: C.pine, justifyContent: 'center' },
  signinBtnText: { color: C.cream, fontFamily: FONTS.uiBold, fontSize: 13 },
  empty: { alignItems: 'center', padding: 28, backgroundColor: C.white, borderRadius: S.card },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.snow, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, backgroundColor: C.white, borderRadius: S.card },
  thumb: { width: 92, height: 92, borderRadius: 16 },
  name: { fontFamily: F.display, fontSize: 17, lineHeight: 21, color: C.ink, marginTop: 7 },
});
