import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/Text';
import { Photo } from '@/components/ui';
import { C, FONTS, S, shadow } from '@/theme';

// Shared building blocks for the booking UI: clean white cards, outlined chips, sans section titles,
// icon spec chips, rating bars and a pinned total bar. One vocabulary for every screen.

export type IconName = ComponentProps<typeof Ionicons>['name'];

/** Sentence-case section title with an optional grey sub line and a "See all" style action. */
export function SectionTitle({ title, sub, action, onAction, style }: { title: string; sub?: string; action?: string; onAction?: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.sectionRow, style]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {!!sub && <Text style={styles.sectionSub}>{sub}</Text>}
      </View>
      {!!action && (
        <Pressable onPress={onAction} hitSlop={10} accessibilityRole="link" style={styles.sectionAction}>
          <Text style={styles.sectionActionText}>{action}</Text>
          <Ionicons name="chevron-forward" size={14} color={C.pine} />
        </Pressable>
      )}
    </View>
  );
}

/** Outlined pill; filled Pine when active. Optional leading icon and trailing chevron (a dropdown filter). */
export function Chip({ label, icon, active, chevron, onPress, style }: { label: string; icon?: IconName; active?: boolean; chevron?: boolean; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const fg = active ? C.cream : C.ink;
  return (
    <Pressable onPress={onPress} disabled={!onPress} accessibilityRole="button" accessibilityState={{ selected: !!active }} style={({ pressed }) => [styles.chip, active && styles.chipOn, pressed && { opacity: 0.8 }, style]}>
      {icon && <Ionicons name={icon} size={15} color={fg} />}
      <Text style={[styles.chipText, { color: fg }]} numberOfLines={1}>{label}</Text>
      {chevron && <Ionicons name="chevron-down" size={14} color={fg} />}
    </Pressable>
  );
}

/** Small outlined spec chip with an icon: "480–594 sq ft", "3 guests", "1 double bed". */
export function SpecChip({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.spec}>
      <Ionicons name={icon} size={13} color={C.ink70} />
      <Text style={styles.specText} numberOfLines={1}>{label}</Text>
    </View>
  );
}

/** Small light tag that sits on a photo ("Summer", "Only 2 left"). */
export function PhotoTag({ label, icon, style }: { label: string; icon?: IconName; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.tag, style]}>
      {icon && <Ionicons name={icon} size={11} color={C.ink} />}
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
}

/** Gold star, score and review count. */
export function Rating({ score, count, size = 13, light }: { score: number; count?: number; size?: number; light?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Ionicons name="star" size={size} color={C.gold} />
      <Text style={{ fontFamily: FONTS.uiBold, fontSize: size, color: light ? C.pureWhite : C.ink }}>{score.toFixed(1)}</Text>
      {count !== undefined && <Text style={{ fontFamily: FONTS.ui, fontSize: size - 0.5, color: light ? 'rgba(255,255,255,0.85)' : C.ink55 }}>({count} reviews)</Text>}
    </View>
  );
}

