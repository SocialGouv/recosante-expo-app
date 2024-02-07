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
import { ERROR_NO_NETWORK } from '~/constants/errors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MUNICIPALITY_FULL_NAME } from '~/constants/municipality';

export function DashboardPage({ navigation }: { navigation: any }) {
  const { favoriteIndicator, indicators, setIndicatorsList } =
    useIndicatorsList((state) => state);
  const { setIndicators } = useIndicators((state) => state);
  const [municipalityFullName, setMunicipalityFullName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { address } = useUser((state) => state);
  const { show } = useToast();

  async function getIndicators(refresh = true) {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    const response = await API.get({ path: '/indicators' });
    setIsLoading(false);
    setIsRefreshing(false);
    if (!response.ok && response.error === ERROR_NO_NETWORK) {
      setIsError(
        'Désolé, il semblerait que vous\nn’ayez pas de connexion à internet 🧐',
      );
      return;
    }
    if (!response.ok) {
      show(
        `Erreur lors du chargement des indicateurs ${response.message ?? ''}`,
      );
      setIsError('Désolé, une erreur est survenue,\nrevenez plus tard ! 😊');
      return;
    }
    setIsError('');
    setIndicators(response.data);
    refreshIndicatorsList();
  }

  async function refreshIndicatorsList() {
    // to avoid having to quit the app to see the new indicators
    const response = await API.get({ path: '/indicators/list' });
    if (!response.ok) return;
    setIndicatorsList(response.data);
  }

  useEffect(() => {
    if (!address?.municipality_insee_code) return;
    let ignore = false;
    getIndicators(false);
    AsyncStorage.getItem(MUNICIPALITY_FULL_NAME).then((name) => {
      console.log({ ignore, name });
      if (ignore) return;
      if (!name) return;
      setMunicipalityFullName(name);
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
  }, [address?.municipality_insee_code]);

  console.log({ isRefreshing });

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
                {municipalityFullName || address?.municipality_name}
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
      {!!address?.municipality_name && (
        <IndicatorsListPreview
          indicators={indicators}
          favoriteIndicator={favoriteIndicator}
          isError={isError}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          onRefresh={getIndicators}
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
