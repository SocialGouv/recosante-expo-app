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
  TouchableOpacity,
} from 'react-native';
import MyText from '~/components/ui/my-text';
import * as Location from 'expo-location';
import { useAddress } from '~/zustand/address/useAddress';
import { type Feature, type Address } from '~/types/location';
import { LocationService } from '~/services/location';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { LocationIcon } from '~/assets/icons/location';
import { cn } from '~/utils/tailwind';
import { Close } from '~/assets/icons/close';
import { Illu } from '~/assets/location/illu';
import { logEvent } from '~/services/logEventsWithMatomo';

interface LocationPageProps {
  navigation: any;
  route: any;
}

type Status = 'idle' | 'with_results' | 'no_result' | 'error';
export function LocationPage(props: LocationPageProps) {
  const navigation = useNavigation();
  const { setAddress } = useAddress((state) => state);
  const [query, setQuery] = useState('');
  const hadMin3Char = query.length >= 3;
  const [status, setStatus] = useState<Status>('idle');
  const [isLoading, setIsLoading] = useState(false);
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

      const search = query.toLowerCase();
      setIsLoading(true);
      const url = new URL('https://api-adresse.data.gouv.fr/search/');
      url.searchParams.append('q', search);
      const response = await fetch(url);
      const items = await response.json();
      const adressReponse: Address[] =
        items?.features?.map((feature: Feature) => {
          return LocationService.formatPropertyToAddress(feature.properties);
        }) ?? [];
      setSuggestedAddress(adressReponse);
      setIsLoading(false);
    },
    [query, setSuggestedAddress, setStatus],
  );

  useEffect(() => {
    if (query.length === 0) {
      setStatus('idle');
    }
    if (query.length >= 3 && suggestedAddress.length > 0) {
      setStatus('with_results');
    }
    if (suggestedAddress.length === 0 && query.length >= 3) {
      setStatus('no_result');
    }
  }, [query, suggestedAddress]);

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
    setStatus('idle');
  }

  useEffect(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <BottomSheet
      style={{
        backgroundColor: '#3343BD',
        borderRadius: 35,
        shadowColor: '#3343BD',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.7,
        shadowRadius: 20,
        elevation: 2,
      }}
      enablePanDownToClose={true}
      ref={bottomSheetRef}
      index={2}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      onClose={closeBottomSheet}
      backgroundStyle={{
        borderTopRightRadius: 35,
        borderTopLeftRadius: 35,
      }}
      handleStyle={{
        backgroundColor: '#3343BD',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
      }}
      handleIndicatorStyle={{
        backgroundColor: 'white',
        height: 7,
        width: 83,
      }}
    >
      <View className="items-start justify-start border-t border-app-primary bg-app-primary p-4 pb-7">
        <View className="mb-4 flex w-full flex-row justify-between">
          <MyText font="MarianneBold" className="text-2xl text-white">
            Rechercher
          </MyText>
          <Pressable
            onPress={() => {
              closeBottomSheet();
            }}
            className=""
          >
            <Close />
          </Pressable>
        </View>
        <View className="flex-row items-start justify-start bg-app-primary">
          <TextInput
            autoCorrect={false}
            autoFocus
            placeholderTextColor="#3343BD"
            placeholder="Rechercher un lieu, ville"
            value={query}
            className="h-12 w-4/5 rounded-full bg-white px-4 text-[16px] placeholder:text-[16px]"
            onChange={getSuggestions}
            onFocus={() => {
              logEvent({
                category: 'LOCATION',
                action: 'TYPE_ADDRESS',
              });
            }}
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

      <BottomSheetScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
        }}
      >
        <View className=" h-full bg-app-gray px-6 pt-6">
          <View className="w-full">
            <Pressable
              onPress={async () => {
                logEvent({
                  category: 'LOCATION',
                  action: 'SELECT_GEOLOCATION',
                });
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
                font="MarianneBold"
                className="ml-4 w-fit text-[14px] text-black"
              >
                Utiliser ma géolocalisation
              </MyText>
            </Pressable>
          </View>

          {isLoading ? (
            <View className="w-full  p-4  ">
              <MyText
                font="MarianneRegular"
                className="ml-4 w-fit text-xs text-black"
              >
                Chargement...
              </MyText>
            </View>
          ) : null}
          {status === 'idle' ? (
            <View className="mt-16 h-full w-full">
              <Illu />
              <MyText
                font="MarianneMedium"
                className="mt-4 px-12 text-center text-[14px] text-gray-700"
              >
                Optimisez votre expérience en activant la géolocalisation afin
                d’améliorer votre utilisation de l'application.
              </MyText>
            </View>
          ) : null}
          {status === 'no_result' ? (
            <View className="mt-16 h-full w-full">
              <Illu />
              <MyText
                font="MarianneMedium"
                className="mt-4 px-4 text-center text-[14px] text-gray-700"
              >
                Aucun résultat n'a été trouvé pour cette recherche.
              </MyText>
            </View>
          ) : null}

          {suggestedAddress?.map((address) => {
            return (
              <View
                key={`${address.id}-${address.postcode}$}`}
                className="w-full  border-b border-gray-300 py-4"
              >
                <TouchableOpacity
                  onPress={() => {
                    logEvent({
                      category: 'LOCATION',
                      action: 'SELECT_ADDRESS',
                    });
                    handleSelect(address);
                  }}
                >
                  <MyText
                    font="MarianneRegular"
                    className="mb-1  w-full   text-[14px] text-black"
                  >
                    {address.label}
                  </MyText>
                  <MyText
                    font="MarianneMedium"
                    className="w-full text-xs text-[#8B99A2]"
                  >
                    {address.postcode} {address.city}
                  </MyText>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
