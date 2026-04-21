export interface ThemePalette {
  mode: 'light' | 'dark';

  background: string;
  backgroundAlt: string;
  backgroundGradientStart: string;
  backgroundGradientEnd: string;

  card: string;
  cardActive: string;
  cardBorder: string;

  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  pink: string;
  pinkLight: string;
  pinkSoft: string;

  purple: string;
  purpleLight: string;
  purpleDark: string;

  optionDefault: string;
  optionSelected: string;
  optionCorrect: string;
  optionWrong: string;

  progressFill: string;
  progressTrack: string;

  tabActive: string;
  tabInactive: string;
  tabBackground: string;
  tabBorder: string;

  success: string;
  warning: string;
  danger: string;

  overlay: string;
  divider: string;
  shadow: string;

  moodGreat: string;
  moodGood: string;
  moodOkay: string;
  moodLow: string;
  moodBad: string;

  white: string;
  black: string;
  transparent: string;
}

export const darkPalette: ThemePalette = {
  mode: 'dark',

  background: '#0D0A1E',
  backgroundAlt: '#13102A',
  backgroundGradientStart: '#1A1535',
  backgroundGradientEnd: '#0D0A1E',

  card: '#1A1535',
  cardActive: '#251E45',
  cardBorder: 'rgba(255,255,255,0.08)',

  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.65)',
  textTertiary: 'rgba(255,255,255,0.4)',
  textInverse: '#0D0A1E',

  pink: '#FF4D8D',
  pinkLight: '#FF80B0',
  pinkSoft: 'rgba(255,77,141,0.15)',

  purple: '#7C3AED',
  purpleLight: '#A78BFA',
  purpleDark: '#4C1D95',

  optionDefault: '#1A1535',
  optionSelected: '#7C3AED',
  optionCorrect: '#16A34A',
  optionWrong: '#DC2626',

  progressFill: '#FF4D8D',
  progressTrack: 'rgba(255,255,255,0.15)',

  tabActive: '#FF4D8D',
  tabInactive: 'rgba(255,255,255,0.45)',
  tabBackground: '#13102A',
  tabBorder: 'rgba(255,92,151,0.35)',

  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',

  overlay: 'rgba(0,0,0,0.55)',
  divider: 'rgba(255,255,255,0.08)',
  shadow: '#000000',

  moodGreat: '#22C55E',
  moodGood: '#84CC16',
  moodOkay: '#F59E0B',
  moodLow: '#F97316',
  moodBad: '#EF4444',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const lightPalette: ThemePalette = {
  mode: 'light',

  background: '#FFF5F8',
  backgroundAlt: '#FFE8F1',
  backgroundGradientStart: '#FFF5F8',
  backgroundGradientEnd: '#F7E3FB',

  card: '#FFFFFF',
  cardActive: '#FFF0F5',
  cardBorder: 'rgba(124,58,237,0.12)',

  textPrimary: '#1F1235',
  textSecondary: 'rgba(31,18,53,0.65)',
  textTertiary: 'rgba(31,18,53,0.45)',
  textInverse: '#FFFFFF',

  pink: '#E63E80',
  pinkLight: '#FF80B0',
  pinkSoft: 'rgba(230,62,128,0.12)',

  purple: '#7C3AED',
  purpleLight: '#A78BFA',
  purpleDark: '#4C1D95',

  optionDefault: '#FFFFFF',
  optionSelected: '#EDE9FE',
  optionCorrect: '#16A34A',
  optionWrong: '#DC2626',

  progressFill: '#E63E80',
  progressTrack: 'rgba(31,18,53,0.12)',

  tabActive: '#E63E80',
  tabInactive: 'rgba(31,18,53,0.5)',
  tabBackground: '#FFFFFF',
  tabBorder: 'rgba(230,62,128,0.25)',

  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',

  overlay: 'rgba(31,18,53,0.45)',
  divider: 'rgba(31,18,53,0.08)',
  shadow: '#1F1235',

  moodGreat: '#16A34A',
  moodGood: '#65A30D',
  moodOkay: '#D97706',
  moodLow: '#EA580C',
  moodBad: '#DC2626',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const palettes = {
  light: lightPalette,
  dark: darkPalette,
};
