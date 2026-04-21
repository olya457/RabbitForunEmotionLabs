import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Share,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  EMOTION_ROUNDS,
  EMOTION_QUIZ_CONFIG,
  EMOTION_RESULT_TIERS,
} from '../data/emotionsQuizData';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { QuizOption } from '../components/quiz/QuizOption';
import { ProgressBar } from '../components/common/ProgressBar';
import { BunnyImage } from '../components/quiz/BunnyImage';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { IconBadge } from '../components/common/IconBadge';
import { StatTile } from '../components/common/StatTile';
import { usePalette } from '../theme/ThemeContext';
import { fs, ms, pick, getScreenSize } from '../utils/responsive';
import { FontWeight } from '../theme/spacing';

type Step = 'home' | 'intro' | 'quiz' | 'result';

export function EmotionsScreen() {
  const palette = usePalette();
  const { isVerySmall, isSmall } = getScreenSize();

  const [step, setStep] = useState<Step>('home');
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EMOTION_QUIZ_CONFIG.secondsPerRound);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const round = EMOTION_ROUNDS[roundIndex];
  const bunnySize = pick({ xs: 130, sm: 150, md: 170, lg: 190 }, 170);

  useEffect(() => {
    if (step !== 'quiz') return;

    setTimeLeft(EMOTION_QUIZ_CONFIG.secondsPerRound);
    setSelected(null);
    setAnswered(false);

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setAnswered(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, roundIndex]);

  const handleSelect = (option: string) => {
    if (answered) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelected(option);
    setAnswered(true);

    if (option === round.correctAnswer) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (roundIndex < EMOTION_ROUNDS.length - 1) {
      setRoundIndex(i => i + 1);
    } else {
      setStep('result');
    }
  };

  const handleReset = () => {
    setStep('home');
    setRoundIndex(0);
    setScore(0);
    setSelected(null);
    setAnswered(false);
    setTimeLeft(EMOTION_QUIZ_CONFIG.secondsPerRound);
  };

  const tier = EMOTION_RESULT_TIERS.find(t => score >= t.minScore && score <= t.maxScore)!;

  const getOptionState = (option: string) => {
    if (!answered) return 'default';
    if (option === round.correctAnswer) return 'correct';
    if (option === selected) return 'wrong';
    return 'default';
  };

  return (
    <ScreenContainer backgroundImage={require('../assets/bg_main.png')}>
      {(step === 'home' || step === 'intro' || step === 'result') && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: ms(20), paddingBottom: ms(100) },
          ]}
        >
          {step === 'home' && (
            <View style={[styles.centered, { gap: isVerySmall ? 10 : 14 }]}>
              <BunnyImage source={require('../assets/bunny_thinking.png')} size={bunnySize} />

              <IconBadge emoji="🎯" />

              <Text
                style={[
                  styles.title,
                  { color: palette.textPrimary, fontSize: fs(isVerySmall ? 20 : 24) },
                ]}
              >
                Guess the Emotion!
              </Text>

              <Text
                style={[
                  styles.body,
                  {
                    color: palette.textSecondary,
                    fontSize: fs(isVerySmall ? 12 : 14),
                    lineHeight: fs(isVerySmall ? 18 : 22),
                  },
                ]}
              >
                A bunny will show you an emotion. Pick the right one from 3 options — you only
                have 10 seconds per question!
              </Text>

              <PrimaryButton label="Next" icon="▶" onPress={() => setStep('intro')} />
            </View>
          )}

          {step === 'intro' && (
            <View style={[styles.centered, { gap: isVerySmall ? 10 : 14 }]}>
              <BunnyImage source={require('../assets/bunny_thinking.png')} size={bunnySize} />

              <Text
                style={[
                  styles.title,
                  { color: palette.textPrimary, fontSize: fs(isVerySmall ? 20 : 24) },
                ]}
              >
                5 Rounds, 10 Seconds Each
              </Text>

              <Text
                style={[
                  styles.body,
                  {
                    color: palette.textSecondary,
                    fontSize: fs(isVerySmall ? 12 : 14),
                    lineHeight: fs(isVerySmall ? 18 : 22),
                  },
                ]}
              >
                Answer quickly and correctly to get the highest score. Ready to test your
                emotional intelligence?
              </Text>

              <PrimaryButton label="Start quiz" onPress={() => setStep('quiz')} />
            </View>
          )}

          {step === 'result' && (
            <View style={[styles.centered, { gap: isVerySmall ? 10 : 14 }]}>
              <BunnyImage source={require('../assets/bunny_default.png')} size={bunnySize} />

              <Text
                style={[
                  styles.bigScore,
                  { color: palette.textPrimary, fontSize: fs(isVerySmall ? 40 : 52) },
                ]}
              >
                {score}/{EMOTION_ROUNDS.length}
              </Text>

              <Text
                style={[
                  styles.tierTitle,
                  { color: palette.pink, fontSize: fs(isVerySmall ? 18 : 20) },
                ]}
              >
                {tier.title} {tier.emoji}
              </Text>

              <View style={styles.statsRow}>
                <StatTile label="Correct" value={score} emoji="✅" />
                <StatTile
                  label="Wrong"
                  value={EMOTION_ROUNDS.length - score}
                  emoji="❌"
                />
                <StatTile
                  label="Accuracy"
                  value={`${Math.round((score / EMOTION_ROUNDS.length) * 100)}%`}
                  emoji="🎯"
                />
              </View>

              <PrimaryButton
                label="Share"
                icon="↗"
                onPress={() =>
                  Share.share({
                    message: `I scored ${score}/${EMOTION_ROUNDS.length} on BunnyMood Emotions! ${tier.emoji}`,
                  })
                }
              />

              <TouchableOpacity onPress={handleReset} activeOpacity={0.75}>
                <Text
                  style={{
                    color: palette.textSecondary,
                    fontSize: fs(13),
                    fontWeight: FontWeight.semibold as any,
                    marginTop: 6,
                  }}
                >
                  Play again
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {step === 'quiz' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: ms(20), paddingBottom: ms(110) },
          ]}
        >
          <View style={[styles.quizWrap, { gap: isVerySmall ? 10 : 14 }]}>
            <View style={styles.quizTopRow}>
              <Text style={[styles.topLabel, { color: palette.textSecondary, fontSize: fs(12) }]}>
                Time left
              </Text>
              <Text
                style={[styles.topLabel, { color: palette.textSecondary, fontSize: fs(12) }]}
              >
                {roundIndex + 1}/{EMOTION_ROUNDS.length}
              </Text>
            </View>

            <Text
              style={[
                styles.timerValue,
                { color: palette.textPrimary, fontSize: fs(isVerySmall ? 22 : 26) },
              ]}
            >
              {timeLeft}s
            </Text>

            <ProgressBar progress={timeLeft / EMOTION_QUIZ_CONFIG.secondsPerRound} />

            <Text
              style={[
                styles.question,
                { color: palette.textPrimary, fontSize: fs(isVerySmall ? 14 : 16) },
              ]}
            >
              What emotion is this bunny showing?
            </Text>

            <View style={styles.bunnyCenter}>
              <BunnyImage
                source={round.bunnyImage}
                size={isVerySmall ? 130 : isSmall ? 150 : 170}
              />
            </View>

            <View style={{ gap: isVerySmall ? 8 : 10 }}>
              {round.options.map(opt => (
                <QuizOption
                  key={opt}
                  label={opt}
                  state={getOptionState(opt)}
                  onPress={() => handleSelect(opt)}
                  disabled={answered}
                />
              ))}
            </View>

            {answered ? (
              <PrimaryButton
                label={
                  roundIndex < EMOTION_ROUNDS.length - 1 ? 'Next question' : 'See result'
                }
                onPress={handleNext}
              />
            ) : null}
          </View>
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingTop: 8,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizWrap: {
    flex: 1,
    paddingTop: 4,
  },
  quizTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topLabel: {
    fontWeight: FontWeight.semibold as any,
  },
  timerValue: {
    textAlign: 'center',
    fontWeight: FontWeight.extrabold as any,
  },
  question: {
    textAlign: 'center',
    fontWeight: FontWeight.semibold as any,
  },
  bunnyCenter: {
    alignItems: 'center',
  },
  title: {
    fontWeight: FontWeight.bold as any,
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
  },
  bigScore: {
    fontWeight: FontWeight.extrabold as any,
    textAlign: 'center',
  },
  tierTitle: {
    fontWeight: FontWeight.bold as any,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
});
