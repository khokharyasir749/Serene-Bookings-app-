import { useFocusEffect, useRouter } from 'expo-router';
import { ChevronRight } from '@/components/icons';
import { memo, useCallback, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Scrim from '@/components/Scrim';
import { useScrollTop } from '@/components/ScrollTop';
import SearchCard from '@/components/SearchCard';
import Segmented from '@/components/Segmented';
import BrandHeader from '@/components/BrandHeader';
import LuxuryFooter from '@/components/LuxuryFooter';
import { Photo, PressableScale } from '@/components/ui';
import { PROPERTY, REASONS, ROOM_TYPES, type RoomType } from '@/data/catalog';
import { money } from '@/lib/stay';
import { useBooking } from '@/state/booking';
import { C, F, S, T, tabBarSpace } from '@/theme';

const SEASONS = {
  summer: '/images/resort/hero-tower-mist.jpg',
  winter: '/images/resort/aerial-snow-resort.jpg',
} as const;
type Season = keyof typeof SEASONS;

const GLANCE = [
  { value: '7,906 ft', label: 'Altitude' },
  { value: '50+', label: 'Facilities' },
  { value: '24/7', label: 'Concierge' },
  { value: '2 hrs', label: 'Islamabad' },
];

const EXPERIENCES = PROPERTY.experiences.slice(0, 8);

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

// Discover: a focused, curated start — search first, then apartments and experiences to tap into.
export default function Discover() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { stay, setStay, user } = useBooking();
  const { ref, onScroll } = useScrollTop();
  const [season, setSeason] = useState<Season>('summer');
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const resW = Math.round(width * 0.64);

  useFocusEffect(
    useCallback(() => {
      setScrollEnabled(true);
    }, [])
  );

  const openStay = (tab: 'dates' | 'guests') => router.push({ pathname: '/stay', params: { tab, next: 'apartments' } });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={ref}
        style={{ flex: 1 }}
        scrollEnabled={scrollEnabled}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        onScroll={onScroll}
        scrollEventThrottle={64}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 0 }}
      >
        <BrandHeader />

        <View style={{ paddingHorizontal: S.gutter, marginTop: 26 }}>
          <Text style={T.eyebrow}>{user ? `${greeting()}, ${user.firstName}` : greeting()}</Text>
          <Text style={[T.h1, { marginTop: 2 }]}>Find your mountain home</Text>
        </View>

        {/* Hero */}
        <View style={[styles.hero, { height: width - S.gutter * 2 }]}>
          <Photo src={SEASONS[season]} style={StyleSheet.absoluteFill} />
          <Scrim top={0.28} bottom={0.55} />
          <View style={{ padding: 14, width: 236 }}>
            <Segmented
              dark
              value={season}
              onChange={setSeason}
              options={[
                { key: 'summer', label: 'Summer' },
                { key: 'winter', label: 'Winter' },
              ]}
            />
          </View>
          <View style={{ flex: 1 }} />
          <View style={{ padding: 20 }}>
            <Text style={styles.heroKicker}>7,906 FT · THE GALIYAT</Text>
            <Text style={[T.h2, { color: C.sand, marginTop: 6 }]}>A home above the clouds</Text>
          </View>
        </View>

        {/* Search */}
        <View style={{ paddingHorizontal: S.gutter, marginTop: 14 }}>
          <SearchCard
            stay={stay}
            onDates={() => openStay('dates')}
            onGuests={() => openStay('guests')}
            onSearch={() => {
              setStay(stay);
              router.navigate('/apartments');
            }}
          />
        </View>

        {/* At a glance */}
        <View style={styles.glance}>
          {GLANCE.map((g, i) => (
            <View key={g.label} style={[styles.glanceItem, i > 0 && styles.glanceDiv]}>
              <Text style={[T.h3, { color: C.cream, fontVariant: ['tabular-nums'] }]}>{g.value}</Text>
              <Text style={styles.glanceLabel}>{g.label.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        {/* Apartments */}
        <SectionHead title="Apartments" sub="Five one-bedroom layouts" onMore={() => router.navigate('/apartments')} />
        <FlatList
          horizontal
          nestedScrollEnabled
          data={ROOM_TYPES}
          keyExtractor={(t) => t.slug}
          renderItem={({ item }) => <ResidenceCard t={item} w={resW} onPress={() => router.push(`/room/${item.slug}`)} />}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={resW + 14}
          initialNumToRender={2}
          windowSize={3}
          contentContainerStyle={{ paddingHorizontal: S.gutter, gap: 14 }}
        />

        {/* Experiences */}
        <SectionHead title="On the mountain" sub="50+ facilities, steps from your door" />
        <FlatList
          horizontal
          nestedScrollEnabled
          data={EXPERIENCES}
          keyExtractor={(e) => e.title}
          renderItem={({ item }) => <ExperienceCard title={item.title} image={item.image} />}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={152}
          initialNumToRender={3}
          windowSize={3}
          contentContainerStyle={{ paddingHorizontal: S.gutter, gap: 12 }}
        />

        {/* Why Serene */}
        <SectionHead title="Why Serene Heights" />
        <View style={styles.reasons}>
          {REASONS.map((r, i) => (
            <View key={r.label} style={[styles.reason, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line }]}>
              <Photo src={r.image} style={{ width: 64, height: 64, borderRadius: 14 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.reasonLabel}>{r.label.toUpperCase()}</Text>
                <Text style={[T.h3, { fontSize: 16, lineHeight: 21, marginTop: 4 }]}>{r.title}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer: concierge + contact */}
        <LuxuryFooter bottomSpace={tabBarSpace(insets.bottom)} />
      </ScrollView>
    </View>
  );
}

const ResidenceCard = memo(function ResidenceCard({ t, w, onPress }: { t: RoomType; w: number; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} scaleTo={0.97} style={{ width: w }}>
      <Photo src={t.images[0]} style={{ width: w, height: w, borderRadius: S.photo }} />
      <Text numberOfLines={1} style={[T.h3, { marginTop: 12 }]}>{t.name.replace(' Apartment', '')}</Text>
      <Text style={[T.small, { marginTop: 2 }]}>
        From <Text style={{ color: C.ink, fontWeight: '600' }}>{money(t.baseRate)}</Text> / night
      </Text>
    </PressableScale>
  );
});

const ExperienceCard = memo(function ExperienceCard({ title, image }: { title: string; image: string }) {
  return (
    <View style={{ width: 140 }}>
      <Photo src={image} style={{ width: 140, height: 140, borderRadius: 18 }} />
      <Text numberOfLines={1} style={[T.small, { color: C.ink, marginTop: 9, fontWeight: '500' }]}>{title}</Text>
    </View>
  );
});

function SectionHead({ title, sub, onMore }: { title: string; sub?: string; onMore?: () => void }) {
  return (
    <View style={styles.sectionHead}>
      <View style={{ flex: 1 }}>
        <Text style={T.h2}>{title}</Text>
        {sub && <Text style={[T.small, { marginTop: 2 }]}>{sub}</Text>}
      </View>
      {onMore && (
        <Pressable onPress={onMore} hitSlop={10} style={styles.more}>
          <Text style={{ fontSize: 13.5, fontWeight: '600', color: C.pine }}>See all</Text>
          <ChevronRight size={15} color={C.pine} strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.gutter },
  lockup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  wordmark: { fontFamily: F.display, fontSize: 16, letterSpacing: 4.2, color: C.pine },
  sub: { fontSize: 8.5, letterSpacing: 2.4, color: C.ink55, marginTop: 3, fontWeight: '600' },
  signIn: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingLeft: 6, paddingRight: 14, height: 36, borderRadius: 18, borderWidth: StyleSheet.hairlineWidth * 2, borderColor: C.lineStrong, backgroundColor: C.white, minWidth: 80, justifyContent: 'center' },
  signInText: { fontSize: 13, fontWeight: '600', color: C.ink },
  avatar: { width: 26, height: 26, borderRadius: 13, backgroundColor: C.pine, alignItems: 'center', justifyContent: 'center' },
  hero: { marginHorizontal: S.gutter, marginTop: 18, borderRadius: S.card, overflow: 'hidden', backgroundColor: C.snow },
  heroKicker: { fontSize: 10, letterSpacing: 2.6, color: C.cream70, fontWeight: '600' },
  glance: { flexDirection: 'row', marginHorizontal: S.gutter, marginTop: 14, paddingVertical: 18, backgroundColor: C.pine, borderRadius: S.card, borderWidth: 1, borderColor: C.goldLine },
  glanceItem: { flex: 1, alignItems: 'center' },
  glanceDiv: { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: C.goldLine },
  glanceLabel: { color: C.gold, fontSize: 9, letterSpacing: 1.4, marginTop: 4, fontWeight: '700' },
  sectionHead: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: S.gutter, marginTop: 34, marginBottom: 14 },
  more: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingVertical: 4 },
  reasons: { marginHorizontal: S.gutter, backgroundColor: C.white, borderRadius: S.card, paddingHorizontal: 14 },
  reason: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  reasonLabel: { fontSize: 9.5, letterSpacing: 1.8, color: C.pine, fontWeight: '700' },
  cta: { marginHorizontal: S.gutter, marginTop: 34, padding: 26, borderRadius: S.card, backgroundColor: C.pine, alignItems: 'center' },
});
