import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';
import { Photo, PressableScale } from '@/components/ui';
import { areaRangeOf, REVIEW_SCORE, type RoomType } from '@/data/catalog';
import { availability, lowestQuote, money, plural, type Stay } from '@/lib/stay';
import { C, FONTS } from '@/theme';

/**
 * Editorial Luxury RoomCard: Minimalist, clean, limited info, zero color clutter.
 * Benchmarking Aman & One&Only: Crisp photography, elegant serif title, single meta line, clean price.
 */
function RoomCard({ type, stay }: { type: RoomType; stay: Stay }) {
  const router = useRouter();
  const av = availability(type, stay);
  const best = lowestQuote(type, stay);
  const bookable = !av.soldOut && av.fitsParty;
  const perNight = Math.round(best.q.grandTotal / Math.max(1, best.q.nights));

  const areaStr = areaRangeOf(type.slug).replace(' sq ft', '');
  const bedStr = type.bedType.replace(/^1 /, '').replace(' + sofa bed', ' + sofa');
  const metaLine = `${type.outdoorSpace} · ${areaStr} sq ft · Up to ${type.maxOccupancy} guests`;

  return (
    <PressableScale
      onPress={() => router.push(`/room/${type.slug}`)}
      scaleTo={0.985}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`${type.name}, ${money(perNight)} per night`}
    >
      {/* ── 16:10 Landscape Photography ── */}
      <View style={styles.photoWrap}>
        <Photo src={type.images[0]} style={StyleSheet.absoluteFill} />

        {/* Minimalist Frosted Rating Badge (Top-Right) */}
        <View style={styles.ratingBadge}>
          <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFill} />
          <Ionicons name="star" size={10.5} color={C.pine} style={{ marginRight: 3.5 }} />
          <Text style={styles.ratingText}>{REVIEW_SCORE.average.toFixed(1)}</Text>
        </View>

        {/* Subtle Scarcity (Only if 3 or less left) */}
        {bookable && av.available <= 3 && (
          <View style={styles.scarcityBadge}>
            <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFill} />
            <Text style={styles.scarcityText}>{`Only ${av.available} left`}</Text>
          </View>
        )}
      </View>

      {/* ── Minimalist Clean Body ── */}
      <View style={styles.body}>
        {/* Eyebrow */}
        <Text style={styles.kicker}>
          {`ONE-BEDROOM · ${type.outdoorSpace.toUpperCase()}`}
        </Text>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {type.name}
        </Text>

        {/* Single Clean Editorial Meta Line (Zero cluttered boxes) */}
        <Text style={styles.metaLine} numberOfLines={1}>
          {metaLine}
        </Text>

        <View style={styles.divider} />

        {/* Pricing & Reservation Row */}
        {bookable ? (
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceBig}>
                {money(perNight)}
                <Text style={styles.pricePer}> / night</Text>
              </Text>
              <Text style={styles.priceTotal}>
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
    borderRadius: 20,
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: C.line,
    overflow: 'hidden',
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },
  photoWrap: {
    width: '100%',
    aspectRatio: 1.55,
    backgroundColor: C.pine,
    position: 'relative',
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
    borderColor: 'rgba(255, 255, 255, 0.65)',
  },
  ratingText: {
    fontFamily: FONTS.uiBold,
    fontSize: 10.5,
    color: C.pine,
    fontVariant: ['tabular-nums'],
  },
  scarcityBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8.5,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
  },
  scarcityText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 10,
    color: C.pine,
  },
  body: {
    padding: 16,
  },
  kicker: {
    fontFamily: FONTS.uiBold,
    fontSize: 9,
    letterSpacing: 1.4,
    color: C.ink55,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.2,
    color: C.pine,
    marginTop: 3,
  },
  metaLine: {
    fontFamily: FONTS.ui,
    fontSize: 12.5,
    color: C.ink55,
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: C.line,
    marginTop: 14,
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
    fontSize: 12,
    color: C.ink55,
  },
  priceTotal: {
    fontFamily: FONTS.ui,
    fontSize: 11,
    color: C.ink55,
    marginTop: 2,
  },
  reserveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.pine,
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 8.5,
  },
  reserveBtnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 12,
    color: C.cream,
    letterSpacing: 0.2,
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
