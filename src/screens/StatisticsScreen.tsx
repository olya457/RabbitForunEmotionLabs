import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { Card } from '../components/common/Card';
import { StatTile } from '../components/common/StatTile';
import { SectionHeader } from '../components/common/SectionHeader';
import { Chip } from '../components/common/Chip';
import { MoodChart } from '../components/mood/MoodChart';
import { MoodDistribution } from '../components/mood/MoodDistribution';
import { EmptyState } from '../components/common/EmptyState';
import { MoodEntry } from '../types/mood';
import { getLastDays, getMoodEntries, getMoodStats } from '../store/moodStore';
import { usePalette } from '../theme/ThemeContext';
import { fs, ms, getScreenSize } from '../utils/responsive';
import { FontWeight } from '../theme/spacing';

type Range = 7 | 14 | 30;

export function StatisticsScreen() {
  const palette = usePalette();
  const { isVerySmall } = getScreenSize();

  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [range, setRange] = useState<Range>(7);

  useFocusEffect(
    useCallback(() => {
      getMoodEntries().then(setEntries);
    }, [])
  );

  const stats = useMemo(() => getMoodStats(entries), [entries]);
  const series = useMemo(() => getLastDays(entries, range), [entries, range]);

  const topTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of entries) {
      for (const tag of e.tags) counts.set(tag, (counts.get(tag) || 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [entries]);

  return (
    <ScreenContainer backgroundImage={require('../assets/bg_main.png')}>
      <ScreenHeader title="Statistics" subtitle="Your mood insights" emoji="📊" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: ms(20),
          paddingTop: ms(8),
          paddingBottom: ms(120),
          gap: ms(14),
        }}
      >
        {entries.length === 0 ? (
          <View style={{ flex: 1, paddingVertical: 40 }}>
            <EmptyState
              emoji="📈"
              title="No data yet"
              description="Log some moods in the Mood Diary to see your personal stats."
            />
          </View>
        ) : (
          <>
            <View style={styles.statsRow}>
              <StatTile label="Entries" value={stats.total} emoji="✏️" />
              <StatTile label="Avg mood" value={stats.average || '–'} emoji="📊" />
              <StatTile
                label="Day streak"
                value={stats.streak}
                emoji="🔥"
                accentColor={palette.pink}
              />
            </View>

            <Card bordered>
              <View style={styles.chartHead}>
                <Text
                  style={{
                    color: palette.textPrimary,
                    fontSize: fs(isVerySmall ? 15 : 16),
                    fontWeight: FontWeight.bold as any,
                  }}
                >
                  Mood over time
                </Text>
                <View style={styles.rangeRow}>
                  {[7, 14, 30].map(r => (
                    <Chip
                      key={r}
                      label={`${r}d`}
                      selected={range === r}
                      onPress={() => setRange(r as Range)}
                    />
                  ))}
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <MoodChart data={series} />
              </View>
            </Card>

            <Card bordered>
              <SectionHeader title="Distribution" subtitle="How your moods are spread" />
              <MoodDistribution entries={entries} />
            </Card>

            <Card bordered>
              <SectionHeader title="Highlights" />
              <View style={styles.hiRow}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: palette.textSecondary,
                      fontSize: fs(12),
                    }}
                  >
                    Best day
                  </Text>
                  <Text
                    style={{
                      color: palette.textPrimary,
                      fontSize: fs(15),
                      fontWeight: FontWeight.bold as any,
                      marginTop: 2,
                    }}
                  >
                    {stats.best ? `${stats.best.emoji} ${stats.best.date}` : '–'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: palette.textSecondary,
                      fontSize: fs(12),
                    }}
                  >
                    Toughest day
                  </Text>
                  <Text
                    style={{
                      color: palette.textPrimary,
                      fontSize: fs(15),
                      fontWeight: FontWeight.bold as any,
                      marginTop: 2,
                    }}
                  >
                    {stats.worst ? `${stats.worst.emoji} ${stats.worst.date}` : '–'}
                  </Text>
                </View>
              </View>
            </Card>

            {topTags.length > 0 ? (
              <Card bordered>
                <SectionHeader title="Top tags" subtitle="What influences your mood most" />
                <View style={styles.tagsRow}>
                  {topTags.map(([tag, count]) => (
                    <Chip key={tag} label={`${tag} · ${count}`} />
                  ))}
                </View>
              </Card>
            ) : null}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  chartHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  rangeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  hiRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
