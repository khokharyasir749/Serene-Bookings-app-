import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Images, Star } from '@/components/icons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';

import { Photo, PressableScale } from '@/components/ui';
import { areaRangeOf, REVIEW_SCORE, type RoomType } from '@/data/catalog';
import { availability, guestsLabel, lowestQuote, money, plural, type Stay } from '@/lib/stay';
import { C, FONTS, S, T } from '@/theme';

// One apartment type in a list: a rounded square photo, then name, key facts and the price for the stay.
function Spec({ icon, k, v, u }: { icon: React.ComponentProps<typeof Ionicons>['name']; k: string; v: string; u?: string }) {
  return (
    <View style={styles.spec}>
      <Ionicons name={icon} size={17} color={C.pine} />
      <Text style={styles.specK}>{k}</Text>
      <Text style={styles.specV} numberOfLines={2}>
        {v}
        {u ? <Text style={styles.specU}> {u}</Text> : null}
      </Text>
    </View>
  );
}

function RoomCard({ type, stay }: { type: RoomType; stay: Stay }) {
  const router = useRouter();
  const av = availability(type, stay);
  const best = lowestQuote(type, stay);
  const bookable = !av.soldOut && av.fitsParty;
  const perNight = Math.round(best.q.grandTotal / Math.max(1, best.q.nights));

  return (
    <PressableScale onPress={() => router.push(`/room/${type.slug}`)} scaleTo={0.98}>
      <View>
        <Photo src={type.images[0]} style={styles.img} />
        <View style={styles.count}>
          <Images size={12} color={C.sand} strokeWidth={1.75} />
          <Text style={{ color: C.sand, fontSize: 11.5, fontWeight: '600' }}>{type.images.filter((i) => !i.includes('floor-plans')).length}</Text>
        </View>
        {bookable && av.available <= 3 && (
          <View style={styles.scarcity}>
            <Text style={{ color: C.ink, fontSize: 11.5, fontWeight: '700' }}>Only {av.available} left</Text>
          </View>
        )}
      </View>

      <View style={{ paddingTop: 14, paddingHorizontal: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.kicker}>ONE-BEDROOM · {type.outdoorSpace.toUpperCase()}</Text>
          <View style={styles.rating}>
            <Star size={11} color={C.pine} fill={C.pine} />
            <Text style={styles.ratingText}>{REVIEW_SCORE.average.toFixed(1)}</Text>
          </View>
        </View>
        <Text style={[T.h2, { marginTop: 6 }]} numberOfLines={2}>{type.name}</Text>
        <View style={styles.specs}>
          <Spec icon="resize-outline" k="AREA" v={areaRangeOf(type.slug).replace(' sq ft', '')} u="sq ft" />
          <Spec icon="bed-outline" k="BED" v={type.bedType.replace(/^1 /, '').replace(' + sofa bed', ' + sofa')} />
          <Spec icon="people-outline" k="GUESTS" v={`Up to ${type.maxOccupancy}`} />
        </View>

        {bookable ? (
          <>
            <Text style={styles.policy}>Free cancellation  ·  Pay at property</Text>
            <View style={styles.priceRow}>
              <View>
                <Text style={styles.priceBig}>
                  {money(perNight)}
                  <Text style={styles.per}> / night</Text>
                </Text>
                <Text style={styles.priceNote}>Incl. taxes · {guestsLabel(stay.adults, stay.children)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.totalLabel}>TOTAL · {plural(best.q.nights, 'NIGHT', 'NIGHTS')}</Text>
                <Text style={styles.total}>{money(best.q.grandTotal)}</Text>
              </View>
            </View>
          </>
        ) : (
          <Text style={[T.small, { color: C.danger, marginTop: 10 }]}>{av.soldOut ? 'Sold out for your dates' : `Sleeps ${type.maxOccupancy} per apartment — add an apartment`}</Text>
        )}
      </View>
    </PressableScale>
  );
}

export default memo(RoomCard);

const styles = StyleSheet.create({
  img: { width: '100%', aspectRatio: 1, borderRadius: S.photo },
  count: { position: 'absolute', left: 12, bottom: 12, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  scarcity: { position: 'absolute', top: 14, left: 12, backgroundColor: 'rgba(245,242,235,0.94)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  kicker: { flex: 1, fontSize: 10, letterSpacing: 1.4, color: C.ink55, fontFamily: FONTS.uiBold },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: C.snow },
  ratingText: { fontSize: 12, fontFamily: FONTS.uiBold, color: C.ink },
  specs: { flexDirection: 'row', gap: 8, marginTop: 14 },
  spec: { flex: 1, alignItems: 'flex-start', gap: 3, paddingVertical: 11, paddingHorizontal: 12, borderRadius: 14, backgroundColor: C.pureWhite, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  specK: { fontSize: 9, letterSpacing: 1.2, fontFamily: FONTS.uiBold, color: C.ink55, marginTop: 4 },
  specV: { fontSize: 14, fontFamily: FONTS.uiSemi, color: C.ink, fontVariant: ['tabular-nums'] },
  specU: { fontSize: 11, fontFamily: FONTS.ui, color: C.ink55 },
  policy: { marginTop: 12, fontSize: 12, letterSpacing: 0.2, fontFamily: FONTS.uiMedium, color: C.ink55 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 12, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  priceBig: { fontSize: 19, fontFamily: FONTS.uiBold, color: C.ink, fontVariant: ['tabular-nums'] },
  per: { fontSize: 13, fontFamily: FONTS.ui, color: C.ink55 },
  priceNote: { fontSize: 11.5, fontFamily: FONTS.ui, color: C.ink55, marginTop: 2 },
  totalLabel: { fontSize: 9.5, letterSpacing: 1.2, fontFamily: FONTS.uiBold, color: C.ink55 },
  total: { fontSize: 15, fontFamily: FONTS.uiSemi, color: C.ink, marginTop: 2, fontVariant: ['tabular-nums'] },
});
