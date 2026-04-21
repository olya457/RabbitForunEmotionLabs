import React from 'react';
import { View, Image, StyleSheet, StatusBar, ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePalette } from '../../theme/ThemeContext';
import { getScreen } from '../../utils/responsive';

interface Props {
  children: React.ReactNode;
  backgroundImage?: ImageSourcePropType;
  noSafeArea?: boolean;
  edges?: ('top' | 'left' | 'right' | 'bottom')[];
}

export function ScreenContainer({
  children,
  backgroundImage,
  noSafeArea,
  edges = ['top', 'left', 'right'],
}: Props) {
  const palette = usePalette();
  const { width, height } = getScreen();
  const useBgImage = backgroundImage && palette.mode === 'dark';

  const content = (
    <>
      <StatusBar
        barStyle={palette.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={palette.background}
        translucent={false}
      />
      {useBgImage ? (
        <Image
          source={backgroundImage}
          style={[styles.bg, { width, height }]}
          resizeMode="cover"
        />
      ) : null}
      {children}
    </>
  );

  if (noSafeArea) {
    return (
      <View style={[styles.container, { backgroundColor: palette.background }]}>
        {content}
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.container, { backgroundColor: palette.background }]}
    >
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },
});
