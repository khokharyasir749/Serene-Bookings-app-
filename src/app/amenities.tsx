import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { memo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Lightbox } from '@/components/Gallery';
import PageHeader from '@/components/PageHeader';
import Scrim from '@/components/Scrim';
import { Text } from '@/components/Text';
import { Button, Photo } from '@/components/ui';
import { AMENITIES, AMENITY_HIGHLIGHTS, AMENITY_ICON, GROUP_BLURB, type Amenity } from '@/data/resort';
import { PROPERTY } from '@/data/catalog';
import { C, FONTS, S, T } from '@/theme';

const GROUPS = [...new Set(AMENITIES.map((a) => a.group))];
const pad = (n: number) => String(n).padStart(2, '0');

type Block = { id: string };
const BLOCKS: Block[] = [{ id: 'hero' }, { id: 'experiences' }, { id: 'groups' }, { id: 'gallery' }, { id: 'cta' }];

// Amenities, after the web's /amenities: the hero, signature experiences, facilities by group, gallery and a closing CTA.
export default function Amenities() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [lightbox, setLightbox] = useState<{ photos: string[]; i: number } | null>(null);

  const expPhotos = PROPERTY.experiences.map((e) => e.image);
  const galleryW = Math.round(width * 0.62);

  const render = ({ item }: { item: Block }) => {
    switch (item.id) {
      case 'hero':
        return (
          <View style={{ paddingHorizontal: S.gutter, paddingTop: 16 }}>
            <View style={styles.hero}>
              <Photo src="/images/resort/aerial-rooftop-pool.jpg" style={StyleSheet.absoluteFill} />
              <Scrim bottom={0.55} />
              <View style={{ flex: 1 }} />
              <View style={{ padding: 20 }}>
                <Text style={styles.heroKicker}>AMENITIES</Text>
                <Text style={styles.heroTitle}>50+ Resort Facilities</Text>
              </View>
            </View>
            <Text style={[T.body, { marginTop: 16 }]}>Everything for a winter escape or a summer retreat, without leaving the resort.</Text>
            <View style={styles.chips}>
              {AMENITY_HIGHLIGHTS.map((h) => (
                <View key={h} style={styles.chip}>
                  <Text style={styles.chipText}>{h}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      case 'experiences':
        return (
          <View style={{ marginTop: 40 }}>
            <Section label="Signature experiences" title="Life at 7,906 ft" />
            <View style={styles.grid}>
              {PROPERTY.experiences.map((e, i) => (
                <ExperienceTile key={e.image} index={i} title={e.title} image={e.image} onPress={() => setLightbox({ photos: expPhotos, i })} />
              ))}
            </View>
          </View>
        );
      case 'groups':
        return (
          <View style={{ marginTop: 40 }}>
            <Section label="Facilities by group" title="Everything on site" sub="From heated floors to a helping hand at 3 a.m." />
            <View style={{ paddingHorizontal: S.gutter }}>
              {GROUPS.map((g, gi) => (
                <GroupCard key={g} index={gi} group={g} items={AMENITIES.filter((a) => a.group === g)} />
              ))}
            </View>
          </View>
        );
      case 'gallery':
        return (
          <View style={{ marginTop: 40 }}>
            <Section label="In pictures" title="Gallery" />
            <FlatList
              horizontal
              data={PROPERTY.gallery}
              keyExtractor={(g) => g}
              showsHorizontalScrollIndicator={false}
              snapToInterval={galleryW + 12}
              decelerationRate="fast"
              initialNumToRender={2}
              windowSize={3}
              contentContainerStyle={{ paddingHorizontal: S.gutter, gap: 12 }}
              renderItem={({ item, index }) => (
                <Pressable onPress={() => setLightbox({ photos: PROPERTY.gallery, i: index })} accessibilityLabel={`Open photo ${index + 1}`}>
                  <Photo src={item} style={{ width: galleryW, height: galleryW, borderRadius: S.photo }} />
                </Pressable>
              )}
            />
          </View>
        );
      default:
        return (
          <View style={styles.cta}>
            <Text style={styles.ctaKicker}>BOOK YOUR STAY</Text>
            <Text style={styles.ctaTitle}>All of this, a lift ride from your apartment</Text>
            <Button label="Check availability" style={{ marginTop: 18 }} onPress={() => router.navigate('/apartments')} icon={<Ionicons name="arrow-forward-outline" size={16} color={C.cream} />} />
          </View>
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.sand }}>
      <PageHeader title="Amenities" />
      <FlatList data={BLOCKS} keyExtractor={(b) => b.id} renderItem={render} showsVerticalScrollIndicator={false} initialNumToRender={3} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }} />
      <Lightbox photos={lightbox?.photos ?? []} index={lightbox?.i ?? null} onClose={() => setLightbox(null)} />
    </View>
  );
}

function Section({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <View style={{ paddingHorizontal: S.gutter, marginBottom: 16 }}>
      <Text style={T.eyebrow}>{label}</Text>
      <Text style={[T.h2, { marginTop: 4 }]}>{title}</Text>
      {sub && <Text style={[T.small, { marginTop: 3 }]}>{sub}</Text>}
    </View>
  );
}

const ExperienceTile = memo(function ExperienceTile({ index, title, image, onPress }: { index: number; title: string; image: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.tile} accessibilityLabel={`Open ${title}`}>
      <Photo src={image} style={styles.tileImg} />
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
        <Text style={styles.tileNum}>{pad(index + 1)}</Text>
        <Text style={styles.tileTitle} numberOfLines={2}>{title}</Text>
      </View>
    </Pressable>
  );
});

