import React from 'react';
import { View } from 'react-native';
import { Illu_1 } from '~/assets/onboarding/illu_1';
import { Logo } from '~/assets/onboarding/logo';
import Button from '~/components/ui/button';
import MyText from '~/components/ui/my-text';
import { Skip } from '../skip';
import { OnboardingRouteEnum } from '~/constants/route';

export function Welcome({ navigation }: { navigation: any }) {
  return (
    <View className="flex flex-1 items-center justify-center gap-y-8 bg-app-primary">
      <Skip
        onPress={() => {
          navigation.navigate(OnboardingRouteEnum.GEOLOCATION);
        }}
      />
      <View className="h-16 w-full">
        <Logo />
      </View>
      <View className="h-1/3 w-full">
        <Illu_1 />
      </View>

      <View className="w-full">
        <MyText font="MarianneMedium" className="text-center text-white">
          Connaitre son environnement {'\n'} Agir pour protéger sa santé
        </MyText>
      </View>
      <View>
        <Button
          onPress={() => {
            navigation.navigate(OnboardingRouteEnum.GEOLOCATION);
          }}
          viewClassName="bg-app-yellow px-8 pb-4 pt-3"
          textClassName="text-black"
          font="MarianneBold"
        >
          C'est parti !
        </Button>
      </View>
    </View>
  );
}
