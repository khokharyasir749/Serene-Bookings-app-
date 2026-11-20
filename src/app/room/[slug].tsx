import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, Share, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Accordion from '@/components/Accordion';
import { HeroGallery, Lightbox } from '@/components/Gallery';
import { Card, Rating, SectionTitle, type IconName } from '@/components/kit';
import { Text } from '@/components/Text';
import { Button, Photo } from '@/components/ui';
import { areaRangeOf, PROPERTY, REVIEW_SCORE, REVIEWS, roomType } from '@/data/catalog';
import { availability, guestsLabel, lowestQuote, money, plural } from '@/lib/stay';
import { useBooking } from '@/state/booking';
import { C, FONTS, S, shadow } from '@/theme';

const POPULAR_FACILITIES: { icon: IconName; label: string }[] = [
  { icon: 'water-outline', label: 'Heated pool' },
  { icon: 'restaurant-outline', label: 'Rooftop dining' },
  { icon: 'barbell-outline', label: 'Gym & spa' },
  { icon: 'wifi-outline', label: 'Fast Wi-Fi' },
  { icon: 'business-outline', label: '24/7 concierge' },
  { icon: 'car-outline', label: 'Valet parking' },
];

const RATING_BREAKDOWN = [
  { label: 'Cleanliness', score: 4.9 },
  { label: 'Communication', score: 5.0 },
  { label: 'Location', score: 4.9 },
  { label: 'Value', score: 4.8 },
];

