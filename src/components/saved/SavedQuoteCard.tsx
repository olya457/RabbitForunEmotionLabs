import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { SavedQuote } from '../../types/quiz';
import { BUNNY_TYPES } from '../../data/bunnyTypes';
import { usePalette } from '../../theme/ThemeContext';
import { fs, ms } from '../../utils/responsive';
import { Radius, FontWeight } from '../../theme/spacing';

interface Props {
  quote: SavedQuote;
  onDelete: (id: string) => void;
}

export function SavedQuoteCard({ quote, onDelete }: Props) {
  const palette = usePalette();
  const bunny = BUNNY_TYPES[quote.bunnyType];

  const handleShare = async () => {
    await Share.share({ message: quote.quote });
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: palette.card,
          borderColor: palette.pink,
          borderRadius: Radius.lg,
          padding: ms(16),
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.emoji}>{bunny.emoji}</Text>
          <View>
            <Text style={[styles.name, { color: palette.pink, fontSize: fs(14) }]}>
              {bunny.name}
            </Text>
            <Text style={[styles.date, { color: palette.textSecondary, fontSize: fs(12) }]}>
              {quote.date}
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handleShare}
            style={[styles.actionBtn, { backgroundColor: palette.cardActive }]}
          >
            <Text style={styles.actionIcon}>🔗</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(quote.id)}
            style={[styles.actionBtn, { backgroundColor: palette.cardActive }]}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: palette.divider }]} />

      <Text
        style={[
          styles.quoteText,
          { color: palette.textPrimary, fontSize: fs(14), lineHeight: fs(22) },
        ]}
      >
        {quote.quote}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emoji: {
    fontSize: 28,
  },
  name: {
    fontWeight: FontWeight.bold as any,
  },
  date: {},
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    borderRadius: 10,
    padding: 8,
  },
  actionIcon: {
    fontSize: 16,
  },
  divider: {
    height: 1,
  },
  quoteText: {
    fontStyle: 'italic',
  },
});
