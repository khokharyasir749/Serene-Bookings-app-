import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { memo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Rating } from '@/components/kit';
import { Text } from '@/components/Text';
import { Photo, PressableScale } from '@/components/ui';
import { areaRangeOf, REVIEW_SCORE, type RoomType } from '@/data/catalog';
import { availability, lowestQuote, money, plural, type Stay } from '@/lib/stay';
import { C, FONTS, shadow } from '@/theme';

// Shakuro-style "Popular hotels" apartment card:
// Large rounded photo with top-right floating heart, bold title, star rating + reviews + distance,
// soft pill badges ("Free cancellation", "Breakfast included"), and bold price per night + stay total.
function RoomCard({ type, stay }: { type: RoomType; stay: Stay }) {
  const router = useRouter();
  const [favorite, setFavorite] = useState(false);
  const av = availability(type, stay);
  const best = lowestQuote(type, stay);
  const bookable = !av.soldOut && av.fitsParty;
  const perNight = Math.round(best.q.grandTotal / Math.max(1, best.q.nights));

  return (
    <PressableScale onPress={() => router.push(`/room/${type.slug}`)} scaleTo={0.985} style={styles.card}>
      {/* Photo with floating tags & favorite button */}
      <View style={styles.imgWrap}>
        <Photo src={type.images[0]} style={styles.img} />
        {/* Top-left feature pill */}
        <View style={styles.tagWrap}>
          {bookable && av.available <= 3 ? (
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>Only {av.available} left</Text>
            </View>
          ) : (
            <View style={styles.statusPill}>
              <Ionicons name="sunny-outline" size={11} color={C.ink} style={{ marginRight: 3 }} />
              <Text style={styles.statusPillText}>{type.outdoorSpace}</Text>
            </View>
          )}
        </View>

        {/* Top-right floating circular favorite button */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            setFavorite((prev) => !prev);
          }}
          hitSlop={8}
          accessibilityLabel="Save to favorites"
          style={({ pressed }) => [styles.favBtn, pressed && { opacity: 0.85 }]}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={18}
            color={favorite ? C.coral : C.ink}
          />
        </Pressable>
      </View>

      {/* Card Body */}
      <View style={styles.body}>
        {/* Title & nightly price */}
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {type.name.replace(' Apartment', '')}
          </Text>
          {bookable && (
            <Text style={styles.price}>
              {money(perNight)}
              <Text style={styles.per}> / night</Text>
            </Text>
          )}
        </View>

        {/* Rating, reviews & location */}
        <View style={styles.metaRow}>
          <Rating score={REVIEW_SCORE.average} count={REVIEW_SCORE.count} size={12.5} />
          <Text style={styles.dot}>·</Text>
          <Text style={styles.meta} numberOfLines={1}>Nathia Gali · 7,906 ft</Text>
        </View>

        {/* Feature Badges Pills */}
        <View style={styles.badgesRow}>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>Free cancellation</Text>
          </View>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>Breakfast included</Text>
          </View>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>{areaRangeOf(type.slug)}</Text>
          </View>
        </View>

        {/* Total or sold out status */}
        {bookable ? (
          <View style={styles.foot}>
            <Text style={styles.totalSub}>
              {plural(best.q.nights, 'night')} · {type.maxOccupancy} guests
            </Text>
            <Text style={styles.total}>
              {money(best.q.grandTotal)}
              <Text style={styles.totalSuffix}> total</Text>
            </Text>
          </View>
        ) : (
          <Text style={styles.unavailable}>
            {av.soldOut ? 'Sold out for your dates' : `Sleeps ${type.maxOccupancy} guests — add an apartment`}
          </Text>
        )}
      </View>
    </PressableScale>
  );
}

export default memo(RoomCard);

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderRadius: 24,
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: C.line,
    marginBottom: 16,
    ...shadow.card,
  },
  imgWrap: {
    position: 'relative',
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 18,
  },
  tagWrap: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    ...shadow.pill,
  },
  statusPillText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 11,
    color: C.ink,
  },
  favBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.pureWhite,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.pill,
  },
  body: {
    paddingHorizontal: 6,
    paddingTop: 12,
    paddingBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  name: {
    flex: 1,
    fontFamily: FONTS.displayBold,
    fontSize: 18.5,
    lineHeight: 23,
    color: C.ink,
  },
  price: {
    fontFamily: FONTS.uiBold,
    fontSize: 17,
    color: C.ink,
    fontVariant: ['tabular-nums'],
  },
  per: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    color: C.ink55,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  dot: {
    color: C.ink40,
    fontSize: 12,
  },
  meta: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    color: C.ink55,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  badgePill: {
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 8,
    backgroundColor: C.fill,
  },
  badgeText: {
    fontFamily: FONTS.uiMedium,
    fontSize: 11.5,
    color: C.ink70,
  },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F0F2F4',
  },
  totalSub: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    color: C.ink55,
  },
  total: {
    fontFamily: FONTS.uiBold,
    fontSize: 15,
    color: C.ink,
    fontVariant: ['tabular-nums'],
  },
  totalSuffix: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    color: C.ink55,
  },
  unavailable: {
    fontFamily: FONTS.uiMedium,
    fontSize: 12.5,
    color: C.danger,
    marginTop: 10,
  },
});
