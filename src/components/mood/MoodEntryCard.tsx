import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MoodEntry } from '../../types/mood';
import { usePalette } from '../../theme/ThemeContext';
import { fs, ms } from '../../utils/responsive';
import { Radius, FontWeight } from '../../theme/spacing';
import { MOOD_OPTIONS } from '../../data/moodData';

interface Props {
  entry: MoodEntry;
  onDelete?: (id: string) => void;
}

export function MoodEntryCard({ entry, onDelete }: Props) {
  const palette = usePalette();
  const option = MOOD_OPTIONS.find(o => o.level === entry.level);
  const accent = option ? palette[option.color] : palette.pink;

  const timeLabel = new Date(entry.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: palette.card,
          borderRadius: Radius.lg,
          padding: ms(14),
          borderLeftWidth: 4,
          borderLeftColor: accent,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={{ fontSize: fs(28) }}>{entry.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: palette.textPrimary, fontSize: fs(14) }]}>
              {entry.label}
            </Text>
            <Text style={[styles.meta, { color: palette.textSecondary, fontSize: fs(11) }]}>
              {entry.date} · {timeLabel}
            </Text>
          </View>
        </View>
        {onDelete ? (
          <TouchableOpacity
            onPress={() => onDelete(entry.id)}
            style={[styles.deleteBtn, { backgroundColor: palette.cardActive }]}
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {entry.tags.length > 0 ? (
        <View style={styles.tags}>
          {entry.tags.map(tag => (
            <View
              key={tag}
              style={[
                styles.tag,
                { backgroundColor: palette.cardActive, borderColor: palette.cardBorder },
              ]}
            >
              <Text style={[styles.tagText, { color: palette.textSecondary, fontSize: fs(11) }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {entry.note ? (
        <Text style={[styles.note, { color: palette.textSecondary, fontSize: fs(13) }]}>
          {entry.note}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  label: {
    fontWeight: FontWeight.bold as any,
  },
  meta: {
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
    borderRadius: 10,
  },
  deleteIcon: {
    fontSize: 14,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagText: {
    fontWeight: FontWeight.semibold as any,
  },
  note: {
    lineHeight: 20,
  },
});
