import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';
import { ChevronRight } from '@/components/icons';
import { memo, useCallback, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BrandHeader from '@/components/BrandHeader';
import LuxuryFooter from '@/components/LuxuryFooter';
import Scrim from '@/components/Scrim';
import { useScrollTop } from '@/components/ScrollTop';
import SearchCard from '@/components/SearchCard';
import { Photo, PressableScale } from '@/components/ui';
import { areaRangeOf, PROPERTY, REASONS, ROOM_TYPES, type RoomType } from '@/data/catalog';
import { money } from '@/lib/stay';
import { useBooking } from '@/state/booking';
import { C, F, FONTS, S, shadow, T, tabBarSpace } from '@/theme';

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

export default function Discover() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { stay, setStay, user } = useBooking();
  const { ref, onScroll } = useScrollTop();
  const [season, setSeason] = useState<Season>('summer');
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const resW = Math.min(300, Math.round(width * 0.74));

  useFocusEffect(
    useCallback(() => {
      setScrollEnabled(true);
    }, [])
  );

  const openStay = (tab: 'dates' | 'guests') => router.push({ pathname: '/stay', params: { tab, next: 'apartments' } });

  return (
    <View style={{ flex: 1, backgroundColor: C.sand }}>
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
        {/* Serene Brand Header */}
        <BrandHeader />

        {/* Editorial Greeting Header */}
        <View style={styles.greetingHeader}>
          <View style={styles.eyebrowPill}>
            <Ionicons name="sparkles" size={10} color={C.gold} style={{ marginRight: 5 }} />
            <Text style={styles.eyebrowText}>7,906 FT · NATHIA GALI</Text>
          </View>
          <Text style={styles.greetingTitle}>
            {user ? `${greeting()}, ${user.firstName}` : 'Find your mountain sanctuary'}
          </Text>
          <Text style={styles.greetingSub}>
            Serene Heights luxury suites & residences nestled in the pine hills of Nathia Gali.
          </Text>
        </View>

        {/* Cinematic Resort Hero Banner */}
        <View style={styles.hero}>
          <Photo src={SEASONS[season]} style={StyleSheet.absoluteFill} />
          <Scrim top={0.35} bottom={0.85} />

          {/* Top meta row inside hero */}
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <Ionicons name="location-outline" size={12} color={C.cream} style={{ marginRight: 4 }} />
              <Text style={styles.heroBadgeText}>Beside PAF Base · 7,906 ft</Text>
            </View>

            {/* Season switcher pill */}
            <View style={styles.seasonSwitch}>
              <Pressable
                onPress={() => setSeason('summer')}
                hitSlop={4}
                style={[styles.seasonBtn, season === 'summer' && styles.seasonBtnOn]}
                accessibilityLabel="Summer season">
                <Text style={[styles.seasonBtnText, season === 'summer' && styles.seasonBtnTextOn]}>
                  🌲 Summer
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSeason('winter')}
                hitSlop={4}
                style={[styles.seasonBtn, season === 'winter' && styles.seasonBtnOn]}
                accessibilityLabel="Winter season">
                <Text style={[styles.seasonBtnText, season === 'winter' && styles.seasonBtnTextOn]}>
                  ❄️ Winter
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={{ flex: 1 }} />

          {/* Bottom text inside hero */}
          <View style={styles.heroBottom}>
            <Text style={styles.heroKicker}>BESPOKE LUXURY RESIDENCES</Text>
            <Text style={styles.heroTitle}>A Home Above the Clouds</Text>
          </View>
        </View>

        {/* Elevated Search Card */}
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

        {/* At a glance metric bar */}
        <View style={styles.glance}>
          {GLANCE.map((g, i) => (
            <View key={g.label} style={[styles.glanceItem, i > 0 && styles.glanceDiv]}>
              <Text style={styles.glanceNum}>{g.value}</Text>
              <Text style={styles.glanceLabel}>{g.label.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        {/* Curated Apartments Showcase */}
        <SectionHead
          title="Curated Residences"
          sub="Five luxury one-bedroom layouts"
          onMore={() => router.navigate('/apartments')}
        />
        <FlatList
          horizontal
          nestedScrollEnabled
          data={ROOM_TYPES}
          keyExtractor={(t) => t.slug}
          renderItem={({ item }) => (
            <ResidenceCard
              t={item}
              w={resW}
              onPress={() => router.push(`/room/${item.slug}`)}
            />
          )}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={resW + 14}
          initialNumToRender={2}
          windowSize={3}
          contentContainerStyle={{ paddingHorizontal: S.gutter, gap: 14 }}
        />

        {/* Resort Facilities & Experiences */}
        <SectionHead
          title="Resort Experiences"
          sub="50+ world-class facilities at 7,906 ft"
          onMore={() => router.push('/amenities')}
        />
        <FlatList
          horizontal
          nestedScrollEnabled
          data={EXPERIENCES}
          keyExtractor={(e) => e.title}
          renderItem={({ item }) => (
            <ExperienceCard
              title={item.title}
              image={item.image}
              onPress={() => router.push('/amenities')}
            />
          )}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={176}
          initialNumToRender={3}
          windowSize={3}
          contentContainerStyle={{ paddingHorizontal: S.gutter, gap: 12 }}
        />

        {/* Why Serene Heights Editorial Cards */}
        <SectionHead
          title="Why Serene Heights"
          sub="Crafted for year-round alpine luxury"
        />
        <View style={styles.reasons}>
          {REASONS.map((r, i) => (
            <View
              key={r.label}
              style={[
                styles.reason,
                i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
              ]}
            >
              <Photo src={r.image} style={styles.reasonPhoto} />
              <View style={{ flex: 1 }}>
                <Text style={styles.reasonLabel}>{r.label.toUpperCase()}</Text>
                <Text style={styles.reasonTitle}>{r.title}</Text>
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

const ResidenceCard = memo(function ResidenceCard({
  t,
  w,
  onPress,
}: {
  t: RoomType;
  w: number;
  onPress: () => void;
}) {
  const [fav, setFav] = useState(false);
  const tag = t.outdoorSpace.includes('terrace') ? 'Private terrace' : t.slug.includes('corner') ? 'Corner suite' : 'Valley views';

  return (
    <PressableScale onPress={onPress} scaleTo={0.97} style={[styles.resCard, { width: w }]}>
      <View style={styles.resImgWrap}>
        <Photo src={t.images[0]} style={styles.resImg} />
        {/* Top-left tag */}
        <View style={styles.resTag}>
          <Text style={styles.resTagText}>✦ {tag}</Text>
        </View>
        {/* Top-right favorite button */}
        <Pressable
          onPress={() => setFav((v) => !v)}
          hitSlop={8}
          style={styles.resHeart}
          accessibilityLabel="Favorite">
          <Ionicons
            name={fav ? 'heart' : 'heart-outline'}
            size={16}
            color={fav ? C.gold : C.pine}
          />
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 4, paddingTop: 10 }}>
        <Text numberOfLines={1} style={styles.resName}>{t.name}</Text>
        <Text style={styles.resMeta}>⭐ 4.8 (126 reviews) · 7,906 ft</Text>
        <Text style={styles.resSpecs} numberOfLines={1}>
          📐 {areaRangeOf(t.slug)} · 👤 {t.maxOccupancy} guests · 🛏️ {t.bedType}
        </Text>

        <View style={styles.resFoot}>
          <View>
            <Text style={styles.resFrom}>FROM</Text>
            <Text style={styles.resPrice}>
              {money(t.baseRate)} <Text style={styles.resNight}>/ night</Text>
            </Text>
          </View>
          <View style={styles.resArrow}>
            <Ionicons name="arrow-forward" size={13} color={C.cream} />
          </View>
        </View>
      </View>
    </PressableScale>
  );
});

const ExperienceCard = memo(function ExperienceCard({
  title,
  image,
  onPress,
}: {
  title: string;
  image: string;
  onPress?: () => void;
}) {
  return (
    <PressableScale onPress={onPress} scaleTo={0.97} style={styles.expCard}>
      <Photo src={image} style={StyleSheet.absoluteFill} />
      <Scrim bottom={0.72} />
      <View style={{ flex: 1 }} />
      <Text numberOfLines={2} style={styles.expTitle}>{title}</Text>
    </PressableScale>
  );
});

function SectionHead({
  title,
  sub,
  onMore,
}: {
  title: string;
  sub?: string;
  onMore?: () => void;
}) {
  return (
    <View style={styles.sectionHead}>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {sub && <Text style={styles.sectionSub}>{sub}</Text>}
      </View>
      {onMore && (
        <Pressable onPress={onMore} hitSlop={10} style={styles.more}>
          <Text style={styles.moreText}>See all</Text>
          <ChevronRight size={15} color={C.pine} strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  greetingHeader: {
    paddingHorizontal: S.gutter,
    marginTop: 20,
  },
  eyebrowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 999,
    backgroundColor: C.snow,
    borderWidth: 1,
    borderColor: C.line,
    marginBottom: 8,
  },
  eyebrowText: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 1.3,
    color: C.ink,
  },
  greetingTitle: {
    fontFamily: FONTS.display,
    fontSize: 31,
    lineHeight: 35,
    letterSpacing: -0.4,
    color: C.ink,
  },
  greetingSub: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    lineHeight: 18,
    color: C.ink70,
    marginTop: 4,
  },
  hero: {
    marginHorizontal: S.gutter,
    marginTop: 18,
    height: 310,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: C.pine,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.35)',
    ...shadow.card,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  heroBadgeText: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 0.8,
    color: '#FFFFFF',
  },
  seasonSwitch: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  seasonBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  seasonBtnOn: {
    backgroundColor: C.gold,
  },
  seasonBtnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  seasonBtnTextOn: {
    color: C.pine,
  },
  heroBottom: {
    padding: 18,
  },
  heroKicker: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 1.8,
    color: C.gold,
  },
  heroTitle: {
    fontFamily: FONTS.display,
    fontSize: 27,
    lineHeight: 31,
    color: '#FFFFFF',
    marginTop: 4,
  },
  glance: {
    flexDirection: 'row',
    marginHorizontal: S.gutter,
    marginTop: 14,
    paddingVertical: 16,
    backgroundColor: C.pine,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.goldLine,
    ...shadow.card,
  },
  glanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  glanceDiv: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: C.goldLine,
  },
  glanceNum: {
    fontFamily: FONTS.display,
    fontSize: 21,
    color: C.cream,
    fontVariant: ['tabular-nums'],
  },
  glanceLabel: {
    color: C.gold,
    fontFamily: FONTS.uiBold,
    fontSize: 9,
    letterSpacing: 1.4,
    marginTop: 3,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: S.gutter,
    marginTop: 32,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: FONTS.display,
    fontSize: 25,
    lineHeight: 29,
    color: C.ink,
  },
  sectionSub: {
    fontFamily: FONTS.ui,
    fontSize: 12.5,
    color: C.ink55,
    marginTop: 3,
  },
  more: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  moreText: {
    fontSize: 13,
    fontFamily: FONTS.uiBold,
    color: C.pine,
  },
  resCard: {
    backgroundColor: C.pureWhite,
    borderRadius: 22,
    padding: 10,
    borderWidth: 1,
    borderColor: C.line,
    ...shadow.card,
  },
  resImgWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 11,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: C.snow,
  },
  resImg: {
    width: '100%',
    height: '100%',
  },
  resTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  resTagText: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    color: C.pine,
  },
  resHeart: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.pill,
  },
  resName: {
    fontFamily: FONTS.uiBold,
    fontSize: 15.5,
    color: C.ink,
    marginTop: 2,
  },
  resMeta: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    color: C.ink55,
    marginTop: 3,
  },
  resSpecs: {
    fontFamily: FONTS.uiMedium,
    fontSize: 11,
    color: C.ink70,
    marginTop: 5,
  },
  resFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
  },
  resFrom: {
    fontFamily: FONTS.uiBold,
    fontSize: 9,
    letterSpacing: 1.2,
    color: C.gold,
  },
  resPrice: {
    fontFamily: FONTS.uiBold,
    fontSize: 15.5,
    color: C.ink,
    fontVariant: ['tabular-nums'],
    marginTop: 1,
  },
  resNight: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    color: C.ink55,
  },
  resArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.pine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expCard: {
    width: 164,
    height: 205,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 12,
    backgroundColor: C.pine,
    borderWidth: 1,
    borderColor: C.line,
    ...shadow.card,
  },
  expTitle: {
    fontFamily: FONTS.uiBold,
    fontSize: 14,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  reasons: {
    marginHorizontal: S.gutter,
    backgroundColor: C.pureWhite,
    borderRadius: 22,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: C.line,
    ...shadow.card,
  },
  reason: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  reasonPhoto: {
    width: 62,
    height: 62,
    borderRadius: 14,
  },
  reasonLabel: {
    fontSize: 9.5,
    letterSpacing: 1.5,
    color: C.gold,
    fontFamily: FONTS.uiBold,
  },
  reasonTitle: {
    fontFamily: FONTS.uiBold,
    fontSize: 14,
    lineHeight: 18,
    color: C.ink,
    marginTop: 3,
  },
});
