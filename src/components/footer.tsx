import { View } from 'react-native';
import { Image } from 'expo-image';
import { FrenchFlag } from '~/assets/footer/french-flag';

export function Footer() {
  return (
    <View className="mx-auto pb-6">
      <FrenchFlag />
      <View className="mt-4 h-12">
        <Image
          className="h-full w-full"
          source={require('~/assets/footer/rf-logo.png')}
          contentFit="contain"
          transition={1000}
        />
      </View>
    </View>
  );
}
