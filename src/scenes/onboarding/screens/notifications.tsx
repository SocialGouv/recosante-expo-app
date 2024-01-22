import React from 'react';
import { View } from 'react-native';
import Button from '~/components/ui/button';
import MyText from '~/components/ui/my-text';
import { Skip } from '../skip';
import { Illu_4 } from '~/assets/onboarding/illu_4';
import { registerForPushNotificationsAsync } from '~/services/expo-push-notifs';
import { RouteEnum } from '~/constants/route';
import API from '~/services/api';

export function Notifications({ navigation }: { navigation: any }) {
  return (
    <View className="flex flex-1 items-center justify-center gap-y-8 bg-app-primary">
      <Skip onPress={() => navigation.navigate(RouteEnum.HOME)} />
      <View className="w-full">
        <MyText
          font="MarianneExtraBold"
          className="text-center text-3xl text-white"
        >
          🔔 Accepter les {'\n'}
          notification
        </MyText>
      </View>
      <View className="h-1/3 w-full">
        <Illu_4 />
      </View>

      <View className="w-10/12">
        <MyText font="MarianneMedium" className="text-center text-white">
          Activez les notifications pour recevoir des alertes et des
          recommandations personnalisées, vous permettant de prendre des mesures
          préventives en temps réel.
        </MyText>
      </View>
      <View>
        <Button
          onPress={async () => {
            registerForPushNotificationsAsync({
              force: true,
              expo: true,
            }).then((token) => {
              navigation.navigate(RouteEnum.HOME);
              if (token) {
                API.put({
                  path: '/user',
                  body: { push_notif_token: JSON.stringify(token) },
                });
              }
            });
          }}
          viewClassName="bg-app-yellow px-8 pb-4 pt-3 min-w-[200px]"
          textClassName="text-black"
          font="MarianneMedium"
        >
          C'est parti !
        </Button>
      </View>
    </View>
  );
}
