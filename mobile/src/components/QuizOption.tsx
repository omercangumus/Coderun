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
    if (isSelected) return '#7C3AED';
    return '#2D2D44';
  };

  const getBackgroundColor = () => {
    if (isCorrect) return 'rgba(34,197,94,0.12)';
    if (isWrong) return 'rgba(239,68,68,0.12)';
    if (isSelected) return 'rgba(124,58,237,0.12)';
    return '#1A1A2E';
  };

  return (
    <TouchableOpacity
      style={[
        styles.option,
        {
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
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
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
    lineHeight: 22,
  },
  selectedLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
