import React from 'react';
import { View, StyleSheet } from 'react-native';
import { usePalette } from '../../theme/ThemeContext';

interface Props {
  total: number;
  current: number;
}

export function PaginationDots({ total, current }: Props) {
  const palette = usePalette();

  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => {
        const active = i === current;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: active ? 24 : 8,
                backgroundColor: active ? palette.pink : palette.progressTrack,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
