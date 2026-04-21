import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { usePalette } from '../../theme/ThemeContext';

interface Props {
  source: ImageSourcePropType;
  size?: number;
  bordered?: boolean;
}

export function BunnyImage({ source, size = 180, bordered = true }: Props) {
  const palette = usePalette();

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : palette.cardActive,
          borderWidth: bordered ? 1 : 0,
          borderColor: palette.cardBorder,
        },
      ]}
    >
      <Image source={source} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '82%',
    height: '82%',
  },
});
