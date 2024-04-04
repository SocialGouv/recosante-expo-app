import * as React from 'react';
import { Image } from 'expo-image';
import { View } from 'react-native';

export function Illu() {
  return (
    <Image
      className="h-full w-full"
      source={require('./illu.png')}
      contentFit="contain"
      transition={1000}
    />
  );
}
