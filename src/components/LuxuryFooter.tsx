import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import SereneLogoMark from '@/components/SereneLogoMark';
import { Text } from '@/components/Text';
import { CONTACT } from '@/data/contact';
import { C, FONTS, S } from '@/theme';

type Glyph = ComponentProps<typeof Ionicons>['name'];

const open = (href: string) => void Linking.openURL(href).catch(() => {});

function Row({ icon, label, value, href, last }: { icon: Glyph; label: string; value: string; href: string; last?: boolean }) {
  return (
    <Pressable onPress={() => open(href)} style={({ pressed }) => [styles.row, !last && styles.rowLine, pressed && styles.pressed]} accessibilityRole="link" accessibilityLabel={`${label}: ${value}`}>
      <View style={styles.disc}>
        <Ionicons name={icon} size={17} color={C.cream} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        <Text style={[styles.value, value.length > 32 && { fontSize: 12 }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
          {value}
        </Text>
      </View>
    </Pressable>
  );
}

/** A website as a button: the booking site is solid Pine with a gold arrow, the property site a Pine outline. */
function SiteButton({ icon, label, value, href, primary }: { icon: Glyph; label: string; value: string; href: string; primary?: boolean }) {
  const fg = primary ? C.cream : C.pine;
  return (
    <Pressable
      onPress={() => open(href)}
      accessibilityRole="link"
      accessibilityLabel={`${label}: ${value}`}
      style={({ pressed }) => [styles.site, primary ? styles.sitePrimary : styles.siteOutline, pressed && { opacity: 0.85, transform: [{ scale: 0.985 }] }]}>
      <Ionicons name={icon} size={19} color={primary ? C.gold : C.pine} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.siteLabel, { color: primary ? C.gold : C.ink55 }]}>{label.toUpperCase()}</Text>
        <Text style={[styles.siteValue, { color: fg }]} numberOfLines={1}>
          {value}
        </Text>
      </View>
      <View style={[styles.go, primary ? { backgroundColor: 'rgba(236, 238, 237, 0.14)' } : { backgroundColor: C.snow }]}>
        <Ionicons name="arrow-up-outline" size={14} color={primary ? C.gold : C.pine} style={{ transform: [{ rotate: '45deg' }] }} />
      </View>
    </Pressable>
  );
}

/** Discover's closing section: light, full-bleed and centred — crest, heading, contact lines, both sites as buttons, social. */
export default function LuxuryFooter({ bottomSpace }: { bottomSpace: number }) {
  return (
    // Extra bottom space keeps the footer and © line generously clear of the floating dock and scroll-to-top arrow.
    <View style={[styles.wrap, { paddingBottom: bottomSpace + 40 }]}>
      <View style={styles.head}>
        <SereneLogoMark size={44} />
        <Text style={styles.title}>Reservations & Concierge</Text>
        <Text style={styles.lede}>We reply on WhatsApp and by phone, seven days a week.</Text>
      </View>

      <View style={styles.group}>
        {CONTACT.lines.map((l, i) => (
          <Row key={l.label} icon={l.icon as Glyph} label={l.label} value={l.value} href={l.href} last={i === CONTACT.lines.length - 1} />
        ))}
      </View>

      <View style={styles.sites}>
        {CONTACT.sites.map((s, i) => (
          <SiteButton key={s.label} icon={s.icon as Glyph} label={s.label} value={s.value} href={s.href} primary={i === 0} />
        ))}
      </View>

      <View style={styles.social}>
        {CONTACT.social.map((s) => (
          <Pressable key={s.label} onPress={() => open(s.href)} hitSlop={6} style={({ pressed }) => [styles.socialBtn, pressed && styles.pressed]} accessibilityRole="link" accessibilityLabel={s.label}>
            <Ionicons name={s.icon as Glyph} size={17} color={C.pine} />
          </Pressable>
        ))}
      </View>
      <Text style={styles.small}>{`© ${new Date().getFullYear()} Serene Heights · DM Consortium`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 48, paddingTop: 36, paddingHorizontal: S.gutter, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  head: { alignItems: 'center' },
  title: { color: C.pine, fontFamily: FONTS.display, fontSize: 26, lineHeight: 30, textAlign: 'center', marginTop: 14 },
  lede: { color: C.ink55, fontFamily: FONTS.ui, fontSize: 13, lineHeight: 18.5, textAlign: 'center', marginTop: 6, maxWidth: 280 },
  group: { marginTop: 22, borderRadius: 20, backgroundColor: C.pureWhite, paddingHorizontal: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  rowLine: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  disc: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.pine, alignItems: 'center', justifyContent: 'center' },
  label: { color: C.ink55, fontFamily: FONTS.uiBold, fontSize: 9.5, letterSpacing: 1.3 },
  value: { color: C.ink, fontFamily: FONTS.uiSemi, fontSize: 14, marginTop: 1, fontVariant: ['tabular-nums'] },
  sites: { gap: 10, marginTop: 14 },
  site: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingLeft: 16, paddingRight: 12, borderRadius: 999 },
  sitePrimary: { backgroundColor: C.pine },
  siteOutline: { backgroundColor: C.pureWhite, borderWidth: 1.5, borderColor: C.pine },
  siteLabel: { fontFamily: FONTS.uiBold, fontSize: 9, letterSpacing: 1.4 },
  siteValue: { fontFamily: FONTS.uiSemi, fontSize: 14, marginTop: 1 },
  go: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  social: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 28 },
  socialBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.snow, alignItems: 'center', justifyContent: 'center' },
  small: { color: C.ink40, fontFamily: FONTS.ui, fontSize: 11.5, textAlign: 'center', marginTop: 16 },
  pressed: { opacity: 0.7 },
});
