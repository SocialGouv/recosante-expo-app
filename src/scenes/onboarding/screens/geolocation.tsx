import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import Button from '~/components/ui/button';
import MyText from '~/components/ui/my-text';
import { Skip } from '../skip';
import { Illu_2 } from '~/assets/onboarding/illu_2';
import { LocationService } from '~/services/location';
import { OnboardingRouteEnum, RouteEnum } from '~/constants/route';
import { registerForPushNotificationsAsync } from '~/services/expo-push-notifs';
import { useAddress } from '~/zustand/address/useAddress';
import API from '~/services/api';

export function Geolocation({ navigation }: { navigation: any }) {
  const { setAddress } = useAddress((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const onNext = async () => {
    const token = await registerForPushNotificationsAsync({
      force: false,
      expo: true,
    });

    if (token?.data) {
      API.put({
        path: '/user',
        body: { push_notif_token: JSON.stringify(token) },
      });
      navigation.navigate(RouteEnum.HOME);
    } else {
      navigation.navigate(OnboardingRouteEnum.NOTIFICATIONS);
    }
  };

  return (
    <View className="flex flex-1 items-center justify-around bg-app-primary">
      <Skip onPress={onNext} />
      <MyText
        font="MarianneExtraBold"
        className="text-center text-3xl text-white"
      >
        📍 Activez la{'\n'} localisation
      </MyText>
      <Illu_2 />

      <MyText
        font="MarianneRegular"
        className=" text-center text-xl text-white"
      >
        Ainsi, nous pouvons vous fournir des informations précises sur la
        qualité de l'air et les risques environnementaux spécifiques à votre
        emplacement.
      </MyText>
      <View>
        <Button
          disabled={isLoading}
          onPress={async () => {
            setIsLoading(true);
            const location = await LocationService.requestLocation();
            if (!location) {
              Alert.alert('Erreur', 'Impossible de trouver votre position');
              return;
            }
            LocationService.getAdressByCoordinates(
              location.coords.latitude,
              location.coords.longitude,
            )
              .then((adress) => {
                if (adress) {
                  setAddress(adress);
                  setIsLoading(false);
                }
                onNext();
              })
              .catch((err) => {
                console.log('err', err);
                setIsLoading(false);
                onNext();
              });
          }}
          viewClassName="bg-app-yellow p-4"
          textClassName="text-black"
          font="MarianneMedium"
        >
          {isLoading ? 'Chargement' : "C'est parti !"}
        </Button>
      </View>
    </View>
  );
}
