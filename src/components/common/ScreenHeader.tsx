import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { usePalette } from '../../theme/ThemeContext';
import { fs, ms } from '../../utils/responsive';
import { FontWeight, Radius } from '../../theme/spacing';

interface Props {
  title: string;
  subtitle?: string;
  emoji?: string;
  onBack?: () => void;
  rightLabel?: string;
  onRightPress?: () => void;
  rightEmoji?: string;
}

export function ScreenHeader({
  title,
  subtitle,
  emoji,
  onBack,
  rightLabel,
  onRightPress,
  rightEmoji,
}: Props) {
  const palette = usePalette();

  return (
    <View style={[styles.wrap, { paddingHorizontal: ms(20), paddingTop: ms(12) }]}>
      {onBack ? (
        <TouchableOpacity
          style={[
            styles.circleBtn,
            { backgroundColor: palette.card, borderColor: palette.cardBorder },
          ]}
          onPress={onBack}
          activeOpacity={0.85}
        >
          <Text style={[styles.back, { color: palette.textPrimary, fontSize: fs(16) }]}>‹</Text>
        </TouchableOpacity>
      ) : emoji ? (
        <View
          style={[
            styles.iconBadge,
            { backgroundColor: palette.card, borderColor: palette.cardBorder },
          ]}
        >
          <Text style={{ fontSize: fs(20) }}>{emoji}</Text>
        </View>
      ) : (
        <View style={{ width: ms(36) }} />
      )}

      <View style={styles.center}>
        <Text
          style={[styles.title, { color: palette.textPrimary, fontSize: fs(18) }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[styles.sub, { color: palette.textSecondary, fontSize: fs(12) }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {onRightPress ? (
        <TouchableOpacity
          style={[
            styles.circleBtn,
            { backgroundColor: palette.card, borderColor: palette.cardBorder },
          ]}
          onPress={onRightPress}
          activeOpacity={0.85}
        >
          {rightEmoji ? (
            <Text style={{ fontSize: fs(16) }}>{rightEmoji}</Text>
          ) : (
            <Text
              style={{
                color: palette.pink,
                fontSize: fs(13),
                fontWeight: FontWeight.semibold as any,
              }}
            >
              {rightLabel}
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={{ width: ms(36) }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    gap: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: FontWeight.bold as any,
  },
  sub: {
    marginTop: 2,
  },
  back: {
    fontWeight: FontWeight.extrabold as any,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
