import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, Lock } from '@/components/icons';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View, type ScrollViewInstance, type TextInputProps } from 'react-native';
import { Text } from '@/components/Text';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Chip } from '@/components/kit';
import PriceSummary from '@/components/PriceSummary';
import { BackBar, BookingSteps, Button } from '@/components/ui';
import { ARRIVAL_TIMES, ratePlan, roomType } from '@/data/catalog';
import { availability, money, quote } from '@/lib/stay';
import { useBooking, type Guest } from '@/state/booking';
import { C, F, FONTS, S, T } from '@/theme';

type Errors = Partial<Record<keyof Guest | 'acceptTerms', string>>;

function validate(g: Guest, accept: boolean): Errors {
  const e: Errors = {};
  if (g.firstName.trim().length < 2) e.firstName = 'Enter your first name';
  if (g.lastName.trim().length < 2) e.lastName = 'Enter your last name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g.email.trim())) e.email = 'Enter a valid email address';
  if (g.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid mobile number';
  if (!accept) e.acceptTerms = 'Please accept the booking conditions';
  return e;
}

// Step 2 of the funnel, as on the web's /book: lead guest, payment, confirm, with the price summary.
export default function Checkout() {
  const { slug, rate } = useLocalSearchParams<{ slug: string; rate: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stay, guest: known, user, createBooking } = useBooking();
  const t = roomType(slug ?? '');
  const plan = ratePlan(rate ?? '');

  const [g, setG] = useState<Guest>(known);

  // After signing in from here, fill any empty fields from the account.
  useEffect(() => {
    if (!user) return;
    setG((cur) => ({
      ...cur,
      firstName: cur.firstName || user.firstName,
      lastName: cur.lastName || user.lastName,
      email: cur.email || user.email || '',
      phone: cur.phone || user.phone || '',
    }));
  }, [user]);
  const [arrival, setArrival] = useState(ARRIVAL_TIMES[0]);
  const [requests, setRequests] = useState('');
  const [accept, setAccept] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const guestY = useRef(0);
  const confirmY = useRef(0);
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));

  if (!t || !plan) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: S.gutter }}>
        <Text style={{ fontFamily: F.display, fontSize: 24, color: C.ink }}>This rate isn’t available</Text>
        <Button label="Back to rates" style={{ marginTop: 20 }} onPress={() => router.back()} />
      </View>
    );
  }

  const q = quote(t, plan, stay);
  const av = availability(t, stay);
  const unavailable = av.soldOut || !av.fitsParty;
  const set = (k: keyof Guest) => (v: string) => {
    setG((cur) => ({ ...cur, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = () => {
    if (!user) {
      router.push({ pathname: '/login', params: { reason: 'booking' } });
      return;
    }
    const e = validate(g, accept);
    setErrors(e);
    if (Object.keys(e).length) {
      const fieldError = Object.keys(e).some((k) => k !== 'acceptTerms');
      scrollRef.current?.scrollTo({ y: Math.max(0, (fieldError ? guestY.current : confirmY.current) - 90), animated: true });
      shake.set(withSequence(withTiming(-8, { duration: 50 }), withTiming(8, { duration: 70 }), withTiming(-5, { duration: 60 }), withTiming(0, { duration: 60 })));
      return;
    }
    setSubmitting(true);
    // A short beat so the confirmation feels considered, not instant.
    setTimeout(() => {
      const b = createBooking({ slug: t.slug, code: plan.code, guest: g, arrivalTime: arrival !== ARRIVAL_TIMES[0] ? arrival : undefined, specialRequests: requests.trim() || undefined });
      if (router.canDismiss()) router.dismissAll();
      router.push({ pathname: '/booking/[ref]', params: { ref: b.reference, new: '1' } });
    }, 900);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.sand }}>
      <View style={[styles.barBg, { height: insets.top + 56 }]} />
      <BackBar onBack={() => router.back()} title="Complete booking" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scrollRef} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 72, paddingBottom: 28, paddingHorizontal: S.gutter }}>
          <BookingSteps current={2} />
          <Text style={[T.h1, { marginTop: 18 }]}>Complete your booking</Text>

          {!user && (
            <Pressable onPress={() => router.push({ pathname: '/login', params: { reason: 'booking' } })} style={styles.signin}>
              <View style={styles.well}>
                <Ionicons name="person-outline" size={18} color={C.pine} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.signTitle}>Sign in to book</Text>
                <Text style={[T.small, { marginTop: 2 }]}>We’ll fill in your details and keep this stay in Trips.</Text>
              </View>
              <View style={styles.signPill}>
                <Text style={styles.signPillText}>Sign in</Text>
              </View>
            </Pressable>
          )}

          <View style={{ marginTop: 20 }}>
            <PriceSummary stay={stay} roomName={t.name} plan={plan} q={q} />
          </View>

          {unavailable && (
            <View style={styles.warn}>
              <Text style={styles.payTitle}>No longer available</Text>
              <Text style={[T.small, { marginTop: 4 }]}>This apartment is sold out for your dates. Go back and choose another.</Text>
            </View>
          )}

          {/* 01 Lead guest */}
          <View onLayout={(e) => (guestY.current = e.nativeEvent.layout.y)} style={styles.card}>
            <StepHead n={1} title="Lead guest details" />
            <Text style={[T.small, { marginTop: 4 }]}>The name must match the CNIC or passport shown at check-in.</Text>
            <View style={styles.formTop}>
              <Field label="First name" value={g.firstName} onChangeText={set('firstName')} error={errors.firstName} autoComplete="given-name" />
              <Field label="Last name" value={g.lastName} onChangeText={set('lastName')} error={errors.lastName} autoComplete="family-name" />
              <Field label="Email" hint="Your confirmation goes here" value={g.email} onChangeText={set('email')} error={errors.email} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
              <Field label="Mobile number" hint="For WhatsApp updates from the front desk" value={g.phone} onChangeText={set('phone')} error={errors.phone} keyboardType="phone-pad" placeholder="+92 3xx xxxxxxx" />
              <Field label="Country of residence" value={g.country} onChangeText={set('country')} />
            </View>
            <Text style={styles.label}>Estimated arrival time</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingTop: 2, paddingBottom: 16 }}>
              {ARRIVAL_TIMES.map((a) => (
                <Chip key={a} label={a} active={arrival === a} onPress={() => setArrival(a)} />
              ))}
            </ScrollView>
            <Field label="Special requests (optional)" hint="Subject to availability, e.g. high floor, extra bedding, celebration" value={requests} onChangeText={setRequests} multiline />
          </View>

          {/* 02 Payment */}
          <View style={styles.card}>
            <StepHead n={2} title="How would you like to pay?" />
            <View style={[styles.pay, styles.payOn]}>
              <View style={styles.radio}><View style={styles.radioDot} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.payTitle}>Pay at the property</Text>
                <Text style={[T.small, { marginTop: 2 }]}>Cash or card at check-in. Nothing is charged now.</Text>
              </View>
            </View>
            <View style={[styles.pay, { opacity: 0.5 }]}>
              <View style={styles.radio} />
              <View style={{ flex: 1 }}>
                <Text style={styles.payTitle}>Card online</Text>
                <Text style={[T.small, { marginTop: 2 }]}>Coming soon</Text>
              </View>
            </View>
          </View>

          {/* 03 Confirm */}
          <Animated.View onLayout={(e) => (confirmY.current = e.nativeEvent.layout.y)} style={[styles.card, shakeStyle]}>
            <StepHead n={3} title="Confirm" />
            <Pressable onPress={() => { setAccept((a) => !a); setErrors((e) => ({ ...e, acceptTerms: undefined })); }} style={styles.terms}>
              <View style={[styles.box, accept && { backgroundColor: C.pine, borderColor: C.pine }]}>{accept && <Animated.View entering={FadeIn.duration(150)}><Check size={13} color={C.cream} strokeWidth={2.5} /></Animated.View>}</View>
              <Text style={[T.small, { flex: 1, color: C.ink70 }]}>
                I agree to the booking conditions: {plan.refundable ? `free cancellation until ${plan.freeCancelHours} hours before check-in` : 'this rate is non-refundable'}, and the house rules (check-in from 2:00 PM, check-out until 12:00 PM, valid ID required).
              </Text>
            </Pressable>
            {errors.acceptTerms && <Text style={styles.error}>{errors.acceptTerms}</Text>}
            {Object.keys(errors).some((k) => errors[k as keyof Errors]) && !errors.acceptTerms && <Text style={styles.error}>Please check the details above.</Text>}
            <Text style={[T.small, { marginTop: 14, fontSize: 12 }]}>No payment is taken now. You’ll pay at the property.</Text>
          </Animated.View>
        </ScrollView>
        <View style={[styles.bottom, { paddingBottom: insets.bottom + 12 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.total}>{money(q.grandTotal)}</Text>
            <Text style={[T.small, { fontSize: 12 }]}>Total incl. taxes · pay at property</Text>
          </View>
          <Button label={submitting ? 'Confirming…' : 'Confirm booking'} disabled={submitting || unavailable} onPress={submit} icon={<Lock size={14} color={C.cream} strokeWidth={1.75} />} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function StepHead({ n, title }: { n: number; title: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View style={styles.stepNo}>
        <Text style={styles.stepNoText}>{n}</Text>
      </View>
      <Text style={styles.h3}>{title}</Text>
    </View>
  );
}

function Field({ label, hint, error, multiline, ...rest }: TextInputProps & { label: string; hint?: string; error?: string }) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...rest}
        multiline={multiline}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholderTextColor={C.ink40}
        style={[styles.input, multiline && { minHeight: 84, textAlignVertical: 'top' }, focus && { borderColor: C.pine }, error && { borderColor: C.danger }]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={[T.small, { fontSize: 11.5, marginTop: 5 }]}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  barBg: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 15, backgroundColor: C.sand, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  signin: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16, padding: 14, borderRadius: S.card, backgroundColor: C.pureWhite, borderWidth: 1, borderColor: C.line },
  well: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.sand, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  signTitle: { fontFamily: FONTS.uiBold, fontSize: 15, color: C.ink },
  signPill: { height: 34, paddingHorizontal: 14, borderRadius: 999, backgroundColor: C.pine, justifyContent: 'center' },
  signPillText: { fontFamily: FONTS.uiBold, fontSize: 12.5, color: C.cream },
  card: { backgroundColor: C.pureWhite, padding: 18, marginTop: 16, borderRadius: S.card, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  stepNo: { width: 26, height: 26, borderRadius: 13, backgroundColor: C.pine, alignItems: 'center', justifyContent: 'center' },
  stepNoText: { fontFamily: FONTS.uiBold, fontSize: 12, color: C.cream },
  h3: { flex: 1, fontFamily: FONTS.uiBold, fontSize: 17, color: C.ink },
  label: { fontFamily: FONTS.uiSemi, fontSize: 13, color: C.ink, marginBottom: 8 },
  formTop: { marginTop: 16, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  input: { fontFamily: FONTS.uiMedium, borderWidth: 1, borderColor: C.line, paddingHorizontal: 14, minHeight: 50, paddingVertical: 12, fontSize: 15, color: C.ink, backgroundColor: C.pureWhite, borderRadius: 14 },
  error: { color: C.danger, fontSize: 12, marginTop: 5, fontFamily: FONTS.uiMedium },
  pay: { flexDirection: 'row', gap: 14, alignItems: 'center', padding: 14, marginTop: 12, borderWidth: 1, borderColor: C.line, borderRadius: 16 },
  payOn: { borderColor: C.pine, borderWidth: 1.5 },
  payTitle: { fontFamily: FONTS.uiSemi, fontSize: 15, color: C.ink },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: C.lineStrong, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: C.pine },
  terms: { flexDirection: 'row', gap: 12, marginTop: 16, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  box: { width: 22, height: 22, borderRadius: 7, borderWidth: 1.5, borderColor: C.lineStrong, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  bottom: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: S.gutter, paddingTop: 12, backgroundColor: C.pureWhite, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  total: { fontFamily: FONTS.uiBold, fontSize: 18, color: C.ink, fontVariant: ['tabular-nums'] },
  warn: { marginTop: 16, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(180, 35, 24, 0.3)', backgroundColor: 'rgba(180, 35, 24, 0.05)' },
});
