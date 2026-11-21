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
    badge: '7,906 FT ELEVATION',
    icon: 'trail-sign-outline' as const,
    kicker: 'REAL MOUNTAIN AIR · GALIYAT',
    title: '7,906 ft above the noise, two hours from Islamabad',
    text: 'Set in the pine forests of the Galiyat beside PAF Airbase Nathia Gali, with cool summers, snowy winters and panoramic valley views from every private balcony.',
    image: '/images/interiors/window-view.jpg',
    chips: ['Pine Valley Canopy', '2 Hrs from Islamabad', 'Crisp Alpine Breeze'],
  },
  {
    badge: 'ALL-YEAR RESORT',
    icon: 'snow-outline' as const,
    kicker: 'MADE FOR EVERY SEASON',
    title: "Pakistan's first winter resort, open all year round",
    text: 'An indoor temperature-controlled infinity pool under glass, cedarwood sauna and spa, snow ski slope, mini golf, archery, and panoramic rooftop dining—all a short walk from your suite.',
    image: '/images/resort/glass-roof-pool.jpg',
    chips: ['Heated Glass Pool', 'Private Ski Slope', 'Panoramic Dining'],
  },
  {
    badge: 'SERVICED LIVING',
    icon: 'key-outline' as const,
    kicker: 'FULLY MANAGED RESIDENCES',
    title: 'A furnished mountain home, with a luxury hotel behind it',
    text: 'Daily housekeeping, 24/7 front desk and concierge, in-residence room service, and underfloor radiant heating throughout. Arrive, unpack, and settle into effortless alpine comfort.',
    image: '/images/interiors/living-room-wide.jpg',
    chips: ['24/7 Concierge', 'Underfloor Heating', 'Daily Housekeeping'],
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
  const reviewW = Math.min(320, Math.round(width * 0.82));

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

        {/* Verified Guest Impressions Carousel */}
        <View style={styles.reviewSection}>
          <SectionHead
            title="Guest Impressions"
            sub={`${REVIEW_SCORE.average.toFixed(1)} / 5.0 · Exceptional · ${REVIEW_SCORE.count} verified reviews`}
          />
          <FlatList
            horizontal
            nestedScrollEnabled
            data={REVIEWS}
            keyExtractor={(r) => r.id}
            renderItem={({ item }) => (
              <View style={[styles.reviewCard, { width: reviewW }]}>
                {/* Decorative Watermark Quote */}
                <Text style={styles.quoteWatermark}>“</Text>

                {/* Header: Stars + Verified Badge */}
                <View style={styles.reviewCardTop}>
                  <View style={{ flexDirection: 'row', gap: 3 }}>
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Ionicons
                        key={k}
                        name={k < item.rating ? 'star' : 'star-outline'}
                        size={14}
                        color={C.gold}
                      />
                    ))}
                  </View>
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="shield-checkmark" size={12} color={C.positive} style={{ marginRight: 4 }} />
                    <Text style={styles.verifiedText}>Verified stay</Text>
                  </View>
                </View>

                {/* Review Headline & Body */}
                <View style={{ marginVertical: 8 }}>
                  <Text style={styles.reviewTitle}>"{item.title}"</Text>
                  <Text numberOfLines={3} style={styles.reviewBody}>{item.body}</Text>
                </View>

                {/* Author Monogram + Info + Rating Score Badge */}
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

        {/* Why Serene Heights Editorial Showcase */}
        <SectionHead
          title="Why Serene Heights"
          sub="Crafted for year-round alpine luxury"
        />
        <View style={styles.pillarsContainer}>
          {EDITORIAL_PILLARS.map((p) => (
            <View key={p.kicker} style={styles.pillarCard}>
              {/* Cinematic Header Photography */}
              <View style={styles.pillarPhotoWrap}>
                <Photo src={p.image} style={StyleSheet.absoluteFill} />
                <Scrim bottom={0.45} />

                {/* Floating Crystal Badge on Image */}
                <View style={styles.pillarBadge}>
                  <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.18)', 'rgba(0, 0, 0, 0.35)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <Ionicons name={p.icon} size={12} color={C.gold} style={{ marginRight: 5 }} />
                  <Text style={styles.pillarBadgeText}>{p.badge}</Text>
                </View>
              </View>

              {/* Content Body */}
              <View style={styles.pillarBody}>
                <Text style={styles.pillarKicker}>{p.kicker}</Text>
                <Text style={styles.pillarTitle}>{p.title}</Text>
                <Text style={styles.pillarText}>{p.text}</Text>

                {/* Micro spec chips */}
                <View style={styles.pillarChipsRow}>
                  {p.chips.map((c) => (
                    <View key={c} style={styles.pillarChip}>
                      <Ionicons name="checkmark-circle" size={11.5} color={C.gold} style={{ marginRight: 4 }} />
                      <Text style={styles.pillarChipText}>{c}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Footer: concierge + contact */}
        <LuxuryFooter bottomSpace={tabBarSpace(insets.bottom) + 16} />
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
    borderColor: 'rgba(200, 164, 106, 0.32)',
    minHeight: 220,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    ...shadow.cardHover,
  },
  quoteWatermark: {
    position: 'absolute',
    top: 6,
    right: 14,
    fontFamily: FONTS.display,
    fontSize: 54,
    lineHeight: 54,
    color: 'rgba(200, 164, 106, 0.16)',
  },
  reviewCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
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
    fontSize: 13,
    lineHeight: 19.5,
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
  reviewAuthorBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flex: 1,
    marginRight: 8,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(200, 164, 106, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorAvatarText: {
    fontFamily: FONTS.uiBold,
    fontSize: 11,
    color: C.pine,
  },
  reviewAuthor: {
    fontFamily: FONTS.uiBold,
    fontSize: 12,
    color: C.pine,
  },
  reviewRoom: {
    fontFamily: FONTS.ui,
    fontSize: 11,
    color: C.ink55,
    marginTop: 1,
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
  pillarsContainer: {
    paddingHorizontal: S.gutter,
    gap: 16,
    marginBottom: 12,
  },
  pillarCard: {
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.3)',
    ...shadow.cardHover,
  },
  pillarPhotoWrap: {
    width: '100%',
    height: 180,
    backgroundColor: C.pine,
    position: 'relative',
    padding: 14,
    justifyContent: 'flex-start',
  },
  pillarBadge: {
    alignSelf: 'flex-start',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 5.5,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  pillarBadgeText: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 1.1,
    color: '#FFFFFF',
  },
  pillarBody: {
    padding: 20,
  },
  pillarKicker: {
    fontFamily: FONTS.uiBold,
    fontSize: 10,
    letterSpacing: 1.5,
    color: C.gold,
  },
  pillarTitle: {
    fontFamily: FONTS.display,
    fontSize: 22,
    lineHeight: 27,
    color: C.pine,
    marginTop: 5,
  },
  pillarText: {
    fontFamily: FONTS.ui,
    fontSize: 13.5,
    lineHeight: 20,
    color: C.ink70,
    marginTop: 8,
  },
  pillarChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
  },
  pillarChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(200, 164, 106, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.22)',
  },
  pillarChipText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 11,
    color: C.pine,
  },
});