/** A labelled horizontal bar with its value, for review breakdowns. */
export function ScoreBar({ label, value, max = 5, right }: { label: string; value: number; max?: number; right?: string }) {
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <View style={styles.bar}>
      <Text style={styles.barLabel} numberOfLines={1}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct * 100}%` }]} />
      </View>
      <Text style={styles.barValue}>{right ?? value.toFixed(1)}</Text>
    </View>
  );
}

/** Four photo thumbnails; the last one shows "+N more" over a dark veil. */
export function ThumbStrip({ photos, onOpen }: { photos: string[]; onOpen: (i: number) => void }) {
  const shown = photos.slice(0, 4);
  const extra = photos.length - shown.length;
  return (
    <View style={styles.thumbs}>
      {shown.map((p, i) => (
        <Pressable key={p} onPress={() => onOpen(i)} style={styles.thumb} accessibilityLabel={`Photo ${i + 1}`}>
          <Photo src={p} style={StyleSheet.absoluteFill} />
          {i === shown.length - 1 && extra > 0 && (
            <View style={styles.thumbMore}>
              <Text style={styles.thumbMoreText}>{extra} more</Text>
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
}

/** White card surface. */
export function Card({ children, style, pad = 16 }: { children: ReactNode; style?: StyleProp<ViewStyle>; pad?: number }) {
  return <View style={[styles.card, { padding: pad }, style]}>{children}</View>;
}

/** An icon well + label + value row, for summaries. */
export function InfoRow({ icon, label, value, onPress, last }: { icon: IconName; label: string; value: string; onPress?: () => void; last?: boolean }) {
  const body = (
    <>
      <View style={styles.well}>
        <Ionicons name={icon} size={17} color={C.pine} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={2}>{value}</Text>
      </View>
      {onPress && <Ionicons name="chevron-forward" size={16} color={C.ink40} />}
    </>
  );
  const st = [styles.info, !last && styles.infoLine];
  return onPress ? (
    <Pressable onPress={onPress} style={({ pressed }) => [...st, pressed && { opacity: 0.7 }]}>
      {body}
    </Pressable>
  ) : (
    <View style={st}>{body}</View>
  );
}

/** Pinned bottom bar: price on the left, the main action on the right. */
export function StickyBar({ title, sub, children, bottom }: { title: ReactNode; sub?: ReactNode; children: ReactNode; bottom: number }) {
  return (
    <View style={[styles.sticky, { paddingBottom: bottom + 12 }]}>
      <View style={{ flex: 1 }}>
        {typeof title === 'string' ? <Text style={styles.stickyTitle}>{title}</Text> : title}
        {typeof sub === 'string' ? <Text style={styles.stickySub} numberOfLines={1}>{sub}</Text> : sub}
      </View>
      {children}
    </View>
  );
}

export const kit = StyleSheet.create({
  /** A white input with a hairline border, like the search sheet's fields. */
  input: { height: 52, paddingHorizontal: 16, borderRadius: 14, backgroundColor: C.pureWhite, borderWidth: 1, borderColor: C.line, fontFamily: FONTS.uiMedium, fontSize: 15.5, color: C.ink },
  inputFocus: { borderColor: C.pine },
  fieldLabel: { fontFamily: FONTS.uiSemi, fontSize: 13, color: C.ink, marginBottom: 8 },
});

const styles = StyleSheet.create({
  sectionRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  sectionTitle: { fontFamily: FONTS.uiBold, fontSize: 17, lineHeight: 22, color: C.ink, letterSpacing: -0.1 },
  sectionSub: { fontFamily: FONTS.ui, fontSize: 12.5, lineHeight: 17, color: C.ink55, marginTop: 2 },
  sectionAction: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingVertical: 2 },
  sectionActionText: { fontFamily: FONTS.uiSemi, fontSize: 13, color: C.pine },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 38, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: C.pureWhite },
  chipOn: { backgroundColor: C.pine, borderColor: C.pine },
  chipText: { fontFamily: FONTS.uiSemi, fontSize: 13 },
  spec: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 28, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: C.pureWhite },
  specText: { fontFamily: FONTS.uiMedium, fontSize: 11.5, color: C.ink70 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', height: 24, paddingHorizontal: 9, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.94)' },
  tagText: { fontFamily: FONTS.uiSemi, fontSize: 11, color: C.ink },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 5 },
  barLabel: { width: 112, fontFamily: FONTS.uiMedium, fontSize: 13, color: C.ink70 },
  barTrack: { flex: 1, height: 5, borderRadius: 3, backgroundColor: C.snow, overflow: 'hidden' },
  barFill: { height: 5, borderRadius: 3, backgroundColor: C.pine },
  barValue: { width: 30, textAlign: 'right', fontFamily: FONTS.uiBold, fontSize: 13, color: C.ink, fontVariant: ['tabular-nums'] },
  thumbs: { flexDirection: 'row', gap: 8 },
  thumb: { flex: 1, aspectRatio: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: C.snow },
  thumbMore: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  thumbMoreText: { fontFamily: FONTS.uiBold, fontSize: 12.5, color: C.pureWhite },
  card: { borderRadius: S.card, backgroundColor: C.pureWhite, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, ...shadow.card },
  info: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 },
  infoLine: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  well: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.sand, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontFamily: FONTS.ui, fontSize: 12, color: C.ink55 },
  infoValue: { fontFamily: FONTS.uiSemi, fontSize: 14.5, color: C.ink, marginTop: 1 },
  sticky: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: S.gutter, paddingTop: 12, backgroundColor: C.pureWhite, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  stickyTitle: { fontFamily: FONTS.uiBold, fontSize: 18, color: C.ink, fontVariant: ['tabular-nums'] },
  stickySub: { fontFamily: FONTS.ui, fontSize: 12, color: C.ink55, marginTop: 1 },
});
