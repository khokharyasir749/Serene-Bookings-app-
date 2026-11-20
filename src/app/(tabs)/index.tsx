import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useRouter } from 'expo-router';
import { ChevronRight } from '@/components/icons';
import { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BrandHeader from '@/components/BrandHeader';
import LuxuryFooter from '@/components/LuxuryFooter';
import Scrim from '@/components/Scrim';
import { useScrollTop } from '@/components/ScrollTop';
import SearchCard from '@/components/SearchCard';
import { Photo, PressableScale } from '@/components/ui';
import { areaRangeOf, PROPERTY, REASONS, REVIEWS, REVIEW_SCORE, ROOM_TYPES, type RoomType } from '@/data/catalog';
import { money } from '@/lib/stay';
import { useBooking } from '@/state/booking';
import { C, FONTS, S, shadow, tabBarSpace } from '@/theme';

const SEASONS = {
  summer: '/images/resort/hero-tower-mist.jpg',
  winter: '/images/resort/aerial-snow-resort.jpg',
} as const;
type Season = keyof typeof SEASONS;

const GLANCE = [
  { value: '7,906 ft', label: 'Altitude', icon: 'trail-sign-outline' as const },
  { value: '50+', label: 'Facilities', icon: 'sparkles-outline' as const },
  { value: '24/7', label: 'Concierge', icon: 'key-outline' as const },
  { value: '2 hrs', label: 'Islamabad', icon: 'car-outline' as const },
];

const FILTER_PILLS = [
  { key: 'all', label: 'All residences', icon: 'sparkles-outline' as const },
  { key: 'terrace', label: 'Private terrace', icon: 'sunny-outline' as const },
  { key: 'corner', label: 'Corner suites', icon: 'grid-outline' as const },
  { key: 'family', label: 'Sleeps 4+', icon: 'people-outline' as const },
  { key: 'pool', label: 'Heated pool', icon: 'water-outline' as const },
] as const;

const EXPERIENCES = [
  {
    title: 'Heated Glass Pool',
    category: 'WELLNESS · 8TH FLOOR',
    image: '/images/resort/aerial-rooftop-pool.jpg',
    tag: 'Year-Round Heated',
  },
  {
    title: 'Panoramic Dining',
    category: 'RESTAURANT & TERRACE',
    image: '/images/dining/rooftop-dining-glass.jpg',
    tag: 'Cloud-Level Cuisine',
  },
  {
    title: 'Private Ski Slope',
    category: 'WINTER SPORTS · SLOPE G2',
    image: '/images/activities/ski-slope-aerial.jpg',
    tag: 'Winter Adventure',
  },
  {
    title: 'Sunset Sky Lounge',
    category: 'LOUNGE & HIGH TEA',
    image: '/images/dining/sky-lounge.jpg',
    tag: 'Alpine Sunsets',
  },
  {
    title: 'Pine Forest Trails',
    category: 'OUTDOOR EXPLORATION',
    image: '/images/activities/winter-trails.jpg',
    tag: 'Private Trailhead',
  },
  {
    title: 'Cedarwood Sauna & Spa',
    category: 'SPA & HYDROTHERAPY',
    image: '/images/resort/glass-roof-pool.jpg',
    tag: 'Thermal Sanctuary',
  },
];

export default function Discover() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { stay, setStay } = useBooking();
  const { ref, onScroll } = useScrollTop();
  const [season, setSeason] = useState<Season>('summer');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const resW = Math.min(300, Math.round(width * 0.76));

  useFocusEffect(
    useCallback(() => {
      setScrollEnabled(true);
    }, [])
  );

  const openStay = (tab: 'dates' | 'guests') => router.push({ pathname: '/stay', params: { tab, next: 'apartments' } });

  const filteredRooms = useMemo(() => {
    if (selectedFilter === 'terrace') {
      return ROOM_TYPES.filter((r) => r.outdoorSpace.toLowerCase().includes('terrace'));
    }
    if (selectedFilter === 'corner') {
      return ROOM_TYPES.filter((r) => r.slug.includes('corner'));
    }
    if (selectedFilter === 'family') {
      return ROOM_TYPES.filter((r) => r.maxOccupancy >= 4);
    }
    return ROOM_TYPES;
  }, [selectedFilter]);

  const featuredReview = REVIEWS[0];

  return (
    <View style={{ flex: 1, backgroundColor: C.sand }}>
      <StatusBar style="light" />
      <ScrollView
        ref={ref}
        style={{ flex: 1 }}
        scrollEnabled={scrollEnabled}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        onScroll={onScroll}
        scrollEventThrottle={64}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 0, paddingBottom: 0 }}
      >
        {/* Full-Bleed Panoramic Mountain Hero Stage */}
        <View style={[styles.hero, { paddingTop: insets.top + 10 }]}>
          <Photo src={SEASONS[season]} style={StyleSheet.absoluteFill} />
          {/* Dual scrim: top scrim for brand header, bottom deep pine scrim for editorial copy */}
          <Scrim top={0.42} bottom={0.94} />

          {/* Integrated Luxury Brand Header */}
          <BrandHeader variant="overPhoto" />

          {/* Ambient Mountain Vital Info & Season Switcher */}
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <View style={styles.livePulse} />
              <Text style={styles.heroBadgeText}>7,906 FT · PAF AIRBASE ROAD</Text>
            </View>

            <View style={styles.seasonSwitch}>
              <Pressable
                onPress={() => setSeason('summer')}
                hitSlop={6}
                style={[styles.seasonBtn, season === 'summer' && styles.seasonBtnOn]}
                accessibilityLabel="Summer season">
                <Text style={[styles.seasonBtnText, season === 'summer' && styles.seasonBtnTextOn]}>
                  ☀️ Summer 18°C
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSeason('winter')}
                hitSlop={6}
                style={[styles.seasonBtn, season === 'winter' && styles.seasonBtnOn]}
                accessibilityLabel="Winter season">
                <Text style={[styles.seasonBtnText, season === 'winter' && styles.seasonBtnTextOn]}>
                  ❄️ Winter -2°C
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={{ flex: 1 }} />

          {/* Bottom editorial content inside hero */}
          <View style={styles.heroBottom}>
            <View style={styles.heroKickerRow}>
              <Text style={styles.heroKicker}>✦ BESPOKE ALPINE RESIDENCES · NATHIA GALI</Text>
            </View>
            <Text style={styles.heroTitle}>
              Where clouds meet <Text style={styles.heroTitleItalic}>luxury</Text>
            </Text>
            <Text style={styles.heroSub}>
              Pakistan's premier 5-star mountain sanctuary with private ski slope & year-round heated rooftop glass pool.
            </Text>

            {/* Micro feature pills inside hero */}
            <View style={styles.heroFeaturesRow}>
              <View style={styles.heroFeaturePill}>
                <Ionicons name="eye-outline" size={12} color={C.gold} style={{ marginRight: 4 }} />
                <Text style={styles.heroFeatureText}>360° Valley Views</Text>
              </View>
              <View style={styles.heroFeaturePill}>
                <Ionicons name="snow-outline" size={12} color={C.gold} style={{ marginRight: 4 }} />
                <Text style={styles.heroFeatureText}>Private Ski Slope</Text>
              </View>
              <View style={styles.heroFeaturePill}>
                <Ionicons name="flame-outline" size={12} color={C.gold} style={{ marginRight: 4 }} />
                <Text style={styles.heroFeatureText}>Heated Living</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Elevated Overlapping Search Card */}
        <View style={styles.searchCardWrap}>
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

        {/* Interactive Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.chipsScroll}
        >
          {FILTER_PILLS.map((pill) => {
            const isActive = selectedFilter === pill.key;
            return (
              <Pressable
                key={pill.key}
                onPress={() => {
                  if (pill.key === 'pool') {
                    router.push('/amenities');
                  } else {
                    setSelectedFilter(pill.key);
                  }
                }}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <Ionicons
                  name={pill.icon}
                  size={14}
                  color={isActive ? C.gold : C.pine}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {pill.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* At a glance metric bar */}
        <View style={styles.glance}>
          {GLANCE.map((g, i) => (
            <View key={g.label} style={[styles.glanceItem, i > 0 && styles.glanceDiv]}>
              <View style={styles.glanceIconRow}>
                <Ionicons name={g.icon} size={12} color={C.gold} style={{ marginRight: 3 }} />
                <Text style={styles.glanceNum}>{g.value}</Text>
              </View>
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
          data={filteredRooms}
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
              category={item.category}
              image={item.image}
              tag={item.tag}
              onPress={() => router.push('/amenities')}
            />
          )}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={192}
          initialNumToRender={3}
          windowSize={3}
          contentContainerStyle={{ paddingHorizontal: S.gutter, gap: 12 }}
        />

        {/* Resort Architecture & Floor Plans Story Card */}
        <View style={styles.storyCard}>
          <View style={styles.storyHeader}>
            <View style={styles.storyBadge}>
              <Ionicons name="business-outline" size={13} color={C.gold} style={{ marginRight: 5 }} />
              <Text style={styles.storyBadgeText}>ARCHITECTURE & DESIGN</Text>
            </View>
            <View style={styles.storyPillMini}>
              <Text style={styles.storyPillMiniText}>G1 – 8TH FLOOR</Text>
            </View>
          </View>
          <Text style={styles.storyTitle}>Every residence with a mountain terrace</Text>
          <Text style={styles.storyBody}>
            Serene Heights combines the privacy of a fully furnished mountain home with the bespoke amenities of a 5-star resort. Underfloor heating, soundproofing, and panoramic pine valley views across G1 to 8th floors.
          </Text>

          <View style={styles.storyHighlights}>
            <View style={styles.storyHighItem}>
              <Ionicons name="checkmark-circle" size={14} color={C.gold} />
              <Text style={styles.storyHighText}>Italian designer finishings</Text>
            </View>
            <View style={styles.storyHighItem}>
              <Ionicons name="checkmark-circle" size={14} color={C.gold} />
              <Text style={styles.storyHighText}>Soundproof triple-glazed glass</Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/floor-plans')}
            style={({ pressed }) => [styles.storyBtn, pressed && { opacity: 0.9 }]}>
            <Text style={styles.storyBtnText}>Explore floor plans & layouts</Text>
            <Ionicons name="arrow-forward" size={14} color={C.pine} />
          </Pressable>
        </View>

        {/* Verified Guest Impressions */}
        {featuredReview && (
          <View style={styles.reviewSection}>
            <SectionHead
              title="Guest Impressions"
              sub={`${REVIEW_SCORE.average.toFixed(1)} / 5.0 · Exceptional · ${REVIEW_SCORE.count} verified reviews`}
            />
            <View style={styles.reviewCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', gap: 3 }}>
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Ionicons
                      key={k}
                      name={k < featuredReview.rating ? 'star' : 'star-outline'}
                      size={15}
                      color={C.gold}
                    />
                  ))}
                </View>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="shield-checkmark" size={12} color={C.positive} style={{ marginRight: 4 }} />
                  <Text style={styles.verifiedText}>Verified stay</Text>
                </View>
              </View>
              <Text style={styles.reviewTitle}>"{featuredReview.title}"</Text>
              <Text style={styles.reviewBody}>{featuredReview.body}</Text>
              <View style={styles.reviewFooter}>
                <View>
                  <Text style={styles.reviewAuthor}>
                    {featuredReview.author} · {featuredReview.country}
                  </Text>
                  <Text style={styles.reviewRoom}>{featuredReview.stayed}</Text>
                </View>
                <View style={styles.scorePill}>
                  <Text style={styles.scorePillText}>5.0</Text>
                </View>
              </View>
            </View>
          </View>
        )}

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
  const tag = t.outdoorSpace.toLowerCase().includes('terrace')
    ? 'Private terrace'
    : t.slug.includes('corner')
      ? 'Corner suite'
      : 'Valley views';

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
            color={fav ? '#E11D48' : C.pine}
          />
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 6, paddingTop: 12 }}>
        <Text numberOfLines={1} style={styles.resName}>{t.name}</Text>
        <Text style={styles.resMeta}>⭐ 4.9 (128 reviews) · 7,906 ft</Text>

        <View style={styles.specChipsRow}>
          <View style={styles.specMiniChip}>
            <Text style={styles.specMiniText}>📐 {areaRangeOf(t.slug)}</Text>
          </View>
          <View style={styles.specMiniChip}>
            <Text style={styles.specMiniText}>👤 {t.maxOccupancy} guests</Text>
          </View>
        </View>

        <View style={styles.resFoot}>
          <View>
            <Text style={styles.resFrom}>STARTING FROM</Text>
            <Text style={styles.resPrice}>
              {money(t.baseRate)} <Text style={styles.resNight}>/ night</Text>
            </Text>
          </View>
          <View style={styles.resCtaPill}>
            <Text style={styles.resCtaText}>View</Text>
            <Ionicons name="arrow-forward" size={12} color={C.cream} />
          </View>
        </View>
      </View>
    </PressableScale>
  );
});

