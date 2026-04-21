import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { usePalette } from '../../theme/ThemeContext';
import { fs, ms, pick, getScreenSize } from '../../utils/responsive';
import { FontWeight } from '../../theme/spacing';

interface Props {
  image?: ImageSourcePropType;
  emoji?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function EmptyState({ image, emoji, title, description, children }: Props) {
  const palette = usePalette();
  const { isVerySmall } = getScreenSize();
  const size = pick({ xs: 120, sm: 140, md: 170, lg: 200 }, 170);

  return (
    <View style={styles.wrap}>
      {image ? (
        <Image source={image} style={{ width: size, height: size }} resizeMode="contain" />
      ) : emoji ? (
        <Text style={[styles.emoji, { fontSize: isVerySmall ? 54 : 72 }]}>{emoji}</Text>
      ) : null}

      <Text style={[styles.title, { color: palette.pink, fontSize: fs(20), marginTop: ms(8) }]}>
        {title}
      </Text>

      {description ? (
        <Text style={[styles.description, { color: palette.textSecondary, fontSize: fs(13) }]}>
          {description}
        </Text>
      ) : null}

      {children ? <View style={styles.actions}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 6,
  },
  emoji: {
    textAlign: 'center',
  },
  title: {
    fontWeight: FontWeight.bold as any,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  actions: {
    marginTop: 16,
    width: '100%',
    gap: 10,
  },
});
