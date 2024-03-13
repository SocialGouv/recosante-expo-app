import React from 'react';
import { Pressable, View } from 'react-native';
import MyText from '~/components/ui/my-text';
import { Illu_2 } from '~/assets/onboarding/illu_2';
import { navigate } from '~/services/navigation';
import { RouteEnum } from '~/constants/route';

export function Cookies() {
  return (
    <View className="basis-full items-center justify-center bg-app-primary">
      <View className="mt-8 w-full bg-app-primary">
        <MyText
          font="MarianneExtraBold"
          className="text-center text-3xl text-white"
        >
          📍 Activez les cookies
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
        <Pressable
          className="mt-8  bg-app-primary "
          onPress={() => {
            navigate(RouteEnum.COOKIES_SELECTOR, {
              enablePanDownToClose: true,
            });
          }}
        >
          <MyText
            font="MarianneBold"
            className="text-center   text-white underline"
          >
            Modifier la sélection
          </MyText>
        </Pressable>
      </View>
    </View>
  );
}
