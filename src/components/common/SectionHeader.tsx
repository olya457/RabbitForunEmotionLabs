import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { usePalette } from '../../theme/ThemeContext';
import { fs, ms } from '../../utils/responsive';
import { FontWeight } from '../../theme/spacing';

interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  align?: 'left' | 'center';
}

export function SectionHeader({ title, subtitle, actionLabel, onAction, align = 'left' }: Props) {
  const palette = usePalette();

  return (
    <View style={[styles.row, align === 'center' && styles.centerRow]}>
      <View style={[styles.texts, align === 'center' && styles.textsCenter]}>
        <Text style={[styles.title, { color: palette.textPrimary, fontSize: fs(18), textAlign: align }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.sub, { color: palette.textSecondary, fontSize: fs(12), textAlign: align }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {actionLabel && onAction ? (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={[styles.action, { color: palette.pink, fontSize: fs(13) }]}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
    marginBottom: 8,
  },
  centerRow: {
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  textsCenter: {
    flex: 0,
    alignItems: 'center',
  },
  title: {
    fontWeight: FontWeight.bold as any,
  },
  sub: {
    fontWeight: FontWeight.regular as any,
  },
  action: {
    fontWeight: FontWeight.semibold as any,
  },
});
