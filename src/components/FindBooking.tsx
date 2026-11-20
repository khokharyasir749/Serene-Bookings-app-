import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import BookingLookupForm from '@/components/BookingLookupForm';
import Drawer from '@/components/Drawer';
import { Text } from '@/components/Text';
import { C, FONTS, S, shadow } from '@/theme';

// "Find a booking" on Trips: tap the row and the lookup opens right underneath. No sign-in involved.
export default function FindBooking({ autoOpen }: { autoOpen?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(!!autoOpen);
  const turn = useSharedValue(autoOpen ? 1 : 0);
  const chevron = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.get() * 180}deg` }] }));

  useEffect(() => {
    turn.set(withTiming(open ? 1 : 0, { duration: 260 }));
  }, [open, turn]);

  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);

  return (
    <View style={styles.card}>
      <Pressable onPress={() => setOpen((o) => !o)} style={styles.head} accessibilityRole="button" accessibilityState={{ expanded: open }} accessibilityLabel="Find a booking">
        <View style={styles.icon}>
          <Ionicons name="search-outline" size={19} color={C.pine} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Find a booking</Text>
          <Text style={styles.sub}>Have a reference? No account needed.</Text>
        </View>
        <Animated.View style={chevron}>
          <Ionicons name="chevron-down-outline" size={18} color={C.ink55} />
        </Animated.View>
      </Pressable>

      <Drawer open={open}>
        <View style={{ paddingTop: 14 }}>
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
  card: { marginTop: 14, padding: 14, borderRadius: S.card, backgroundColor: C.pureWhite, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, ...shadow.card },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.snow, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: FONTS.display, fontSize: 18, lineHeight: 22, color: C.ink },
  sub: { fontFamily: FONTS.ui, fontSize: 12.5, color: C.ink55, marginTop: 1 },
});
