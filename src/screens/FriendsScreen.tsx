import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Share,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { PERSONALITY_QUESTIONS } from '../data/personalityQuizData';
import { COMPATIBILITY_MATRIX } from '../data/friendsQuizData';
import { BUNNY_TYPES, BunnyTypeId } from '../data/bunnyTypes';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { QuizOption } from '../components/quiz/QuizOption';
import { ProgressBar } from '../components/common/ProgressBar';
import { BunnyImage } from '../components/quiz/BunnyImage';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { IconBadge } from '../components/common/IconBadge';
import { usePalette } from '../theme/ThemeContext';
import { fs, ms, pick, getScreenSize } from '../utils/responsive';
import { FontWeight } from '../theme/spacing';

type Step = 'home' | 'intro' | 'quiz1' | 'handoff' | 'quiz2' | 'result';

export function FriendsScreen() {
  const palette = usePalette();
  const { isVerySmall } = getScreenSize();

  const [step, setStep] = useState<Step>('home');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores1, setScores1] = useState<Record<BunnyTypeId, number>>({
    happy: 0,
    angry: 0,
    smart: 0,
    wild: 0,
  });
  const [scores2, setScores2] = useState<Record<BunnyTypeId, number>>({
    happy: 0,
    angry: 0,
    smart: 0,
    wild: 0,
  });
  const [type1, setType1] = useState<BunnyTypeId | null>(null);
  const [type2, setType2] = useState<BunnyTypeId | null>(null);

  const question = PERSONALITY_QUESTIONS[questionIndex];

  const duoSize = pick({ xs: 140, sm: 170, md: 200, lg: 220 }, 190);
  const quizBunnySize = pick({ xs: 130, sm: 150, md: 160, lg: 180 }, 160);
  const resultBunnySize = pick({ xs: 80, sm: 95, md: 110, lg: 120 }, 100);

  const getWinner = (s: Record<BunnyTypeId, number>): BunnyTypeId =>
    (Object.keys(s) as BunnyTypeId[]).reduce((a, b) => (s[a] >= s[b] ? a : b));

  const getCompatibilityLabel = (percentage: number) => {
    if (percentage >= 90) return 'Best Bunny Match';
    if (percentage >= 75) return 'Great Friendship Match';
    if (percentage >= 60) return 'Good Bunny Connection';
    if (percentage >= 40) return 'Playful Bunny Duo';
    return 'Different but Fun Pair';
  };

  const handleSelect1 = (type: BunnyTypeId) => {
    const newScores = { ...scores1, [type]: scores1[type] + 1 };
    setScores1(newScores);

    if (questionIndex < PERSONALITY_QUESTIONS.length - 1) {
      setQuestionIndex(i => i + 1);
    } else {
      setType1(getWinner(newScores));
      setQuestionIndex(0);
      setStep('handoff');
    }
  };

  const handleSelect2 = (type: BunnyTypeId) => {
    const newScores = { ...scores2, [type]: scores2[type] + 1 };
    setScores2(newScores);

    if (questionIndex < PERSONALITY_QUESTIONS.length - 1) {
      setQuestionIndex(i => i + 1);
    } else {
      setType2(getWinner(newScores));
      setStep('result');
    }
  };

  const handleReset = () => {
    setStep('home');
    setQuestionIndex(0);
    setScores1({ happy: 0, angry: 0, smart: 0, wild: 0 });
    setScores2({ happy: 0, angry: 0, smart: 0, wild: 0 });
    setType1(null);
    setType2(null);
  };

  const compatibility = type1 && type2 ? COMPATIBILITY_MATRIX[type1][type2] : null;
  const bunny1 = type1 ? BUNNY_TYPES[type1] : null;
  const bunny2 = type2 ? BUNNY_TYPES[type2] : null;

  return (
    <ScreenContainer backgroundImage={require('../assets/bg_main.png')}>
      {(step === 'home' || step === 'intro' || step === 'handoff') && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingHorizontal: ms(20), paddingBottom: ms(110) },
          ]}
        >
          <View style={[styles.centered, { gap: isVerySmall ? 10 : 14 }]}>
            <BunnyImage
              source={require('../assets/bunny_duo.png')}
              size={duoSize}
              bordered={false}
            />

            {step === 'home' ? <IconBadge emoji="👥" /> : null}

            {step === 'handoff' && bunny1 ? (
              <Text
                style={{
                  color: palette.pink,
                  fontSize: fs(isVerySmall ? 16 : 18),
                  fontWeight: FontWeight.bold as any,
                }}
              >
                Player 1 · {bunny1.emoji} {bunny1.name}
              </Text>
            ) : null}

            <Text
              style={[
                styles.title,
                { color: palette.textPrimary, fontSize: fs(isVerySmall ? 20 : 24) },
              ]}
            >
              {step === 'home'
                ? 'Friendship Compatibility!'
                : step === 'intro'
                ? 'Take Turns!'
                : 'Now Player 2!'}
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
              {step === 'home'
                ? 'Find out how compatible you and your friend are as bunnies! Take turns answering and discover your friendship bond.'
                : step === 'intro'
                ? 'Player 1 answers first, then Player 2. At the end we will reveal both bunny types and your compatibility score.'
                : 'Pass the phone to your friend — it is their turn to answer the quiz.'}
            </Text>

            <PrimaryButton
              label={
                step === 'home'
                  ? 'Next'
                  : step === 'intro'
                  ? 'Start Compatibility 🐰'
                  : 'Player 2, Ready! 🐰'
              }
              onPress={() =>
                setStep(step === 'home' ? 'intro' : step === 'intro' ? 'quiz1' : 'quiz2')
              }
            />
          </View>
        </ScrollView>
      )}

      {(step === 'quiz1' || step === 'quiz2') && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingHorizontal: ms(20), paddingBottom: ms(110) },
          ]}
        >
          <View style={[styles.quizWrap, { gap: isVerySmall ? 10 : 14 }]}>
            <Text
              style={{
                color: palette.pink,
                fontSize: fs(13),
                fontWeight: FontWeight.bold as any,
                textAlign: 'center',
              }}
            >
              {step === 'quiz1' ? 'Player 1' : 'Player 2'}
            </Text>

            <ProgressBar progress={(questionIndex + 1) / PERSONALITY_QUESTIONS.length} />

            <Text
              style={{
                color: palette.textSecondary,
                fontSize: fs(12),
                textAlign: 'center',
              }}
            >
              Question {questionIndex + 1} of {PERSONALITY_QUESTIONS.length}
            </Text>

            <View style={{ alignItems: 'center' }}>
              <BunnyImage source={require('../assets/bunny_walking.png')} size={quizBunnySize} />
            </View>

            <Text
              style={[
                styles.question,
                { color: palette.textPrimary, fontSize: fs(isVerySmall ? 14 : 16) },
              ]}
            >
              {question.question}
            </Text>

            <View style={{ gap: isVerySmall ? 8 : 10 }}>
              {question.options.map(opt => (
                <QuizOption
                  key={opt.type}
                  label={opt.text}
                  onPress={() =>
                    step === 'quiz1' ? handleSelect1(opt.type) : handleSelect2(opt.type)
                  }
                />
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {step === 'result' && compatibility && bunny1 && bunny2 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingHorizontal: ms(20), paddingBottom: ms(110) },
          ]}
        >
          <View style={[styles.resultWrap, { gap: isVerySmall ? 10 : 14 }]}>
            <Text
              style={{
                color: palette.textSecondary,
                fontSize: fs(isVerySmall ? 14 : 16),
                fontWeight: FontWeight.bold as any,
              }}
            >
              Compatibility Results
            </Text>

            <View style={styles.bunniesRow}>
              <View style={styles.bunnyCol}>
                <BunnyImage source={bunny1.image} size={resultBunnySize} />
                <Text
                  style={{
                    color: palette.textPrimary,
                    fontSize: fs(12),
                    fontWeight: FontWeight.semibold as any,
                    textAlign: 'center',
                  }}
                >
                  {bunny1.emoji} {bunny1.name}
                </Text>
              </View>

              <Text style={{ fontSize: fs(isVerySmall ? 22 : 28) }}>❤️</Text>

              <View style={styles.bunnyCol}>
                <BunnyImage source={bunny2.image} size={resultBunnySize} />
                <Text
                  style={{
                    color: palette.textPrimary,
                    fontSize: fs(12),
                    fontWeight: FontWeight.semibold as any,
                    textAlign: 'center',
                  }}
                >
                  {bunny2.emoji} {bunny2.name}
                </Text>
              </View>
            </View>

            <Text
              style={{
                color: palette.pink,
                fontSize: fs(isVerySmall ? 40 : 48),
                fontWeight: FontWeight.extrabold as any,
                textAlign: 'center',
              }}
            >
              {compatibility.percentage}%
            </Text>

            <Text
              style={{
                color: palette.textPrimary,
                fontSize: fs(isVerySmall ? 18 : 20),
                fontWeight: FontWeight.bold as any,
                textAlign: 'center',
              }}
            >
              {getCompatibilityLabel(compatibility.percentage)}
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
              {compatibility.description}
            </Text>

            <PrimaryButton
              label="Share Result"
              icon="↗"
              onPress={() =>
                Share.share({
                  message: `${bunny1.name} + ${bunny2.name} = ${compatibility.percentage}% compatible! #BunnyMood`,
                })
              }
            />

            <TouchableOpacity onPress={handleReset} activeOpacity={0.75}>
              <Text
                style={{
                  color: palette.textSecondary,
                  fontSize: fs(13),
                  fontWeight: FontWeight.semibold as any,
                  marginTop: 4,
                }}
              >
                Play Again 🎉
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingTop: 4,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizWrap: {
    flex: 1,
  },
  resultWrap: {
    alignItems: 'center',
  },
  title: {
    fontWeight: FontWeight.bold as any,
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
  },
  question: {
    fontWeight: FontWeight.semibold as any,
    textAlign: 'center',
  },
  bunniesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  bunnyCol: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
});
