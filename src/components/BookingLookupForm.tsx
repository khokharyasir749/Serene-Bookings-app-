import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/Text';
import { normalizeRef, useBooking, type Booking } from '@/state/booking';
import { C, FONTS } from '@/theme';

type Tone = 'light' | 'dark';

/**
 * Reference + email lookup, as on the web's /manage — "No account needed". It never checks sign-in: it searches the
 * bookings by reference and the email they were made with. `onFound` receives the match.
 */
export default function BookingLookupForm({ onFound, tone = 'light', onFocusField, hideNote }: { onFound: (b: Booking) => void; tone?: Tone; onFocusField?: () => void; hideNote?: boolean }) {
  const { findBooking } = useBooking();
  const [reference, setReference] = useState('SH-4QK8TW'); // TESTING defaults — clear before production
  const [email, setEmail] = useState('guest@example.com');
  const [error, setError] = useState('');
  const [focus, setFocus] = useState<'ref' | 'email' | null>(null);
  const dark = tone === 'dark';

  const submit = () => {
    setError('');
    const ref = normalizeRef(reference);
    if (!/^SH-[A-Z0-9]{6}$/.test(ref)) return setError('Your reference looks like SH-XXXXXX');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Enter the email used to book');
    const b = findBooking(ref, email);
    if (!b) return setError('We couldn’t find a booking with those details. Check the reference and email, then try again.');
    onFound(b);
  };

  const field = (name: 'ref' | 'email') => [styles.input, dark && styles.inputDark, focus === name && (dark ? styles.focusDark : styles.focus)];
  const placeholder = dark ? 'rgba(236, 238, 237, 0.4)' : C.ink40;

  return (
    <View style={{ gap: 12 }}>
      {!hideNote && <Text style={[styles.note, dark && { color: C.cream70 }]}>No account needed — use your booking reference and the email you booked with.</Text>}
      <View>
        <Text style={[styles.label, dark && { color: C.cream45 }]}>BOOKING REFERENCE</Text>
        <TextInput
          value={reference}
          onChangeText={(v) => setReference(v.toUpperCase())}
          onFocus={() => {
            setFocus('ref');
            onFocusField?.();
          }}
          onBlur={() => setFocus(null)}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="next"
          placeholder="e.g. SH-4QK8TW"
          placeholderTextColor={placeholder}
          style={[...field('ref'), { letterSpacing: 2 }]}
        />
      </View>
      <View>
        <Text style={[styles.label, dark && { color: C.cream45 }]}>EMAIL ADDRESS</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          onFocus={() => {
            setFocus('email');
            onFocusField?.();
          }}
          onBlur={() => setFocus(null)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          returnKeyType="go"
          placeholder="you@example.com"
          placeholderTextColor={placeholder}
          onSubmitEditing={submit}
          style={field('email')}
        />
      </View>
      {!!error && (
        <View style={[styles.error, dark && styles.errorDark]}>
          <Ionicons name="alert-circle-outline" size={15} color={dark ? '#FFB4A8' : C.danger} />
          <Text style={[styles.errorText, dark && { color: '#FFB4A8' }]}>{error}</Text>
        </View>
      )}
      <Pressable onPress={submit} accessibilityRole="button" style={({ pressed }) => [styles.btn, dark && styles.btnDark, pressed && { opacity: 0.85 }]}>
        <Text style={[styles.btnText, dark && { color: C.pine }]}>FIND BOOKING</Text>
        <Ionicons name="arrow-forward-outline" size={16} color={dark ? C.pine : C.cream} />
      </Pressable>
      <View style={styles.demo}>
        <Text style={[styles.hint, dark && { color: C.cream45 }]} numberOfLines={1}>Demo: SH-4QK8TW · guest@example.com</Text>
        <Pressable onPress={() => { setReference('SH-4QK8TW'); setEmail('guest@example.com'); setError(''); }} accessibilityRole="button" accessibilityLabel="Fill demo booking" style={({ pressed }) => [styles.chip, dark && styles.chipDark, pressed && { opacity: 0.7 }]}>
          <Ionicons name="flash-outline" size={13} color={dark ? C.cream : C.pine} />
          <Text style={[styles.chipText, dark && { color: C.cream }]}>Fill demo</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  note: { fontFamily: FONTS.ui, fontSize: 13, lineHeight: 18, color: C.ink55 },
  label: { fontFamily: FONTS.uiBold, fontSize: 10, letterSpacing: 1.3, color: C.ink55, marginBottom: 6 },
  input: { height: 50, paddingHorizontal: 14, borderRadius: 14, backgroundColor: C.sand, borderWidth: 1.5, borderColor: 'transparent', fontFamily: FONTS.uiMedium, fontSize: 15.5, color: C.ink },
  inputDark: { backgroundColor: 'rgba(236, 238, 237, 0.08)', color: C.cream },
  focus: { borderColor: C.pine, backgroundColor: C.pureWhite },
  focusDark: { borderColor: C.gold, backgroundColor: 'rgba(236, 238, 237, 0.12)' },
  error: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, padding: 10, borderRadius: 10, backgroundColor: 'rgba(180, 35, 24, 0.07)' },
  errorDark: { backgroundColor: 'rgba(255, 180, 168, 0.1)' },
  errorText: { flex: 1, fontFamily: FONTS.uiMedium, fontSize: 12.5, color: C.danger },
  btn: { height: 52, borderRadius: 14, backgroundColor: C.pine, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  btnDark: { backgroundColor: C.cream },
  btnText: { fontFamily: FONTS.uiBold, fontSize: 12, letterSpacing: 2, color: C.cream },
  hint: { flexShrink: 1, fontFamily: FONTS.ui, fontSize: 11.5, color: C.ink55 },
  demo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 2 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, height: 28, borderRadius: 999, backgroundColor: C.snow },
  chipDark: { backgroundColor: 'rgba(236, 238, 237, 0.12)' },
  chipText: { fontFamily: FONTS.uiBold, fontSize: 11.5, color: C.pine },
});
