import { View, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import MyText from '~/components/ui/my-text';
import { LocationIcon } from '~/assets/icons/location';
import { useIndicatorsList } from '~/zustand/indicator/useIndicatorsList';
import { IndicatorsListPreview } from './indicators-list-preview';
import API from '~/services/api';
import { useIndicators } from '~/zustand/indicator/useIndicators';
import { RouteEnum } from '~/constants/route';
import { useAddress } from '~/zustand/address/useAddress';
import { registerForPushNotificationsAsync } from '~/services/expo-push-notifs';
import Button from '~/components/ui/button';
import { Illu } from '~/assets/share/illu';

export function DashboardPage({ navigation }: { navigation: any }) {
  const { favoriteIndicator, indicators } = useIndicatorsList((state) => state);
  const { setIndicators } = useIndicators((state) => state);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { address } = useAddress((state) => state);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!address?.citycode) return;
    let ignore = false;
    setIsLoading(true);
    // add wait time to show loading
    API.get({ path: '/indicators' }).then((response) => {
      if (ignore) return;
      if (!response.ok) {
        setError(response.error);
        return;
      }
      setIndicators(response.data);
      setIsLoading(false);
    });

    registerForPushNotificationsAsync({
      force: false,
      expo: true,
    }).then((token) => {
      if (ignore) return;
      if (!token) return;
      API.put({
        path: '/user',
        body: { push_notif_token: JSON.stringify(token) },
      });
    });
    return () => {
      ignore = true;
    };
  }, [address?.city]);

  if (error) {
    return (
      <View className="flex items-center justify-start bg-app-gray px-4 py-4">
        <MyText>{error}</MyText>
      </View>
    );
  }

  return (
    <>
      <View className="flex items-center justify-start bg-app-gray px-4 py-4">
        <View className="relative z-50 mt-8 flex w-full items-end">
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(RouteEnum.LOCATION);
            }}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <View className="w-fit  rounded-full bg-app-primary p-3 text-sm text-white">
              <LocationIcon />
            </View>
          </TouchableOpacity>
        </View>
        <View className="-mt-6 flex w-full">
          <MyText font="MarianneRegular" className="text-md text-black">
            Bonjour,
          </MyText>
          <MyText
            font="MarianneBold"
            className="mt-2 text-2xl leading-6 text-black"
          >
            Découvrez {'\n'}vos indicateurs favoris !
          </MyText>
          {address?.city ? (
            <View className="-mb-4 mt-2 flex flex-row items-center">
              <MyText
                font="MarianneBold"
                className="max-w-[90%] text-xs text-app-gray-100"
                numberOfLines={1}
              >
                {address?.label ?? address?.city}
              </MyText>
              <View className=" ml-2">
                <LocationIcon color="#AEB1B7" />
              </View>
            </View>
          ) : null}
        </View>
      </View>
      {address?.city ? (
        <IndicatorsListPreview
          indicators={indicators}
          favoriteIndicator={favoriteIndicator}
          isLoading={isLoading}
        />
      ) : (
        <NoLocationCallToAction navigation={navigation} />
      )}
    </>
  );
}

function NoLocationCallToAction({ navigation }: { navigation: any }) {
  return (
    <View className="h-full flex-1 bg-app-gray px-4">
      <Illu />
      <MyText
        font="MarianneRegular"
        className="mb-12 px-8 text-center text-base"
      >
        Choisissez une ville afin de découvrir vos indicateurs favoris !
      </MyText>
      <View className="px-8">
        <Button
          onPress={() => {
            navigation.navigate(RouteEnum.LOCATION);
          }}
          viewClassName="bg-app-yellow px-8 pb-4 pt-3"
          textClassName="text-black text-base"
          font="MarianneBold"
        >
          <MyText>Choisir une ville</MyText>
        </Button>
      </View>
    </View>
  );
}
