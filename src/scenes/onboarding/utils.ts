import { useState } from 'react';
import { Alert, InteractionManager } from 'react-native';
import { LocationService } from '~/services/location';

import { OnboardingRouteEnum, RouteEnum } from '~/constants/route';
import { navigate } from '~/services/navigation';
import { useAddress } from '~/zustand/address/useAddress';
import { registerForPushNotificationsAsync } from '~/services/expo-push-notifs';
import API from '~/services/api';
import { capture } from '~/services/sentry';

export function useOnboardingNavigation() {
  const [onboardingScreen, setOnboardingScreen] = useState<
    OnboardingRouteEnum | RouteEnum.HOME
  >(OnboardingRouteEnum.WELCOME);
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
      // setOnboardingScreen(RouteEnum.HOME);
      // navigate(RouteEnum.HOME);
      setOnboardingScreen(OnboardingRouteEnum.NOTIFICATIONS);
      navigate(OnboardingRouteEnum.NOTIFICATIONS);
    } else {
      setOnboardingScreen(OnboardingRouteEnum.NOTIFICATIONS);
      navigate(OnboardingRouteEnum.NOTIFICATIONS);
    }
  }

  async function onSkip() {
    switch (onboardingScreen) {
      case OnboardingRouteEnum.GEOLOCATION:
        onNextAfterGeolocation();
        break;
      case OnboardingRouteEnum.NOTIFICATIONS:
        setOnboardingScreen(RouteEnum.HOME);
        navigate(RouteEnum.HOME);
        break;
      default:
        break;
    }
  }

  async function onNext() {
    switch (onboardingScreen) {
      case OnboardingRouteEnum.WELCOME:
        setOnboardingScreen(OnboardingRouteEnum.GEOLOCATION);
        navigate(OnboardingRouteEnum.GEOLOCATION);
        InteractionManager.runAfterInteractions(() => {
          setSkipVisible(true);
        });
        break;
      case OnboardingRouteEnum.GEOLOCATION:
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
            onNextAfterGeolocation();
          })
          .catch((err) => {
            capture(err, { extra: { location, method: 'get localisation onboarding' } });
            setIsLoading(false);
          });
        break;
      case OnboardingRouteEnum.NOTIFICATIONS:
        registerForPushNotificationsAsync({
          force: true,
          expo: true,
        }).then((token) => {
          setOnboardingScreen(RouteEnum.HOME);
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
  }

  return {
    onboardingScreen,
    skipVisible,
    onSkip,
    isLoading,
    onNext,
  };
}
