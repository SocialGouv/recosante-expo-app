import React from 'react';
import { View } from 'react-native';
import { Illu_1 } from '~/assets/onboarding/illu_1';
import { Logo } from '~/assets/onboarding/logo';
import MyText from '~/components/ui/my-text';

export function Welcome() {
  return (
    <View className="basis-full items-center justify-center bg-app-primary">
      <View className="mb-8 h-16 w-full">
        <Logo />
      </View>
      <View className="mb-8 h-1/3 w-full">
        <Illu_1 />
      </View>
      <View className="mb-8 w-full">
        <MyText font="MarianneMedium" className="text-center text-white">
          Connaitre son environnement {'\n'} Agir pour protéger sa santé
        </MyText>
      </View>
    </View>
  );
}
