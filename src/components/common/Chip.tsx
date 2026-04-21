import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View } from 'react-native';
import { usePalette } from '../../theme/ThemeContext';
import { fs, ms } from '../../utils/responsive';
import { Radius, FontWeight } from '../../theme/spacing';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  emoji?: string;
  style?: ViewStyle;
  accentColor?: string;
}

export function Chip({ label, selected, onPress, emoji, style, accentColor }: Props) {
  const palette = usePalette();
  const activeColor = accentColor ?? palette.pink;

  const bg = selected ? activeColor : palette.card;
  const borderColor = selected ? activeColor : palette.cardBorder;
  const textColor = selected ? palette.white : palette.textPrimary;

  const inner = (
    <>
      {emoji ? <Text style={{ fontSize: fs(14), marginRight: 4 }}>{emoji}</Text> : null}
      <Text style={[styles.label, { color: textColor, fontSize: fs(13) }]} numberOfLines={1}>
        {label}
      </Text>
    </>
  );

  const baseStyle = [
    styles.chip,
    {
      backgroundColor: bg,
      borderColor,
      borderRadius: Radius.pill,
      paddingHorizontal: ms(12),
      paddingVertical: ms(6),
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={baseStyle}>
        {inner}
      </TouchableOpacity>
    );
  }

  return <View style={baseStyle}>{inner}</View>;
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: FontWeight.semibold as any,
  },
});
