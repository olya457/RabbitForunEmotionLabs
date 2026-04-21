import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { usePalette } from '../../theme/ThemeContext';

interface Props {
  progress: number;
  height?: number;
  color?: string;
  trackColor?: string;
  style?: ViewStyle;
}

export function ProgressBar({ progress, height = 6, color, trackColor, style }: Props) {
  const palette = usePalette();
  const clamped = Math.max(0, Math.min(progress, 1));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius: height / 2,
          backgroundColor: trackColor ?? palette.progressTrack,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clamped * 100}%`,
            borderRadius: height / 2,
            backgroundColor: color ?? palette.progressFill,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
