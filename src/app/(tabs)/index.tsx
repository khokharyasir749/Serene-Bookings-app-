import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
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
import { areaRangeOf, PROPERTY, REASONS, REVIEWS, REVIEW_SCORE, ROOM_TYPES, type RoomType } from '@/data/catalog';
import { money } from '@/lib/stay';
import { useBooking } from '@/state/booking';
import { C, FONTS, S, shadow, tabBarSpace } from '@/theme';

const SEASONS = {
  summer: '/images/resort/hero-tower-mist.jpg',
  winter: '/images/resort/aerial-snow-resort.jpg',
} as const;

const GLANCE = [
  { value: '7,906 ft', label: 'Altitude', icon: 'trail-sign-outline' as const },
  { value: '50+', label: 'Facilities', icon: 'business-outline' as const },
  { value: '24/7', label: 'Concierge', icon: 'key-outline' as const },
  { value: '2 hrs', label: 'Islamabad', icon: 'car-outline' as const },
];

const EXPERIENCES = [
  {
    title: 'Heated Glass Pool',
    category: 'WELLNESS · 8TH FLOOR',
    image: '/images/resort/aerial-rooftop-pool.jpg',
    desc: 'Indoor heated infinity pool with 360° cloud & pine valley views.',
  },
  {
    title: 'Panoramic Dining',
    category: 'FINE DINING · ROOFTOP',
    image: '/images/dining/rooftop-dining-glass.jpg',
    desc: 'Cloud-level dining featuring Pakistani heritage & global cuisine.',
  },
  {
    title: 'Private Ski Slope',
    category: 'WINTER SPORTS · SLOPE G2',
    image: '/images/activities/ski-slope-aerial.jpg',
    desc: "Pakistan's first private ski slope and snow tubing track.",
  },
  {
    title: 'Sunset Sky Lounge',
    category: 'LOUNGE & HIGH TEA',
    image: '/images/dining/sky-lounge.jpg',
    desc: 'Artisanal high tea and evening mocktails facing sunset vistas.',
  },
  {
    title: 'Pine Forest Trails',
    category: 'OUTDOOR EXPLORATION',
    image: '/images/activities/winter-trails.jpg',
    desc: 'Private gated trailhead leading directly into the historic forest.',
  },
  {
    title: 'Cedarwood Sauna & Spa',
    category: 'SPA & HYDROTHERAPY',
    image: '/images/resort/glass-roof-pool.jpg',
    desc: 'Alpine steam room, cedarwood sauna, and cold plunge recovery.',
  },
];

