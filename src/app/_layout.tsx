import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableFreeze } from 'react-native-screens';

import AnimatedSplashScreen from '@/components/AnimatedSplashScreen';
import { BookingProvider } from '@/state/booking';
import { C, FONTS } from '@/theme';

// Disable react-freeze across all screens to ensure touch & scroll responders never freeze on navigation
enableFreeze(false);

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [splash, setSplash] = useState(true);
  // The same faces as the Serene Groups app, bundled locally (assets/fonts, SIL Open Font Licence).
  const [fontsReady, fontError] = useFonts({
    [FONTS.displayMedium]: require('@/assets/fonts/CormorantGaramond_500Medium.ttf'),
    [FONTS.displayItalic]: require('@/assets/fonts/CormorantGaramond_500Medium_Italic.ttf'),
    [FONTS.display]: require('@/assets/fonts/CormorantGaramond_600SemiBold.ttf'),
    [FONTS.displayBold]: require('@/assets/fonts/CormorantGaramond_700Bold.ttf'),
    [FONTS.ui]: require('@/assets/fonts/PlusJakartaSans_400Regular.ttf'),
    [FONTS.uiMedium]: require('@/assets/fonts/PlusJakartaSans_500Medium.ttf'),
    [FONTS.uiSemi]: require('@/assets/fonts/PlusJakartaSans_600SemiBold.ttf'),
    [FONTS.uiBold]: require('@/assets/fonts/PlusJakartaSans_700Bold.ttf'),
  });
  const ready = fontsReady || Boolean(fontError);

  useEffect(() => {
    // Hand over from the static native splash to the animated one once the type is ready.
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return <View style={{ flex: 1, backgroundColor: C.pine }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BookingProvider>
        <View style={{ flex: 1, backgroundColor: C.sand }}>
          <StatusBar style={splash ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: C.sand },
              animation: 'slide_from_right',
              freezeOnBlur: false,
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="room/[slug]" />
            <Stack.Screen name="book/[slug]" options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="booking/[ref]" options={{ animation: 'fade', gestureEnabled: false }} />
            <Stack.Screen name="stay" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="rates/[slug]" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="login" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="menu" options={{ presentation: 'transparentModal', animation: 'none', gestureEnabled: false, contentStyle: { backgroundColor: 'transparent' } }} />
            <Stack.Screen name="amenities" />
            <Stack.Screen name="floor-plans" />
            <Stack.Screen name="location" />
            <Stack.Screen name="find-booking" />
            <Stack.Screen name="reviews" />
          </Stack>
          {splash && <AnimatedSplashScreen onFinish={() => setSplash(false)} />}
        </View>
      </BookingProvider>
    </GestureHandlerRootView>
  );
}
