// Ghostie maskot bileşeni — Flutter ghostie_image.dart'tan

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export type GhostieState = 'idle' | 'happy' | 'sad' | 'thinking';

interface GhostieImageProps {
  state?: GhostieState;
  size?: number;
}

const GHOSTIE_IMAGES: Record<GhostieState, ReturnType<typeof require>> = {
  idle: require('../../assets/images/ghostie.png'),
  happy: require('../../assets/images/ghostie_happy.png'),
  sad: require('../../assets/images/ghostie_sad.png'),
  thinking: require('../../assets/images/ghostie_thinking.png'),
};

export const GhostieImage: React.FC<GhostieImageProps> = ({
  state = 'idle',
  size = 80,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={GHOSTIE_IMAGES[state]}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
