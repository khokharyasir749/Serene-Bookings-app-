import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';
import { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BrandHeader from '@/components/BrandHeader';
import { Rating } from '@/components/kit';
import LuxuryFooter from '@/components/LuxuryFooter';
import RoomCard from '@/components/RoomCard';
import Scrim from '@/components/Scrim';
import { useScrollTop } from '@/components/ScrollTop';
import { Text } from '@/components/Text';
import { Photo, PressableScale } from '@/components/ui';
import { PROPERTY, REASONS, ROOM_TYPES, type RoomType } from '@/data/catalog';
import { fmtShort, guestsLabel } from '@/lib/stay';
import { useBooking } from '@/state/booking';
import { C, FONTS, S, shadow, T, tabBarSpace } from '@/theme';

// Authentic Serene Heights seasons & resort features from serene-booking-web
const RESORT_HIGHLIGHTS = [
  {
    id: '1',
    title: 'Nathia Gali Pines',
    sub: '7,906 ft · 2 hrs from Islamabad',
    badge: 'Mountain resort',
    image: '/images/resort/hero-tower-mist.jpg',
  },
  {
    id: '2',
    title: 'Winter Snow Slopes',
    sub: 'Dec – Feb · Ski slope & heated pool',
    badge: 'Snow season',
    image: '/images/resort/aerial-snow-resort.jpg',
  },
  {
    id: '3',
    title: 'Summer Mountain Air',
    sub: 'Jun – Sep · Misty greens & cool air',
    badge: 'Summer peak',
    image: '/images/resort/tower-sunset-forest.jpg',
  },
  {
    id: '4',
    title: 'Top-Floor Terraces',
    sub: '8th floor · Private outdoor living',
    badge: 'Stargazing',
    image: '/images/resort/rooftop-crown.jpg',
  },
];

const FILTER_PILLS = [
  { key: 'all', label: 'All residences', icon: 'sparkles-outline' },
  { key: 'terrace', label: 'Private terrace', icon: 'sunny-outline' },
  { key: 'corner', label: 'Corner suites', icon: 'grid-outline' },
  { key: 'family', label: 'Sleeps 4', icon: 'people-outline' },
  { key: 'pool', label: 'Heated pool', icon: 'water-outline' },
] as const;

const EXPERIENCES = PROPERTY.experiences.slice(0, 8);

export default function Discover() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { stay, user } = useBooking();
  const { ref, onScroll } = useScrollTop();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useFocusEffect(
    useCallback(() => {
      setScrollEnabled(true);
    }, [])
  );

  const openFilter = (tab?: 'dates' | 'guests') => {
    router.push({ pathname: '/stay', params: { tab: tab ?? 'dates', next: 'apartments' } });
  };

  const filteredRooms = useMemo(() => {
    if (selectedFilter === 'terrace') {
      return ROOM_TYPES.filter((r) => r.outdoorSpace.includes('terrace'));
    }
    if (selectedFilter === 'corner') {
      return ROOM_TYPES.filter((r) => r.slug.includes('corner'));
    }
    if (selectedFilter === 'family') {
      return ROOM_TYPES.filter((r) => r.maxOccupancy >= 4);
    }
    return ROOM_TYPES;
  }, [selectedFilter]);

  const userName = user?.firstName ? `${user.firstName}` : 'Guest';

  return (
    <View style={styles.root}>
      <ScrollView
        ref={ref}
        style={{ flex: 1 }}
        scrollEnabled={scrollEnabled}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        onScroll={onScroll}
        scrollEventThrottle={64}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: tabBarSpace(insets.bottom),
        }}
      >
        {/* Serene Brand Lockup with Account Button */}
        <BrandHeader />

        {/* Hero Editorial Header (Notification Bell removed) */}
        <View style={styles.headerRow}>
          <View style={styles.eyebrowPill}>
            <Ionicons name="sparkles" size={11} color={C.gold} style={{ marginRight: 4 }} />
            <Text style={styles.eyebrowText}>7,906 FT · NATHIA GALI</Text>
          </View>
          <Text style={styles.greetingTitle}>Find your mountain sanctuary</Text>
          <Text style={styles.greetingSub}>
            Pakistan's first & largest winter resort, beside PAF Airbase Nathia Gali.
          </Text>
        </View>

        {/* Elevated Luxury Search Capsule */}
        <View style={styles.searchWrap}>
          <PressableScale onPress={() => openFilter('dates')} scaleTo={0.99} style={styles.searchBar}>
            <View style={styles.searchIconWell}>
              <Ionicons name="search" size={17} color={C.pine} />
            </View>
            <View style={styles.searchTextWrap}>
              <Text style={styles.searchPrimary} numberOfLines={1}>
                Serene Heights Nathia Gali
              </Text>
              <Text style={styles.searchSecondary} numberOfLines={1}>
                {stay.checkIn && stay.checkOut
                  ? `${fmtShort(stay.checkIn)} – ${fmtShort(stay.checkOut)} · ${guestsLabel(stay.adults, stay.children)}`
                  : 'Check availability · Choose dates & guests'}
              </Text>
            </View>
            <View style={styles.filterBtn}>
              <Ionicons name="options-outline" size={18} color={C.pine} />
            </View>
          </PressableScale>
        </View>

        {/* Filter Chips Carousel with Icons */}
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
                style={({ pressed }) => [
                  styles.chip,
                  isActive ? styles.chipActive : styles.chipInactive,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Ionicons
                  name={pill.icon as any}
                  size={14}
                  color={isActive ? C.sand : C.ink70}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.chipText, isActive ? styles.chipTextActive : styles.chipTextInactive]}>
                  {pill.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Mountain Highlights & Seasons Carousel */}
        <View style={styles.sectionHeadRow}>
          <View>
            <Text style={styles.sectionHeadTitle}>Resort highlights</Text>
            <Text style={styles.sectionHeadSub}>Experience 7,906 ft across all seasons</Text>
          </View>
          <Pressable onPress={() => router.navigate('/apartments')} hitSlop={8}>
            <Text style={styles.sectionHeadAction}>See all</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          contentContainerStyle={styles.recentScroll}
        >
          {RESORT_HIGHLIGHTS.map((item) => (
            <PressableScale
              key={item.id}
              onPress={() => router.navigate('/apartments')}
              scaleTo={0.97}
              style={styles.recentCard}
            >
              <Photo src={item.image} style={StyleSheet.absoluteFill} />
              <Scrim bottom={0.7} />
              {/* Top frosted badge */}
              <View style={styles.recentBadge}>
                <Ionicons name="sparkles" size={10} color={C.gold} style={{ marginRight: 4 }} />
                <Text style={styles.recentBadgeText}>{item.badge}</Text>
              </View>
              <View style={{ flex: 1 }} />
              {/* Bottom titles */}
              <View style={styles.recentBottom}>
                <Text style={styles.recentTitle}>{item.title}</Text>
                <Text style={styles.recentDate}>{item.sub}</Text>
              </View>
            </PressableScale>
          ))}
        </ScrollView>

        {/* Serene Resort Glance Metric Bar */}
        <View style={styles.glance}>
          <View style={styles.glanceItem}>
            <Text style={styles.glanceNum}>7,906 ft</Text>
            <Text style={styles.glanceLabel}>Altitude</Text>
          </View>
          <View style={[styles.glanceItem, styles.glanceDiv]}>
            <Text style={styles.glanceNum}>50+</Text>
            <Text style={styles.glanceLabel}>Facilities</Text>
          </View>
          <View style={[styles.glanceItem, styles.glanceDiv]}>
            <Text style={styles.glanceNum}>24/7</Text>
            <Text style={styles.glanceLabel}>Concierge</Text>
          </View>
          <View style={[styles.glanceItem, styles.glanceDiv]}>
            <Text style={styles.glanceNum}>2 hrs</Text>
            <Text style={styles.glanceLabel}>Islamabad</Text>
          </View>
        </View>

        {/* Curated Residences Showcase */}
        <View style={[styles.sectionHeadRow, { marginTop: 28 }]}>
          <View>
            <Text style={styles.sectionHeadTitle}>Curated residences</Text>
            <Text style={styles.sectionHeadSub}>Furnished hotel-apartments with private balconies</Text>
          </View>
          <Pressable onPress={() => router.navigate('/apartments')} hitSlop={8}>
            <Text style={styles.sectionHeadAction}>All stays</Text>
          </Pressable>
        </View>

        {/* Room Cards List */}
        <View style={styles.roomsList}>
          {filteredRooms.map((type) => (
            <RoomCard key={type.slug} type={type} stay={stay} />
          ))}
        </View>

        {/* Resort Facilities & Experiences */}
        <View style={[styles.sectionHeadRow, { marginTop: 20 }]}>
          <View>
            <Text style={styles.sectionHeadTitle}>Resort facilities</Text>
            <Text style={styles.sectionHeadSub}>Glass-roof pool, dining & wellness at 7,906 ft</Text>
          </View>
          <Pressable onPress={() => router.push('/amenities')} hitSlop={8}>
            <Text style={styles.sectionHeadAction}>50+ facilities</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          contentContainerStyle={styles.expScroll}
        >
          {EXPERIENCES.map((e) => (
            <PressableScale
              key={e.title}
              onPress={() => router.push('/amenities')}
              scaleTo={0.97}
              style={styles.expCard}
            >
              <Photo src={e.image} style={StyleSheet.absoluteFill} />
              <Scrim bottom={0.65} />
              <View style={{ flex: 1 }} />
              <Text numberOfLines={2} style={styles.expTitle}>
                {e.title}
              </Text>
            </PressableScale>
          ))}
        </ScrollView>

        {/* Why Serene Heights Editorial Cards */}
        <View style={[styles.sectionHeadRow, { marginTop: 26 }]}>
          <View>
            <Text style={styles.sectionHeadTitle}>Why Serene Heights</Text>
            <Text style={styles.sectionHeadSub}>A mountain resort designed for year-round luxury</Text>
          </View>
        </View>

        <View style={styles.reasonsList}>
          {REASONS.map((r, i) => (
            <View
              key={r.label}
              style={[
                styles.reasonCard,
                i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
              ]}
            >
              <Photo src={r.image} style={styles.reasonPhoto} />
              <View style={{ flex: 1 }}>
                <Text style={styles.reasonLabel}>{r.label}</Text>
                <Text style={styles.reasonTitle}>{r.title}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Luxury Footer */}
        <LuxuryFooter bottomSpace={16} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.canvas,
  },
  headerRow: {
    paddingHorizontal: S.gutter,
    marginTop: 20,
  },
  eyebrowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: C.warmSand,
    borderWidth: 1,
    borderColor: C.line,
    marginBottom: 8,
  },
  eyebrowText: {
    fontFamily: FONTS.uiBold,
    fontSize: 10,
    letterSpacing: 1.2,
    color: C.ink,
  },
  greetingTitle: {
    fontFamily: FONTS.display,
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.4,
    color: C.ink,
  },
  greetingSub: {
    fontFamily: FONTS.ui,
    fontSize: 13.5,
    lineHeight: 19,
    color: C.ink70,
    marginTop: 5,
  },
  searchWrap: {
    paddingHorizontal: S.gutter,
    marginTop: 18,
  },
  searchBar: {
    height: 60,
    borderRadius: 30,
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: C.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    ...shadow.pill,
  },
  searchIconWell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.sand,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchTextWrap: {
    flex: 1,
    paddingHorizontal: 12,
  },
  searchPrimary: {
    fontFamily: FONTS.uiBold,
    fontSize: 14,
    color: C.ink,
  },
  searchSecondary: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    color: C.ink55,
    marginTop: 2,
  },
  filterBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.warmSand,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsScroll: {
    paddingHorizontal: S.gutter,
    paddingTop: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 999,
    paddingHorizontal: 16,
  },
  chipActive: {
    backgroundColor: C.pine,
  },
  chipInactive: {
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: C.line,
  },
  chipText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 13,
  },
  chipTextActive: {
    color: C.sand,
  },
  chipTextInactive: {
    color: C.ink,
  },
  sectionHeadRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: S.gutter,
    marginTop: 26,
    marginBottom: 12,
  },
  sectionHeadTitle: {
    fontFamily: FONTS.uiBold,
    fontSize: 19,
    color: C.ink,
    letterSpacing: -0.2,
  },
  sectionHeadSub: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    color: C.ink55,
    marginTop: 2,
  },
  sectionHeadAction: {
    fontFamily: FONTS.uiSemi,
    fontSize: 13,
    color: C.gold,
  },
  recentScroll: {
    paddingHorizontal: S.gutter,
    gap: 12,
  },
  recentCard: {
    width: 175,
    height: 205,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: C.snow,
    borderWidth: 1,
    borderColor: C.line,
  },
  recentBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
    ...shadow.pill,
  },
  recentBadgeText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 11,
    color: C.pine,
  },
  recentBottom: {
    padding: 12,
  },
  recentTitle: {
    fontFamily: FONTS.uiBold,
    fontSize: 15.5,
    color: C.pureWhite,
  },
  recentDate: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  glance: {
    flexDirection: 'row',
    marginHorizontal: S.gutter,
    marginTop: 22,
    paddingVertical: 16,
    backgroundColor: C.pine,
    borderRadius: S.card,
    borderWidth: 1,
    borderColor: C.goldLine,
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
    fontFamily: FONTS.uiBold,
    fontSize: 17,
    color: C.sand,
    fontVariant: ['tabular-nums'],
  },
  glanceLabel: {
    fontFamily: FONTS.uiSemi,
    fontSize: 11,
    color: C.gold,
    marginTop: 2,
  },
  roomsList: {
    paddingHorizontal: S.gutter,
  },
  expScroll: {
    paddingHorizontal: S.gutter,
    gap: 12,
  },
  expCard: {
    width: 155,
    height: 195,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 12,
    backgroundColor: C.fill,
    borderWidth: 1,
    borderColor: C.line,
  },
  expTitle: {
    fontFamily: FONTS.uiBold,
    fontSize: 14.5,
    lineHeight: 18,
    color: C.pureWhite,
  },
  reasonsList: {
    marginHorizontal: S.gutter,
    backgroundColor: C.pureWhite,
    borderRadius: S.card,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: C.line,
    ...shadow.card,
  },
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  reasonPhoto: {
    width: 64,
    height: 64,
    borderRadius: 14,
  },
  reasonLabel: {
    fontSize: 11.5,
    color: C.gold,
    fontFamily: FONTS.uiSemi,
    letterSpacing: 0.3,
  },
  reasonTitle: {
    fontFamily: FONTS.uiBold,
    fontSize: 14,
    lineHeight: 18,
    color: C.ink,
    marginTop: 2,
  },
});
