import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import SereneLogoMark from '@/components/SereneLogoMark';
import { Text } from '@/components/Text';
import { PressableScale } from '@/components/ui';
import { CONTACT, MAPS_LINK } from '@/data/contact';
import { C, FONTS, S, shadow } from '@/theme';

type Glyph = ComponentProps<typeof Ionicons>['name'];

const open = (href: string) => void Linking.openURL(href).catch(() => {});

/**
 * Flagship Alpine Concierge Lounge (Editorial Bento Architecture)
 * Consolidates Online Reservations, WhatsApp, Phone, Email, Location & Group Portals
 * into one cohesive, beautifully organized luxury suite.
 */
export default function LuxuryFooter({ bottomSpace }: { bottomSpace: number }) {
  const currentYear = new Date().getFullYear();

  const bookingSite = CONTACT.sites[0];
  const groupSite = CONTACT.sites[1];
  const whatsappLine = CONTACT.lines.find((l) => l.label === 'WhatsApp') ?? CONTACT.lines[0];
  const phoneLine = CONTACT.lines.find((l) => l.label === 'Reservations') ?? CONTACT.lines[1];
  const emailLine = CONTACT.lines.find((l) => l.label === 'Email') ?? CONTACT.lines[2];

  return (
    <View style={[styles.wrap, { paddingBottom: bottomSpace + 50 }]}>
      {/* Editorial Gold Ornament Divider */}
      <View style={styles.ornamentDivider}>
        <View style={styles.dividerLine} />
        <View style={styles.ornamentCenter}>
          <Ionicons name="sparkles" size={11} color={C.gold} />
        </View>
        <View style={styles.dividerLine} />
      </View>

      {/* Header with Crest */}
      <View style={styles.head}>
        <View style={styles.crestCircle}>
          <SereneLogoMark size={44} color={C.pine} snow={C.gold} />
        </View>
        <Text style={styles.eyebrow}>BESPOKE ALPINE SERVICE</Text>
        <Text style={styles.title}>Reservations & Concierge</Text>
        <Text style={styles.lede}>
          Your dedicated mountain hosts in Nathia Gali, available seven days a week.
        </Text>
      </View>

      {/* ── FLAGSHIP MASTER CONCIERGE BENTO CARD ── */}
      <View style={styles.masterCard}>
        {/* Top Hero: Direct Online Reservation Invitation */}
        <PressableScale
          onPress={() => open(bookingSite.href)}
          scaleTo={0.985}
          style={styles.heroBookingBanner}
          accessibilityRole="link"
          accessibilityLabel={`Book suite online: ${bookingSite.value}`}
        >
          <View style={styles.heroBannerHeader}>
            <View style={styles.heroBadgeRow}>
              <View style={styles.goldDot} />
              <Text style={styles.heroKicker}>OFFICIAL BOOKING PORTAL</Text>
            </View>
            <View style={styles.ratePill}>
              <Ionicons name="shield-checkmark" size={10} color={C.gold} style={{ marginRight: 3.5 }} />
              <Text style={styles.ratePillText}>Best Rates</Text>
            </View>
          </View>

          <View style={styles.heroBannerBody}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.heroBannerTitle}>Reserve Your Mountain Suite</Text>
              <Text style={styles.heroBannerUrl} numberOfLines={1}>
                {bookingSite.value}
              </Text>
            </View>
            <View style={styles.heroCtaBtn}>
              <Ionicons name="arrow-forward" size={15} color={C.pine} />
            </View>
          </View>
        </PressableScale>

        {/* Subtle Inset Divider */}
        <View style={styles.cardDivider} />

        {/* Middle: 2-Column Responsive Concierge Bento Tiles */}
        <View style={styles.bentoGrid}>
          {/* Tile 1: WhatsApp Direct */}
          <PressableScale
            onPress={() => open(whatsappLine.href)}
            scaleTo={0.975}
            style={styles.bentoTile}
            accessibilityRole="link"
            accessibilityLabel={`WhatsApp Concierge: ${whatsappLine.value}`}
          >
            <View style={styles.tileHeader}>
              <View style={styles.waDisc}>
                <Ionicons name="logo-whatsapp" size={16} color="#1D7348" />
              </View>
              <View style={styles.liveChip}>
                <View style={styles.liveDot} />
                <Text style={styles.liveChipText}>24/7</Text>
              </View>
            </View>
            <Text style={styles.tileLabel}>WHATSAPP</Text>
            <Text style={styles.tileValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
              {whatsappLine.value}
            </Text>
            <View style={styles.tileActionRow}>
              <Text style={styles.tileActionText}>Instant Chat</Text>
              <Ionicons name="chevron-forward" size={11} color={C.gold} />
            </View>
          </PressableScale>

          {/* Tile 2: Phone Reservations */}
          <PressableScale
            onPress={() => open(phoneLine.href)}
            scaleTo={0.975}
            style={styles.bentoTile}
            accessibilityRole="link"
            accessibilityLabel={`Call Reservations: ${phoneLine.value}`}
          >
            <View style={styles.tileHeader}>
              <View style={styles.phoneDisc}>
                <Ionicons name="call" size={15} color={C.gold} />
              </View>
              <View style={styles.deskChip}>
                <Text style={styles.deskChipText}>Direct</Text>
              </View>
            </View>
            <Text style={styles.tileLabel}>RESERVATIONS</Text>
            <Text style={styles.tileValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
              {phoneLine.value}
            </Text>
            <View style={styles.tileActionRow}>
              <Text style={styles.tileActionText}>Call Desk</Text>
              <Ionicons name="chevron-forward" size={11} color={C.gold} />
            </View>
          </PressableScale>
        </View>

        {/* Bottom Sub-Strip: Email & Corporate Portfolio */}
        <View style={styles.cardDivider} />

        <View style={styles.bottomSubStrip}>
          {/* Email Action */}
          <PressableScale
            onPress={() => open(emailLine.href)}
            scaleTo={0.98}
            style={styles.subStripAction}
            accessibilityRole="link"
            accessibilityLabel={`Email Concierge: ${emailLine.value}`}
          >
            <View style={styles.stripIconWell}>
              <Ionicons name="mail" size={13} color={C.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stripLabel}>PRIVATE INQUIRIES</Text>
              <Text style={styles.stripValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
                {emailLine.value}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={13} color="rgba(200, 164, 106, 0.7)" />
          </PressableScale>

          {/* Group Portfolio Link */}
          <PressableScale
            onPress={() => open(groupSite.href)}
            scaleTo={0.98}
            style={styles.groupLinkRow}
            accessibilityRole="link"
            accessibilityLabel={`The Serene Group: ${groupSite.value}`}
          >
            <Ionicons name="globe-outline" size={12} color="rgba(236, 238, 237, 0.6)" style={{ marginRight: 6 }} />
            <Text style={styles.groupLinkText}>
              The Serene Group Portfolio · <Text style={{ color: C.gold }}>{groupSite.value}</Text>
            </Text>
            <Ionicons name="arrow-up-outline" size={10} color={C.gold} style={{ transform: [{ rotate: '45deg' }], marginLeft: 3 }} />
          </PressableScale>
        </View>
      </View>

      {/* ── RESORT LOCATION PILL ── */}
      <PressableScale
        onPress={() => open(MAPS_LINK)}
        scaleTo={0.985}
        style={styles.locationPill}
        accessibilityRole="link"
        accessibilityLabel="View Serene Heights location on Google Maps"
      >
        <Ionicons name="location" size={13} color={C.gold} style={{ marginRight: 5 }} />
        <Text style={styles.locationText} numberOfLines={1}>
          Kala Bagh Air Base Road · Nathia Gali (7,906 ft)
        </Text>
        <Ionicons name="open-outline" size={11} color={C.pine} style={{ marginLeft: 5, opacity: 0.6 }} />
      </PressableScale>

      {/* ── LUXURY SOCIAL CHANNELS ── */}
      <View style={styles.socialRow}>
        {CONTACT.social.map((s) => (
          <PressableScale
            key={s.label}
            onPress={() => open(s.href)}
            scaleTo={0.93}
            style={styles.socialBtn}
            accessibilityRole="link"
            accessibilityLabel={s.label}
          >
            <Ionicons name={s.icon as Glyph} size={18} color={C.pine} />
          </PressableScale>
        ))}
      </View>

      {/* ── RESORT HERITAGE & FOOTNOTE ── */}
      <View style={styles.footerFootnote}>
        <Text style={styles.resortTitle}>SERENE HEIGHTS RESORT & RESIDENCES</Text>
        <Text style={styles.footnoteLine}>
          {`A DM Consortium Alpine Development · © ${currentYear}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 56,
    paddingTop: 28,
    paddingHorizontal: S.gutter,
  },
  ornamentDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(200, 164, 106, 0.28)',
  },
  ornamentCenter: {
    paddingHorizontal: 14,
  },
  head: {
    alignItems: 'center',
  },
  crestCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(200, 164, 106, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    ...shadow.pill,
  },
  eyebrow: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 2,
    color: C.gold,
    marginBottom: 6,
  },
  title: {
    color: C.pine,
    fontFamily: FONTS.display,
    fontSize: 28,
    lineHeight: 33,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  lede: {
    color: C.ink55,
    fontFamily: FONTS.ui,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 7,
    maxWidth: 300,
  },

  /* ── MASTER CARD ── */
  masterCard: {
    marginTop: 26,
    borderRadius: 24,
    backgroundColor: C.pine,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.35)',
    padding: 16,
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 22,
    elevation: 5,
  },

  /* Hero Booking Banner */
  heroBookingBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.25)',
  },
  heroBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goldDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: C.gold,
    marginRight: 6,
  },
  heroKicker: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    letterSpacing: 1.4,
    color: C.gold,
  },
  ratePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 999,
    backgroundColor: 'rgba(200, 164, 106, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.32)',
  },
  ratePillText: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    color: C.gold,
    letterSpacing: 0.3,
  },
  heroBannerBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroBannerTitle: {
    fontFamily: FONTS.display,
    fontSize: 19,
    lineHeight: 23,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  heroBannerUrl: {
    fontFamily: FONTS.uiMedium,
    fontSize: 11.5,
    color: 'rgba(236, 238, 237, 0.65)',
    marginTop: 2.5,
  },
  heroCtaBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(200, 164, 106, 0.18)',
    marginVertical: 14,
  },

  /* 2-Column Bento Grid */
  bentoGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  bentoTile: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.2)',
    padding: 12,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  waDisc: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(29, 115, 72, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(29, 115, 72, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneDisc: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(200, 164, 106, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(29, 115, 72, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(29, 115, 72, 0.35)',
  },
  liveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#25D366',
    marginRight: 3.5,
  },
  liveChipText: {
    fontFamily: FONTS.uiBold,
    fontSize: 8,
    color: '#25D366',
    letterSpacing: 0.3,
  },
  deskChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(200, 164, 106, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.25)',
  },
  deskChipText: {
    fontFamily: FONTS.uiBold,
    fontSize: 8,
    color: C.gold,
    letterSpacing: 0.3,
  },
  tileLabel: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    letterSpacing: 1.2,
    color: 'rgba(236, 238, 237, 0.55)',
  },
  tileValue: {
    fontFamily: FONTS.uiSemi,
    fontSize: 12.5,
    color: '#FFFFFF',
    marginTop: 2.5,
    fontVariant: ['tabular-nums'],
  },
  tileActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(200, 164, 106, 0.15)',
  },
  tileActionText: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    color: C.gold,
  },

  /* Bottom Sub-Strip */
  bottomSubStrip: {
    gap: 10,
  },
  subStripAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.18)',
  },
  stripIconWell: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(200, 164, 106, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripLabel: {
    fontFamily: FONTS.uiBold,
    fontSize: 8,
    letterSpacing: 1.2,
    color: C.gold,
  },
  stripValue: {
    fontFamily: FONTS.uiSemi,
    fontSize: 11.5,
    color: '#FFFFFF',
    marginTop: 1,
  },
  groupLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  groupLinkText: {
    fontFamily: FONTS.uiMedium,
    fontSize: 10.5,
    color: 'rgba(236, 238, 237, 0.7)',
  },

  /* Location Pill */
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(200, 164, 106, 0.09)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.25)',
    maxWidth: '92%',
  },
  locationText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 11,
    color: C.pine,
    letterSpacing: 0.2,
  },

  /* Social */
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginTop: 18,
  },
  socialBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  /* Footnote */
  footerFootnote: {
    alignItems: 'center',
    marginTop: 22,
    gap: 4,
  },
  resortTitle: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 1.8,
    color: C.pine,
    textAlign: 'center',
    opacity: 0.85,
  },
  footnoteLine: {
    fontFamily: FONTS.ui,
    fontSize: 11,
    color: C.ink40,
    textAlign: 'center',
  },
});
