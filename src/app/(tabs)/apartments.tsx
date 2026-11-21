import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BrandHeader from '@/components/BrandHeader';
import RoomCard from '@/components/RoomCard';
import { useScrollTop } from '@/components/ScrollTop';
import StayBar from '@/components/StayBar';
import { Text } from '@/components/Text';
import { Button, Sheet } from '@/components/ui';
import { apartmentsOf, ROOM_TYPES, type RoomType } from '@/data/catalog';
import { availability, fmtShort, guestsLabel, lowestQuote, nightsBetween, plural, type Stay } from '@/lib/stay';
import { useBooking } from '@/state/booking';
import { C, FONTS, S, T, tabBarSpace } from '@/theme';

type FilterKey = 'available' | 'family' | 'terrace' | 'corner' | 'value';
type SortKey = 'recommended' | 'priceAsc' | 'priceDesc' | 'largest';

const perNight = (t: RoomType, s: Stay) => {
  const q = lowestQuote(t, s).q;
  return q.grandTotal / Math.max(1, q.nights);
};
const maxArea = (t: RoomType) => Math.max(...apartmentsOf(t.slug).map((a) => a.areaSqft ?? 0));

const FILTERS: { key: FilterKey; label: string; test: (t: RoomType, s: Stay) => boolean }[] = [
  {
    key: 'available',
    label: 'Available',
    test: (t, s) => {
      const a = availability(t, s);
      return !a.soldOut && a.fitsParty;
    },
  },
  { key: 'family', label: 'Sleeps 4', test: (t) => t.maxOccupancy >= 4 },
  { key: 'terrace', label: 'Terrace', test: (t) => t.outdoorSpace === 'Private terrace' },
  { key: 'corner', label: 'Corner views', test: (t) => t.features.some((f) => f.startsWith('Corner')) },
  { key: 'value', label: 'Under PKR 25k/night', test: (t, s) => perNight(t, s) < 25_000 },
];

const SORT_ICON: Record<SortKey, 'sparkles-outline' | 'trending-up-outline' | 'trending-down-outline' | 'resize-outline'> = {
  recommended: 'sparkles-outline',
  priceAsc: 'trending-up-outline',
  priceDesc: 'trending-down-outline',
  largest: 'resize-outline',
};

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'recommended', label: 'Recommended' },
  { key: 'priceAsc', label: 'Price: low to high' },
  { key: 'priceDesc', label: 'Price: high to low' },
  { key: 'largest', label: 'Largest first' },
];

