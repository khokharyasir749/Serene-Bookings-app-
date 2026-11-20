import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BookingLookupForm from '@/components/BookingLookupForm';
import { SectionTitle } from '@/components/kit';
import PageHeader from '@/components/PageHeader';
import { Text } from '@/components/Text';
import { useBooking } from '@/state/booking';
import { C, FONTS, S, T, shadow } from '@/theme';

const rise = (i: number) => FadeInDown.delay(60 + i * 70).duration(480).easing(Easing.bezier(0.22, 1, 0.36, 1));

// Find a booking, light and editorial like Amenities / Floor plans / Location: no account needed.
export default function FindBookingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, bookings } = useBooking();

  useEffect(() => {
    return () => {
      Keyboard.dismiss();
    };
  }, []);

  return (
    <View style={styles.root}>
      <PageHeader title="Find a booking" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          nestedScrollEnabled
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: S.gutter, paddingTop: 26, paddingBottom: insets.bottom + 40 }}
        >
          <Animated.View entering={rise(0)}>
            <Text style={T.eyebrow}>Manage your stay</Text>
            <Text style={[T.h1, { marginTop: 8 }]}>Your reservation, in a moment</Text>
            <Text style={[T.body, { marginTop: 10 }]}>Look up any booking with its reference and the email it was made with. No account needed.</Text>
          </Animated.View>

          <Animated.View entering={rise(1)} style={styles.card}>
            <View style={styles.cardHead}>
              <View style={styles.icon}>
                <Ionicons name="search-outline" size={18} color={C.cream} />
              </View>
              <Text style={styles.cardTitle}>Booking lookup</Text>
            </View>
            <BookingLookupForm
              hideNote
              onFound={(b) => {
                Keyboard.dismiss();
                router.replace({ pathname: '/booking/[ref]', params: { ref: b.reference } });
              }}
            />
          </Animated.View>

          <SectionTitle title="More options" style={{ marginTop: 26 }} />
          <Animated.View entering={rise(2)} style={styles.options}>
            {user ? (
              <Option
                icon="calendar-outline"
                title="View all my stays"
                sub={bookings.length ? `${bookings.length} reservation${bookings.length === 1 ? '' : 's'} on your account` : 'Your reservations appear here'}
                onPress={() => {
                  Keyboard.dismiss();
                  router.navigate('/trips');
                }}
              />
            ) : (
              <Option
                icon="person-outline"
                title="Sign in to view all stays"
                sub="See every reservation in one place"
                onPress={() => {
                  Keyboard.dismiss();
                  router.push('/login');
                }}
              />
            )}
            <Option
              icon="bed-outline"
              title="Explore apartments"
              sub="Plan a new stay"
              onPress={() => {
                Keyboard.dismiss();
                router.navigate('/apartments');
              }}
              last
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Option({ icon, title, sub, onPress, last }: { icon: React.ComponentProps<typeof Ionicons>['name']; title: string; sub: string; onPress: () => void; last?: boolean }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link" accessibilityLabel={title} style={({ pressed }) => [styles.opt, !last && styles.optLine, pressed && { opacity: 0.7 }]}>
      <View style={styles.optIcon}>
        <Ionicons name={icon} size={18} color={C.pine} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.optTitle}>{title}</Text>
        <Text style={styles.optSub}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={17} color={C.ink40} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.sand },
  card: { marginTop: 26, padding: 18, borderRadius: S.card, backgroundColor: C.pureWhite, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, ...shadow.card },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  icon: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.pine, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontFamily: FONTS.uiBold, fontSize: 17, color: C.ink },
  options: { marginTop: 12, borderRadius: S.card, backgroundColor: C.pureWhite, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, paddingHorizontal: 16 },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15 },
  optLine: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  optIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.sand, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  optTitle: { fontFamily: FONTS.uiSemi, fontSize: 15, color: C.ink },
  optSub: { fontFamily: FONTS.ui, fontSize: 12.5, color: C.ink55, marginTop: 2 },
});
