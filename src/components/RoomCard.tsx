import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';
import { Photo, PressableScale } from '@/components/ui';
import { areaRangeOf, REVIEW_SCORE, type RoomType } from '@/data/catalog';
import { availability, lowestQuote, money, plural, type Stay } from '@/lib/stay';
import { C, FONTS } from '@/theme';

function RoomCard({ type, stay }: { type: RoomType; stay: Stay }) {
  const router = useRouter();
  const av = availability(type, stay);
  const best = lowestQuote(type, stay);
  const bookable = !av.soldOut && av.fitsParty;
  const perNight = Math.round(best.q.grandTotal / Math.max(1, best.q.nights));
  const photoCount = type.images.filter((i) => !i.includes('floor-plans')).length;

  return (
    <PressableScale
      onPress={() => router.push(`/room/${type.slug}`)}
      scaleTo={0.985}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`${type.name}, ${money(perNight)} per night`}
    >
      {/* ── 16:10 Editorial Landscape Photography ── */}
      <View style={styles.photoWrap}>
        <Photo src={type.images[0]} style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.22)', 'transparent', 'rgba(12, 26, 19, 0.42)']}
          locations={[0, 0.35, 1]}
          style={StyleSheet.absoluteFill}
        />

        {/* Scarcity Badge (Top-Left) */}
        {bookable && av.available <= 3 && (
          <View style={styles.scarcityBadge}>
            <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.55)', 'rgba(255, 255, 255, 0.25)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.scarcityDot} />
            <Text style={styles.scarcityText}>{`Only ${av.available} left`}</Text>
          </View>
        )}

        {/* Rating Badge (Top-Right) */}
        <View style={styles.ratingBadge}>
          <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.55)', 'rgba(255, 255, 255, 0.25)']}
            style={StyleSheet.absoluteFill}
          />
          <Ionicons name="star" size={10.5} color={C.gold} style={{ marginRight: 3.5 }} />
          <Text style={styles.ratingText}>{REVIEW_SCORE.average.toFixed(1)}</Text>
        </View>

        {/* Photo Count (Bottom-Left) */}
        <View style={styles.photoCountPill}>
          <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
          <Ionicons name="images-outline" size={11} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.photoCountText}>{`${photoCount} Photos`}</Text>
        </View>
      </View>

      {/* ── Card Content Body ── */}
      <View style={styles.body}>
        {/* Eyebrow */}
        <Text style={styles.kicker}>
          {`ONE-BEDROOM · ${type.outdoorSpace.toUpperCase()}`}
        </Text>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {type.name}
        </Text>

        {/* Architectural Specs Bar */}
        <View style={styles.specsBar}>
          <View style={styles.specCol}>
            <View style={styles.specHeader}>
              <Ionicons name="resize-outline" size={12} color={C.gold} style={{ marginRight: 3 }} />
              <Text style={styles.specLabel}>AREA</Text>
            </View>
            <Text style={styles.specValue} numberOfLines={1}>
              {areaRangeOf(type.slug).replace(' sq ft', '')} <Text style={styles.specUnit}>sq ft</Text>
            </Text>
          </View>

          <View style={styles.specDivider} />

          <View style={styles.specCol}>
            <View style={styles.specHeader}>
              <Ionicons name="bed-outline" size={12} color={C.gold} style={{ marginRight: 3 }} />
              <Text style={styles.specLabel}>BED</Text>
            </View>
            <Text style={styles.specValue} numberOfLines={1}>
              {type.bedType.replace(/^1 /, '').replace(' + sofa bed', ' + sofa')}
            </Text>
          </View>

          <View style={styles.specDivider} />

          <View style={styles.specCol}>
            <View style={styles.specHeader}>
              <Ionicons name="people-outline" size={12} color={C.gold} style={{ marginRight: 3 }} />
              <Text style={styles.specLabel}>GUESTS</Text>
            </View>
            <Text style={styles.specValue} numberOfLines={1}>
              {`Up to ${type.maxOccupancy}`}
            </Text>
          </View>
        </View>

        {/* Cancellation Policy */}
        <View style={styles.policyRow}>
          <Ionicons name="checkmark-circle-outline" size={12.5} color={C.positive} style={{ marginRight: 4.5 }} />
          <Text style={styles.policyText}>Free cancellation · Pay at resort check-in</Text>
        </View>

        <View style={styles.bodyDivider} />

        {/* Pricing & CTA */}
        {bookable ? (
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceBig}>
                {money(perNight)}
                <Text style={styles.pricePer}> / night</Text>
              </Text>
              <Text style={styles.priceNote}>
                {`${money(best.q.grandTotal)} total · ${plural(best.q.nights, 'night')} incl. taxes`}
              </Text>
            </View>

            <View style={styles.reserveBtn}>
              <Text style={styles.reserveBtnText}>Reserve</Text>
              <Ionicons name="arrow-forward" size={12} color={C.cream} style={{ marginLeft: 4 }} />
            </View>
          </View>
        ) : (
          <View style={styles.soldOutWrap}>
            <Ionicons name="alert-circle-outline" size={14} color={C.danger} style={{ marginRight: 5 }} />
            <Text style={styles.soldOutText}>
              {av.soldOut ? 'Sold out for selected dates' : `Sleeps ${type.maxOccupancy} max per apartment`}
            </Text>
          </View>
        )}
      </View>
    </PressableScale>
  );
}

