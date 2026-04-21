export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  level: MoodLevel;
  emoji: string;
  label: string;
  note?: string;
  tags: string[];
  createdAt: number;
  date: string;
}

export interface MoodOption {
  level: MoodLevel;
  emoji: string;
  label: string;
  color: keyof {
    moodGreat: string;
    moodGood: string;
    moodOkay: string;
    moodLow: string;
    moodBad: string;
  };
}
