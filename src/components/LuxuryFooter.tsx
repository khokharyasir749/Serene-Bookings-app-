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

interface LineMeta {
  badge?: string;
  badgeType?: 'live' | 'neutral';
}

const LINE_METAS: Record<string, LineMeta> = {
  WhatsApp: { badge: 'Online · 24/7', badgeType: 'live' },
  Reservations: { badge: 'Direct Line', badgeType: 'neutral' },
  Email: { badge: 'Concierge Desk', badgeType: 'neutral' },
};

function ConciergeRow({
  icon,
  label,
  value,
  href,
  last,
}: {
  icon: Glyph;
  label: string;
  value: string;
  href: string;
  last?: boolean;
}) {
  const meta = LINE_METAS[label];
  const isWhatsapp = label === 'WhatsApp';

  return (
    <PressableScale
      onPress={() => open(href)}
      scaleTo={0.985}
      style={[styles.conciergeRow, !last && styles.conciergeRowDivider]}
      accessibilityRole="link"
      accessibilityLabel={`${label}: ${value}`}
    >
      {/* Luxury Icon Well */}
      <View style={[styles.iconWell, isWhatsapp && styles.iconWellWa]}>
        <Ionicons
          name={icon}
          size={18}
          color={isWhatsapp ? '#1D7348' : C.pine}
        />
      </View>

      {/* Details Column */}
      <View style={styles.rowDetails}>
        <View style={styles.labelRow}>
          <Text style={styles.rowLabel}>{label.toUpperCase()}</Text>
          {meta?.badge && (
            <View style={[styles.badge, meta.badgeType === 'live' ? styles.badgeLive : styles.badgeNeutral]}>
              {meta.badgeType === 'live' && <View style={styles.liveDot} />}
              <Text style={[styles.badgeText, meta.badgeType === 'live' ? styles.badgeLiveText : styles.badgeNeutralText]}>
                {meta.badge}
              </Text>
            </View>
          )}
        </View>
        <Text
          style={[styles.rowValue, value.length > 30 && styles.rowValueSmall]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {value}
        </Text>
      </View>

      {/* Trailing Chevron Disc */}
      <View style={styles.trailingDisc}>
        <Ionicons name="chevron-forward" size={14} color={C.pine} />
      </View>
    </PressableScale>
  );
}

/** Luxury Portal Card for web links */
function PortalCard({
  icon,
  label,
  value,
  href,
  primary,
  subtitle,
}: {
  icon: Glyph;
  label: string;
  value: string;
  href: string;
  primary?: boolean;
  subtitle: string;
}) {
  return (
    <PressableScale
      onPress={() => open(href)}
      scaleTo={0.985}
      accessibilityRole="link"
      accessibilityLabel={`${label}: ${value}`}
      style={[
        styles.portalCard,
        primary ? styles.portalCardPrimary : styles.portalCardSecondary,
      ]}
    >
      <View style={[styles.portalIconWell, primary ? styles.portalIconWellPrimary : styles.portalIconWellSecondary]}>
        <Ionicons name={icon} size={20} color={primary ? C.gold : C.pine} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[styles.portalLabel, { color: primary ? C.gold : C.ink55 }]}>
          {label.toUpperCase()}
        </Text>
        <Text
          style={[styles.portalValue, { color: primary ? C.cream : C.pine }]}
          numberOfLines={1}
        >
          {value}
        </Text>
        <Text
          style={[styles.portalSub, { color: primary ? 'rgba(236, 238, 237, 0.65)' : C.ink55 }]}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      </View>

      <View style={[styles.portalArrow, primary ? styles.portalArrowPrimary : styles.portalArrowSecondary]}>
        <Ionicons
          name="arrow-up-outline"
          size={14}
          color={primary ? C.gold : C.pine}
          style={{ transform: [{ rotate: '45deg' }] }}
        />
      </View>
    </PressableScale>
  );
}

