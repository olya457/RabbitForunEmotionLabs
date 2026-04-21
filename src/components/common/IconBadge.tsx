import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePalette } from '../../theme/ThemeContext';
import { fs, ms, pick } from '../../utils/responsive';
import { Radius } from '../../theme/spacing';

interface Props {
  emoji: string;
  size?: 'sm' | 'md' | 'lg';
}

export function IconBadge({ emoji, size = 'md' }: Props) {
  const palette = usePalette();
  const pad = size === 'sm' ? ms(8) : size === 'lg' ? ms(16) : ms(12);
  const fontSize = pick(
    { xs: size === 'sm' ? 18 : 22, md: size === 'sm' ? 20 : 26 },
    22
  );

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: palette.card,
          borderColor: palette.cardBorder,
          padding: pad,
          borderRadius: Radius.md,
        },
      ]}
    >
      <Text style={{ fontSize: fs(fontSize) }}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
