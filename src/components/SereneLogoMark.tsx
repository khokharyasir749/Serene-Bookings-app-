import Svg, { ClipPath, Defs, G, Path, Polygon, Rect } from 'react-native-svg';

// Serene Heights crest, identical to the Serene Management app's SereneLogoMark (same geometry and colours):
// a thin outer capsule, a solid inner capsule, a ridge line, a snow-capped central peak and a smaller right ridge.
// Brand colours from the Management app: the crest's deep pine-slate and soft off-white, the header wordmark's charcoal-green and brand pine.
export const BRAND_SLATE = '#314A43';
export const BRAND_SNOW = '#ECEEED';
export const BRAND_FG = '#14261C';
export const BRAND_PINE = '#143D29';

export const CREST_W = 34;
export const CREST_H = 42;
export const OUTER = { x: 0.75, y: 0.75, w: 32.5, h: 40.5, r: 16.25 };
export const INNER = { x: 3.6, y: 3.6, w: 26.8, h: 34.8, r: 13.4 };
export const RIDGE_L = 'M3 27.5 L8.8 21 L12 24.2 L18 13.5';
export const RIDGE_R = 'M18 13.5 L22.2 22 L26 19 L31 26';
export const PEAK = '18,13.5 13.2,22.2 19.2,24.6';

type Props = { size?: number; color?: string; snow?: string; ring?: string };

/** `size` is the crest height in px; width follows the 34 : 42 proportion. */
export default function SereneLogoMark({ size = 42, color = BRAND_SLATE, snow = BRAND_SNOW, ring = color }: Props) {
  const w = (size * CREST_W) / CREST_H;
  const id = `crest-${color.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <Svg width={w} height={size} viewBox={`0 0 ${CREST_W} ${CREST_H}`}>
      <Defs>
        <ClipPath id={id}>
          <Rect x={INNER.x} y={INNER.y} width={INNER.w} height={INNER.h} rx={INNER.r} />
        </ClipPath>
      </Defs>
      <Rect x={OUTER.x} y={OUTER.y} width={OUTER.w} height={OUTER.h} rx={OUTER.r} fill="none" stroke={ring} strokeWidth={1.5} />
      <Rect x={INNER.x} y={INNER.y} width={INNER.w} height={INNER.h} rx={INNER.r} fill={color} />
      <G clipPath={`url(#${id})`}>
        <Path d={RIDGE_L} fill="none" stroke={snow} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <Path d={RIDGE_R} fill="none" stroke={snow} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <Polygon points={PEAK} fill={snow} />
      </G>
    </Svg>
  );
}
