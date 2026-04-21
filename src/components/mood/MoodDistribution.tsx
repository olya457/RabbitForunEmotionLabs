import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MoodEntry, MoodLevel } from '../../types/mood';
import { MOOD_OPTIONS } from '../../data/moodData';
import { usePalette } from '../../theme/ThemeContext';
import { fs, ms } from '../../utils/responsive';
import { FontWeight, Radius } from '../../theme/spacing';

interface Props {
  entries: MoodEntry[];
}

export function MoodDistribution({ entries }: Props) {
  const palette = usePalette();
  const total = entries.length;

  const counts: Record<MoodLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const e of entries) counts[e.level] += 1;

  return (
    <View style={styles.wrap}>
      {MOOD_OPTIONS.map(opt => {
        const count = counts[opt.level];
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        const color = palette[opt.color];

        return (
          <View key={opt.level} style={styles.row}>
            <Text style={{ fontSize: fs(22) }}>{opt.emoji}</Text>
            <View style={styles.barWrap}>
              <View style={styles.barHeader}>
                <Text style={[styles.label, { color: palette.textPrimary, fontSize: fs(12) }]}>
                  {opt.label}
                </Text>
                <Text style={[styles.count, { color: palette.textSecondary, fontSize: fs(11) }]}>
                  {count} · {pct}%
                </Text>
              </View>
              <View
                style={[
                  styles.track,
                  {
                    backgroundColor: palette.progressTrack,
                    borderRadius: Radius.pill,
                    height: ms(8),
                  },
                ]}
              >
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${pct}%`,
                      backgroundColor: color,
                      borderRadius: Radius.pill,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  barWrap: {
    flex: 1,
    gap: 4,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: FontWeight.semibold as any,
  },
  count: {},
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
