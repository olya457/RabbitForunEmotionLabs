import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { usePalette } from '../../theme/ThemeContext';
import { fs, ms } from '../../utils/responsive';
import { Radius } from '../../theme/spacing';

interface Props {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

export function PrimaryButton({
  label,
  onPress,
  style,
  variant = 'primary',
  disabled,
  loading,
  icon,
}: Props) {
  const palette = usePalette();

  const bg =
    variant === 'primary'
      ? palette.pink
      : variant === 'secondary'
      ? palette.card
      : palette.transparent;

  const borderColor =
    variant === 'secondary' ? palette.pink : palette.transparent;

  const textColor =
    variant === 'primary'
      ? palette.white
      : variant === 'secondary'
      ? palette.pink
      : palette.textPrimary;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: bg,
          borderColor,
          opacity: disabled ? 0.55 : 1,
          paddingVertical: ms(14),
          paddingHorizontal: ms(28),
          borderRadius: Radius.pill,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor, fontSize: fs(16) }]}>
          {icon ? `${icon}  ` : ''}
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1,
    flexDirection: 'row',
  },
  label: {
    fontWeight: '700',
  },
});
