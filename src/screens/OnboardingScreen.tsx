import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ONBOARDING_PAGES } from '../data/onboardingData';
import { PaginationDots } from '../components/quiz/PaginationDots';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { IconBadge } from '../components/common/IconBadge';
import { usePalette } from '../theme/ThemeContext';
import { RootNavProp } from '../types/navigation';
import { fs, ms, pick, getScreenSize, getScreen } from '../utils/responsive';
import { FontWeight } from '../theme/spacing';
import { setOnboarded } from '../store/settingsStore';

const { width } = getScreen();

export function OnboardingScreen() {
  const navigation = useNavigation<RootNavProp>();
  const palette = usePalette();
  const { isVerySmall } = getScreenSize();

  const [currentIndex, setCurrentIndex] = useState(0);
  const page = ONBOARDING_PAGES[currentIndex];
  const isLast = currentIndex === ONBOARDING_PAGES.length - 1;

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(16);

    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 360, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 360, useNativeDriver: true }),
    ]).start();
  }, [currentIndex]);

  const finish = async () => {
    await setOnboarded(true);
    navigation.replace('Main');
  };

  const handleNext = () => {
    if (isLast) finish();
    else setCurrentIndex(i => i + 1);
  };

  const handleSkip = () => {
    finish();
  };

  const bunnySize = pick(
    { xs: width * 0.55, sm: width * 0.6, md: width * 0.7, lg: width * 0.75 },
    width * 0.65
  );

  return (
    <ScreenContainer backgroundImage={require('../assets/bg_main.png')} edges={['top', 'left', 'right']}>
      <View style={[styles.topBar, { paddingHorizontal: ms(20) }]}>
        <View style={styles.sideSpace} />
        <PaginationDots total={ONBOARDING_PAGES.length} current={currentIndex} />
        <TouchableOpacity onPress={handleSkip} style={styles.sideSpace} activeOpacity={0.7}>
          <Text style={{ color: palette.textSecondary, fontSize: fs(13) }}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bunnyWrap}>
        <Image
          source={page.image}
          style={{ width: bunnySize, height: bunnySize }}
          resizeMode="contain"
        />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity,
            transform: [{ translateY }],
            paddingHorizontal: ms(24),
            gap: isVerySmall ? 8 : 12,
            paddingBottom: ms(isVerySmall ? 12 : 24),
          },
        ]}
      >
        <IconBadge emoji={page.iconEmoji} size={isVerySmall ? 'sm' : 'md'} />

        <Text
          style={[
            styles.title,
            { color: palette.textPrimary, fontSize: fs(isVerySmall ? 20 : 24) },
          ]}
        >
          {page.title}
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: palette.pink, fontSize: fs(13) },
          ]}
        >
          {page.subtitle}
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
          {page.description}
        </Text>

        <PrimaryButton label={page.buttonLabel} onPress={handleNext} />
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  sideSpace: {
    width: 44,
    alignItems: 'flex-end',
  },
  bunnyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontWeight: FontWeight.bold as any,
    textAlign: 'center',
  },
  subtitle: {
    fontWeight: FontWeight.semibold as any,
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
  },
});
