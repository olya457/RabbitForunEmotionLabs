import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootNavProp } from '../types/navigation';
import { usePalette } from '../theme/ThemeContext';
import { getOnboarded } from '../store/settingsStore';
import { getScreen } from '../utils/responsive';

const { width, height } = getScreen();
const LOGO_SIZE = Math.min(width * 0.55, 280);

export function SplashScreen() {
  const navigation = useNavigation<RootNavProp>();
  const palette = usePalette();

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.07, duration: 800, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    });

    const timer = setTimeout(async () => {
      const onboarded = await getOnboarded();
      navigation.replace(onboarded ? 'Main' : 'Onboarding');
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <StatusBar hidden />
      {palette.mode === 'dark' ? (
        <Image
          source={require('../assets/loader_background.png')}
          style={[styles.bg, { width, height }]}
          resizeMode="cover"
        />
      ) : null}

      <Animated.View
        style={[
          styles.logoWrap,
          {
            opacity,
            transform: [{ scale: Animated.multiply(scale, pulse) }],
          },
        ]}
      >
        <Image
          source={require('../assets/loader_logo.png')}
          style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
