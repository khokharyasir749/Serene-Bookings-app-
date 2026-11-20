import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
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
import { FACTS, PROPERTY, ROOM_TYPES, type RoomType } from '@/data/catalog';
import { fmtShort } from '@/lib/stay';
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
  { key: 'all', label: 'All apartments', active: true, chevron: true },
  { key: 'terrace', label: 'Private terrace', active: false, chevron: false },
  { key: 'corner', label: 'Corner views', active: false, chevron: false },
  { key: 'pool', label: 'Heated pool', active: false, chevron: false },
  { key: 'dining', label: 'Rooftop dining', active: false, chevron: false },
];

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
        {/* Serene Brand Lockup */}
        <BrandHeader />

        {/* Header: Greeting & Serene Tagline (Notification Bell removed as requested) */}
        <View style={styles.headerRow}>
          <Text style={styles.greetingTitle}>Welcome, {userName}</Text>
          <Text style={styles.greetingSub}>
            Pakistan's first & largest winter resort · 7,906 ft above Islamabad
          </Text>
        </View>

        {/* Serene Pill Search Bar */}
        <View style={styles.searchWrap}>
          <PressableScale onPress={() => openFilter('dates')} scaleTo={0.99} style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={C.gold} style={{ marginLeft: 4 }} />
            <View style={styles.searchTextWrap}>
              <Text style={styles.searchPlaceholder} numberOfLines={1}>
                {stay.checkIn && stay.checkOut
                  ? `Nathia Gali · ${fmtShort(stay.checkIn)} – ${fmtShort(stay.checkOut)}`
                  : 'Serene Heights · Search dates & residences...'}
              </Text>
            </View>
            <View style={styles.filterBtn}>
              <Ionicons name="options-outline" size={17} color={C.pine} />
            </View>
          </PressableScale>
        </View>

        {/* Filter Chips Row */}
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
                  setSelectedFilter(pill.key);
                  if (pill.key === 'all') {
                    openFilter('dates');
                  } else if (pill.key === 'pool' || pill.key === 'dining') {
                    router.push('/amenities');
                  } else {
                    router.navigate('/apartments');
                  }
                }}
                style={({ pressed }) => [
                  styles.chip,
                  isActive ? styles.chipActive : styles.chipInactive,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={[styles.chipText, isActive ? styles.chipTextActive : styles.chipTextInactive]}>
                  {pill.label}
                </Text>
                {pill.chevron && (
                  <Ionicons
                    name="chevron-down"
                    size={13}
                    color={isActive ? C.sand : C.ink}
                    style={{ marginLeft: 3 }}
                  />
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Mountain Highlights / Seasons Carousel */}
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
              {/* Top badge pill */}
              <View style={styles.recentBadge}>
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

        {/* Serene Resort Glance Bar */}
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

        {/* Popular Residences (All 5 Serene Apartment Types) */}
        <View style={[styles.sectionHeadRow, { marginTop: 28 }]}>
          <View>
            <Text style={styles.sectionHeadTitle}>Popular residences</Text>
            <Text style={styles.sectionHeadSub}>Furnished hotel-apartments with private balconies</Text>
          </View>
          <Pressable onPress={() => router.navigate('/apartments')} hitSlop={8}>
            <Text style={styles.sectionHeadAction}>All stays</Text>
          </Pressable>
        </View>

        {/* Vertical list of Serene Room Cards */}
        <View style={styles.roomsList}>
          {ROOM_TYPES.map((type) => (
            <RoomCard key={type.slug} type={type} stay={stay} />
          ))}
        </View>

        {/* Resort facilities / Experiences carousel */}
        <View style={[styles.sectionHeadRow, { marginTop: 20 }]}>
          <View>
            <Text style={styles.sectionHeadTitle}>Resort facilities</Text>
            <Text style={styles.sectionHeadSub}>Heated pool, dining & wellness at 7,906 ft</Text>
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
            <View key={e.title} style={styles.expCard}>
              <Photo src={e.image} style={StyleSheet.absoluteFill} />
              <Scrim bottom={0.65} />
              <View style={{ flex: 1 }} />
              <Text numberOfLines={2} style={styles.expTitle}>
                {e.title}
              </Text>
            </View>
          ))}
        </ScrollView>

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
  greetingTitle: {
    fontFamily: FONTS.display,
    fontSize: 27,
    lineHeight: 31,
    letterSpacing: -0.3,
    color: C.ink,
  },
  greetingSub: {
    fontFamily: FONTS.ui,
    fontSize: 13.5,
    lineHeight: 19,
    color: C.ink70,
    marginTop: 4,
  },
  searchWrap: {
    paddingHorizontal: S.gutter,
    marginTop: 18,
  },
  searchBar: {
    height: 54,
    borderRadius: 27,
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: C.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    ...shadow.pill,
  },
  searchTextWrap: {
    flex: 1,
    paddingHorizontal: 10,
  },
  searchPlaceholder: {
    fontFamily: FONTS.uiMedium,
    fontSize: 13.5,
    color: C.ink70,
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.warmSand,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsScroll: {
    paddingHorizontal: S.gutter,
    paddingTop: 14,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderRadius: 999,
    paddingHorizontal: 15,
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
    width: 170,
    height: 200,
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
    width: 150,
    height: 190,
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
});
