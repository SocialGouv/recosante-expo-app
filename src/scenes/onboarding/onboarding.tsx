import { useState } from 'react';
import { Alert, InteractionManager, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Welcome } from './screens/welcome';
import { Geolocation } from './screens/geolocation';
import { Notifications } from './screens/notifications';
import { LocationService } from '~/services/location';

import { OnboardingRouteEnum, RouteEnum } from '~/constants/route';
import { navigate } from '~/services/navigation';
import Button from '~/components/ui/button';
import { useAddress } from '~/zustand/address/useAddress';
import { registerForPushNotificationsAsync } from '~/services/expo-push-notifs';
import API from '~/services/api';
import { cn } from '~/utils/tailwind';

const OnboardingStack = createStackNavigator();
export function Onboarding() {
  const [onboardingScreen, setOnboardingScreen] = useState<OnboardingRouteEnum>(
    OnboardingRouteEnum.WELCOME,
  );
  const [skipVisible, setSkipVisible] = useState<boolean>(false);

  const { setAddress } = useAddress((state) => state);
  const [isLoading, setIsLoading] = useState(false);

  async function onNextAfterGeolocation() {
    const token = await registerForPushNotificationsAsync({
      force: false,
      expo: true,
    });

    if (token?.data) {
      API.put({
        path: '/user',
        body: { push_notif_token: JSON.stringify(token) },
      });
      // navigate(RouteEnum.HOME);
      navigate(OnboardingRouteEnum.NOTIFICATIONS);
      setOnboardingScreen(OnboardingRouteEnum.NOTIFICATIONS);
    } else {
      navigate(OnboardingRouteEnum.NOTIFICATIONS);
      setOnboardingScreen(OnboardingRouteEnum.NOTIFICATIONS);
    }
  }

  return (
    <SafeAreaView className="flex flex-1 bg-app-primary px-4">
      <View
        className={cn(
          !skipVisible ? 'opacity-0' : 'opacity-100',
          'mb-8 flex w-full flex-row justify-end',
        )}
      >
        <Button
          onPress={() => {
            switch (onboardingScreen) {
              case OnboardingRouteEnum.WELCOME:
                setOnboardingScreen(OnboardingRouteEnum.GEOLOCATION);
                break;
              case OnboardingRouteEnum.GEOLOCATION:
                onNextAfterGeolocation();
                break;
              case OnboardingRouteEnum.NOTIFICATIONS:
                navigate(RouteEnum.HOME);
                break;
              default:
                break;
            }
          }}
          textClassName="text-right text-white text-sm"
          font="MarianneRegular"
        >
          Passer {'>'}
        </Button>
      </View>
      <View className="shrink basis-full justify-end bg-app-primary">
        <OnboardingStack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#3343BD' },
          }}
        >
          <OnboardingStack.Screen
            name={OnboardingRouteEnum.WELCOME}
            component={Welcome}
          />
          <OnboardingStack.Screen
            name={OnboardingRouteEnum.GEOLOCATION}
            component={Geolocation}
          />
          <OnboardingStack.Screen
            name={OnboardingRouteEnum.NOTIFICATIONS}
            component={Notifications}
          />
        </OnboardingStack.Navigator>
        <View className="mx-auto my-8 flex w-screen flex-row justify-center">
          <Button
            onPress={async () => {
              switch (onboardingScreen) {
                case OnboardingRouteEnum.WELCOME:
                  navigate(OnboardingRouteEnum.GEOLOCATION);
                  setOnboardingScreen(OnboardingRouteEnum.GEOLOCATION);
                  InteractionManager.runAfterInteractions(() => {
                    setSkipVisible(true);
                  });
                  break;
                case OnboardingRouteEnum.GEOLOCATION:
                  setIsLoading(true);
                  const location = await LocationService.requestLocation();
                  if (!location) {
                    Alert.alert(
                      'Erreur',
                      'Impossible de trouver votre position',
                    );
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
                      onNextAfterGeolocation();
                    })
                    .catch((err) => {
                      console.log('err', err);
                      setIsLoading(false);
                    });
                  break;
                case OnboardingRouteEnum.NOTIFICATIONS:
                  registerForPushNotificationsAsync({
                    force: true,
                    expo: true,
                  }).then((token) => {
                    navigate(RouteEnum.HOME);
                    if (token) {
                      API.put({
                        path: '/user',
                        body: { push_notif_token: JSON.stringify(token) },
                      });
                    }
                  });
                  break;
                default:
                  break;
              }
            }}
            disabled={isLoading}
            viewClassName="bg-app-yellow px-8 pb-4 pt-3 min-w-[200px]"
            textClassName="text-black"
            font="MarianneBold"
          >
            {isLoading ? 'Chargement' : "C'est parti !"}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
