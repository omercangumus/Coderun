// Yükleme iskelet bileşeni — Flutter skeleton_loader.dart'tan

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: width as number, height, borderRadius, opacity },
        style,
      ]}
    />
  );
};

export const SkeletonCard: React.FC<{ height?: number }> = ({
  height = 100,
}) => (
  <View style={[styles.card, { height }]}>
    <LoadingSkeleton height={height} borderRadius={16} />
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#2D2D44',
  },
  card: {
    width: '100%',
  },
});
