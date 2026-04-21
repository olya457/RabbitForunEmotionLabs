import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { Card } from '../components/common/Card';
import { Chip } from '../components/common/Chip';
import { SectionHeader } from '../components/common/SectionHeader';
import { useTheme, usePalette } from '../theme/ThemeContext';
import { ThemePreference } from '../store/settingsStore';
import { fs, ms } from '../utils/responsive';
import { FontWeight, Radius } from '../theme/spacing';
import { getMoodEntries, clearMoodEntries } from '../store/moodStore';
import { RootNavProp } from '../types/navigation';

export function SettingsScreen() {
  const palette = usePalette();
  const { preference, setPreference, mode } = useTheme();
  const navigation = useNavigation<RootNavProp>();

  const [entriesCount, setEntriesCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getMoodEntries().then(list => setEntriesCount(list.length));
    }, [])
  );

  const confirmClear = () => {
    Alert.alert(
      'Clear mood data?',
      'This deletes all mood diary entries. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearMoodEntries();
            setEntriesCount(0);
          },
        },
      ]
    );
  };

  const Row = ({
    icon,
    title,
    subtitle,
    right,
    onPress,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
    onPress?: () => void;
  }) => {
    const Body = (
      <View style={styles.row}>
        <View
          style={[
            styles.rowIcon,
            { backgroundColor: palette.cardActive, borderRadius: Radius.sm },
          ]}
        >
          <Text style={{ fontSize: fs(16) }}>{icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: palette.textPrimary,
              fontSize: fs(14),
              fontWeight: FontWeight.semibold as any,
            }}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={{
                color: palette.textSecondary,
                fontSize: fs(12),
                marginTop: 2,
              }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        {right ? <View>{right}</View> : null}
      </View>
    );

    if (onPress) {
      return (
        <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
          {Body}
        </TouchableOpacity>
      );
    }
    return Body;
  };

  return (
    <ScreenContainer backgroundImage={require('../assets/bg_main.png')}>
      <ScreenHeader title="Settings" subtitle="Preferences & data" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: ms(20),
          paddingTop: ms(8),
          paddingBottom: ms(40),
          gap: ms(14),
        }}
      >
        <Card bordered>
          <SectionHeader title="Appearance" subtitle={`Currently ${mode} mode`} />
          <View style={styles.themeRow}>
            {(['system', 'light', 'dark'] as ThemePreference[]).map(p => (
              <Chip
                key={p}
                label={p.charAt(0).toUpperCase() + p.slice(1)}
                emoji={p === 'system' ? '⚙️' : p === 'light' ? '☀️' : '🌙'}
                selected={preference === p}
                onPress={() => setPreference(p)}
                style={{ flex: 1 }}
              />
            ))}
          </View>
        </Card>

        <Card bordered>
          <SectionHeader title="Data" subtitle="Manage your saved content" />
          <View style={{ gap: 10 }}>
            <Row
              icon="📔"
              title="Mood entries"
              subtitle={`${entriesCount} saved`}
            />
            <Row
              icon="💾"
              title="Saved quotes"
              subtitle="View your saved bunny quotes"
              onPress={() => navigation.navigate('Saved')}
            />
            <Row
              icon="🗑️"
              title="Clear mood data"
              subtitle="Delete all diary entries"
              onPress={confirmClear}
            />
          </View>
        </Card>

        <Card bordered>
          <SectionHeader title="About" />
          <View style={{ gap: 10 }}>
            <Row icon="🐰" title="BunnyMood" subtitle="Version 0.0.2" />
            <Row
              icon="⭐"
              title="Rate the app"
              subtitle="If you enjoy BunnyMood, leave a review"
              onPress={() => Linking.openURL('https://apps.apple.com')}
            />
            <Row
              icon="💌"
              title="Send feedback"
              subtitle="Tell us how we can improve"
              onPress={() => Linking.openURL('mailto:support@example.com')}
            />
          </View>
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  themeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  rowIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
