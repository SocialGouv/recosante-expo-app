import * as React from 'react';
import { Image } from 'expo-image';
import { View } from 'react-native';

export function Illu() {
  return (
    <View className="h-88 w-full">
      <Image
        className="h-full w-full"
        source={require('./illu.png')}
        contentFit="contain"
        transition={1000}
      />
    </View>
  );
}
