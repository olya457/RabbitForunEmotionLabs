import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Share,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { PERSONALITY_QUESTIONS } from '../data/personalityQuizData';
import { BUNNY_TYPES, BunnyTypeId } from '../data/bunnyTypes';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { QuizOption } from '../components/quiz/QuizOption';
import { ProgressBar } from '../components/common/ProgressBar';
import { BunnyImage } from '../components/quiz/BunnyImage';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { IconBadge } from '../components/common/IconBadge';
import { Chip } from '../components/common/Chip';
import { usePalette } from '../theme/ThemeContext';
import { fs, ms, pick, getScreenSize } from '../utils/responsive';
import { FontWeight, Radius } from '../theme/spacing';
import { saveQuote } from '../store/savedStore';
import { setMyBunnyType } from '../store/myBunnyStore';
import { SavedQuote } from '../types/quiz';

type Step = 'home' | 'intro' | 'quiz' | 'result';

export function MyBunnyScreen() {
  const palette = usePalette();
  const { isVerySmall } = getScreenSize();

  const [step, setStep] = useState<Step>('home');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<BunnyTypeId, number>>({
    happy: 0,
    angry: 0,
    smart: 0,
    wild: 0,
  });
  const [resultType, setResultType] = useState<BunnyTypeId | null>(null);
  const [saved, setSaved] = useState(false);

  const question = PERSONALITY_QUESTIONS[questionIndex];
  const bunny = resultType ? BUNNY_TYPES[resultType] : null;

  const selectedQuote = useMemo(() => {
    if (!bunny) return '';
    const { quotes } = bunny;
    return quotes.length > 0 ? quotes[Math.floor(Math.random() * quotes.length)] : '';
  }, [bunny]);

  const bunnySize = pick({ xs: 130, sm: 150, md: 170, lg: 190 }, 170);

  const handleSelect = (type: BunnyTypeId) => {
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);

    if (questionIndex < PERSONALITY_QUESTIONS.length - 1) {
      setQuestionIndex(i => i + 1);
      return;
    }

    const winner = (Object.keys(newScores) as BunnyTypeId[]).reduce((a, b) =>
      newScores[a] >= newScores[b] ? a : b
    );

    setResultType(winner);
    setMyBunnyType(winner);
    setStep('result');
  };

  const handleSave = async () => {
    if (!resultType || saved) return;

    const quote: SavedQuote = {
      id: Date.now().toString(),
      bunnyType: resultType,
      quote: selectedQuote,
      date: new Date().toLocaleDateString('en-GB'),
    };

    await saveQuote(quote);
    setSaved(true);
  };

  const handleReset = () => {
    setStep('home');
    setQuestionIndex(0);
    setScores({ happy: 0, angry: 0, smart: 0, wild: 0 });
    setResultType(null);
    setSaved(false);
  };

  return (
    <ScreenContainer backgroundImage={require('../assets/bg_main.png')}>
      {(step === 'home' || step === 'intro') && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingHorizontal: ms(20), paddingBottom: ms(100) },
          ]}
        >
          <View style={[styles.centered, { gap: isVerySmall ? 10 : 14 }]}>
            <BunnyImage source={require('../assets/bunny_walking.png')} size={bunnySize} />

            <IconBadge emoji="✨" />

            <Text
              style={[
                styles.title,
                { color: palette.textPrimary, fontSize: fs(isVerySmall ? 20 : 24) },
              ]}
            >
              {step === 'home' ? 'Which Bunny Are You?' : 'No Right or Wrong!'}
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
                ? 'Answer 5 fun questions and discover your inner bunny personality. Are you happy, angry, smart, or wild?'
                : 'Pick the answer that feels most like you. Then get a unique quote to save and share.'}
            </Text>

            <PrimaryButton
              label={step === 'home' ? 'Next' : 'Discover My Bunny ✨'}
              onPress={() => setStep(step === 'home' ? 'intro' : 'quiz')}
            />
          </View>
        </ScrollView>
      )}

      {step === 'quiz' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingHorizontal: ms(20), paddingBottom: ms(110) },
          ]}
        >
          <View style={[styles.quizWrap, { gap: isVerySmall ? 10 : 14 }]}>
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

            <View style={styles.bunnyCenter}>
              <BunnyImage source={require('../assets/bunny_walking.png')} size={bunnySize} />
            </View>

            <Text
              style={[
                styles.question,
                {
                  color: palette.textPrimary,
                  fontSize: fs(isVerySmall ? 14 : 16),
                },
              ]}
            >
              {question.question}
            </Text>

            <View style={{ gap: isVerySmall ? 8 : 10 }}>
              {question.options.map(opt => (
                <QuizOption
                  key={opt.type}
                  label={opt.text}
                  onPress={() => handleSelect(opt.type)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {step === 'result' && bunny ? (
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
                fontSize: fs(13),
                fontWeight: FontWeight.semibold as any,
              }}
            >
              You are…
            </Text>

            <Text
              style={[
                styles.bunnyLabel,
                { color: palette.textPrimary, fontSize: fs(isVerySmall ? 22 : 26) },
              ]}
            >
              {bunny.emoji}  {bunny.name}
            </Text>

            <BunnyImage source={bunny.image} size={bunnySize + 10} />

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
              {bunny.description}
            </Text>

            {selectedQuote ? (
              <View
                style={[
                  styles.quoteBox,
                  {
                    backgroundColor: palette.card,
                    borderLeftColor: palette.pink,
                    borderRadius: Radius.lg,
                    padding: ms(14),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.quote,
                    {
                      color: palette.textPrimary,
                      fontSize: fs(isVerySmall ? 12 : 14),
                      lineHeight: fs(isVerySmall ? 18 : 22),
                    },
                  ]}
                >
                  {selectedQuote}
                </Text>
              </View>
            ) : null}

            <View style={styles.tagsRow}>
              {bunny.tags.map(tag => (
                <Chip key={tag} label={tag} accentColor={palette.purpleLight} />
              ))}
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor: palette.card,
                    borderColor: saved ? palette.success : palette.pink,
                    borderRadius: Radius.md,
                    paddingVertical: ms(12),
                  },
                ]}
                onPress={handleSave}
                activeOpacity={0.85}
              >
                <Text
                  style={{
                    color: palette.textPrimary,
                    fontWeight: FontWeight.bold as any,
                    fontSize: fs(14),
                  }}
                >
                  {saved ? 'Saved ✓' : 'Save'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor: palette.card,
                    borderColor: palette.pink,
                    borderRadius: Radius.md,
                    paddingVertical: ms(12),
                  },
                ]}
                onPress={() =>
                  Share.share({
                    message: selectedQuote
                      ? `I'm a ${bunny.name}! ${selectedQuote}`
                      : `I'm a ${bunny.name}!`,
                  })
                }
                activeOpacity={0.85}
              >
                <Text
                  style={{
                    color: palette.textPrimary,
                    fontWeight: FontWeight.bold as any,
                    fontSize: fs(14),
                  }}
                >
                  Share
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleReset} activeOpacity={0.75}>
              <Text
                style={{
                  color: palette.textSecondary,
                  fontSize: fs(13),
                  fontWeight: FontWeight.semibold as any,
                  marginTop: 6,
                }}
              >
                Take again
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
  bunnyCenter: {
    alignItems: 'center',
  },
  resultWrap: {
    alignItems: 'center',
    paddingTop: 8,
  },
  question: {
    fontWeight: FontWeight.semibold as any,
    textAlign: 'center',
  },
  title: {
    fontWeight: FontWeight.bold as any,
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
  },
  bunnyLabel: {
    fontWeight: FontWeight.extrabold as any,
    textAlign: 'center',
  },
  quoteBox: {
    width: '100%',
    borderLeftWidth: 4,
  },
  quote: {
    fontStyle: 'italic',
    textAlign: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  actionBtn: {
    flex: 1,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
