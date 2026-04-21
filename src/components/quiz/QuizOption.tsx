import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { usePalette } from '../../theme/ThemeContext';
import { fs, ms } from '../../utils/responsive';
import { Radius, FontWeight } from '../../theme/spacing';

type OptionState = 'default' | 'selected' | 'correct' | 'wrong';

interface Props {
  label: string;
  state?: OptionState;
  onPress: () => void;
  disabled?: boolean;
}

export function QuizOption({ label, state = 'default', onPress, disabled }: Props) {
  const palette = usePalette();

  const bgByState: Record<OptionState, string> = {
    default: palette.optionDefault,
    selected: palette.optionSelected,
    correct: palette.optionCorrect,
    wrong: palette.optionWrong,
  };

  const borderByState: Record<OptionState, string> = {
    default: palette.cardBorder,
    selected: palette.purpleLight,
    correct: palette.optionCorrect,
    wrong: palette.optionWrong,
  };

  const textColorByState: Record<OptionState, string> = {
    default: palette.textPrimary,
    selected: palette.mode === 'light' ? palette.textPrimary : palette.white,
    correct: palette.white,
    wrong: palette.white,
  };

  return (
    <TouchableOpacity
      style={[
        styles.option,
        {
          backgroundColor: bgByState[state],
          borderColor: borderByState[state],
          borderRadius: Radius.md,
          paddingVertical: ms(14),
          paddingHorizontal: ms(18),
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text
        style={[
          styles.label,
          { color: textColorByState[state], fontSize: fs(15) },
        ]}
        numberOfLines={3}
      >
        {label}
      </Text>
      {state === 'correct' ? (
        <Text style={[styles.icon, { color: palette.white }]}>✓</Text>
      ) : null}
      {state === 'wrong' ? (
        <Text style={[styles.icon, { color: palette.white }]}>✗</Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    fontWeight: FontWeight.medium as any,
    flex: 1,
  },
  icon: {
    fontWeight: FontWeight.bold as any,
    fontSize: 18,
    marginLeft: 8,
  },
});
