import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
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
    image: '/images/resort/aerial-rooftop-pool.jpg',
  },
  {
    title: 'Panoramic Dining',
    image: '/images/dining/rooftop-dining-glass.jpg',
  },
  {
    title: 'Private Ski Slope',
    image: '/images/activities/ski-slope-aerial.jpg',
  },
  {
    title: 'Sunset Sky Lounge',
    image: '/images/dining/sky-lounge.jpg',
  },
  {
    title: 'Pine Forest Trails',
    image: '/images/activities/winter-trails.jpg',
  },
  {
    title: 'Cedarwood Sauna & Spa',
    image: '/images/resort/glass-roof-pool.jpg',
  },
];

export default function Discover() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { stay, setStay } = useBooking();
  const { ref, onScroll } = useScrollTop();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const resW = Math.min(312, Math.round(width * 0.78));

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
              image={item.image}
              onPress={() => router.push('/amenities')}
            />
          )}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={236 + 14}
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
  return (
    <PressableScale onPress={onPress} scaleTo={0.975} style={[styles.resCard, { width: w }]}>
      {/* Full-bleed portrait photography */}
      <Photo src={t.images[0]} style={StyleSheet.absoluteFill} />
      <Scrim bottom={0.22} />

      <View style={{ flex: 1 }} />

      {/* Crystal clear glass pill */}
      <View style={styles.glassDock}>
        <View style={styles.crystalPill}>
          <BlurView
            intensity={60}
            tint="light"
            blurMethod="dimezisBlurView"
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.42)', 'rgba(255, 255, 255, 0.18)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.crystalHighlight} />
          <Text numberOfLines={1} style={styles.crystalTitle}>{t.name}</Text>
          <View style={styles.crystalArrow}>
            <Ionicons name="arrow-forward" size={13} color={C.pine} />
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
    <PressableScale onPress={onPress} scaleTo={0.975} style={styles.expCard}>
      {/* Full-bleed experience photography */}
      <Photo src={image} style={StyleSheet.absoluteFill} />
      <Scrim bottom={0.22} />

      <View style={{ flex: 1 }} />

      {/* Crystal clear glass pill */}
      <View style={styles.glassDock}>
        <View style={styles.crystalPill}>
          <BlurView
            intensity={60}
            tint="light"
            blurMethod="dimezisBlurView"
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.42)', 'rgba(255, 255, 255, 0.18)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.crystalHighlight} />
          <Text numberOfLines={1} style={styles.crystalTitle}>{title}</Text>
          <View style={styles.crystalArrow}>
            <Ionicons name="arrow-forward" size={13} color={C.pine} />
          </View>
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
    height: 360,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: C.pine,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.35)',
    ...shadow.cardHover,
  },
  expCard: {
    width: 236,
    height: 300,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: C.pine,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.3)',
    ...shadow.cardHover,
  },
  glassDock: {
    padding: 12,
  },
  crystalPill: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 5,
  },
  crystalHighlight: {
    position: 'absolute',
    top: 0,
    left: 18,
    right: 18,
    height: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 1,
  },
  crystalTitle: {
    flex: 1,
    fontFamily: FONTS.display,
    fontSize: 16.5,
    lineHeight: 20,
    color: C.pine,
    marginRight: 8,
  },
  crystalArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
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
