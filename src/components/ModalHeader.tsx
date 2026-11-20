import { X } from '@/components/icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, FONTS, S } from '@/theme';

// Header for full-screen modals: a close button and a centred title.
export default function ModalHeader({ title, onClose, right }: { title: string; onClose: () => void; right?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 8 }]}>
      <View style={styles.side}>{right}</View>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close" style={styles.close}>
        <X size={18} color={C.ink} strokeWidth={1.75} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.gutter - 4, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line, backgroundColor: C.sand },
  close: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: C.pureWhite, borderWidth: 1, borderColor: C.line },
  title: { flex: 1, textAlign: 'center', fontFamily: FONTS.uiSemi, fontSize: 16, color: C.ink },
  side: { width: 40, alignItems: 'flex-start' },
});
