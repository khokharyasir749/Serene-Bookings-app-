import { BlurTargetView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { useRef, type ComponentRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { DockBridge, FloatingDock } from '@/components/GlassTabBar';
import { C } from '@/theme';

// As in the Serene Groups app: the screens live inside a BlurTargetView (what Android's blur samples), and the
// floating dock is drawn beside it so it blurs the page rather than itself.
export default function TabsLayout() {
  const blurTarget = useRef<ComponentRef<typeof View>>(null);
  return (
    <View style={styles.root}>
      <BlurTargetView ref={blurTarget} style={styles.root}>
        <Tabs tabBar={(props) => <DockBridge {...props} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: C.sand } }}>
          <Tabs.Screen name="index" options={{ title: 'Discover' }} />
          <Tabs.Screen name="apartments" options={{ title: 'Stay' }} />
          <Tabs.Screen name="trips" options={{ title: 'Trips' }} />
        </Tabs>
      </BlurTargetView>
      <FloatingDock blurTarget={blurTarget} />
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: C.sand } });
