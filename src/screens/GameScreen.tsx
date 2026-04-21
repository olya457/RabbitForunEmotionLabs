import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Share,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { GAME_ROUNDS, GAME_RESULT_TIERS } from '../data/gameData';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { BunnyImage } from '../components/quiz/BunnyImage';
import { ProgressBar } from '../components/common/ProgressBar';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { IconBadge } from '../components/common/IconBadge';
import { usePalette } from '../theme/ThemeContext';
import { fs, ms, pick, getScreenSize, getScreen } from '../utils/responsive';
import { FontWeight } from '../theme/spacing';

type Step = 'home' | 'intro' | 'play' | 'round_result' | 'result';
const MAX_ATTEMPTS = 1;

export function GameScreen() {
  const palette = usePalette();
  const { isVerySmall, isSmall } = getScreenSize();
  const { width } = getScreen();

  const [step, setStep] = useState<Step>('home');
  const [roundIndex, setRoundIndex] = useState(0);
  const [scores, setScores] = useState<boolean[]>([]);
  const [uniqueIndex, setUniqueIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [wrongIndexes, setWrongIndexes] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [roundWon, setRoundWon] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [failReason, setFailReason] = useState<'time' | 'attempts' | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const round = GAME_ROUNDS[roundIndex];
  const totalCells = round.gridColumns * round.gridRows;

  const bunnyIntroSize = pick({ xs: 110, sm: 130, md: 160, lg: 180 }, 150);

  useEffect(() => {
    if (step !== 'play') return;

    const idx = Math.floor(Math.random() * totalCells);
    setUniqueIndex(idx);
    setSelected(null);
    setWrongIndexes([]);
    setAttemptsLeft(MAX_ATTEMPTS);
    setTimeLeft(round.timeSeconds);
    setRoundWon(false);
    setFailReason(null);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setRoundWon(false);
          setFailReason('time');
          setScores(cur => [...cur, false]);
          setStep('round_result');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, roundIndex, totalCells, round.timeSeconds]);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const finishRound = (won: boolean, reason?: 'time' | 'attempts') => {
    stopTimer();
    setRoundWon(won);
    setFailReason(won ? null : reason ?? null);
    setScores(prev => [...prev, won]);
    setStep('round_result');
  };

  const handleCellPress = (index: number) => {
    if (step !== 'play' || selected !== null || wrongIndexes.includes(index)) return;

    if (index === uniqueIndex) {
      setSelected(index);
      finishRound(true);
      return;
    }

    const nextAttempts = attemptsLeft - 1;
    setWrongIndexes(prev => [...prev, index]);

    if (nextAttempts <= 0) {
      setSelected(index);
      setAttemptsLeft(0);
      finishRound(false, 'attempts');
      return;
    }

    setAttemptsLeft(nextAttempts);
  };

  const handleNextRound = () => {
    if (roundIndex < GAME_ROUNDS.length - 1) {
      setRoundIndex(prev => prev + 1);
      setStep('play');
    } else {
      setStep('result');
    }
  };

  const handleReset = () => {
    stopTimer();
    setStep('home');
    setRoundIndex(0);
    setScores([]);
    setUniqueIndex(0);
    setSelected(null);
    setWrongIndexes([]);
    setTimeLeft(0);
    setRoundWon(false);
    setAttemptsLeft(MAX_ATTEMPTS);
    setFailReason(null);
  };

  const totalScore = scores.filter(Boolean).length;
  const tier =
    GAME_RESULT_TIERS.find(t => totalScore >= t.minScore && totalScore <= t.maxScore) ||
    GAME_RESULT_TIERS[0];

  const horizontalPad = ms(40);
  const gap = isVerySmall ? 5 : isSmall ? 7 : 8;
  const availableWidth = width - horizontalPad - (round.gridColumns - 1) * gap;
  const rawSize = availableWidth / round.gridColumns;
  const maxSize = isVerySmall ? 58 : isSmall ? 68 : 80;
  const cellSize = Math.min(rawSize, maxSize);
  const bunnyImageSize = Math.round(cellSize * 0.82);

  return (
    <ScreenContainer backgroundImage={require('../assets/bg_main.png')}>
      {(step === 'home' || step === 'intro' || step === 'round_result' || step === 'result') && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingHorizontal: ms(20), paddingBottom: ms(110) },
          ]}
        >
          {step === 'home' ? (
            <View style={[styles.centered, { gap: isVerySmall ? 10 : 14 }]}>
              <BunnyImage
                source={require('../assets/bunny_magnifier.png')}
                size={bunnyIntroSize}
              />

              <IconBadge emoji="🔍" />

              <Text
                style={[
                  styles.title,
                  { color: palette.textPrimary, fontSize: fs(isVerySmall ? 20 : 24) },
                ]}
              >
                Find the Unique Bunny!
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
                A grid of bunnies will appear. Only one bunny is different. Find it before time
                runs out.
              </Text>

              <PrimaryButton label="Next" onPress={() => setStep('intro')} />
            </View>
          ) : null}

          {step === 'intro' ? (
            <View style={[styles.centered, { gap: isVerySmall ? 10 : 14 }]}>
              <BunnyImage
                source={require('../assets/bunny_magnifier.png')}
                size={bunnyIntroSize}
              />

              <Text
                style={[
                  styles.title,
                  { color: palette.textPrimary, fontSize: fs(isVerySmall ? 20 : 24) },
                ]}
              >
                3 Rounds, 1 Attempt
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
                You have only one attempt per round. One wrong tap ends the round, so choose
                carefully.
              </Text>

              <PrimaryButton label="Start Game 🔍" onPress={() => setStep('play')} />
            </View>
          ) : null}

          {step === 'round_result' ? (
            <View style={[styles.centered, { gap: isVerySmall ? 10 : 14 }]}>
              <BunnyImage
                source={require('../assets/bunny_magnifier.png')}
                size={bunnyIntroSize}
              />

              <Text style={{ fontSize: fs(isVerySmall ? 42 : 52) }}>
                {roundWon ? '🎯' : '❌'}
              </Text>

              <Text
                style={[
                  styles.roundTitle,
                  {
                    color: roundWon ? palette.success : palette.danger,
                    fontSize: fs(isVerySmall ? 22 : 28),
                  },
                ]}
              >
                {roundWon ? 'Found it!' : 'Round lost'}
              </Text>

              <Text
                style={[
                  styles.body,
                  {
                    color: palette.textSecondary,
                    fontSize: fs(isVerySmall ? 12 : 14),
                  },
                ]}
              >
                {roundWon
                  ? 'You found the unique bunny.'
                  : failReason === 'attempts'
                  ? 'Wrong tap. The round is over.'
                  : 'Time is over.'}
              </Text>

              <Text
                style={[
                  styles.body,
                  {
                    color: palette.textSecondary,
                    fontSize: fs(isVerySmall ? 12 : 14),
                  },
                ]}
              >
                Score: {scores.filter(Boolean).length}/{scores.length} rounds
              </Text>

              <PrimaryButton
                label={
                  roundIndex < GAME_ROUNDS.length - 1
                    ? `Round ${roundIndex + 2} →`
                    : 'See result'
                }
                onPress={handleNextRound}
              />
            </View>
          ) : null}

          {step === 'result' && tier ? (
            <View style={[styles.centered, { gap: isVerySmall ? 10 : 14 }]}>
              <BunnyImage
                source={require('../assets/bunny_magnifier.png')}
                size={bunnyIntroSize}
              />

              <Text
                style={[
                  styles.bigScore,
                  { color: palette.textPrimary, fontSize: fs(isVerySmall ? 40 : 52) },
                ]}
              >
                {totalScore}/3
              </Text>

              <Text
                style={[
                  styles.tierTitle,
                  { color: palette.pink, fontSize: fs(isVerySmall ? 18 : 22) },
                ]}
              >
                {tier.title} {tier.emoji}
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
                {tier.description}
              </Text>

              <View style={styles.dotsRow}>
                {scores.map((won, i) => (
                  <View
                    key={i}
                    style={[
                      styles.scoreDot,
                      { backgroundColor: won ? palette.success : palette.danger },
                    ]}
                  />
                ))}
              </View>

              <PrimaryButton
                label="Share"
                icon="↗"
                onPress={() =>
                  Share.share({
                    message: `I scored ${totalScore}/3 in Find the Unique Bunny! ${tier.emoji} #BunnyMood`,
                  })
                }
              />

              <TouchableOpacity onPress={handleReset} activeOpacity={0.75}>
                <Text
                  style={{
                    color: palette.textSecondary,
                    fontSize: fs(13),
                    fontWeight: FontWeight.semibold as any,
                  }}
                >
                  Play again
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </ScrollView>
      )}

      {step === 'play' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingHorizontal: ms(20), paddingBottom: ms(110) },
          ]}
        >
          <View style={[styles.playWrap, { gap: isVerySmall ? 8 : 12 }]}>
            <View style={styles.playHeader}>
              <Text
                style={{
                  color: palette.textSecondary,
                  fontSize: fs(13),
                  fontWeight: FontWeight.semibold as any,
                }}
              >
                Round {round.roundNumber}/{GAME_ROUNDS.length}
              </Text>
              <Text
                style={{
                  color: palette.textPrimary,
                  fontSize: fs(isVerySmall ? 20 : 24),
                  fontWeight: FontWeight.extrabold as any,
                }}
              >
                {timeLeft}s
              </Text>
            </View>

            <ProgressBar progress={timeLeft / round.timeSeconds} />

            <Text
              style={{
                color: palette.textPrimary,
                fontSize: fs(isVerySmall ? 13 : 14),
                fontWeight: FontWeight.semibold as any,
                textAlign: 'center',
              }}
            >
              Find the bunny that is different
            </Text>
            <Text
              style={{
                color: palette.pink,
                fontSize: fs(12),
                fontWeight: FontWeight.bold as any,
                textAlign: 'center',
              }}
            >
              Attempts: {attemptsLeft}/{MAX_ATTEMPTS}
            </Text>

            <View style={[styles.grid, { gap }]}>
              {Array.from({ length: totalCells }).map((_, i) => {
                const isWrong = wrongIndexes.includes(i);
                const isCorrectSelected = selected === i && i === uniqueIndex;

                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.cell,
                      {
                        width: cellSize,
                        height: cellSize,
                        borderRadius: isVerySmall ? 10 : 12,
                        backgroundColor: palette.pink,
                        opacity: isWrong ? 0.4 : 1,
                        borderWidth: isCorrectSelected ? 2 : 0,
                        borderColor: isCorrectSelected ? palette.success : 'transparent',
                      },
                    ]}
                    onPress={() => handleCellPress(i)}
                    activeOpacity={0.85}
                    disabled={isWrong}
                  >
                    <Image
                      source={
                        i === uniqueIndex
                          ? require('../assets/bunny_magnifier.png')
                          : require('../assets/bunny_default.png')
                      }
                      style={{ width: bunnyImageSize, height: bunnyImageSize }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingTop: 8,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playWrap: {
    flex: 1,
  },
  playHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    marginTop: 4,
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
  roundTitle: {
    fontWeight: FontWeight.extrabold as any,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  scoreDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
  },
});
