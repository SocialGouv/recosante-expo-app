import React, {
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Alert,
  Linking,
  type NativeSyntheticEvent,
  Pressable,
  TextInput,
  type TextInputChangeEventData,
  View,
} from 'react-native';
import MyText from '~/components/ui/my-text';
import * as Location from 'expo-location';
import { useAddress } from '~/zustand/address/useAddress';
import { type Feature, type Address } from '~/types/location';
import { LocationService } from '~/services/location';
import BottomSheet from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { LocationIcon } from '~/assets/icons/location';
import { cn } from '~/utils/tailwind';
import { Close } from '~/assets/icons/close';
import { Illu } from '~/assets/location/illu';

interface LocationPageProps {
  navigation: any;
  route: any;
}

type Status = 'idle' | 'loading' | 'with_results' | 'no_result' | 'error';
export function LocationPage(props: LocationPageProps) {
  const navigation = useNavigation();
  const { setAddress } = useAddress((state) => state);
  const [query, setQuery] = useState('');
  const hadMin3Char = query.length >= 3;
  const [status, setStatus] = useState<Status>('idle');
  const [suggestedAddress, setSuggestedAddress] = useState<Address[]>([]);
  function handleSelect(address: Address) {
    setAddress(address);
    props.navigation.goBack();
  }
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['20%', '50%', '90%'], []);
  const isOpenedRef = useRef(false);
  const getSuggestions = useCallback(
    async (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
      const { text } = event.nativeEvent;
      // TODO: debounce
      setQuery(text);
      if (query.length < 3) {
        setStatus('idle');
        setSuggestedAddress([]);
      }

      const search = query.toLowerCase();
      setStatus('loading');
      const url = new URL('https://api-adresse.data.gouv.fr/search/');
      url.searchParams.append('q', search);
      const response = await fetch(url);
      const items = await response.json();
      const adressReponse: Address[] =
        items?.features?.map((feature: Feature) => {
          return LocationService.formatPropertyToAddress(feature.properties);
        }) ?? [];
      setSuggestedAddress(adressReponse);
      if (query.length >= 3 && suggestedAddress.length === 0) {
        setStatus('no_result');
      } else {
        setStatus('with_results');
      }
    },
    [query, setSuggestedAddress, setStatus],
  );

  const handleSheetChanges = useCallback((index: number) => {
    if (index < 0) {
      isOpenedRef.current = false;
    }
  }, []);

  function closeBottomSheet() {
    bottomSheetRef.current?.close();
    isOpenedRef.current = false;
    navigation.goBack();
  }

  function cancelQuery() {
    setQuery('');
    setSuggestedAddress([]);
  }

  useEffect(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <BottomSheet
      enablePanDownToClose={true}
      ref={bottomSheetRef}
      index={2}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      onClose={closeBottomSheet}
      handleStyle={{
        backgroundColor: '#3343BD',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
      }}
      handleIndicatorStyle={{
        backgroundColor: '#3343BD',
      }}
    >
      <View className="items-start justify-start bg-app-primary p-4">
        <Pressable
          onPress={() => {
            closeBottomSheet();
          }}
          className="absolute -top-0 right-2"
        >
          <Close />
        </Pressable>
        <MyText font="MarianneBold" className="mb-4   text-xl text-white">
          Rechercher
        </MyText>
        <View className="flex-row items-start justify-start bg-app-primary  ">
          <TextInput
            placeholder="Rechercher une adresse"
            value={query}
            className=" flex h-12 w-4/5 items-start justify-start rounded-md bg-white px-4 text-xl"
            onChange={getSuggestions}
          />
          <Pressable
            onPress={cancelQuery}
            className="flex   h-12 w-1/5 items-center justify-center"
          >
            <MyText
              font="MarianneRegular"
              className={cn(
                'ml-4 text-white',
                hadMin3Char ? 'opacity-100' : 'opacity-0',
              )}
            >
              Annuler
            </MyText>
          </Pressable>
        </View>
      </View>

      <View className="flex items-start justify-start bg-app-gray">
        <View className="w-full   border-b  border-gray-300 p-4">
          <Pressable
            onPress={async () => {
              Location.requestForegroundPermissionsAsync().then(
                async ({ status }) => {
                  if (status !== 'granted') {
                    Alert.alert(
                      'Permission not granted to access your location',
                      'You can change that in your settings',
                      [
                        {
                          text: 'Open Settings',
                          onPress: async () => {
                            await Linking.openSettings();
                          },
                        },
                        {
                          text: 'OK',
                          style: 'cancel',
                          onPress: () => {
                            navigation.goBack();
                          },
                        },
                      ],
                    );
                    return;
                  }
                  const location = await Location.getCurrentPositionAsync({});
                  const { latitude, longitude } = location.coords;

                  const formatedAdress =
                    await LocationService.getAdressByCoordinates(
                      latitude,
                      longitude,
                    );
                  if (formatedAdress) {
                    handleSelect(formatedAdress);
                  }
                },
              );
            }}
            className="flex flex-row items-center justify-start "
          >
            <LocationIcon color="black" />

            <MyText
              font="MarianneRegular"
              className="ml-4 w-fit text-lg text-black"
            >
              Utiliser ma géolocalisation
            </MyText>
          </Pressable>
        </View>

        {status === 'loading' ? (
          <View className="w-full  border-b  border-gray-300 p-4  ">
            <MyText
              font="MarianneRegular"
              className="ml-4 w-fit text-lg text-black"
            >
              Chargement...
            </MyText>
          </View>
        ) : null}
        {status === 'idle' ? (
          <View className="mt-8 h-full w-full">
            <Illu />
            <MyText
              font="MarianneRegular"
              className="mt-4 px-4 text-center text-lg text-gray-700"
            >
              Optimisez votre expérience en activant la géolocalisation afin
              d’améliorer votre utilisation de l'application.
            </MyText>
          </View>
        ) : null}
        {status === 'no_result' ? (
          <View className="mt-8 h-full w-full">
            <Illu />
            <MyText
              font="MarianneRegular"
              className="mt-4 px-4 text-center text-lg text-gray-700"
            >
              Aucun résultat n'a été trouvé pour cette recherche.
            </MyText>
          </View>
        ) : null}
        {suggestedAddress?.map((address) => {
          return (
            <View
              key={`${address.id}-${address.postcode}$}`}
              className="w-full  border-b  border-gray-300 p-4  "
            >
              <Pressable
                onPress={() => {
                  handleSelect(address);
                }}
              >
                <MyText
                  font="MarianneRegular"
                  className="mb-2  w-full   text-xl text-black"
                >
                  {address.label}
                </MyText>
                <MyText
                  font="MarianneBold"
                  className="  w-full   text-xl text-black"
                >
                  {address.postcode} {address.city}
                </MyText>
              </Pressable>
            </View>
          );
        })}
      </View>
    </BottomSheet>
  );
}
