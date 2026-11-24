import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from '@/lib/nav';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import BookingLookupForm from '@/components/BookingLookupForm';
import Drawer from '@/components/Drawer';
import { Text } from '@/components/Text';
import { C, FONTS } from '@/theme';

/**
 * Editorial Booking Lookup Drawer:
 * Clean, minimalist, zero clunky grey blobs, seamless drawer expansion.
 */
export default function FindBooking({ autoOpen }: { autoOpen?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(!!autoOpen);
  const turn = useSharedValue(autoOpen ? 1 : 0);
  const chevron = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.get() * 180}deg` }] }));

  useEffect(() => {
    turn.set(withTiming(open ? 1 : 0, { duration: 240 }));
  }, [open, turn]);

  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);

  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        style={styles.head}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel="Look up a reservation"
      >
        <View style={styles.iconWell}>
          <Ionicons name="search-outline" size={17} color={C.pine} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Look up a reservation</Text>
          <Text style={styles.sub}>Have a booking reference? No account needed.</Text>
        </View>
        <Animated.View style={chevron}>
          <Ionicons name="chevron-down" size={16} color={C.ink55} />
        </Animated.View>
      </Pressable>

      <Drawer open={open}>
        <View style={styles.drawerContent}>
          <BookingLookupForm
            onFound={(b) => {
              setOpen(false);
              router.push({ pathname: '/booking/[ref]', params: { ref: b.reference } });
            }}
          />
        </View>
      </Drawer>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: C.line,
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(18, 53, 36, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 20,
    lineHeight: 24,
    color: C.pine,
    letterSpacing: -0.2,
  },
  sub: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    color: C.ink55,
    marginTop: 2,
  },
  drawerContent: {
    paddingTop: 16,
    marginTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
  },
});
