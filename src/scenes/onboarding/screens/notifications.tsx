import React from 'react';
import { View } from 'react-native';
import MyText from '~/components/ui/my-text';
import { Illu_4 } from '~/assets/onboarding/illu_4';

export function Notifications() {
  return (
    <View className="basis-full items-center justify-center bg-app-primary">
      <View className="mb-8 w-full">
        <MyText
          font="MarianneExtraBold"
          className="text-center text-3xl text-white"
        >
          🔔 Accepter les {'\n'}
          notifications
        </MyText>
      </View>
      <View className="mb-8 h-1/3 w-full">
        <Illu_4 />
      </View>

      <View className="mb-8 w-10/12">
        <MyText font="MarianneMedium" className="text-center text-white">
          Activez les notifications pour recevoir des alertes et des
          recommandations personnalisées, vous permettant de prendre des mesures
          préventives en temps réel.
        </MyText>
      </View>
    </View>
  );
}
