import { View, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import MyText from '~/components/ui/my-text';
import { LocationIcon } from '~/assets/icons/location';
import { useIndicatorsList } from '~/zustand/indicator/useIndicatorsList';
import { IndicatorsListPreview } from './indicators-list-preview';
import API from '~/services/api';
import { useIndicators } from '~/zustand/indicator/useIndicators';
import { RouteEnum } from '~/constants/route';
import { useUser } from '~/zustand/user/useUser';
import { registerForPushNotificationsAsync } from '~/services/expo-push-notifs';
import Button from '~/components/ui/button';
import { Illu } from '~/assets/share/illu';
import { useToast } from '~/services/toast';

export function DashboardPage({ navigation }: { navigation: any }) {
  const { favoriteIndicator, indicators } = useIndicatorsList((state) => state);
  const { setIndicators } = useIndicators((state) => state);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { address } = useUser((state) => state);
  const { show } = useToast();

  useEffect(() => {
    if (!address?.municipality_insee_code) return;
    let ignore = false;
    setIsLoading(true);
    API.get({ path: '/indicators' }).then((response) => {
      setIsLoading(false);
      if (ignore) return;
      if (!response.ok) {
        show(`Erreur lors du chargement des indicateurs ${response.message}`);
        setIsError(true);
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
  }, [address?.municipality_name]);

  function onRefresh() {
    setIsRefreshing(true);
    API.get({ path: '/indicators' }).then((response) => {
      if (!response.ok) {
        show(`Erreur lors du chargement des indicateurs ${response.message}`);
        return;
      }
      setIndicators(response.data);
      setIsRefreshing(false);
    });
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
          {address?.municipality_name ? (
            <View className="-mb-4 mt-2 flex flex-row items-center">
              <MyText
                font="MarianneBold"
                className="max-w-[90%] text-xs text-app-gray-100"
                numberOfLines={1}
              >
                {address?.municipality_full_name ?? address?.municipality_name}
              </MyText>
              <View className=" ml-2">
                <LocationIcon color="#AEB1B7" />
              </View>
            </View>
          ) : null}
        </View>
      </View>
      {!address?.municipality_name && (
        <NoLocationCallToAction navigation={navigation} />
      )}
      {isError && (
        <View className="h-full w-full flex-1 flex-row flex-wrap items-center justify-center bg-app-gray pb-24 pt-8">
          <MyText className="text-center">
            Désolé, nos serveurs sont hors-service,{'\n'}revenez plus tard ! 😊
          </MyText>
        </View>
      )}

      {!!address?.municipality_name && (
        <IndicatorsListPreview
          indicators={indicators}
          favoriteIndicator={favoriteIndicator}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
        />
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