export default function Discover() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { stay, setStay } = useBooking();
  const { ref, onScroll } = useScrollTop();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const resW = Math.min(320, Math.round(width * 0.82));

  useFocusEffect(
    useCallback(() => {
      setScrollEnabled(true);
    }, [])
  );

  const openStay = (tab: 'dates' | 'guests') => router.push({ pathname: '/stay', params: { tab, next: 'apartments' } });

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
          <Photo src={SEASONS.summer} style={StyleSheet.absoluteFill} />
          {/* Dual scrim: top scrim for brand header, bottom deep pine scrim for editorial copy */}
          <Scrim top={0.35} bottom={0.92} />

          {/* Integrated Luxury Brand Header */}
          <BrandHeader variant="overPhoto" />

          <View style={{ flex: 1 }} />

          {/* Clean Editorial Content Inside Hero */}
          <View style={styles.heroBottom}>
            <Text style={styles.heroKicker}>BESPOKE ALPINE RESIDENCES · NATHIA GALI</Text>
            <Text style={styles.heroTitle}>
              Where clouds meet <Text style={styles.heroTitleItalic}>luxury</Text>
            </Text>
            <Text style={styles.heroSub}>
              Pakistan's premier 5-star mountain sanctuary beside PAF Airbase Nathia Gali.
            </Text>
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

        {/* At a glance metric bar */}
        <View style={styles.glance}>
          {GLANCE.map((g, i) => (
            <View key={g.label} style={[styles.glanceItem, i > 0 && styles.glanceDiv]}>
              <View style={styles.glanceIconRow}>
                <Ionicons name={g.icon} size={13} color={C.gold} style={{ marginRight: 4 }} />
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
              category={item.category}
              image={item.image}
              desc={item.desc}
              onPress={() => router.push('/amenities')}
            />
          )}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={242}
          initialNumToRender={3}
          windowSize={3}
          contentContainerStyle={{ paddingHorizontal: S.gutter, gap: 14 }}
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
    ? 'Private Terrace'
    : t.slug.includes('corner')
      ? 'Corner Suite'
      : 'Valley Views';

  return (
    <PressableScale onPress={onPress} scaleTo={0.975} style={[styles.resCard, { width: w }]}>
      {/* Full top edge-to-edge photo */}
      <View style={styles.resImgWrap}>
        <Photo src={t.images[0]} style={styles.resImg} />
        <Scrim top={0.25} bottom={0.4} />

        {/* Top-left frosted tag */}
        <View style={styles.resTag}>
          <Text style={styles.resTagText}>{tag.toUpperCase()}</Text>
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

      {/* Card Content Area with Generous Padding */}
      <View style={styles.resBody}>
        <Text numberOfLines={2} style={styles.resName}>{t.name}</Text>
        <Text numberOfLines={1} style={styles.resTagline}>{t.tagline}</Text>

        {/* Structured Spec Capsule */}
        <View style={styles.specCapsule}>
          <View style={styles.specItem}>
            <Ionicons name="expand-outline" size={13} color={C.gold} style={{ marginRight: 5 }} />
            <Text style={styles.specText}>{areaRangeOf(t.slug)}</Text>
          </View>
          <View style={styles.specDot} />
          <View style={styles.specItem}>
            <Ionicons name="people-outline" size={13} color={C.gold} style={{ marginRight: 5 }} />
            <Text style={styles.specText}>Up to {t.maxOccupancy} guests</Text>
          </View>
        </View>

        {/* Price & Action Row */}
        <View style={styles.resFoot}>
          <View>
            <Text style={styles.resFrom}>STARTING FROM</Text>
            <View style={styles.priceRow}>
              <Text style={styles.resPrice}>{money(t.baseRate)}</Text>
              <Text style={styles.resNight}> / night</Text>
            </View>
          </View>
          <View style={styles.resCta}>
            <Text style={styles.resCtaText}>View Suite</Text>
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
  desc,
  onPress,
}: {
  title: string;
  category: string;
  image: string;
  desc: string;
  onPress?: () => void;
}) {
  return (
    <PressableScale onPress={onPress} scaleTo={0.975} style={styles.expCard}>
      <Photo src={image} style={StyleSheet.absoluteFill} />
      <Scrim top={0.25} bottom={0.92} />

      {/* Top category badge */}
      <View style={styles.expTag}>
        <Text style={styles.expTagText}>{category}</Text>
      </View>

      <View style={{ flex: 1 }} />

      {/* Bottom editorial content */}
      <View style={styles.expInfo}>
        <Text numberOfLines={1} style={styles.expTitle}>{title}</Text>
        <Text numberOfLines={2} style={styles.expDesc}>{desc}</Text>

        <View style={styles.expActionRow}>
          <Text style={styles.expActionText}>Explore facility</Text>
          <Ionicons name="arrow-forward" size={12} color={C.gold} />
        </View>
      </View>
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
    height: 420,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
    backgroundColor: C.pine,
    ...shadow.cardHover,
  },
  heroBottom: {
    paddingHorizontal: S.gutter,
    paddingBottom: 48,
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
    marginTop: 6,
  },
  heroTitleItalic: {
    fontFamily: FONTS.displayItalic,
    color: '#FBF8F1',
  },
  heroSub: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(236, 238, 237, 0.92)',
    marginTop: 6,
  },
  searchCardWrap: {
    paddingHorizontal: S.gutter,
    marginTop: -32,
    zIndex: 10,
  },
  glance: {
    flexDirection: 'row',
    marginHorizontal: S.gutter,
    marginTop: 20,
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
    fontSize: 26,
    lineHeight: 30,
    color: C.ink,
  },
  sectionSub: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: C.ink55,
    marginTop: 4,
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
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.25)',
    ...shadow.cardHover,
  },
  resImgWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 10.5,
    backgroundColor: C.snow,
  },
  resImg: {
    width: '100%',
    height: '100%',
  },
  resTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  resTagText: {
    fontFamily: FONTS.uiBold,
    fontSize: 9,
    letterSpacing: 0.8,
    color: C.pine,
  },
  resHeart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.pill,
  },
  resBody: {
    padding: 16,
    paddingTop: 14,
  },
  resName: {
    fontFamily: FONTS.display,
    fontSize: 22,
    lineHeight: 26,
    color: C.pine,
  },
  resTagline: {
    fontFamily: FONTS.ui,
    fontSize: 12.5,
    color: C.ink55,
    marginTop: 3,
  },
  specCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(236, 230, 218, 0.45)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 10,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 11,
    color: C.ink70,
  },
  specDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: C.lineStrong,
    marginHorizontal: 10,
  },
  resFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
  },
  resFrom: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    letterSpacing: 1.2,
    color: C.gold,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 1,
  },
  resPrice: {
    fontFamily: FONTS.uiBold,
    fontSize: 18,
    color: C.ink,
    fontVariant: ['tabular-nums'],
  },
  resNight: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    color: C.ink55,
  },
  resCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 7.5,
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
    width: 228,
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 16,
    backgroundColor: C.pine,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.25)',
    ...shadow.cardHover,
  },
  expTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(18, 53, 36, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  expTagText: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    letterSpacing: 1.3,
    color: C.gold,
  },
  expInfo: {
    paddingTop: 8,
  },
  expTitle: {
    fontFamily: FONTS.display,
    fontSize: 22,
    lineHeight: 26,
    color: '#FFFFFF',
  },
  expDesc: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(236, 238, 237, 0.92)',
    marginTop: 5,
  },
  expActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  expActionText: {
    fontFamily: FONTS.uiBold,
    fontSize: 11.5,
    color: C.gold,
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
