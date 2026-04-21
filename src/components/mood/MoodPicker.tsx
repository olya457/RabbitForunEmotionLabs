import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MoodOption } from '../../types/mood';
import { MOOD_OPTIONS } from '../../data/moodData';
import { usePalette } from '../../theme/ThemeContext';
import { fs, ms } from '../../utils/responsive';
import { FontWeight, Radius } from '../../theme/spacing';

interface Props {
  selected?: number | null;
  onSelect: (option: MoodOption) => void;
  compact?: boolean;
}

export function MoodPicker({ selected, onSelect, compact }: Props) {
  const palette = usePalette();

  return (
    <View style={styles.row}>
      {MOOD_OPTIONS.map(opt => {
        const active = selected === opt.level;
        const color = palette[opt.color];

        return (
          <TouchableOpacity
            key={opt.level}
            onPress={() => onSelect(opt)}
            activeOpacity={0.85}
            style={[
              styles.option,
              {
                backgroundColor: active ? color : palette.card,
                borderColor: active ? color : palette.cardBorder,
                paddingVertical: compact ? ms(10) : ms(14),
                borderRadius: Radius.md,
              },
            ]}
          >
            <Text style={[styles.emoji, { fontSize: compact ? fs(22) : fs(28) }]}>{opt.emoji}</Text>
            {!compact ? (
              <Text
                style={[
                  styles.label,
                  {
                    color: active ? palette.white : palette.textSecondary,
                    fontSize: fs(11),
                  },
                ]}
              >
                {opt.label}
              </Text>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  option: {
    flex: 1,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 4,
  },
  emoji: {
    textAlign: 'center',
  },
  label: {
    fontWeight: FontWeight.semibold as any,
    textAlign: 'center',
  },
});