export default function RoomDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const t = roomType(slug ?? '');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { stay } = useBooking();

  const [more, setMore] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!t) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: S.gutter, backgroundColor: C.pureWhite }}>
        <Text style={{ fontFamily: FONTS.uiBold, fontSize: 20, color: C.ink }}>Apartment type not found</Text>
        <Button label="Back to apartments" style={{ marginTop: 20 }} onPress={() => router.back()} />
      </View>
    );
  }

  const photos = [...t.images, ...PROPERTY.gallery.filter((g) => !t.images.includes(g))].filter(
    (p) => !p.includes('floor-plans'),
  );
  const av = availability(t, stay);
  const best = lowestQuote(t, stay);
  const bookable = !av.soldOut && av.fitsParty;
  const perNight = Math.round(best.q.grandTotal / Math.max(1, best.q.nights));
  const groups = [...new Set(PROPERTY.amenities.map((a) => a.group))];

  const openRates = () => router.push({ pathname: '/rates/[slug]', params: { slug: t.slug } });
  const openStay = () => router.push({ pathname: '/stay', params: { type: t.slug } });
  const openBook = () => router.push({ pathname: '/book/[slug]', params: { slug: t.slug } });
  const share = () => void Share.share({ message: `${t.name} at Serene Heights, Nathia Gali` }).catch(() => {});

  const shownThumbs = photos.slice(1, 5);
  const extraThumbs = Math.max(0, photos.length - 5);

  return (
    <View style={styles.root}>
      {/* Floating Header Actions above Hero Gallery */}
      <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityLabel="Back"
          style={({ pressed }) => [styles.circleBtn, pressed && { opacity: 0.85 }]}
        >
          <Ionicons name="chevron-back" size={20} color={C.ink} />
        </Pressable>

        <View style={styles.headerRight}>
          <Pressable
            onPress={share}
            hitSlop={8}
            accessibilityLabel="Share"
            style={({ pressed }) => [styles.circleBtn, pressed && { opacity: 0.85 }]}
          >
            <Ionicons name="share-outline" size={19} color={C.ink} />
          </Pressable>

          <Pressable
            onPress={() => setFavorite((f) => !f)}
            hitSlop={8}
            accessibilityLabel="Favorite"
            style={({ pressed }) => [styles.circleBtn, pressed && { opacity: 0.85 }]}
          >
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={19}
              color={favorite ? C.coral : C.ink}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}
      >
        {/* Hero Photo Carousel */}
        <HeroGallery photos={photos} height={Math.round(height * 0.45)} />

        {/* Shakuro Curved White Content Sheet */}
        <View style={styles.sheet}>
          {/* Title & nightly price */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.title} numberOfLines={2}>
                {t.name}
              </Text>
              <View style={styles.locRow}>
                <Ionicons name="location-outline" size={14} color={C.ink55} />
                <Text style={styles.locText} numberOfLines={1}>
                  Nathia Gali, Pakistan · 7,906 ft
                </Text>
              </View>
            </View>

            {bookable && (
              <View style={styles.priceCol}>
                <Text style={styles.priceNum}>{money(perNight)}</Text>
                <Text style={styles.priceSub}>/ night</Text>
              </View>
            )}
          </View>

          {/* Shakuro 4-Thumbnail Gallery Strip */}
          <View style={styles.thumbsRow}>
            {shownThumbs.map((p, idx) => {
              const isLast = idx === shownThumbs.length - 1 && extraThumbs > 0;
              return (
                <Pressable
                  key={p}
                  onPress={() => setLightbox(idx + 1)}
                  style={styles.thumbWrap}
                  accessibilityLabel={`Thumbnail ${idx + 1}`}
                >
                  <Photo src={p} style={StyleSheet.absoluteFill} />
                  {isLast && (
                    <View style={styles.thumbMoreOverlay}>
                      <Text style={styles.thumbMoreText}>+{extraThumbs + 1}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Property Spec Pills */}
          <View style={styles.specPillsRow}>
            <View style={styles.specPill}>
              <Ionicons name="resize-outline" size={15} color={C.ink} />
              <Text style={styles.specPillText}>{areaRangeOf(t.slug)}</Text>
            </View>
            <View style={styles.specPill}>
              <Ionicons name="people-outline" size={15} color={C.ink} />
              <Text style={styles.specPillText}>{t.maxOccupancy} guests</Text>
            </View>
            <View style={styles.specPill}>
              <Ionicons name="water-outline" size={15} color={C.ink} />
              <Text style={styles.specPillText}>1 bath</Text>
            </View>
            <View style={styles.specPill}>
              <Ionicons name="bed-outline" size={15} color={C.ink} />
              <Text style={styles.specPillText}>{t.bedType}</Text>
            </View>
          </View>

          {/* Apartment Description */}
          <View style={styles.descWrap}>
            <Text style={styles.descText} numberOfLines={more ? undefined : 3}>
              {t.description}
            </Text>
            <Pressable onPress={() => setMore((m) => !m)} hitSlop={8} style={styles.readMoreBtn}>
              <Text style={styles.readMoreText}>{more ? 'Show less' : 'Read more'}</Text>
            </Pressable>
          </View>

          {/* Popular Facilities */}
          <View style={styles.sectionDivider} />
          <SectionTitle title="Popular facilities" style={styles.sectionHead} />
          <View style={styles.facilitiesGrid}>
            {POPULAR_FACILITIES.map((fac) => (
              <View key={fac.label} style={styles.facilityItem}>
                <View style={styles.facilityIconCircle}>
                  <Ionicons name={fac.icon} size={16} color={C.pine} />
                </View>
                <Text style={styles.facilityLabel} numberOfLines={1}>
                  {fac.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Rating and Reviews Breakdown */}
          <View style={styles.sectionDivider} />
          <View style={styles.ratingHeader}>
            <View style={styles.ratingScoreWrap}>
              <Ionicons name="star" size={20} color={C.gold} />
              <Text style={styles.ratingScoreBig}>{REVIEW_SCORE.average.toFixed(2)}</Text>
            </View>
            <Text style={styles.ratingCountMeta}>· {REVIEW_SCORE.count} reviews</Text>
          </View>

          {/* Score Bars */}
          <View style={styles.scoreBarsCol}>
            {RATING_BREAKDOWN.map((rb) => (
              <View key={rb.label} style={styles.scoreBarRow}>
                <Text style={styles.scoreBarLabel}>{rb.label}</Text>
                <View style={styles.scoreBarTrack}>
                  <View style={[styles.scoreBarFill, { width: `${(rb.score / 5) * 100}%` }]} />
                </View>
                <Text style={styles.scoreBarVal}>{rb.score.toFixed(1)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews horizontal cards */}
        <FlatList
          horizontal
          data={REVIEWS}
          keyExtractor={(r) => r.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.reviewsScroll}
          renderItem={({ item: r }) => (
            <Card style={styles.reviewCard}>
              <Rating score={r.rating} size={12} />
              <Text style={styles.reviewTitle} numberOfLines={1}>
                {r.title}
              </Text>
              <Text style={styles.reviewBody} numberOfLines={4}>
                {r.body}
              </Text>
              <Text style={styles.reviewAuthor}>
                {r.author} · {r.country} · {r.stayed}
              </Text>
            </Card>
          )}
        />

        {/* Accordions: Facilities, Rules, Location */}
        <View style={{ paddingHorizontal: S.gutter, marginTop: 24 }}>
          <Accordion
            first
            title="All facilities"
            summary={`${t.features.length} in your apartment · ${PROPERTY.amenities.length} at the resort`}
          >
            <FacilityList title="In your apartment" items={t.features} />
            {groups.map((g) => (
              <FacilityList
                key={g}
                title={g}
                items={PROPERTY.amenities.filter((a) => a.group === g).map((a) => a.name)}
              />
            ))}
          </Accordion>

          <Accordion title="House rules" summary="Check-in 2 PM · check-out 12 PM · ID required">
            {PROPERTY.policies.map((p) => (
              <View key={p.label} style={styles.ruleRow}>
                <Text style={styles.ruleLabel}>{p.label}</Text>
                <Text style={styles.ruleValue}>{p.value}</Text>
              </View>
            ))}
          </Accordion>

          <Accordion title="Location" summary="Nathia Gali · 2 hrs from Islamabad">
            <Photo
              src="/images/resort/tower-sunset-forest.jpg"
              style={{ width: '100%', aspectRatio: 16 / 10, borderRadius: 18 }}
            />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
              <Ionicons name="location-outline" size={15} color={C.ink55} style={{ marginTop: 2 }} />
              <Text style={styles.locDesc}>{PROPERTY.address}</Text>
            </View>
            {PROPERTY.distances.map((d) => (
              <View key={d.place} style={styles.distRow}>
                <Text style={styles.distPlace}>{d.place}</Text>
                <Text style={styles.distTime}>{d.drive ?? d.distance}</Text>
              </View>
            ))}
          </Accordion>
        </View>
      </ScrollView>

      {/* Shakuro Sticky Elevated Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(14, insets.bottom + 6) }]}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          {bookable ? (
            <>
              <Text style={styles.bottomPrice}>{money(best.q.grandTotal)} total</Text>
              <Text style={styles.bottomSub}>
                {guestsLabel(stay.adults, stay.children)} · {money(perNight)}/night
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.bottomPrice, { color: C.danger }]}>Sold out</Text>
              <Text style={styles.bottomSub}>Try other dates</Text>
            </>
          )}
        </View>

        <Pressable
          onPress={bookable ? openBook : openStay}
          style={({ pressed }) => [styles.bookNowBtn, pressed && { opacity: 0.9 }]}
        >
          <Text style={styles.bookNowText}>{bookable ? 'Book now' : 'Change dates'}</Text>
        </Pressable>
      </View>

      <Lightbox photos={photos} index={lightbox} onClose={() => setLightbox(null)} />
    </View>
  );
}

function FacilityList({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.facListTitle}>{title}</Text>
      {items.map((it) => (
        <View key={it} style={{ flexDirection: 'row', gap: 9, paddingVertical: 4 }}>
          <Ionicons name="checkmark" size={15} color={C.pine} style={{ marginTop: 1 }} />
          <Text style={styles.facListItem}>{it}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.pureWhite,
  },
  floatingHeader: {
    position: 'absolute',
    left: S.gutter,
    right: S.gutter,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.pureWhite,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.pill,
  },
  sheet: {
    marginTop: -32,
    paddingHorizontal: S.gutter,
    paddingTop: 24,
    backgroundColor: C.pureWhite,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: FONTS.uiBold,
    fontSize: 22,
    lineHeight: 27,
    letterSpacing: -0.3,
    color: C.ink,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  locText: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: C.ink55,
  },
  priceCol: {
    alignItems: 'flex-end',
    marginTop: 2,
  },
  priceNum: {
    fontFamily: FONTS.uiBold,
    fontSize: 18,
    color: C.ink,
    fontVariant: ['tabular-nums'],
  },
  priceSub: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    color: C.ink55,
  },
  thumbsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  thumbWrap: {
    flex: 1,
    height: 72,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: C.fill,
  },
  thumbMoreOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(22, 30, 26, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbMoreText: {
    fontFamily: FONTS.uiBold,
    fontSize: 15,
    color: C.pureWhite,
  },
  specPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  specPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 14,
    backgroundColor: C.fill,
    borderWidth: 1,
    borderColor: '#E8EAEB',
  },
  specPillText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 11.5,
    color: C.ink,
  },
  descWrap: {
    marginTop: 18,
  },
  descText: {
    fontFamily: FONTS.ui,
    fontSize: 14.5,
    lineHeight: 22,
    color: C.ink70,
  },
  readMoreBtn: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontFamily: FONTS.uiBold,
    fontSize: 13.5,
    color: C.pine,
    textDecorationLine: 'underline',
  },
  sectionDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#EAECEF',
    marginTop: 22,
  },
  sectionHead: {
    marginTop: 18,
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 14,
    marginTop: 14,
  },
  facilityItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  facilityIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facilityLabel: {
    fontFamily: FONTS.uiMedium,
    fontSize: 13.5,
    color: C.ink,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
  },
  ratingScoreWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingScoreBig: {
    fontFamily: FONTS.uiBold,
    fontSize: 22,
    color: C.ink,
  },
  ratingCountMeta: {
    fontFamily: FONTS.uiMedium,
    fontSize: 14,
    color: C.ink55,
  },
  scoreBarsCol: {
    marginTop: 14,
    gap: 10,
  },
  scoreBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreBarLabel: {
    width: 105,
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: C.ink70,
  },
  scoreBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E8EAEB',
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: C.pine,
  },
  scoreBarVal: {
    width: 28,
    textAlign: 'right',
    fontFamily: FONTS.uiSemi,
    fontSize: 12.5,
    color: C.ink,
  },
  reviewsScroll: {
    paddingHorizontal: S.gutter,
    gap: 12,
    paddingTop: 16,
  },
  reviewCard: {
    width: 270,
    backgroundColor: C.pureWhite,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECEEF0',
  },
  reviewTitle: {
    fontFamily: FONTS.uiBold,
    fontSize: 14,
    color: C.ink,
    marginTop: 8,
  },
  reviewBody: {
    fontFamily: FONTS.ui,
    fontSize: 12.5,
    lineHeight: 18,
    color: C.ink70,
    marginTop: 4,
  },
  reviewAuthor: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    color: C.ink55,
    marginTop: 10,
  },
  ruleRow: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EAECEF',
  },
  ruleLabel: {
    fontFamily: FONTS.uiSemi,
    fontSize: 13,
    color: C.ink,
  },
  ruleValue: {
    fontFamily: FONTS.ui,
    fontSize: 12.5,
    color: C.ink55,
    marginTop: 3,
  },
  locDesc: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: C.ink70,
    flex: 1,
  },
  distRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EAECEF',
  },
  distPlace: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: C.ink70,
  },
  distTime: {
    fontFamily: FONTS.uiSemi,
    fontSize: 13,
    color: C.ink,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: S.gutter,
    paddingTop: 14,
    backgroundColor: C.pureWhite,
    borderTopWidth: 1,
    borderTopColor: '#ECEEF0',
    ...shadow.dock,
  },
  bottomPrice: {
    fontFamily: FONTS.uiBold,
    fontSize: 17,
    color: C.ink,
    fontVariant: ['tabular-nums'],
  },
  bottomSub: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    color: C.ink55,
    marginTop: 1,
  },
  bookNowBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: C.pine,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.pill,
  },
  bookNowText: {
    fontFamily: FONTS.uiBold,
    fontSize: 14.5,
    color: C.pureWhite,
  },
  facListTitle: {
    fontFamily: FONTS.uiBold,
    fontSize: 13,
    color: C.ink,
    marginBottom: 6,
  },
  facListItem: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: C.ink70,
    flex: 1,
  },
});