const ExperienceCard = memo(function ExperienceCard({
  title,
  category,
  image,
  tag,
  onPress,
}: {
  title: string;
  category: string;
  image: string;
  tag: string;
  onPress?: () => void;
}) {
  return (
    <PressableScale onPress={onPress} scaleTo={0.97} style={styles.expCard}>
      <Photo src={image} style={StyleSheet.absoluteFill} />
      <Scrim bottom={0.82} />
      <View style={styles.expTag}>
        <Text style={styles.expTagText}>{category}</Text>
      </View>
      <View style={{ flex: 1 }} />
      <View style={styles.expMiniPill}>
        <Text style={styles.expMiniPillText}>{tag}</Text>
      </View>
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
  hero: {
    width: '100%',
    height: 485,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
    backgroundColor: C.pine,
    ...shadow.cardHover,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.gutter,
    marginTop: 14,
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
    marginRight: 6,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5.5,
    borderRadius: 999,
    backgroundColor: 'rgba(18, 53, 36, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
  },
  heroBadgeText: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 1.2,
    color: '#FFFFFF',
  },
  seasonSwitch: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(18, 53, 36, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  seasonBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  seasonBtnOn: {
    backgroundColor: C.gold,
  },
  seasonBtnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.88)',
  },
  seasonBtnTextOn: {
    color: C.pine,
  },
  heroBottom: {
    paddingHorizontal: 20,
    paddingBottom: 58,
  },
  heroKickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroKicker: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 1.8,
    color: C.gold,
  },
  heroTitle: {
    fontFamily: FONTS.display,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.3,
    color: '#FFFFFF',
    marginTop: 5,
  },
  heroTitleItalic: {
    fontFamily: FONTS.displayItalic,
    color: '#FBF8F1',
  },
  heroSub: {
    fontFamily: FONTS.ui,
    fontSize: 12.5,
    lineHeight: 18,
    color: 'rgba(236, 238, 237, 0.92)',
    marginTop: 6,
  },
  heroFeaturesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  heroFeaturePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.32)',
  },
  heroFeatureText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 10,
    color: '#ECEEED',
  },
  searchCardWrap: {
    paddingHorizontal: S.gutter,
    marginTop: -38,
    zIndex: 10,
  },
  chipsScroll: {
    paddingHorizontal: S.gutter,
    gap: 8,
    marginTop: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 999,
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: C.line,
    ...shadow.pill,
  },
  chipActive: {
    backgroundColor: C.pine,
    borderColor: C.pine,
  },
  chipText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 12.5,
    color: C.ink,
  },
  chipTextActive: {
    color: C.cream,
  },
  glance: {
    flexDirection: 'row',
    marginHorizontal: S.gutter,
    marginTop: 18,
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
  glanceIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 8.5,
    letterSpacing: 1.4,
    marginTop: 3,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: S.gutter,
    marginTop: 34,
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
    borderRadius: 24,
    padding: 10,
    borderWidth: 1,
    borderColor: C.line,
    ...shadow.card,
  },
  resImgWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 11,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: C.snow,
  },
  resImg: {
    width: '100%',
    height: '100%',
  },
  resTag: {
    position: 'absolute',
    top: 9,
    left: 9,
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
  resTagText: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    color: C.pine,
  },
  resHeart: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.pill,
  },
  resName: {
    fontFamily: FONTS.uiBold,
    fontSize: 16,
    color: C.ink,
  },
  resMeta: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    color: C.ink55,
    marginTop: 3,
  },
  specChipsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 7,
  },
  specMiniChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
    backgroundColor: C.snow,
  },
  specMiniText: {
    fontFamily: FONTS.uiMedium,
    fontSize: 10.5,
    color: C.ink70,
  },
  resFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
  },
  resFrom: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    letterSpacing: 1.2,
    color: C.gold,
  },
  resPrice: {
    fontFamily: FONTS.uiBold,
    fontSize: 16,
    color: C.ink,
    fontVariant: ['tabular-nums'],
    marginTop: 1,
  },
  resNight: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    color: C.ink55,
  },
  resCtaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: C.pine,
    ...shadow.pill,
  },
  resCtaText: {
    fontFamily: FONTS.uiBold,
    fontSize: 11.5,
    color: C.cream,
  },
  expCard: {
    width: 180,
    height: 230,
    borderRadius: 22,
    overflow: 'hidden',
    padding: 14,
    backgroundColor: C.pine,
    borderWidth: 1,
    borderColor: C.line,
    ...shadow.card,
  },
  expTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  expTagText: {
    fontFamily: FONTS.uiBold,
    fontSize: 8,
    letterSpacing: 1.1,
    color: C.gold,
  },
  expMiniPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 5,
  },
  expMiniPillText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 9.5,
    color: '#FFFFFF',
  },
  expTitle: {
    fontFamily: FONTS.uiBold,
    fontSize: 14.5,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  storyCard: {
    marginHorizontal: S.gutter,
    marginTop: 32,
    padding: 22,
    borderRadius: 24,
    backgroundColor: C.pine,
    borderWidth: 1,
    borderColor: C.goldLine,
    ...shadow.cardHover,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 999,
    backgroundColor: 'rgba(200, 164, 106, 0.16)',
  },
  storyBadgeText: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 1.2,
    color: C.gold,
  },
  storyPillMini: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  storyPillMiniText: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    letterSpacing: 1,
    color: C.cream70,
  },
  storyTitle: {
    fontFamily: FONTS.display,
    fontSize: 24,
    lineHeight: 28,
    color: C.cream,
    marginTop: 12,
  },
  storyBody: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    lineHeight: 19,
    color: C.cream70,
    marginTop: 6,
  },
  storyHighlights: {
    gap: 6,
    marginTop: 12,
  },
  storyHighItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storyHighText: {
    fontFamily: FONTS.uiMedium,
    fontSize: 12,
    color: C.cream,
  },
  storyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: C.gold,
  },
  storyBtnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 12.5,
    color: C.pine,
  },
  reviewSection: {
    marginTop: 6,
  },
  reviewCard: {
    marginHorizontal: S.gutter,
    padding: 18,
    backgroundColor: C.pureWhite,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.line,
    ...shadow.card,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(29, 115, 72, 0.08)',
  },
  verifiedText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 10.5,
    color: C.positive,
  },
  reviewTitle: {
    fontFamily: FONTS.display,
    fontSize: 20,
    lineHeight: 24,
    color: C.pine,
    marginTop: 10,
  },
  reviewBody: {
    fontFamily: FONTS.ui,
    fontSize: 13.5,
    lineHeight: 20,
    color: C.ink70,
    marginTop: 6,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
  },
  reviewAuthor: {
    fontFamily: FONTS.uiBold,
    fontSize: 12,
    color: C.pine,
  },
  reviewRoom: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    color: C.ink55,
  },
  scorePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: C.pine,
  },
  scorePillText: {
    fontFamily: FONTS.uiBold,
    fontSize: 11,
    color: C.gold,
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
