import { TextStyle } from 'react-native';
import { fs } from '../utils/responsive';
import { FontWeight } from './spacing';

export const makeTypography = (color: string, secondary: string) => ({
  hero: {
    fontSize: fs(32),
    fontWeight: FontWeight.extrabold as TextStyle['fontWeight'],
    color,
    textAlign: 'center' as const,
  },
  h1: {
    fontSize: fs(26),
    fontWeight: FontWeight.bold as TextStyle['fontWeight'],
    color,
    textAlign: 'center' as const,
  },
  h2: {
    fontSize: fs(22),
    fontWeight: FontWeight.bold as TextStyle['fontWeight'],
    color,
    textAlign: 'center' as const,
  },
  h3: {
    fontSize: fs(18),
    fontWeight: FontWeight.semibold as TextStyle['fontWeight'],
    color,
    textAlign: 'center' as const,
  },
  body: {
    fontSize: fs(14),
    fontWeight: FontWeight.regular as TextStyle['fontWeight'],
    color: secondary,
    lineHeight: fs(22),
    textAlign: 'center' as const,
  },
  bodyStrong: {
    fontSize: fs(14),
    fontWeight: FontWeight.semibold as TextStyle['fontWeight'],
    color,
    lineHeight: fs(22),
  },
  caption: {
    fontSize: fs(12),
    fontWeight: FontWeight.regular as TextStyle['fontWeight'],
    color: secondary,
  },
  label: {
    fontSize: fs(13),
    fontWeight: FontWeight.semibold as TextStyle['fontWeight'],
    color,
  },
});

export type AppTypography = ReturnType<typeof makeTypography>;
