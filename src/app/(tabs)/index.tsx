import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BrandHeader from '@/components/BrandHeader';
import { Rating, SectionTitle } from '@/components/kit';
import LuxuryFooter from '@/components/LuxuryFooter';
import RoomCard from '@/components/RoomCard';
import Scrim from '@/components/Scrim';
import { useScrollTop } from '@/components/ScrollTop';
import { Text } from '@/components/Text';
import { Photo, PressableScale } from '@/components/ui';
import { PROPERTY, ROOM_TYPES, type RoomType } from '@/data/catalog';
import { fmtShort, type Stay } from '@/lib/stay';
import { useBooking } from '@/state/booking';
import { C, FONTS, S, shadow, T, tabBarSpace } from '@/theme';

const RECENT_EXPLORED = [
  { id: '1', title: 'Nathia Gali', date: '20 Sep–29 Sep', badge: 'Want to visit', image: '/images/resort/hero-tower-mist.jpg' },
  { id: '2', title: 'Murree Hills', date: '15 Oct–22 Oct', badge: 'Popular', image: '/images/resort/aerial-snow-resort.jpg' },
  { id: '3', title: 'Miranjani Peak', date: '01 Nov–08 Nov', badge: 'Scenic stay', image: '/images/resort/terrace-mist.jpg' },
  { id: '4', title: 'Mukshpuri Top', date: '10 Dec–18 Dec', badge: 'Mountain view', image: '/images/resort/tower-sunset-forest.jpg' },
];

const FILTER_PILLS = [
  { key: 'location', label: 'Location', active: true, chevron: true },
  { key: 'price', label: 'Price', active: false, chevron: true },
  { key: 'rating', label: 'Rating', active: false, chevron: true },
  { key: 'reviews', label: 'Reviews', active: false, chevron: false },
  { key: 'amenities', label: 'Amenities', active: false, chevron: false },
];

const EXPERIENCES = PROPERTY.experiences.slice(0, 6);

export default function Discover() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { stay, user } = useBooking();
  const { ref, onScroll } = useScrollTop();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('location');

  useFocusEffect(
    useCallback(() => {
      setScrollEnabled(true);
    }, [])
  );

  const openFilter = (tab?: 'dates' | 'guests') => {
    router.push({ pathname: '/stay', params: { tab: tab ?? 'dates', next: 'apartments' } });
  };

  const userName = user?.firstName ?? 'Guest';

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

        {/* Shakuro Header: Greeting & Notification Bell */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingTitle}>Hey, {userName}!</Text>
            <Text style={styles.greetingSub}>Explore new hotels for your next stay!</Text>
          </View>
          <Pressable
            onPress={() => router.push('/menu')}
            accessibilityLabel="Notifications"
            style={({ pressed }) => [styles.bellBtn, pressed && { opacity: 0.85 }]}
          >
            <Ionicons name="notifications-outline" size={20} color={C.ink} />
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>3</Text>
            </View>
          </Pressable>
        </View>

        {/* Shakuro Search Bar Pill */}
        <View style={styles.searchWrap}>
          <PressableScale onPress={() => openFilter('dates')} scaleTo={0.99} style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#8E95A2" style={{ marginLeft: 4 }} />
            <View style={styles.searchTextWrap}>
              <Text style={styles.searchPlaceholder} numberOfLines={1}>
                {stay.checkIn && stay.checkOut
                  ? `Nathia Gali · ${fmtShort(stay.checkIn)} – ${fmtShort(stay.checkOut)}`
                  : 'Search hotels, destinations...'}
              </Text>
            </View>
            <View style={styles.filterBtn}>
              <Ionicons name="options-outline" size={17} color={C.ink} />
            </View>
          </PressableScale>
        </View>

        {/* Shakuro Filter Chips Row */}
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
                  if (pill.key === 'location' || pill.key === 'price') {
                    openFilter('dates');
                  } else if (pill.key === 'amenities') {
                    router.push('/amenities');
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
                    color={isActive ? C.pureWhite : C.ink}
                    style={{ marginLeft: 3 }}
                  />
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Shakuro "Recently explored" Section */}
        <View style={styles.sectionHeadRow}>
          <Text style={styles.sectionHeadTitle}>Recently explored</Text>
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
          {RECENT_EXPLORED.map((item) => (
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
                <Text style={styles.recentDate}>{item.date}</Text>
              </View>
            </PressableScale>
          ))}
        </ScrollView>

        {/* Shakuro "Popular hotels" (Popular apartments) Section */}
        <View style={[styles.sectionHeadRow, { marginTop: 28 }]}>
          <Text style={styles.sectionHeadTitle}>Popular hotels</Text>
          <Pressable onPress={() => router.navigate('/apartments')} hitSlop={8}>
            <Text style={styles.sectionHeadAction}>See all</Text>
          </Pressable>
        </View>

        {/* Vertical list of Shakuro Room Cards */}
        <View style={styles.roomsList}>
          {ROOM_TYPES.map((type) => (
            <RoomCard key={type.slug} type={type} stay={stay} />
          ))}
        </View>

        {/* Resort facilities / Experiences carousel */}
        <View style={[styles.sectionHeadRow, { marginTop: 24 }]}>
          <Text style={styles.sectionHeadTitle}>Resort experiences</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.gutter,
    marginTop: 22,
  },
  greetingTitle: {
    fontFamily: FONTS.uiBold,
    fontSize: 22,
    lineHeight: 27,
    letterSpacing: -0.3,
    color: C.ink,
  },
  greetingSub: {
    fontFamily: FONTS.ui,
    fontSize: 13.5,
    color: C.ink55,
    marginTop: 3,
  },
  bellBtn: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: '#E8EAEB',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.pill,
  },
  bellBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    minWidth: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: C.coral,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  bellBadgeText: {
    fontFamily: FONTS.uiBold,
    fontSize: 10,
    color: C.pureWhite,
  },
  searchWrap: {
    paddingHorizontal: S.gutter,
    marginTop: 18,
  },
  searchBar: {
    height: 52,
    borderRadius: 26,
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: '#E8EAEB',
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
    fontSize: 14,
    color: '#8E95A2',
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.fill,
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
    borderColor: '#E5E7EB',
  },
  chipText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 13,
  },
  chipTextActive: {
    color: C.pureWhite,
  },
  chipTextInactive: {
    color: C.ink,
  },
  sectionHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  sectionHeadAction: {
    fontFamily: FONTS.uiSemi,
    fontSize: 13,
    color: C.ink55,
  },
  recentScroll: {
    paddingHorizontal: S.gutter,
    gap: 12,
  },
  recentCard: {
    width: 165,
    height: 195,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  recentBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    ...shadow.pill,
  },
  recentBadgeText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 11,
    color: C.ink,
  },
  recentBottom: {
    padding: 12,
  },
  recentTitle: {
    fontFamily: FONTS.uiBold,
    fontSize: 16.5,
    color: C.pureWhite,
  },
  recentDate: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
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
  },
  expTitle: {
    fontFamily: FONTS.uiBold,
    fontSize: 14.5,
    lineHeight: 18,
    color: C.pureWhite,
  },
});
