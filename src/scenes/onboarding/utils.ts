import { useState } from 'react';
import { Alert, InteractionManager } from 'react-native';
import { LocationService } from '~/services/location';

import { OnboardingRouteEnum, RouteEnum } from '~/constants/route';
import { navigate } from '~/services/navigation';
import { useAddress } from '~/zustand/address/useAddress';
import { registerForPushNotificationsAsync } from '~/services/expo-push-notifs';
import API from '~/services/api';
import { capture } from '~/services/sentry';
import { logEvent } from '~/services/logEventsWithMatomo';

export function useOnboardingNavigation(): {
  onboardingScreen: OnboardingRouteEnum | RouteEnum.HOME;
  skipVisible: boolean;
  onSkip: () => void;
  isLoading: boolean;
  onNext: () => void;
} {
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
      logEvent({
        category: 'ONBOARDING',
        action: 'COMPLETED',
      });
      setOnboardingScreen(RouteEnum.HOME);
      navigate(RouteEnum.HOME);
    } else {
      setOnboardingScreen(OnboardingRouteEnum.NOTIFICATIONS);
      navigate(OnboardingRouteEnum.NOTIFICATIONS);
    }
  }

  async function onSkip() {
    switch (onboardingScreen) {
      case OnboardingRouteEnum.GEOLOCATION:
        logEvent({
          category: 'ONBOARDING',
          action: 'SKIP',
          name: 'GEOLOCATION',
        });
        onNextAfterGeolocation();
        break;
      case OnboardingRouteEnum.NOTIFICATIONS:
        logEvent({
          category: 'ONBOARDING',
          action: 'SKIP',
          name: 'NOTIFICATIONS',
        });
        logEvent({
          category: 'ONBOARDING',
          action: 'COMPLETED',
        });
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
        logEvent({
          category: 'ONBOARDING',
          action: 'ENABLE_GEOLOCATION',
        });
        setIsLoading(true);
        const location = await LocationService.requestLocation();
        if (!location) {
          Alert.alert('Erreur', 'Impossible de trouver votre position');
          setIsLoading(false);
          return;
        }
        LocationService.getAdressByCoordinates(
          location.coords.latitude,
          location.coords.longitude,
        )
          .then((adress) => {
            setIsLoading(false);
            if (adress) {
              setAddress(adress);
            }
            onNextAfterGeolocation();
          })
          .catch((err) => {
            capture(err, {
              extra: { location, method: 'get localisation onboarding' },
            });
            setIsLoading(false);
          });
        break;
      case OnboardingRouteEnum.NOTIFICATIONS:
        registerForPushNotificationsAsync({
          force: true,
          expo: true,
        }).then((token) => {
          logEvent({
            category: 'ONBOARDING',
            action: 'ENABLE_NOTIFICATIONS',
          });
          setOnboardingScreen(RouteEnum.HOME);
          navigate(RouteEnum.HOME);
          if (token) {
            API.put({
              path: '/user',
              body: { push_notif_token: JSON.stringify(token) },
            });
          }
          logEvent({
            category: 'ONBOARDING',
            action: 'COMPLETED',
          });
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