// Search results, as on the web's /rooms: brand header, the stay at a glance, working filters + sort, one card per type.
export default function Apartments() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { stay } = useBooking();
  const { ref, onScroll } = useScrollTop();
  const [filters, setFilters] = useState<FilterKey[]>([]);
  const [sort, setSort] = useState<SortKey>('recommended');
  const [sortOpen, setSortOpen] = useState(false);
  const sortLabel = SORTS.find((s) => s.key === sort)!.label;

  const nights = nightsBetween(stay.checkIn, stay.checkOut);
  const toggle = (k: FilterKey) => setFilters((f) => (f.includes(k) ? f.filter((x) => x !== k) : [...f, k]));
  const reset = () => {
    setFilters([]);
    setSort('recommended');
  };

  const types = useMemo(() => {
    const list = ROOM_TYPES.filter((t) => filters.every((k) => FILTERS.find((f) => f.key === k)!.test(t, stay)));
    if (sort === 'priceAsc') return [...list].sort((a, b) => perNight(a, stay) - perNight(b, stay));
    if (sort === 'priceDesc') return [...list].sort((a, b) => perNight(b, stay) - perNight(a, stay));
    if (sort === 'largest') return [...list].sort((a, b) => maxArea(b) - maxArea(a));
    return list;
  }, [filters, sort, stay]);

  const renderItem = useCallback(
    ({ item }: { item: RoomType }) => (
      <View style={{ paddingHorizontal: S.gutter }}>
        <RoomCard type={item} stay={stay} />
      </View>
    ),
    [stay],
  );

  const changed = filters.length > 0 || sort !== 'recommended';

  const header = (
    <View>
      <BrandHeader />
      <View style={{ paddingHorizontal: S.gutter, marginTop: 24 }}>
        <Text style={T.eyebrow}>
          {fmtShort(stay.checkIn)} – {fmtShort(stay.checkOut)} · {guestsLabel(stay.adults, stay.children)}
        </Text>
        <Text style={[T.h1, { marginTop: 4 }]}>{nights}-Night Stays</Text>
        <Text style={[T.small, { marginTop: 4 }]}>Serene Heights, Nathia Gali · taxes included</Text>
        <View style={{ marginTop: 16 }}>
          <StayBar stay={stay} onPress={() => router.push('/stay')} />
        </View>
      </View>

      <ScrollView horizontal nestedScrollEnabled keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {FILTERS.map((f) => (
          <Chip key={f.key} label={f.label} on={filters.includes(f.key)} onPress={() => toggle(f.key)} />
        ))}
      </ScrollView>
      <View style={styles.summary}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
          <Text style={styles.count}>
            {types.length} <Text style={styles.countOf}>of {ROOM_TYPES.length} stays</Text>
          </Text>
          {changed && (
            <Pressable onPress={reset} hitSlop={8}>
              <Text style={styles.reset}>Reset</Text>
            </Pressable>
          )}
        </View>
        <Pressable onPress={() => setSortOpen(true)} hitSlop={6} style={styles.sortPill} accessibilityRole="button" accessibilityLabel={`Sort: ${sortLabel}`}>
          <Ionicons name="swap-vertical-outline" size={14} color={C.pine} />
          <Text style={styles.sortPillText} numberOfLines={1}>{sortLabel}</Text>
          <Ionicons name="chevron-down-outline" size={13} color={C.ink55} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
    <FlatList
      ref={ref}
      data={types}
      extraData={`${filters.join(',')}|${sort}`}
      keyExtractor={(t) => t.slug}
      renderItem={renderItem}
      ListHeaderComponent={header}
      ItemSeparatorComponent={Gap}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="options-outline" size={22} color={C.pine} />
          <Text style={[T.h3, { marginTop: 10 }]}>No apartments match</Text>
          <Text style={[T.small, { marginTop: 4, textAlign: 'center' }]}>Try removing a filter or changing your dates.</Text>
          <Button label="Reset filters" onPress={reset} style={{ marginTop: 16, alignSelf: 'stretch' }} />
        </View>
      }
      onScroll={onScroll}
      scrollEventThrottle={64}
      initialNumToRender={2}
      maxToRenderPerBatch={2}
      windowSize={5}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: C.sand }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: Math.max(120, tabBarSpace(insets.bottom) + 32) }}
    />
    <Sheet open={sortOpen} onClose={() => setSortOpen(false)} title="Sort stays">
      <View style={{ paddingHorizontal: S.gutter, paddingBottom: 8 }}>
        {SORTS.map((o) => {
          const on = o.key === sort;
          return (
            <Pressable
              key={o.key}
              onPress={() => {
                setSort(o.key);
                setSortOpen(false);
              }}
              style={styles.option}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}>
              <Ionicons name={SORT_ICON[o.key]} size={18} color={on ? C.pine : C.ink55} />
              <Text style={[styles.optionText, on && { fontFamily: FONTS.uiBold }]}>{o.label}</Text>
              {on && <Ionicons name="checkmark-outline" size={18} color={C.pine} />}
            </Pressable>
          );
        })}
      </View>
    </Sheet>
    </View>
  );
}

const Gap = () => <View style={{ height: 32 }} />;

function Chip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={4} style={[styles.chip, on && styles.chipOn]} accessibilityRole="checkbox" accessibilityState={{ checked: on }}>
      {on && <Ionicons name="checkmark-outline" size={14} color={C.cream} />}
      <Text style={[styles.chipText, on && { color: C.cream }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chipRow: { paddingHorizontal: S.gutter, gap: 8, marginTop: 16 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, height: 38, borderRadius: 999, backgroundColor: C.pureWhite, borderWidth: StyleSheet.hairlineWidth, borderColor: C.lineStrong },
  chipOn: { backgroundColor: C.pine, borderColor: C.pine },
  chipText: { fontSize: 13, fontFamily: FONTS.uiSemi, color: C.ink },
  sortPill: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: 12, borderRadius: 999, backgroundColor: C.pureWhite, borderWidth: StyleSheet.hairlineWidth, borderColor: C.lineStrong, maxWidth: 200 },
  sortPillText: { flexShrink: 1, fontSize: 12.5, fontFamily: FONTS.uiSemi, color: C.ink },
  count: { fontSize: 15, fontFamily: FONTS.uiBold, color: C.ink, fontVariant: ['tabular-nums'] },
  countOf: { fontSize: 13, fontFamily: FONTS.ui, color: C.ink55 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  optionText: { flex: 1, fontSize: 15, fontFamily: FONTS.uiMedium, color: C.ink },
  summary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.gutter, marginTop: 16, marginBottom: 16 },
  reset: { fontSize: 13, fontFamily: FONTS.uiBold, color: C.pine, textDecorationLine: 'underline' },
  empty: { marginHorizontal: S.gutter, padding: 24, borderRadius: S.card, backgroundColor: C.pureWhite, alignItems: 'center' },
});