function GroupCard({ index, group, items }: { index: number; group: string; items: Amenity[] }) {
  return (
    <View style={styles.group}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
        <Text style={styles.tileNum}>{pad(index + 1)}</Text>
        <Text style={[T.h3, { fontSize: 22 }]}>{group}</Text>
      </View>
      {GROUP_BLURB[group] && <Text style={[T.small, { marginTop: 4 }]}>{GROUP_BLURB[group]}</Text>}
      <View style={{ marginTop: 10 }}>
        {items.map((a, i) => (
          <View key={a.key} style={[styles.row, i > 0 && styles.rowLine]}>
            <Ionicons name={(AMENITY_ICON[a.key] ?? 'heart-outline') as never} size={19} color={C.pine} style={{ marginTop: 1 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowName}>{a.name}</Text>
              {a.description && <Text style={[T.small, { marginTop: 2 }]}>{a.description}</Text>}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 240, borderRadius: S.card, overflow: 'hidden', backgroundColor: C.snow },
  heroKicker: { color: C.cream, fontFamily: FONTS.uiBold, fontSize: 10, letterSpacing: 2 },
  heroTitle: { color: C.cream, fontFamily: FONTS.display, fontSize: 34, lineHeight: 38, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: C.pureWhite, borderWidth: StyleSheet.hairlineWidth, borderColor: C.lineStrong },
  chipText: { fontSize: 12.5, fontFamily: FONTS.uiSemi, color: C.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: S.gutter, gap: 14 },
  tile: { width: '47.5%', flexGrow: 1 },
  tileImg: { width: '100%', aspectRatio: 1, borderRadius: 18 },
  tileNum: { color: C.ink40, fontFamily: FONTS.uiBold, fontSize: 11, letterSpacing: 1.2, fontVariant: ['tabular-nums'] },
  tileTitle: { flex: 1, fontFamily: FONTS.display, fontSize: 17, lineHeight: 20, color: C.ink },
  group: { padding: 18, marginBottom: 12, borderRadius: S.card, backgroundColor: C.pureWhite, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  row: { flexDirection: 'row', gap: 12, paddingVertical: 11 },
  rowLine: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  rowName: { fontFamily: FONTS.uiSemi, fontSize: 14, color: C.ink },
  cta: { marginHorizontal: S.gutter, marginTop: 40, padding: 22, borderRadius: S.card, backgroundColor: C.pine },
  ctaKicker: { color: C.gold, fontFamily: FONTS.uiBold, fontSize: 10, letterSpacing: 2 },
  ctaTitle: { color: C.cream, fontFamily: FONTS.display, fontSize: 27, lineHeight: 31, marginTop: 8 },
});

