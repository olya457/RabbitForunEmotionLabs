import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePalette } from '../../theme/ThemeContext';
import { fs, ms } from '../../utils/responsive';
import { FontWeight, Radius } from '../../theme/spacing';

interface Props {
  label: string;
  value: string | number;
  emoji?: string;
  accentColor?: string;
}

export function StatTile({ label, value, emoji, accentColor }: Props) {
  const palette = usePalette();

  return (
    <View
      style={[
        styles.tile,
        {
          backgroundColor: palette.card,
          borderColor: palette.cardBorder,
          borderRadius: Radius.lg,
          padding: ms(14),
        },
      ]}
    >
      {emoji ? (
        <Text style={[styles.emoji, { fontSize: fs(22) }]}>{emoji}</Text>
      ) : null}
      <Text
        style={[
          styles.value,
          { color: accentColor ?? palette.textPrimary, fontSize: fs(22) },
        ]}
      >
        {value}
      </Text>
      <Text style={[styles.label, { color: palette.textSecondary, fontSize: fs(11) }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  emoji: {},
  value: {
    fontWeight: FontWeight.extrabold as any,
    textAlign: 'center',
  },
  label: {
    fontWeight: FontWeight.semibold as any,
    textAlign: 'center',
  },
});
