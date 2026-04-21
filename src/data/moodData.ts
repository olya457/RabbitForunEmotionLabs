import { MoodOption } from '../types/mood';

export const MOOD_OPTIONS: MoodOption[] = [
  { level: 5, emoji: '🤩', label: 'Amazing', color: 'moodGreat' },
  { level: 4, emoji: '😊', label: 'Good', color: 'moodGood' },
  { level: 3, emoji: '😐', label: 'Okay', color: 'moodOkay' },
  { level: 2, emoji: '😕', label: 'Low', color: 'moodLow' },
  { level: 1, emoji: '😢', label: 'Bad', color: 'moodBad' },
];

export const MOOD_TAGS = [
  { id: 'work', label: 'Work', emoji: '💼' },
  { id: 'family', label: 'Family', emoji: '👨\u200d👩\u200d👧' },
  { id: 'friends', label: 'Friends', emoji: '👯' },
  { id: 'health', label: 'Health', emoji: '💪' },
  { id: 'sleep', label: 'Sleep', emoji: '😴' },
  { id: 'food', label: 'Food', emoji: '🍔' },
  { id: 'hobby', label: 'Hobby', emoji: '🎨' },
  { id: 'sport', label: 'Sport', emoji: '🏃' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'study', label: 'Study', emoji: '📚' },
  { id: 'relax', label: 'Relax', emoji: '🛋️' },
  { id: 'money', label: 'Money', emoji: '💰' },
];

export const MOOD_TIPS: Record<number, string[]> = {
  5: [
    'Amazing! Take a moment to savor what made today so good.',
    'Share the joy — a kind word can brighten someone else too.',
    'Note what worked today so you can repeat it tomorrow.',
  ],
  4: [
    'A good day is a small win. Celebrate the little things.',
    'Pause and breathe — good moments deserve attention too.',
    'Try a quick gratitude note: 3 things that made you smile.',
  ],
  3: [
    'Middle of the road days are normal. Be kind to yourself.',
    'A 10-minute walk can gently lift your energy.',
    'Reach out to someone — a short message can shift your mood.',
  ],
  2: [
    'Low days pass. Try a slow, grounding breath: in 4, out 6.',
    'Hydrate, eat something warm, and let yourself rest.',
    'Write down one thing you are grateful for, however small.',
  ],
  1: [
    'It is okay to feel bad. You are not alone in this.',
    'Try 5 minutes of slow breathing. Your body will follow.',
    'If things feel heavy, talk to someone you trust.',
  ],
};
