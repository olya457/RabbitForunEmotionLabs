import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodEntry } from '../types/mood';

const KEY = 'bunnymood_mood_entries';

export async function getMoodEntries(): Promise<MoodEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const list: MoodEntry[] = raw ? JSON.parse(raw) : [];
    return list.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export async function addMoodEntry(entry: MoodEntry): Promise<void> {
  try {
    const current = await getMoodEntries();
    const updated = [entry, ...current];
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
}

export async function deleteMoodEntry(id: string): Promise<void> {
  try {
    const current = await getMoodEntries();
    const updated = current.filter(e => e.id !== id);
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
}

export async function clearMoodEntries(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {}
}

export function getMoodStats(entries: MoodEntry[]) {
  if (entries.length === 0) {
    return {
      total: 0,
      average: 0,
      streak: 0,
      best: null as MoodEntry | null,
      worst: null as MoodEntry | null,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>,
    };
  }

  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  let best: MoodEntry = entries[0];
  let worst: MoodEntry = entries[0];

  for (const e of entries) {
    distribution[e.level] += 1;
    sum += e.level;
    if (e.level > best.level) best = e;
    if (e.level < worst.level) worst = e;
  }

  const streak = calcStreak(entries);

  return {
    total: entries.length,
    average: Math.round((sum / entries.length) * 10) / 10,
    streak,
    best,
    worst,
    distribution,
  };
}

function calcStreak(entries: MoodEntry[]): number {
  if (entries.length === 0) return 0;

  const uniqueDays = new Set<string>();
  for (const e of entries) uniqueDays.add(e.date);

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 400; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = isoDate(d);
    if (uniqueDays.has(key)) {
      streak += 1;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}

export function isoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getLastDays(entries: MoodEntry[], days: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result: { date: string; label: string; average: number; count: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = isoDate(d);
    const dayEntries = entries.filter(e => e.date === key);
    const avg =
      dayEntries.length > 0
        ? dayEntries.reduce((sum, e) => sum + e.level, 0) / dayEntries.length
        : 0;

    const label = d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);

    result.push({
      date: key,
      label,
      average: Math.round(avg * 10) / 10,
      count: dayEntries.length,
    });
  }

  return result;
}