/** Discover's closing section: Flagship Luxury Concierge Lounge & Resort Portals */
export default function LuxuryFooter({ bottomSpace }: { bottomSpace: number }) {
  const currentYear = new Date().getFullYear();

  return (
    <View style={[styles.wrap, { paddingBottom: bottomSpace + 40 }]}>
      {/* Editorial Gold Ornament Divider */}
      <View style={styles.ornamentDivider}>
        <View style={styles.dividerLine} />
        <View style={styles.ornamentCenter}>
          <Ionicons name="sparkles" size={12} color={C.gold} />
        </View>
        <View style={styles.dividerLine} />
      </View>

      {/* Header with Crest */}
      <View style={styles.head}>
        <View style={styles.crestCircle}>
          <SereneLogoMark size={46} color={C.pine} snow={C.gold} />
        </View>
        <Text style={styles.eyebrow}>CONCIERGE & PRIVATE INQUIRIES</Text>
        <Text style={styles.title}>Reservations & Concierge</Text>
        <Text style={styles.lede}>
          Dedicated alpine hospitality · Available seven days a week for suite bookings, private dining, and airport transfers.
        </Text>
      </View>

      {/* Concierge Desk Lounge Card */}
      <View style={styles.conciergeCard}>
        {CONTACT.lines.map((l, i) => (
          <ConciergeRow
            key={l.label}
            icon={l.icon as Glyph}
            label={l.label}
            value={l.value}
            href={l.href}
            last={i === CONTACT.lines.length - 1}
          />
        ))}
      </View>

      {/* Digital Portals */}
      <View style={styles.portalsContainer}>
        <PortalCard
          icon="calendar-outline"
          label="Direct Reservation Portal"
          value={CONTACT.sites[0]?.value ?? 'sereneheightsgroup.com/booking'}
          href={CONTACT.sites[0]?.href ?? 'https://www.sereneheightsgroup.com/booking'}
          primary
          subtitle="Instant suite confirmation · Best guaranteed rates"
        />
        <PortalCard
          icon="business-outline"
          label="The Serene Hospitality Group"
          value={CONTACT.sites[1]?.value ?? 'sereneheightsgroup.com'}
          href={CONTACT.sites[1]?.href ?? 'https://www.sereneheightsgroup.com'}
          subtitle="Resort masterplans, residences & corporate portfolio"
        />
      </View>

      {/* Location Pill */}
      <PressableScale
        onPress={() => open(MAPS_LINK)}
        scaleTo={0.985}
        style={styles.locationPill}
        accessibilityRole="link"
        accessibilityLabel="View resort location on Google Maps"
      >
        <Ionicons name="location-outline" size={15} color={C.gold} style={{ marginRight: 6 }} />
        <Text style={styles.locationText} numberOfLines={1}>
          Kala Bagh Air Base Road · Nathia Gali, Pakistan
        </Text>
        <Ionicons name="open-outline" size={12} color={C.pine} style={{ marginLeft: 6, opacity: 0.65 }} />
      </PressableScale>

      {/* Social Icons */}
      <View style={styles.socialRow}>
        {CONTACT.social.map((s) => (
          <PressableScale
            key={s.label}
            onPress={() => open(s.href)}
            scaleTo={0.94}
            style={styles.socialBtn}
            accessibilityRole="link"
            accessibilityLabel={s.label}
          >
            <Ionicons name={s.icon as Glyph} size={18} color={C.pine} />
          </PressableScale>
        ))}
      </View>

      {/* Resort Heritage & Legal Footnote */}
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
    paddingTop: 32,
    paddingHorizontal: S.gutter,
  },
  ornamentDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 36,
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
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(200, 164, 106, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
    lineHeight: 19.5,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 310,
  },

  /* Concierge Card */
  conciergeCard: {
    marginTop: 26,
    borderRadius: 22,
    backgroundColor: C.white,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.28)',
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },
  conciergeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 14,
  },
  conciergeRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(200, 164, 106, 0.22)',
  },
  iconWell: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: 'rgba(200, 164, 106, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWellWa: {
    backgroundColor: 'rgba(29, 115, 72, 0.1)',
    borderColor: 'rgba(29, 115, 72, 0.25)',
  },
  rowDetails: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  rowLabel: {
    color: C.ink55,
    fontFamily: FONTS.uiBold,
    fontSize: 9,
    letterSpacing: 1.3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6.5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  badgeText: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    letterSpacing: 0.3,
  },
  badgeLive: {
    backgroundColor: 'rgba(29, 115, 72, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(29, 115, 72, 0.22)',
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#1D7348',
    marginRight: 4,
  },
  badgeLiveText: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    color: '#1D7348',
    letterSpacing: 0.3,
  },
  badgeNeutral: {
    backgroundColor: 'rgba(200, 164, 106, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.2)',
  },
  badgeNeutralText: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    color: C.pine,
    letterSpacing: 0.3,
  },
  rowValue: {
    color: C.pine,
    fontFamily: FONTS.uiSemi,
    fontSize: 14,
    lineHeight: 18,
    marginTop: 3,
    fontVariant: ['tabular-nums'],
  },
  rowValueSmall: {
    fontSize: 12,
  },
  trailingDisc: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(18, 53, 36, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Portals */
  portalsContainer: {
    gap: 12,
    marginTop: 16,
  },
  portalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  portalCardPrimary: {
    backgroundColor: C.pine,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.35)',
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  portalCardSecondary: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.25)',
    shadowColor: '#123524',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  portalIconWell: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  portalIconWellPrimary: {
    backgroundColor: 'rgba(200, 164, 106, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.3)',
  },
  portalIconWellSecondary: {
    backgroundColor: 'rgba(18, 53, 36, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(18, 53, 36, 0.12)',
  },
  portalLabel: {
    fontFamily: FONTS.uiBold,
    fontSize: 9,
    letterSpacing: 1.4,
  },
  portalValue: {
    fontFamily: FONTS.uiSemi,
    fontSize: 13.5,
    lineHeight: 18,
    marginTop: 2,
  },
  portalSub: {
    fontFamily: FONTS.ui,
    fontSize: 10.5,
    lineHeight: 14,
    marginTop: 1.5,
  },
  portalArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  portalArrowPrimary: {
    backgroundColor: 'rgba(200, 164, 106, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.35)',
  },
  portalArrowSecondary: {
    backgroundColor: 'rgba(18, 53, 36, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(18, 53, 36, 0.12)',
  },

  /* Location */
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 22,
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(200, 164, 106, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.26)',
    maxWidth: '92%',
  },
  locationText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 11.5,
    color: C.pine,
    letterSpacing: 0.2,
  },

  /* Social */
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginTop: 20,
  },
  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    marginTop: 24,
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
