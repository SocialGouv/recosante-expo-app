import { useState } from 'react';
import { Alert, InteractionManager } from 'react-native';
import { LocationService } from '~/services/location';

import { OnboardingRouteEnum, RouteEnum } from '~/constants/route';
import { navigate, resetNavigationTo } from '~/services/navigation';
import { useUser } from '~/zustand/user/useUser';
import { registerForPushNotificationsAsync } from '~/services/expo-push-notifs';
import API from '~/services/api';
import { capture } from '~/services/sentry';
import { logEvent } from '~/services/logEventsWithMatomo';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

type State = OnboardingRouteEnum | RouteEnum.HOME;

export function useOnboardingNavigation(): {
  onboardingScreen: OnboardingRouteEnum | RouteEnum.HOME;
  skipVisible: boolean;
  onSkip: () => void;
  isLoading: boolean;
  onNext: () => void;
} {
  const [onboardingScreen, setOnboardingScreen] = useState<State>(
    OnboardingRouteEnum.WELCOME,
  );
  const [skipVisible, setSkipVisible] = useState<boolean>(false);
  const { setAddress } = useUser((state) => state);
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
      resetNavigationTo(RouteEnum.HOME);
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
        setOnboardingScreen(OnboardingRouteEnum.COOKIES);
        navigate(OnboardingRouteEnum.COOKIES);
        break;
      case OnboardingRouteEnum.COOKIES:
        logEvent({
          category: 'ONBOARDING',
          action: 'SKIP',
          name: 'COOKIES',
        });
        setOnboardingScreen(RouteEnum.HOME);
        resetNavigationTo(RouteEnum.HOME);
        break;
      default:
        break;
    }
  }

  async function askRequestForCookie() {
    const { status: requestTrackingPermissionsStatus } =
      await requestTrackingPermissionsAsync();

    if (requestTrackingPermissionsStatus === 'granted') {
      logEvent({
        category: 'ONBOARDING',
        action: 'ENABLE_ADVERTISER_TRACKING',
      });
      logEvent({
        category: 'ONBOARDING',
        action: 'COMPLETED',
      });
      setOnboardingScreen(RouteEnum.HOME);
      resetNavigationTo(RouteEnum.HOME);
    }
  }

  async function askRequestForLocation() {
    const { status, location } = await LocationService.requestLocation();
    logEvent({
      category: 'ONBOARDING',
      action: 'ENABLE_GEOLOCATION',
    });
    setIsLoading(true);
    if (!location) {
      if (status === 'granted') {
        Alert.alert(
          "Nous n'avons pas réussi à vous localiser 🧐",
          'Peut-être est-ce un problème de réseau ? Ne vous en faites pas, vous pourrez réessayer plus tard 😅',
        );
      }
      setIsLoading(false);
      onNextAfterGeolocation();
      return;
    }
    LocationService.getAdressByCoordinates(
      location.coords.latitude,
      location.coords.longitude,
    )
      .then((address) => {
        setIsLoading(false);
        if (address) {
          setAddress(address);
        }
        onNextAfterGeolocation();
      })
      .catch((err) => {
        capture(err, {
          extra: { location, method: 'get localisation onboarding' },
        });
        setIsLoading(false);
      });
  }

  async function askRequestForNotification() {
    if (process.env.NODE_ENV === 'development') {
      logEvent({
        category: 'ONBOARDING',
        action: 'DEV_SKIP_NOTIFICATIONS',
      });
      setOnboardingScreen(OnboardingRouteEnum.COOKIES);
      navigate(OnboardingRouteEnum.COOKIES);
      return;
    }
    registerForPushNotificationsAsync({
      force: true,
      expo: true,
    }).then((token) => {
      logEvent({
        category: 'ONBOARDING',
        action: 'ENABLE_NOTIFICATIONS',
      });
      setOnboardingScreen(OnboardingRouteEnum.COOKIES);
      navigate(OnboardingRouteEnum.COOKIES);
      if (token) {
        API.put({
          path: '/user',
          body: { push_notif_token: JSON.stringify(token) },
        });
      }
    });
  }

  function onNextAfterWelcome() {
    setOnboardingScreen(OnboardingRouteEnum.GEOLOCATION);
    navigate(OnboardingRouteEnum.GEOLOCATION);
    InteractionManager.runAfterInteractions(() => {
      setSkipVisible(true);
    });
  }

  async function onNext() {
    switch (onboardingScreen) {
      case OnboardingRouteEnum.WELCOME:
        onNextAfterWelcome();
        break;
      case OnboardingRouteEnum.GEOLOCATION:
        askRequestForLocation();
        break;
      case OnboardingRouteEnum.NOTIFICATIONS:
        askRequestForNotification();
        break;
      case OnboardingRouteEnum.COOKIES:
        askRequestForCookie();
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
