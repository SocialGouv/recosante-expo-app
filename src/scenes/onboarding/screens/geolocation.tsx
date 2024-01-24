import React from 'react';
import { View } from 'react-native';
import MyText from '~/components/ui/my-text';
import { Illu_2 } from '~/assets/onboarding/illu_2';

export function Geolocation() {
  return (
    <View className="basis-full items-center justify-center bg-app-primary">
      <View className="mt-8 w-full bg-app-primary">
        <MyText
          font="MarianneExtraBold"
          className="text-center text-3xl text-white"
        >
          📍 Activez la{'\n'} localisation
        </MyText>
      </View>
      <View className="mt-8 h-1/3 w-full bg-app-primary">
        <Illu_2 />
      </View>

      <View className="mt-8 w-3/4 bg-app-primary">
        <MyText font="MarianneMedium" className="text-center text-white">
          Ainsi, nous pouvons vous fournir des informations précises sur la
          qualité de l'air et les risques environnementaux spécifiques à votre
          emplacement.
        </MyText>
      </View>
    </View>
  );
}
