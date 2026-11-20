import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/Text';
import { CONFIG, roomType, type RoomType } from '@/data/catalog';
import { addDays, fromISO, monthName, nightlyRate, nightsBetween, plural, today, toISO } from '@/lib/stay';
import { useBooking } from '@/state/booking';
import { C, FONTS, S, shadow } from '@/theme';

const HISTOGRAM_DATA = [
  20, 28, 35, 48, 62, 78, 85, 92, 98, 86, 75, 68, 55, 48, 60, 72, 80, 70, 58, 42, 34, 26, 20, 16,
];

// The authentic 5 Serene Heights apartment types from serene-booking-web
const STAY_TYPES = ['All types', 'Classic', 'Premier', 'Grand', 'Corner Suite', 'Terrace'];

export default function StayModal() {
  const params = useLocalSearchParams<{ tab?: 'dates' | 'guests'; type?: string; next?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stay, setStay } = useBooking();
  const type = params.type ? roomType(params.type) : undefined;

  const [draft, setDraft] = useState(stay);
  const [showCalendar, setShowCalendar] = useState(true);
  const [picking, setPicking] = useState<'in' | 'out'>('in');
  const [selectedType, setSelectedType] = useState('All types');
  const [minPrice, setMinPrice] = useState(18000);
  const [maxPrice, setMaxPrice] = useState(34000);

  const nights = nightsBetween(draft.checkIn, draft.checkOut);
  const valid = nights >= 1;

  const pick = useCallback(
    (iso: string) => {
      if (picking === 'in' || iso <= draft.checkIn) {
        setDraft((d) => ({ ...d, checkIn: iso, checkOut: addDays(iso, 1) }));
        setPicking('out');
      } else {
        const out =
          nightsBetween(draft.checkIn, iso) > CONFIG.maxStayNights
            ? addDays(draft.checkIn, CONFIG.maxStayNights)
            : iso;
        setDraft((d) => ({ ...d, checkOut: out }));
        setPicking('in');
      }
    },
    [picking, draft.checkIn],
  );

  const apply = () => {
    setStay(draft);
    router.back();
    if (params.next === 'apartments') {
      setTimeout(() => router.navigate('/apartments'), 50);
    }
  };

  const formatDateDisplay = (iso: string | null) => {
    if (!iso) return 'Select date';
    const d = fromISO(iso);
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const y = d.getFullYear();
    return `${m}/${day}/${y}`;
  };

  return (
    <View style={styles.root}>
      {/* Top Drag Handle */}
      <View style={styles.handleWrap}>
        <View style={styles.handle} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Plan your stay</Text>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityLabel="Close"
          style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.8 }]}
        >
          <Ionicons name="close" size={20} color={C.ink} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}
      >
        {/* Serene Headline */}
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>Your mountain stay is just a tap away</Text>
          <Text style={styles.heroSub}>
            Serene Heights · 7,906 ft · 2 hours from Islamabad
          </Text>
        </View>

        {/* Location Input Pill */}
        <View style={styles.section}>
          <View style={styles.locationPill}>
            <View style={{ flex: 1 }}>
              <Text style={styles.locationLabel}>Resort location</Text>
              <Text style={styles.locationValue} numberOfLines={1}>
                1.5 KM, Kala Bagh Air Base Road, Nathia Gali
              </Text>
            </View>
            <View style={styles.locationIcon}>
              <Ionicons name="location" size={17} color={C.gold} />
            </View>
          </View>
        </View>

        {/* Date Selector Pills */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Stay dates</Text>
          <View style={styles.dateRow}>
            {/* Check-in Pill */}
            <Pressable
              onPress={() => {
                setShowCalendar(true);
                setPicking('in');
              }}
              style={[
                styles.datePill,
                showCalendar && picking === 'in' ? styles.datePillActive : styles.datePillInactive,
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.dateSubLabel}>Check-in</Text>
                <Text style={styles.dateValue}>{formatDateDisplay(draft.checkIn)}</Text>
              </View>
              <Ionicons
                name="chevron-down"
                size={16}
                color={showCalendar && picking === 'in' ? C.pine : C.ink55}
              />
            </Pressable>

            {/* Check-out Pill */}
            <Pressable
              onPress={() => {
                setShowCalendar(true);
                setPicking('out');
              }}
              style={[
                styles.datePill,
                showCalendar && picking === 'out' ? styles.datePillActive : styles.datePillInactive,
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.dateSubLabel}>Check-out</Text>
                <Text style={styles.dateValue}>
                  {picking === 'out' ? 'Pick date' : formatDateDisplay(draft.checkOut)}
                </Text>
              </View>
              <Ionicons
                name="chevron-down"
                size={16}
                color={showCalendar && picking === 'out' ? C.pine : C.ink55}
              />
            </Pressable>
          </View>
        </View>

        {/* Calendar Grid (Inline when active) */}
        {showCalendar && (
          <View style={styles.calendarWrap}>
            <Calendar
              checkIn={draft.checkIn}
              checkOut={picking === 'out' ? null : draft.checkOut}
              onPick={pick}
              type={type}
            />
          </View>
        )}

        {/* Guests Counters */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Guests & apartments</Text>
          <View style={styles.stepperRow}>
            {/* Adults Counter */}
            <View style={styles.counterBox}>
              <View>
                <Text style={styles.counterTitle}>Adults</Text>
                <Text style={styles.counterSub}>Ages 13+</Text>
              </View>
              <View style={styles.stepperControl}>
                <Pressable
                  disabled={draft.adults <= draft.rooms}
                  onPress={() => setDraft((d) => ({ ...d, adults: Math.max(d.rooms, d.adults - 1) }))}
                  style={styles.stepBtn}
                >
                  <Ionicons name="remove" size={17} color={draft.adults <= draft.rooms ? '#CBD5E1' : C.ink} />
                </Pressable>
                <Text style={styles.stepNum}>{draft.adults}</Text>
                <Pressable
                  onPress={() => setDraft((d) => ({ ...d, adults: d.adults + 1 }))}
                  style={styles.stepBtn}
                >
                  <Ionicons name="add" size={17} color={C.ink} />
                </Pressable>
              </View>
            </View>

            {/* Children Counter */}
            <View style={styles.counterBox}>
              <View>
                <Text style={styles.counterTitle}>Children</Text>
                <Text style={styles.counterSub}>Ages 0–12</Text>
              </View>
              <View style={styles.stepperControl}>
                <Pressable
                  disabled={draft.children <= 0}
                  onPress={() => setDraft((d) => ({ ...d, children: Math.max(0, d.children - 1) }))}
                  style={styles.stepBtn}
                >
                  <Ionicons name="remove" size={17} color={draft.children <= 0 ? '#CBD5E1' : C.ink} />
                </Pressable>
                <Text style={styles.stepNum}>{draft.children}</Text>
                <Pressable
                  onPress={() => setDraft((d) => ({ ...d, children: d.children + 1 }))}
                  style={styles.stepBtn}
                >
                  <Ionicons name="add" size={17} color={C.ink} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* Serene Rate Histogram (PKR Rates) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Nightly rate range</Text>

          {/* Histogram Frequency Chart */}
          <View style={styles.histogramContainer}>
            <View style={styles.histogramBars}>
              {HISTOGRAM_DATA.map((val, idx) => {
                const isInRange = idx >= 4 && idx <= 18;
                return (
                  <View key={idx} style={styles.barCol}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${val}%`,
                          backgroundColor: isInRange ? C.pine : C.line,
                        },
                      ]}
                    />
                  </View>
                );
              })}
            </View>
          </View>

          {/* Min & Max Price Pills in PKR */}
          <View style={styles.priceRow}>
            <View style={styles.pricePill}>
              <Text style={styles.pricePillLabel}>Base rate</Text>
              <Text style={styles.pricePillValue}>PKR {minPrice.toLocaleString()}</Text>
            </View>
            <View style={styles.priceDivLine} />
            <View style={styles.pricePill}>
              <Text style={styles.pricePillLabel}>Suite rate</Text>
              <Text style={styles.pricePillValue}>PKR {maxPrice.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Serene Apartment Types Pills */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Apartment layouts</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeScroll}>
            {STAY_TYPES.map((st) => {
              const isSel = selectedType === st;
              return (
                <Pressable
                  key={st}
                  onPress={() => setSelectedType(st)}
                  style={[styles.typePill, isSel ? styles.typePillActive : styles.typePillInactive]}
                >
                  <Text style={[styles.typeText, isSel ? styles.typeTextActive : styles.typeTextInactive]}>
                    {st}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={[styles.footer, { paddingBottom: Math.max(16, insets.bottom + 8) }]}>
        <Pressable
          onPress={() => {
            setDraft(stay);
            setPicking('in');
          }}
          style={styles.resetBtn}
        >
          <Text style={styles.resetBtnText}>Reset</Text>
        </Pressable>

        <Pressable
          disabled={!valid}
          onPress={apply}
          style={[styles.searchActionBtn, !valid && { opacity: 0.5 }]}
        >
          <Ionicons name="search" size={16} color={C.cream} style={{ marginRight: 6 }} />
          <Text style={styles.searchActionText}>
            {valid ? `Search · ${plural(nights, 'night')}` : 'Choose check-out'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function Calendar({
  checkIn,
  checkOut,
  onPick,
  type,
}: {
  checkIn: string;
  checkOut: string | null;
  onPick: (iso: string) => void;
  type?: RoomType;
}) {
  const min = today();
  const months = useMemo(() => {
    const start = fromISO(min);
    return Array.from({ length: 4 }, (_, i) =>
      toISO(new Date(start.getFullYear(), start.getMonth() + i, 1)),
    );
  }, [min]);

  return (
    <View style={styles.calContainer}>
      <View style={styles.weekRow}>
        {WEEK.map((d, i) => (
          <Text key={i} style={styles.weekDay}>
            {d}
          </Text>
        ))}
      </View>
      {months.slice(0, 2).map((item) => (
        <Month
          key={item}
          first={item}
          min={min}
          checkIn={checkIn}
          checkOut={checkOut}
          onPick={onPick}
          type={type}
        />
      ))}
    </View>
  );
}

const Month = memo(function Month({
  first,
  min,
  checkIn,
  checkOut,
  onPick,
  type,
}: {
  first: string;
  min: string;
  checkIn: string;
  checkOut: string | null;
  onPick: (iso: string) => void;
  type?: RoomType;
}) {
  const m = fromISO(first);
  const lead = m.getDay();
  const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array(lead).fill(null),
    ...Array.from({ length: days }, (_, i) => toISO(new Date(m.getFullYear(), m.getMonth(), i + 1))),
  ];
  while (cells.length % 7) cells.push(null);

  return (
    <View style={{ marginTop: 14 }}>
      <Text style={styles.monthTitle}>
        {monthName(m.getMonth())} {m.getFullYear()}
      </Text>
      <View style={styles.grid}>
        {cells.map((iso, i) => {
          if (!iso) return <View key={i} style={styles.cell} />;
          const past = iso < min;
          const edge = iso === checkIn || iso === checkOut;
          const inRange = checkOut != null && iso > checkIn && iso < checkOut;
          const price = type && !past ? nightlyRate(type, iso) : null;
          return (
            <Pressable
              key={iso}
              disabled={past}
              onPress={() => onPick(iso)}
              style={[styles.cell, inRange && styles.inRange]}
            >
              <View style={[styles.day, edge && styles.dayOn]}>
                <Text
                  style={[
                    styles.dayText,
                    past && { color: C.ink40, textDecorationLine: 'line-through' },
                    edge && { color: C.sand, fontFamily: FONTS.uiBold },
                  ]}
                >
                  {fromISO(iso).getDate()}
                </Text>
              </View>
              {price != null && <Text style={styles.dayPrice}>{Math.round(price / 1000)}k</Text>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.white,
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 6,
  },
  handle: {
    width: 38,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: C.lineStrong,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.gutter,
    paddingVertical: 10,
  },
  headerTitle: {
    fontFamily: FONTS.display,
    fontSize: 21,
    color: C.ink,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.sand,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    paddingHorizontal: S.gutter,
    marginTop: 10,
  },
  heroTitle: {
    fontFamily: FONTS.display,
    fontSize: 24,
    lineHeight: 29,
    letterSpacing: -0.3,
    color: C.ink,
  },
  heroSub: {
    fontFamily: FONTS.ui,
    fontSize: 13.5,
    color: C.ink55,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: S.gutter,
    marginTop: 20,
  },
  sectionLabel: {
    fontFamily: FONTS.uiBold,
    fontSize: 14.5,
    color: C.ink,
    marginBottom: 10,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: C.sand,
    borderWidth: 1,
    borderColor: C.line,
  },
  locationLabel: {
    fontFamily: FONTS.uiSemi,
    fontSize: 11,
    color: C.ink55,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  locationValue: {
    fontFamily: FONTS.uiBold,
    fontSize: 13.5,
    color: C.ink,
    marginTop: 2,
  },
  locationIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.pill,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  datePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  datePillActive: {
    borderColor: C.pine,
    backgroundColor: C.pureWhite,
  },
  datePillInactive: {
    borderColor: C.line,
    backgroundColor: C.sand,
  },
  dateSubLabel: {
    fontFamily: FONTS.ui,
    fontSize: 11,
    color: C.ink55,
  },
  dateValue: {
    fontFamily: FONTS.uiBold,
    fontSize: 13.5,
    color: C.ink,
    marginTop: 2,
  },
  calendarWrap: {
    marginHorizontal: S.gutter,
    marginTop: 14,
    padding: 14,
    borderRadius: 20,
    backgroundColor: C.sand,
    borderWidth: 1,
    borderColor: C.line,
  },
  calContainer: {},
  weekRow: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.line,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11.5,
    color: C.ink55,
    fontFamily: FONTS.uiSemi,
  },
  monthTitle: {
    fontFamily: FONTS.display,
    fontSize: 16,
    color: C.ink,
    marginBottom: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inRange: {
    backgroundColor: C.snow,
  },
  day: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayOn: {
    backgroundColor: C.pine,
  },
  dayText: {
    fontSize: 13.5,
    color: C.ink,
    fontFamily: FONTS.uiMedium,
  },
  dayPrice: {
    fontSize: 8.5,
    color: C.ink55,
    marginTop: -2,
  },
  stepperRow: {
    flexDirection: 'row',
    gap: 12,
  },
  counterBox: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    backgroundColor: C.sand,
    borderWidth: 1,
    borderColor: C.line,
  },
  counterTitle: {
    fontFamily: FONTS.uiBold,
    fontSize: 13.5,
    color: C.ink,
  },
  counterSub: {
    fontFamily: FONTS.ui,
    fontSize: 11,
    color: C.ink55,
    marginTop: 1,
  },
  stepperControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    backgroundColor: C.pureWhite,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: C.line,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    fontFamily: FONTS.uiBold,
    fontSize: 14,
    color: C.ink,
  },
  histogramContainer: {
    height: 70,
    justifyContent: 'flex-end',
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  histogramBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
  },
  barCol: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 1.5,
  },
  barFill: {
    width: '100%',
    minWidth: 4,
    borderRadius: 3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pricePill: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: C.sand,
    borderWidth: 1,
    borderColor: C.line,
  },
  priceDivLine: {
    width: 10,
    height: 1.5,
    backgroundColor: C.lineStrong,
  },
  pricePillLabel: {
    fontFamily: FONTS.ui,
    fontSize: 10.5,
    color: C.ink55,
  },
  pricePillValue: {
    fontFamily: FONTS.uiBold,
    fontSize: 13.5,
    color: C.ink,
    marginTop: 2,
  },
  typeScroll: {
    gap: 8,
  },
  typePill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  typePillActive: {
    backgroundColor: C.pine,
  },
  typePillInactive: {
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: C.line,
  },
  typeText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 13,
  },
  typeTextActive: {
    color: C.sand,
  },
  typeTextInactive: {
    color: C.ink,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: S.gutter,
    paddingTop: 12,
    backgroundColor: C.pureWhite,
    borderTopWidth: 1,
    borderTopColor: C.line,
    ...shadow.dock,
  },
  resetBtn: {
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 25,
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 14,
    color: C.ink,
  },
  searchActionBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    borderRadius: 25,
    backgroundColor: C.pine,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.pill,
  },
  searchActionText: {
    fontFamily: FONTS.uiBold,
    fontSize: 14.5,
    color: C.cream,
  },
});
