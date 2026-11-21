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

const EDITORIAL_PILLARS = [
  {
    badge: '7,906 ft Elevation',
    icon: 'trail-sign-outline' as const,
    kicker: '01 · REAL MOUNTAIN AIR',
    title: '7,906 ft above the noise',
    text: 'Crisp pine forest air, cool summers, snowy winters, and unbroken valley views from every terrace.',
    image: '/images/interiors/window-view.jpg',
    chips: ['Pine Valley Canopy', '2 Hrs from ISB'],
  },
  {
    badge: 'All-Year Resort',
    icon: 'snow-outline' as const,
    kicker: '02 · MADE FOR EVERY SEASON',
    title: "Pakistan's first winter resort",
    text: 'Heated glass infinity pool, cedarwood sauna, private snow ski slope, and cloud-level rooftop dining.',
    image: '/images/resort/glass-roof-pool.jpg',
    chips: ['Heated Pool', 'Ski Slope'],
  },
  {
    badge: 'Serviced Living',
    icon: 'key-outline' as const,
    kicker: '03 · FULLY MANAGED LIVING',
    title: 'A home with a hotel behind it',
    text: 'Daily housekeeping, 24/7 concierge, in-room dining, and underfloor radiant heating throughout.',
    image: '/images/interiors/living-room-wide.jpg',
    chips: ['24/7 Concierge', 'Heated Floors'],
  },
];

