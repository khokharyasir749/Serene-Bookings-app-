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
 * Flagship Luxury Concierge & Heritage Pavilion
 * Benchmarking Aman Resorts, Four Seasons & Airbnb Luxe
 * Integrates Direct Suite Reservations, 2-Column High-Contrast Concierge Grid,
 * Integrated Location & Map Link, and Corporate Group Portfolio.
 */
export default function LuxuryFooter({ bottomSpace = 0 }: { bottomSpace?: number }) {
  const currentYear = new Date().getFullYear();

  const bookingSite = CONTACT.sites[0];
  const groupSite = CONTACT.sites[1];
  const whatsappLine = CONTACT.lines.find((l) => l.label === 'WhatsApp') ?? CONTACT.lines[0];
  const phoneLine = CONTACT.lines.find((l) => l.label === 'Reservations') ?? CONTACT.lines[1];
  const emailLine = CONTACT.lines.find((l) => l.label === 'Email') ?? CONTACT.lines[2];

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(bottomSpace, 40) }]}>
      {/* Editorial Gold Ornament Divider */}
      <View style={styles.ornamentDivider}>
        <View style={styles.dividerLine} />
        <View style={styles.ornamentCenter}>
          <Ionicons name="sparkles" size={12} color={C.gold} />
        </View>
        <View style={styles.dividerLine} />
      </View>

      {/* Editorial Header with Crest */}
      <View style={styles.head}>
        <View style={styles.crestContainer}>
          <SereneLogoMark size={48} color={C.pine} snow={C.gold} />
        </View>
        <Text style={styles.eyebrow}>CONCIERGE & PRIVATE INQUIRIES</Text>
        <Text style={styles.title}>Reservations & Concierge</Text>
        <Text style={styles.lede}>
          Dedicated alpine hospitality · Available seven days a week for suite bookings, private dining, and airport transfers.
        </Text>
      </View>

      {/* ── 1. PRIMARY SUITE BOOKING BANNER (Deep Forest Pine & Gold) ── */}
      <PressableScale
        onPress={() => open(bookingSite.href)}
        scaleTo={0.985}
        style={styles.heroBookingCard}
        accessibilityRole="link"
        accessibilityLabel={`Book suite online: ${bookingSite.value}`}
      >
        <View style={styles.bookingTopRow}>
          <View style={styles.bookingKickerRow}>
            <View style={styles.goldDot} />
            <Text style={styles.bookingKicker}>OFFICIAL RESERVATION PORTAL</Text>
          </View>
          <View style={styles.rateBadge}>
            <Ionicons name="shield-checkmark" size={11} color={C.gold} style={{ marginRight: 4 }} />
            <Text style={styles.rateBadgeText}>Best Rate Guarantee</Text>
          </View>
        </View>

        <Text style={styles.bookingTitle}>Reserve Your Mountain Residence</Text>
        <Text style={styles.bookingSub}>
          Instant confirmation · Direct resort privileges · G1 to 8th floor suites
        </Text>

        <View style={styles.bookingBottomRow}>
          <View style={styles.urlPill}>
            <Ionicons name="calendar-outline" size={13} color={C.gold} style={{ marginRight: 6 }} />
            <Text style={styles.urlText} numberOfLines={1}>
              {bookingSite.value}
            </Text>
          </View>

          <View style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Book Online</Text>
            <Ionicons name="arrow-forward" size={13} color={C.pine} style={{ marginLeft: 4 }} />
          </View>
        </View>
      </PressableScale>

      {/* ── 2. CONCIERGE DESK LOUNGE (Warm Ivory Card with High Contrast) ── */}
      <View style={styles.conciergeCard}>
        {/* Card Header */}
        <View style={styles.conciergeHeader}>
          <View style={styles.conciergeHeaderLeft}>
            <Ionicons name="headset-outline" size={14} color={C.gold} style={{ marginRight: 6 }} />
            <Text style={styles.conciergeHeaderText}>DIRECT CONCIERGE DESK</Text>
          </View>
          <View style={styles.liveDeskPill}>
            <View style={styles.livePulseDot} />
            <Text style={styles.liveDeskText}>Live Assistance</Text>
          </View>
        </View>

        {/* 2-Column Contact Grid */}
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
              <View style={styles.waIconWell}>
                <Ionicons name="logo-whatsapp" size={17} color="#1D7348" />
              </View>
              <View style={styles.waStatusBadge}>
                <View style={styles.greenDot} />
                <Text style={styles.waStatusText}>24/7</Text>
              </View>
            </View>

            <Text style={styles.tileLabel}>WHATSAPP CHAT</Text>
            <Text style={styles.tileValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
              {whatsappLine.value}
            </Text>

            <View style={styles.tileCtaRow}>
              <Text style={styles.waCtaText}>Message us</Text>
              <Ionicons name="arrow-forward" size={11} color="#1D7348" />
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
              <View style={styles.phoneIconWell}>
                <Ionicons name="call" size={16} color={C.pine} />
              </View>
              <View style={styles.deskStatusBadge}>
                <Text style={styles.deskStatusText}>Direct Line</Text>
              </View>
            </View>

            <Text style={styles.tileLabel}>PHONE DESK</Text>
            <Text style={styles.tileValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
              {phoneLine.value}
            </Text>

            <View style={styles.tileCtaRow}>
              <Text style={styles.phoneCtaText}>Call now</Text>
              <Ionicons name="arrow-forward" size={11} color={C.pine} />
            </View>
          </PressableScale>
        </View>

        <View style={styles.cardDivider} />

        {/* Email Inquiry Row */}
        <PressableScale
          onPress={() => open(emailLine.href)}
          scaleTo={0.985}
          style={styles.emailRow}
          accessibilityRole="link"
          accessibilityLabel={`Email Concierge: ${emailLine.value}`}
        >
          <View style={styles.emailIconWell}>
            <Ionicons name="mail-outline" size={15} color={C.pine} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emailLabel}>PRIVATE INQUIRIES & TRANSFERS</Text>
            <Text style={styles.emailValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
              {emailLine.value}
            </Text>
          </View>
          <View style={styles.emailChevron}>
            <Ionicons name="chevron-forward" size={14} color={C.pine} />
          </View>
        </PressableScale>

        <View style={styles.cardDivider} />

        {/* Integrated Resort Location & Maps Row */}
        <PressableScale
          onPress={() => open(MAPS_LINK)}
          scaleTo={0.985}
          style={styles.locationRow}
          accessibilityRole="link"
          accessibilityLabel="Open resort location in Google Maps"
        >
          <View style={styles.locIconWell}>
            <Ionicons name="location-outline" size={15} color={C.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.locLabel}>RESORT LOCATION</Text>
            <Text style={styles.locValue} numberOfLines={1}>
              PAF Airbase Road, Kala Bagh, Nathia Gali (7,906 ft)
            </Text>
          </View>
          <View style={styles.mapActionPill}>
            <Text style={styles.mapActionText}>Map</Text>
            <Ionicons name="open-outline" size={11} color={C.pine} style={{ marginLeft: 3 }} />
          </View>
        </PressableScale>
      </View>

      {/* ── 3. SERENE GROUP PORTFOLIO LINK ── */}
      <PressableScale
        onPress={() => open(groupSite.href)}
        scaleTo={0.985}
        style={styles.groupPortfolioCard}
        accessibilityRole="link"
        accessibilityLabel={`The Serene Hospitality Group: ${groupSite.value}`}
      >
        <View style={styles.groupIconWell}>
          <Ionicons name="business-outline" size={15} color={C.gold} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.groupLabel}>THE SERENE HOSPITALITY GROUP</Text>
          <Text style={styles.groupValue} numberOfLines={1}>
            {groupSite.value}
          </Text>
        </View>
        <Ionicons name="arrow-up-outline" size={13} color={C.pine} style={{ transform: [{ rotate: '45deg' }] }} />
      </PressableScale>

      {/* ── 4. LUXURY SOCIAL CHANNELS ── */}
      <View style={styles.socialRow}>
        {CONTACT.social.map((s) => (
          <PressableScale
            key={s.label}
            onPress={() => open(s.href)}
            scaleTo={0.92}
            style={styles.socialBtn}
            accessibilityRole="link"
            accessibilityLabel={s.label}
          >
            <Ionicons name={s.icon as Glyph} size={18} color={C.pine} />
          </PressableScale>
        ))}
      </View>

      {/* ── 5. HERITAGE & LEGAL FOOTNOTE ── */}
      <View style={styles.footerFootnote}>
        <Text style={styles.resortTitle}>SERENE HEIGHTS RESORT & RESIDENCES</Text>
        <Text style={styles.footnoteLine}>
          Nathia Gali, Khyber Pakhtunkhwa, Pakistan
        </Text>
        <Text style={styles.footnoteSub}>
          {`A DM Consortium Alpine Development · © ${currentYear}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 64,
    paddingTop: 32,
    paddingHorizontal: S.gutter,
  },
  ornamentDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 34,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(200, 164, 106, 0.3)',
  },
  ornamentCenter: {
    paddingHorizontal: 14,
  },
  head: {
    alignItems: 'center',
  },
  crestContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(200, 164, 106, 0.12)',
    borderWidth: 1.2,
    borderColor: 'rgba(200, 164, 106, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...shadow.pill,
  },
  eyebrow: {
    fontFamily: FONTS.uiBold,
    fontSize: 10,
    letterSpacing: 2,
    color: C.gold,
    marginBottom: 6,
  },
  title: {
    color: C.pine,
    fontFamily: FONTS.display,
    fontSize: 29,
    lineHeight: 34,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  lede: {
    color: C.ink55,
    fontFamily: FONTS.ui,
    fontSize: 13,
    lineHeight: 19.5,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 320,
  },

  /* ── 1. Hero Booking Banner ── */
  heroBookingCard: {
    marginTop: 28,
    borderRadius: 22,
    backgroundColor: C.pine,
    borderWidth: 1.2,
    borderColor: 'rgba(200, 164, 106, 0.4)',
    padding: 18,
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 6,
  },
  bookingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bookingKickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goldDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.gold,
    marginRight: 6,
  },
  bookingKicker: {
    fontFamily: FONTS.uiBold,
    fontSize: 9,
    letterSpacing: 1.4,
    color: C.gold,
  },
  rateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(200, 164, 106, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.35)',
  },
  rateBadgeText: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    color: C.gold,
    letterSpacing: 0.3,
  },
  bookingTitle: {
    fontFamily: FONTS.display,
    fontSize: 22,
    lineHeight: 26,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  bookingSub: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    lineHeight: 16.5,
    color: 'rgba(236, 238, 237, 0.75)',
    marginTop: 4,
    marginBottom: 16,
  },
  bookingBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  urlPill: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  urlText: {
    fontFamily: FONTS.uiMedium,
    fontSize: 11.5,
    color: 'rgba(236, 238, 237, 0.9)',
    flex: 1,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.gold,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaButtonText: {
    fontFamily: FONTS.uiBold,
    fontSize: 12,
    color: C.pine,
    letterSpacing: 0.2,
  },

  /* ── 2. Concierge Lounge Card (Warm Ivory) ── */
  conciergeCard: {
    marginTop: 16,
    borderRadius: 22,
    backgroundColor: C.white,
    borderWidth: 1.2,
    borderColor: 'rgba(200, 164, 106, 0.32)',
    padding: 16,
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 3,
  },
  conciergeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  conciergeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conciergeHeaderText: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 1.5,
    color: C.pine,
  },
  liveDeskPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(29, 115, 72, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(29, 115, 72, 0.25)',
  },
  livePulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#1D7348',
    marginRight: 4.5,
  },
  liveDeskText: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    color: '#1D7348',
    letterSpacing: 0.3,
  },

  /* Bento Grid */
  bentoGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  bentoTile: {
    flex: 1,
    backgroundColor: C.sand,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.25)',
    padding: 12,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  waIconWell: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(29, 115, 72, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(29, 115, 72, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneIconWell: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(200, 164, 106, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.32)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(29, 115, 72, 0.12)',
  },
  greenDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1D7348',
    marginRight: 3,
  },
  waStatusText: {
    fontFamily: FONTS.uiBold,
    fontSize: 8,
    color: '#1D7348',
    letterSpacing: 0.2,
  },
  deskStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(200, 164, 106, 0.14)',
  },
  deskStatusText: {
    fontFamily: FONTS.uiBold,
    fontSize: 8,
    color: C.pine,
    letterSpacing: 0.2,
  },
  tileLabel: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    letterSpacing: 1.2,
    color: C.ink55,
  },
  tileValue: {
    fontFamily: FONTS.uiBold,
    fontSize: 13,
    color: C.pine,
    marginTop: 3,
    fontVariant: ['tabular-nums'],
  },
  tileCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(200, 164, 106, 0.22)',
  },
  waCtaText: {
    fontFamily: FONTS.uiBold,
    fontSize: 10,
    color: '#1D7348',
  },
  phoneCtaText: {
    fontFamily: FONTS.uiBold,
    fontSize: 10,
    color: C.pine,
  },

  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(200, 164, 106, 0.2)',
    marginVertical: 12,
  },

  /* Email Row */
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  emailIconWell: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: 'rgba(200, 164, 106, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.26)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailLabel: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    letterSpacing: 1.2,
    color: C.ink55,
  },
  emailValue: {
    fontFamily: FONTS.uiSemi,
    fontSize: 12,
    color: C.pine,
    marginTop: 1.5,
  },
  emailChevron: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(18, 53, 36, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Location Row */
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  locIconWell: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: 'rgba(200, 164, 106, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.26)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locLabel: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    letterSpacing: 1.2,
    color: C.ink55,
  },
  locValue: {
    fontFamily: FONTS.uiSemi,
    fontSize: 12,
    color: C.pine,
    marginTop: 1.5,
  },
  mapActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(200, 164, 106, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.3)',
  },
  mapActionText: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    color: C.pine,
  },

  /* ── 3. Serene Group Portfolio Card ── */
  groupPortfolioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
    borderRadius: 16,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  groupIconWell: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(200, 164, 106, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupLabel: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    letterSpacing: 1.2,
    color: C.ink55,
  },
  groupValue: {
    fontFamily: FONTS.uiSemi,
    fontSize: 12.5,
    color: C.pine,
    marginTop: 1.5,
  },

  /* ── 4. Social Channels ── */
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginTop: 22,
  },
  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.white,
    borderWidth: 1.2,
    borderColor: 'rgba(200, 164, 106, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  /* ── 5. Heritage Footnote ── */
  footerFootnote: {
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  },
  resortTitle: {
    fontFamily: FONTS.uiBold,
    fontSize: 10,
    letterSpacing: 1.8,
    color: C.pine,
    textAlign: 'center',
    opacity: 0.9,
  },
  footnoteLine: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    color: C.ink55,
    textAlign: 'center',
  },
  footnoteSub: {
    fontFamily: FONTS.ui,
    fontSize: 10.5,
    color: C.ink40,
    textAlign: 'center',
    marginTop: 1,
  },
});
