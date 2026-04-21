import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { Card } from '../components/common/Card';
import { Chip } from '../components/common/Chip';
import { SectionHeader } from '../components/common/SectionHeader';
import { MoodPicker } from '../components/mood/MoodPicker';
import { MoodEntryCard } from '../components/mood/MoodEntryCard';
import { EmptyState } from '../components/common/EmptyState';
import { MOOD_OPTIONS, MOOD_TAGS, MOOD_TIPS } from '../data/moodData';
import { MoodEntry, MoodOption } from '../types/mood';
import {
  addMoodEntry,
  deleteMoodEntry,
  getMoodEntries,
  isoDate,
} from '../store/moodStore';
import { usePalette } from '../theme/ThemeContext';
import { fs, ms, getScreenSize } from '../utils/responsive';
import { FontWeight, Radius } from '../theme/spacing';
import { AppNavProp } from '../types/navigation';

export function MoodDiaryScreen() {
  const palette = usePalette();
  const { isVerySmall } = getScreenSize();
  const navigation = useNavigation<AppNavProp>();

  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selected, setSelected] = useState<MoodOption | null>(null);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getMoodEntries().then(setEntries);
    }, [])
  );

  const today = new Date();
  const todayLabel = today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const todayEntries = useMemo(
    () => entries.filter(e => e.date === isoDate(today)),
    [entries]
  );

  const tip = useMemo(() => {
    if (!selected) return null;
    const list = MOOD_TIPS[selected.level];
    return list[Math.floor(Math.random() * list.length)];
  }, [selected?.level]);

  const toggleTag = (id: string) => {
    setTags(prev => (prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]));
  };

  const handleSave = async () => {
    if (!selected || saving) return;
    setSaving(true);

    const entry: MoodEntry = {
      id: Date.now().toString(),
      level: selected.level,
      emoji: selected.emoji,
      label: selected.label,
      note: note.trim() || undefined,
      tags,
      createdAt: Date.now(),
      date: isoDate(new Date()),
    };

    await addMoodEntry(entry);
    const updated = await getMoodEntries();
    setEntries(updated);

    setSelected(null);
    setNote('');
    setTags([]);
    setSaving(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete entry?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteMoodEntry(id);
          const updated = await getMoodEntries();
          setEntries(updated);
        },
      },
    ]);
  };

  return (
    <ScreenContainer backgroundImage={require('../assets/bg_main.png')}>
      <ScreenHeader
        title="Mood Diary"
        subtitle={todayLabel}
        emoji="📔"
        rightEmoji="📊"
        onRightPress={() => navigation.navigate('Stats')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: ms(20),
          paddingTop: ms(8),
          paddingBottom: ms(120),
          gap: ms(14),
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Card bordered>
          <Text
            style={{
              color: palette.textPrimary,
              fontSize: fs(isVerySmall ? 15 : 16),
              fontWeight: FontWeight.bold as any,
              marginBottom: 10,
            }}
          >
            How are you feeling?
          </Text>
          <MoodPicker selected={selected?.level ?? null} onSelect={setSelected} />

          {selected ? (
            <>
              <Text
                style={{
                  color: palette.textSecondary,
                  fontSize: fs(12),
                  marginTop: 12,
                }}
              >
                What is on your mind? (optional)
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                multiline
                placeholder="A short note about this moment…"
                placeholderTextColor={palette.textTertiary}
                style={{
                  backgroundColor: palette.cardActive,
                  color: palette.textPrimary,
                  borderRadius: Radius.md,
                  padding: ms(12),
                  marginTop: 6,
                  minHeight: ms(70),
                  textAlignVertical: 'top',
                  fontSize: fs(13),
                }}
                maxLength={240}
              />

              <Text
                style={{
                  color: palette.textSecondary,
                  fontSize: fs(12),
                  marginTop: 12,
                }}
              >
                Tags
              </Text>
              <View style={styles.tagsRow}>
                {MOOD_TAGS.map(t => (
                  <Chip
                    key={t.id}
                    label={t.label}
                    emoji={t.emoji}
                    selected={tags.includes(t.id)}
                    onPress={() => toggleTag(t.id)}
                  />
                ))}
              </View>

              {tip ? (
                <View
                  style={[
                    styles.tipBox,
                    {
                      backgroundColor: palette.cardActive,
                      borderLeftColor: palette[selected.color],
                      borderRadius: Radius.md,
                    },
                  ]}
                >
                  <Text style={{ fontSize: fs(18) }}>💡</Text>
                  <Text
                    style={{
                      color: palette.textSecondary,
                      fontSize: fs(12),
                      lineHeight: fs(18),
                      flex: 1,
                    }}
                  >
                    {tip}
                  </Text>
                </View>
              ) : null}

              <PrimaryButton
                label={saving ? 'Saving…' : 'Save entry'}
                icon="✓"
                onPress={handleSave}
                disabled={saving}
                style={{ marginTop: 10 }}
              />
            </>
          ) : (
            <Text
              style={{
                color: palette.textTertiary,
                fontSize: fs(12),
                marginTop: 10,
                textAlign: 'center',
              }}
            >
              Tap a mood to log how you feel today
            </Text>
          )}
        </Card>

        <View>
          <SectionHeader
            title="Today"
            subtitle={`${todayEntries.length} entr${todayEntries.length === 1 ? 'y' : 'ies'}`}
          />
          {todayEntries.length === 0 ? (
            <Card>
              <Text
                style={{
                  color: palette.textSecondary,
                  fontSize: fs(13),
                  textAlign: 'center',
                  paddingVertical: 14,
                }}
              >
                No mood logged yet today. Pick one above!
              </Text>
            </Card>
          ) : (
            <View style={{ gap: 10 }}>
              {todayEntries.map(entry => (
                <MoodEntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
              ))}
            </View>
          )}
        </View>

        {entries.length > todayEntries.length ? (
          <View>
            <SectionHeader
              title="Recent"
              actionLabel="See stats"
              onAction={() => navigation.navigate('Stats')}
            />
            <View style={{ gap: 10 }}>
              {entries.slice(0, 6).filter(e => !todayEntries.find(t => t.id === e.id)).map(entry => (
                <MoodEntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
              ))}
            </View>
          </View>
        ) : entries.length === 0 ? (
          <EmptyState
            emoji="🐇"
            title="Start your mood journey"
            description="Log how you feel every day to spot patterns and understand yourself better."
          />
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 4,
  },
});
