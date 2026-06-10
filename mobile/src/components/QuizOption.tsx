// Quiz seçenek bileşeni — Flutter multiple_choice_widget.dart'tan

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

interface QuizOptionProps {
  label: string;
  isSelected: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export const QuizOption: React.FC<QuizOptionProps> = ({
  label,
  isSelected,
  isCorrect,
  isWrong,
  onPress,
  disabled = false,
}) => {
  const getBorderColor = () => {
    if (isCorrect) return '#22C55E';
    if (isWrong) return '#EF4444';
    if (isSelected) return '#A78BFA';
    return '#2D2D4B';
  };

  const getBackgroundColor = () => {
    if (isCorrect) return 'rgba(34,197,94,0.12)';
    if (isWrong) return 'rgba(239,68,68,0.12)';
    if (isSelected) return 'rgba(124,58,237,0.15)';
    return '#111124';
  };

  const getShadowColor = () => {
    if (isCorrect) return '#22C55E';
    if (isWrong) return '#EF4444';
    if (isSelected) return '#7C3AED';
    return 'transparent';
  };

  const hasStatus = isSelected || isCorrect || isWrong;

  return (
    <TouchableOpacity
      style={[
        styles.option,
        {
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
          shadowColor: getShadowColor(),
          shadowOffset: hasStatus ? { width: 0, height: 3 } : { width: 0, height: 0 },
          shadowOpacity: hasStatus ? 0.25 : 0,
          shadowRadius: hasStatus ? 8 : 0,
          elevation: hasStatus ? 4 : 0,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
    >
      <Text style={[styles.label, isSelected && styles.selectedLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    borderWidth: 2,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 18,
    marginBottom: 10,
    borderStyle: 'solid',
  },
  label: {
    fontSize: 15,
    color: '#E5E7EB',
    fontWeight: '500',
    lineHeight: 22,
  },
  selectedLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

