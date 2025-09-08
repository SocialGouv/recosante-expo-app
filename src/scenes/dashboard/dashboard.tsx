import { View, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  type HomeTabRouteEnum,
  RouteEnum,
  type HomeTabParamList,
  type RootStackParamList,
} from '~/constants/route';
import MyText from '~/components/ui/my-text';
import { useIndicatorsList } from '~/zustand/indicator/useIndicatorsList';
import { IndicatorsListPreview } from './indicators-list-preview';
import API from '~/services/api';
import { useIndicators } from '~/zustand/indicator/useIndicators';
import { useUser } from '~/zustand/user/useUser';
import { registerForPushNotificationsAsync } from '~/services/expo-push-notifs';
import Button from '~/components/ui/button';
import { Illu } from '~/assets/share/illu';
import { useToast } from '~/services/toast';
import { ERROR_NO_NETWORK } from '~/constants/errors';
import { MUNICIPALITY_FULL_NAME } from '~/constants/municipality';
import { EditIcon } from '~/assets/icons/edit';
import { LocationService } from '~/services/location';
import { useNavigation } from '@react-navigation/native';
import { LocationIcon } from '~/assets/icons/location';

export type DashboardProps = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, HomeTabRouteEnum.DASHBOARD>,
  NativeStackScreenProps<RootStackParamList>
>;

export function DashboardPage(props: DashboardProps) {
  const navigation = useNavigation<any>();
  const { favoriteIndicators, indicators, setIndicatorsList } =
    useIndicatorsList((state) => state);
  const { setIndicators } = useIndicators((state) => state);
  const [municipalityFullName, setMunicipalityFullName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { address, udi } = useUser((state) => state);
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
      console.log('response', response);
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
    AsyncStorage.getItem(MUNICIPALITY_FULL_NAME).then(
      async (oneLineFullAddress) => {
        if (ignore) return;
        if (!oneLineFullAddress) return;
        setMunicipalityFullName(oneLineFullAddress);

        if (udi) return;
        // if the user has already oboarded on a version where we didn't save the udi
        // we need to save it now incognito to the user
        const address = await LocationService.getAdressMetadatByFullAdress(
          oneLineFullAddress,
        );
        if (!address?.coordinates) return;
        API.put({
          path: '/user',
          body: {
            coordinates: {
              lat: address.coordinates[1],
              lon: address.coordinates[0],
            },
          },
        });
      },
    );
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

  return (
    <>
      {address?.municipality_name ? (
        <>
          <View className="flex-0 mr-12 flex w-full bg-app-gray px-6">
            <MyText font="MarianneRegular" className="text-sm text-black">
              Vos indicateurs autour de
            </MyText>
          </View>
          <View className="flex w-fit flex-row items-center justify-between bg-app-gray px-6">
            <View className="mr-12 max-w-[90%] flex-1 border-b border-app-primary">
              <MyText
                font="MarianneRegular"
                className="self-start truncate text-xl text-app-primary "
                numberOfLines={1}
              >
                {municipalityFullName ??
                  address?.municipality_name ??
                  'pas de nom'}
              </MyText>
            </View>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate(RouteEnum.LOCATION, {
                    isOnboarding: false,
                  });
                }}
                className="mr-4 rounded-full bg-app-primary p-2 text-sm text-white"
              >
                <EditIcon />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('FavoriteCities')}
                className="ml-2 flex-row items-center"
              >
                <LocationIcon color="#3343BD" />
                <MyText className="ml-2 font-bold text-app-primary">
                  Mes villes
                </MyText>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <View className="flex-1 bg-app-gray px-4">
          <View className="h-1/2 w-full">
            <Illu />
          </View>
          <MyText
            font="MarianneRegular"
            className="mb-12 px-8 text-center text-base"
          >
            Choisissez une ville afin de découvrir vos indicateurs favoris !
          </MyText>
          <View className="px-8">
            <Button
              onPress={() => {
                props.navigation.navigate(RouteEnum.LOCATION, {
                  isOnboarding: false,
                });
              }}
              viewClassName="bg-app-yellow px-8 pb-4 pt-3"
              textClassName="text-black text-base"
              font="MarianneBold"
            >
              <MyText>Choisir une ville</MyText>
            </Button>
          </View>
        </View>
      )}
      {!!address?.municipality_name && (
        <IndicatorsListPreview
          indicators={indicators}
          favoriteIndicators={favoriteIndicators}
          isError={isError}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          onRefresh={getIndicators}
        />
      )}
    </>
  );
}