export default memo(RoomCard);

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.28)',
    overflow: 'hidden',
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 3,
  },
  photoWrap: {
    width: '100%',
    aspectRatio: 1.55,
    backgroundColor: C.pine,
    position: 'relative',
  },
  scarcityBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)',
  },
  scarcityDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#B42318',
    marginRight: 4.5,
  },
  scarcityText: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    color: C.pine,
    letterSpacing: 0.2,
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8.5,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)',
  },
  ratingText: {
    fontFamily: FONTS.uiBold,
    fontSize: 10,
    color: C.pine,
    fontVariant: ['tabular-nums'],
  },
  photoCountPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  photoCountText: {
    fontFamily: FONTS.uiMedium,
    fontSize: 9.5,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  body: {
    padding: 16,
  },
  kicker: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 1.5,
    color: C.gold,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 23,
    lineHeight: 27,
    letterSpacing: -0.2,
    color: C.pine,
    marginTop: 4,
  },
  specsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.sand,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.22)',
    paddingVertical: 9,
    paddingHorizontal: 10,
    marginTop: 12,
  },
  specCol: {
    flex: 1,
    alignItems: 'center',
  },
  specHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specLabel: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    letterSpacing: 1.1,
    color: C.ink55,
  },
  specValue: {
    fontFamily: FONTS.uiSemi,
    fontSize: 12,
    color: C.pine,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  specUnit: {
    fontFamily: FONTS.ui,
    fontSize: 10,
    color: C.ink55,
  },
  specDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(200, 164, 106, 0.22)',
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 11,
  },
  policyText: {
    fontFamily: FONTS.uiMedium,
    fontSize: 11.5,
    color: C.ink55,
    letterSpacing: 0.2,
  },
  bodyDivider: {
    height: 1,
    backgroundColor: 'rgba(200, 164, 106, 0.2)',
    marginTop: 12,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceBig: {
    fontFamily: FONTS.uiBold,
    fontSize: 18,
    lineHeight: 22,
    color: C.pine,
    fontVariant: ['tabular-nums'],
  },
  pricePer: {
    fontFamily: FONTS.ui,
    fontSize: 12.5,
    color: C.ink55,
  },
  priceNote: {
    fontFamily: FONTS.ui,
    fontSize: 11,
    color: C.ink55,
    marginTop: 2,
  },
  reserveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.pine,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  reserveBtnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 12,
    color: C.cream,
    letterSpacing: 0.3,
  },
  soldOutWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  soldOutText: {
    fontFamily: FONTS.uiMedium,
    fontSize: 12,
    color: C.danger,
  },
});
