import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DockBridge, FloatingDock } from '@/components/GlassTabBar';
import { C } from '@/theme';

export default function TabsLayout() {
  return (
    <View style={styles.root}>
      <Tabs
        detachInactiveScreens={false}
        tabBar={(props) => <DockBridge {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: C.sand },
          freezeOnBlur: false,
          lazy: false, // build every tab up front, so the first tap on one doesn't stutter the dock
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Discover' }} />
        <Tabs.Screen name="apartments" options={{ title: 'Stay' }} />
        <Tabs.Screen name="trips" options={{ title: 'Trips' }} />
      </Tabs>
      <FloatingDock />
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: C.sand } });
