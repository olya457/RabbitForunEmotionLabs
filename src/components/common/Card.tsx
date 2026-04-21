import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { usePalette } from '../../theme/ThemeContext';
import { Radius } from '../../theme/spacing';
import { ms } from '../../utils/responsive';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padded?: boolean;
  bordered?: boolean;
  accentColor?: string;
}

export function Card({ children, style, onPress, padded = true, bordered, accentColor }: Props) {
  const palette = usePalette();

  const containerStyle = [
    styles.card,
    {
      backgroundColor: palette.card,
      borderRadius: Radius.lg,
      padding: padded ? ms(16) : 0,
      borderWidth: bordered ? 1 : 0,
      borderColor: accentColor ?? palette.cardBorder,
      shadowColor: palette.shadow,
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={containerStyle}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