export default function Discover() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { stay, setStay } = useBooking();
  const { ref, onScroll } = useScrollTop();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [darkStatus, setDarkStatus] = useState(false);
  const resW = Math.min(312, Math.round(width * 0.78));
  const reviewW = Math.min(315, Math.round(width * 0.80));

  useFocusEffect(
    useCallback(() => {
      setScrollEnabled(true);
    }, [])
  );

  const handleScroll = useCallback(
    (e: any) => {
      onScroll(e);
      const y = e.nativeEvent?.contentOffset?.y ?? 0;
      if (y > 140 && !darkStatus) setDarkStatus(true);
      else if (y <= 140 && darkStatus) setDarkStatus(false);
    },
    [onScroll, darkStatus]
  );

  const openStay = (tab: 'dates' | 'guests') => router.push({ pathname: '/stay', params: { tab, next: 'apartments' } });

  const featuredReview = REVIEWS[0];

  return (
    <View style={{ flex: 1, backgroundColor: C.sand }}>
      <StatusBar style={darkStatus ? 'dark' : 'light'} />
      <ScrollView
        ref={ref}
        style={{ flex: 1 }}
        scrollEnabled={scrollEnabled}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={64}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 0, paddingBottom: 150 }}
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
          snapToInterval={240 + 14}
          initialNumToRender={3}
          windowSize={3}
          contentContainerStyle={{ paddingHorizontal: S.gutter, gap: 14 }}
        />

        {/* Resort Architecture & Floor Plans Feature Card */}
        <View style={styles.storyCard}>
          {/* Architectural Background Photography: Portrait Facade at Night */}
          <Photo src="/images/resort/night-facade-portrait.jpg" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={[
              'rgba(0, 0, 0, 0.35)',
              'transparent',
              'rgba(0, 0, 0, 0.45)',
            ]}
            locations={[0, 0.35, 1]}
            style={StyleSheet.absoluteFill}
          />

          {/* Top badges in crystal glass */}
          <View style={styles.storyHeader}>
            <View style={styles.storyBadge}>
              <Ionicons name="business-outline" size={12} color={C.gold} style={{ marginRight: 6 }} />
              <Text style={styles.storyBadgeText}>ARCHITECTURE & DESIGN</Text>
            </View>
            <View style={styles.storyPillMini}>
              <Text style={styles.storyPillMiniText}>G1 – 8TH FLOOR</Text>
            </View>
          </View>

          <View style={{ flex: 1 }} />

          {/* Bottom Crystal Clear Glass Dock with Limited Text */}
          <View style={styles.archGlassDock}>
            <BlurView
              intensity={70}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.14)', 'rgba(10, 16, 12, 0.55)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.crystalHighlight} />

            <Text style={styles.storyTitle}>Residences & Alpine Terraces</Text>
            <Text style={styles.storySubtitle}>5 luxury layouts · Italian finishes · Underfloor heating</Text>

            {/* Luxury CTA Button */}
            <PressableScale
              onPress={() => router.push('/floor-plans')}
              scaleTo={0.975}
              style={styles.storyBtn}
            >
              <LinearGradient
                colors={['#D8B882', '#BE9559']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.storyBtnText}>Explore Floor Plans & Layouts</Text>
              <View style={styles.storyBtnArrow}>
                <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
              </View>
            </PressableScale>
          </View>
        </View>

        {/* Verified Guest Impressions Section */}
        <View style={styles.reviewSection}>
          <View style={styles.reviewsHeaderRow}>
            <View>
              <Text style={styles.reviewsEyebrow}>GUEST IMPRESSIONS</Text>
              <Text style={styles.reviewsTitle}>Moments at Serene Heights</Text>
            </View>
            <View style={styles.ratingSummaryPill}>
              <Ionicons name="star" size={11} color={C.gold} style={{ marginRight: 4 }} />
              <Text style={styles.ratingSummaryText}>{`${REVIEW_SCORE.average.toFixed(1)} · ${REVIEW_SCORE.count} verified stays`}</Text>
            </View>
          </View>

          <FlatList
            horizontal
            nestedScrollEnabled
            data={REVIEWS}
            keyExtractor={(r) => r.id}
            renderItem={({ item }) => (
              <View style={[styles.reviewCard, { width: reviewW }]}>
                {/* Subtle Editorial Pull-Quote Watermark */}
                <Text style={styles.quoteWatermark}>“</Text>

                {/* Header: Stars + Tiny Elegant Verified Badge */}
                <View style={styles.reviewCardTop}>
                  <View style={styles.starsRow}>
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Ionicons
                        key={k}
                        name={k < item.rating ? 'star' : 'star-outline'}
                        size={12.5}
                        color={C.gold}
                      />
                    ))}
                  </View>
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="shield-checkmark" size={10.5} color={C.positive} style={{ marginRight: 3.5 }} />
                    <Text style={styles.verifiedText}>Verified stay</Text>
                  </View>
                </View>

                {/* Review Headline & Body with Tight 3-Line Un-truncated Copy */}
                <View style={styles.reviewContent}>
                  <Text style={styles.reviewTitle}>"{item.title}"</Text>
                  <Text numberOfLines={3} style={styles.reviewBody}>{item.body}</Text>
                </View>

                {/* Author Monogram + Info + Rating Score Badge Vertically Centered */}
                <View style={styles.reviewFooter}>
                  <View style={styles.reviewAuthorBlock}>
                    <View style={styles.authorAvatar}>
                      <Text style={styles.authorAvatarText}>
                        {item.author.split(' ').map((n) => n[0]).join('')}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text numberOfLines={1} style={styles.reviewAuthor}>
                        {item.author} · {item.country}
                      </Text>
                      <Text numberOfLines={1} style={styles.reviewRoom}>{item.roomType}</Text>
                    </View>
                  </View>
                  <View style={styles.scorePill}>
                    <Ionicons name="star" size={10} color={C.gold} style={{ marginRight: 3.5 }} />
                    <Text style={styles.scorePillText}>
                      {item.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={reviewW + 14}
            initialNumToRender={2}
            windowSize={3}
            contentContainerStyle={{ paddingHorizontal: S.gutter, gap: 14 }}
          />
        </View>

        {/* Why Serene Heights — Curated Vertical Editorial Showcase */}
        <SectionHead
          title="Why Serene Heights"
          sub="Crafted for year-round alpine luxury"
        />

        <View style={styles.editorialShowcase}>
          {/* Flagship 16:10 Hero Feature Card on Top (Pillar 1) */}
          <PressableScale
            onPress={() => router.push('/amenities')}
            scaleTo={0.985}
            style={styles.heroFeatureCard}
          >
            <View style={styles.heroFeaturePhotoWrap}>
              <Photo src={EDITORIAL_PILLARS[0].image} style={StyleSheet.absoluteFill} />
              <LinearGradient
                colors={['rgba(0, 0, 0, 0.25)', 'transparent', 'rgba(12, 26, 19, 0.45)']}
                locations={[0, 0.35, 1]}
                style={StyleSheet.absoluteFill}
              />
              {/* Subtle top-left frosted glass pill */}
              <View style={styles.featureBadge}>
                <BlurView intensity={65} tint="light" style={StyleSheet.absoluteFill} />
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.45)', 'rgba(255, 255, 255, 0.2)']}
                  style={StyleSheet.absoluteFill}
                />
                <Ionicons name={EDITORIAL_PILLARS[0].icon} size={11} color={C.pine} style={{ marginRight: 4.5 }} />
                <Text style={styles.featureBadgeText}>{EDITORIAL_PILLARS[0].badge}</Text>
              </View>
            </View>

            {/* Crisp Ivory Card Surface Below Photo */}
            <View style={styles.heroFeatureBody}>
              <Text style={styles.featureKicker}>{EDITORIAL_PILLARS[0].kicker}</Text>
              <Text style={styles.heroFeatureTitle}>{EDITORIAL_PILLARS[0].title}</Text>
              <Text style={styles.featureDesc}>{EDITORIAL_PILLARS[0].text}</Text>

              <View style={styles.featureChipsRow}>
                {EDITORIAL_PILLARS[0].chips.map((c) => (
                  <View key={c} style={styles.featureChip}>
                    <Ionicons name="sparkles" size={9.5} color={C.gold} style={{ marginRight: 4 }} />
                    <Text style={styles.featureChipText}>{c}</Text>
                  </View>
                ))}
              </View>
            </View>
          </PressableScale>

          {/* Secondary Editorial Cards (Pillars 2 & 3) in Stacked Layout */}
          {EDITORIAL_PILLARS.slice(1).map((p) => (
            <PressableScale
              key={p.kicker}
              onPress={() => router.push('/amenities')}
              scaleTo={0.985}
              style={styles.subFeatureCard}
            >
              <View style={styles.subFeaturePhotoWrap}>
                <Photo src={p.image} style={StyleSheet.absoluteFill} />
                <LinearGradient
                  colors={['rgba(0, 0, 0, 0.22)', 'transparent', 'rgba(12, 26, 19, 0.4)']}
                  locations={[0, 0.35, 1]}
                  style={StyleSheet.absoluteFill}
                />
                {/* Subtle top-left frosted glass pill */}
                <View style={styles.featureBadge}>
                  <BlurView intensity={65} tint="light" style={StyleSheet.absoluteFill} />
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.45)', 'rgba(255, 255, 255, 0.2)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <Ionicons name={p.icon} size={11} color={C.pine} style={{ marginRight: 4.5 }} />
                  <Text style={styles.featureBadgeText}>{p.badge}</Text>
                </View>
              </View>

              {/* Crisp Ivory Card Surface Below Photo */}
              <View style={styles.subFeatureBody}>
                <Text style={styles.featureKicker}>{p.kicker}</Text>
                <Text style={styles.subFeatureTitle}>{p.title}</Text>
                <Text style={styles.featureDesc}>{p.text}</Text>

                <View style={styles.featureChipsRow}>
                  {p.chips.map((c) => (
                    <View key={c} style={styles.featureChip}>
                      <Ionicons name="sparkles" size={9.5} color={C.gold} style={{ marginRight: 4 }} />
                      <Text style={styles.featureChipText}>{c}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </PressableScale>
          ))}
        </View>

        {/* Footer: concierge + contact */}
        <LuxuryFooter bottomSpace={tabBarSpace(insets.bottom) + 32} />
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
    width: 240,
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
    fontSize: 15.5,
    lineHeight: 19,
    color: C.pine,
    marginRight: 6,
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
    height: 410,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: 'rgba(200, 164, 106, 0.4)',
    padding: 14,
    backgroundColor: '#121416',
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
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(200, 164, 106, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.4)',
  },
  storyBadgeText: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 1.3,
    color: C.gold,
  },
  storyPillMini: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  storyPillMiniText: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    letterSpacing: 1.1,
    color: C.cream,
  },
  archGlassDock: {
    position: 'relative',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  storyTitle: {
    fontFamily: FONTS.display,
    fontSize: 22,
    lineHeight: 26,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  storySubtitle: {
    fontFamily: FONTS.ui,
    fontSize: 12.5,
    lineHeight: 17,
    color: 'rgba(255, 253, 249, 0.8)',
    marginTop: 4,
  },
  storyBtn: {
    position: 'relative',
    marginTop: 14,
    borderRadius: 999,
    overflow: 'hidden',
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E6CFAB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  storyBtnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 12.5,
    letterSpacing: 0.3,
    color: C.pine,
  },
  storyBtnArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(18, 53, 36, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewSection: {
    marginTop: 6,
  },
  reviewCard: {
    padding: 20,
    backgroundColor: C.pureWhite,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.28)',
    minHeight: 216,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  quoteWatermark: {
    position: 'absolute',
    top: 32,
    right: 18,
    fontFamily: FONTS.display,
    fontSize: 68,
    lineHeight: 68,
    color: 'rgba(200, 164, 106, 0.08)',
  },
  reviewCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7.5,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(29, 115, 72, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(29, 115, 72, 0.16)',
  },
  verifiedText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 9.5,
    letterSpacing: 0.2,
    color: C.positive,
  },
  reviewContent: {
    marginVertical: 10,
  },
  reviewTitle: {
    fontFamily: FONTS.displayItalic,
    fontSize: 17.5,
    lineHeight: 22,
    color: C.pine,
    letterSpacing: -0.1,
  },
  reviewBody: {
    fontFamily: FONTS.ui,
    fontSize: 12.5,
    lineHeight: 18.5,
    color: C.ink70,
    marginTop: 6,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
  },
  reviewAuthorBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  authorAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(200, 164, 106, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorAvatarText: {
    fontFamily: FONTS.uiBold,
    fontSize: 11,
    color: C.pine,
  },
  reviewAuthor: {
    fontFamily: FONTS.uiSemi,
    fontSize: 12,
    lineHeight: 16,
    color: C.pine,
  },
  reviewRoom: {
    fontFamily: FONTS.ui,
    fontSize: 10.5,
    lineHeight: 14,
    color: C.ink55,
    marginTop: 1.5,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8.5,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: C.pine,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.3)',
  },
  scorePillText: {
    fontFamily: FONTS.uiBold,
    fontSize: 11,
    color: C.gold,
    fontVariant: ['tabular-nums'],
  },
  reviewsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: S.gutter,
    marginTop: 34,
    marginBottom: 16,
  },
  reviewsEyebrow: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 1.6,
    color: C.gold,
  },
  reviewsTitle: {
    fontFamily: FONTS.display,
    fontSize: 24,
    lineHeight: 28,
    color: C.pine,
    marginTop: 3,
  },
  ratingSummaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 5.5,
    borderRadius: 999,
    backgroundColor: C.pine,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.35)',
    ...shadow.pill,
  },
  ratingSummaryText: {
    fontFamily: FONTS.uiBold,
    fontSize: 10.5,
    letterSpacing: 0.5,
    color: C.cream,
  },
  editorialShowcase: {
    paddingHorizontal: S.gutter,
    gap: 16,
    marginBottom: 8,
  },
  heroFeatureCard: {
    borderRadius: 24,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.25)',
    overflow: 'hidden',
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },
  heroFeaturePhotoWrap: {
    width: '100%',
    height: 205,
    backgroundColor: C.pine,
    position: 'relative',
  },
  featureBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9.5,
    paddingVertical: 4.5,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)',
  },
  featureBadgeText: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 0.8,
    color: C.pine,
  },
  heroFeatureBody: {
    padding: 18,
  },
  featureKicker: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 1.5,
    color: C.gold,
  },
  heroFeatureTitle: {
    fontFamily: FONTS.display,
    fontSize: 23,
    lineHeight: 27,
    letterSpacing: -0.2,
    color: C.pine,
    marginTop: 4,
  },
  subFeatureTitle: {
    fontFamily: FONTS.display,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.1,
    color: C.pine,
    marginTop: 4,
  },
  featureDesc: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    lineHeight: 19.5,
    color: C.ink70,
    marginTop: 6,
  },
  featureChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8.5,
    paddingVertical: 4,
    borderRadius: 7,
    backgroundColor: 'rgba(200, 164, 106, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.22)',
  },
  featureChipText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 10.5,
    color: C.pine,
  },
  subFeatureCard: {
    borderRadius: 24,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.22)',
    overflow: 'hidden',
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  subFeaturePhotoWrap: {
    width: '100%',
    height: 155,
    backgroundColor: C.pine,
    position: 'relative',
  },
  subFeatureBody: {
    padding: 18,
  },
});
