import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import SereneLogoMark from '@/components/SereneLogoMark';
import { Text } from '@/components/Text';
import { useBooking } from '@/state/booking';
import { C, FONTS, S, shadow } from '@/theme';

/**
 * Top bar, after the Serene Groups app (ExploreTopBar + AccountButton): the Pine crest, the serif wordmark and a clean
 * account pill — solid Pine to sign in, white with your initials once signed in. No gold rings.
 */
export default function BrandHeader() {
  const router = useRouter();
  const { user, signOut } = useBooking();

  const press = () =>
    user
      ? Alert.alert(`${user.firstName} ${user.lastName}`, user.email ?? user.phone ?? '', [
          { text: 'Close', style: 'cancel' },
          { text: 'Sign out', style: 'destructive', onPress: signOut },
        ])
      : router.push('/login');

  return (
    <View style={styles.row}>
      <SereneLogoMark size={42} color={C.pine} snow={C.cream} />
      <View style={{ flex: 1 }}>
        <Text style={styles.brand} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>SERENE HEIGHTS</Text>
        <Text style={styles.sub} numberOfLines={1}>BOOKINGS · NATHIA GALI</Text>
      </View>
      <Pressable onPress={press} accessibilityRole="button" accessibilityLabel={user ? 'Account' : 'Sign in'} style={({ pressed }) => [styles.pill, user ? styles.on : styles.off, pressed && styles.pressed]}>
        {user ? (
          <>
            <View style={styles.initials}>
              <Text style={styles.initialsText}>
                {user.firstName[0]}
                {user.lastName[0]}
              </Text>
            </View>
            <Text style={[styles.label, { color: C.pine }]}>{user.firstName}</Text>
          </>
        ) : (
          <>
            <Ionicons name="person-outline" size={15} color={C.cream} />
            <Text style={[styles.label, { color: C.pureWhite }]}>Sign in</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: S.gutter },
  brand: { color: C.ink, fontFamily: FONTS.display, fontSize: 19, letterSpacing: 1.3, lineHeight: 23 },
  sub: { color: C.ink55, fontFamily: FONTS.uiBold, fontSize: 9, letterSpacing: 1.8, marginTop: 1 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, paddingHorizontal: 12, height: 38, ...shadow.card },
  off: { backgroundColor: C.pine },
  on: { backgroundColor: C.pureWhite, paddingLeft: 5 },
  pressed: { opacity: 0.88, transform: [{ scale: 0.97 }] },
  label: { fontSize: 13, fontFamily: FONTS.uiBold },
  initials: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.pine, alignItems: 'center', justifyContent: 'center' },
  initialsText: { color: C.cream, fontSize: 11, fontFamily: FONTS.uiBold, letterSpacing: 0.5 },
});
