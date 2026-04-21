import { Dimensions, PixelRatio, Platform, ScaledSize } from 'react-native';

const GUIDE_BASE_WIDTH = 390;
const GUIDE_BASE_HEIGHT = 844;

const getDims = (): ScaledSize => Dimensions.get('window');

export const getScreen = () => {
  const { width, height } = getDims();
  return { width, height };
};

export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';

export const scale = (size: number): number => {
  const { width } = getDims();
  return (width / GUIDE_BASE_WIDTH) * size;
};

export const verticalScale = (size: number): number => {
  const { height } = getDims();
  return (height / GUIDE_BASE_HEIGHT) * size;
};

export const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

export const fontScale = (size: number): number => {
  const newSize = moderateScale(size, 0.4);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const rs = scale;
export const vs = verticalScale;
export const ms = moderateScale;
export const fs = fontScale;

export const getScreenSize = () => {
  const { height, width } = getDims();

  return {
    width,
    height,
    isVerySmall: height < 680,
    isSmall: height < 760,
    isMedium: height >= 760 && height < 900,
    isLarge: height >= 900,
    isNarrow: width < 360,
  };
};

export const pick = <T,>(
  values: {
    xs?: T;
    sm?: T;
    md?: T;
    lg?: T;
  },
  fallback: T
): T => {
  const s = getScreenSize();
  if (s.isVerySmall && values.xs !== undefined) return values.xs;
  if (s.isSmall && values.sm !== undefined) return values.sm;
  if (s.isMedium && values.md !== undefined) return values.md;
  if (s.isLarge && values.lg !== undefined) return values.lg;
  return values.md ?? values.sm ?? values.lg ?? values.xs ?? fallback;
};
