import { useMemo } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Welcome } from './screens/welcome';
import { Geolocation } from './screens/geolocation';
import { Notifications } from './screens/notifications';
import { OnboardingRouteEnum, RouteEnum } from '~/constants/route';
import Button from '~/components/ui/button';
import { cn } from '~/utils/tailwind';
import { useOnboardingNavigation } from './utils';

import MyText from '~/components/ui/my-text';
import { Stepper } from './steps';
import { SkipArrow } from '~/assets/icons/skip';
import { Cookies } from './screens/cookies';
import { navigate } from '~/services/navigation';

const OnboardingStack = createStackNavigator();
export function Onboarding() {
  const { onboardingScreen, skipVisible, onSkip, isLoading, onNext } =
    useOnboardingNavigation();

  const step = useMemo(() => {
    switch (onboardingScreen) {
      case OnboardingRouteEnum.WELCOME:
        return 1;
      case OnboardingRouteEnum.GEOLOCATION:
        return 2;
      case OnboardingRouteEnum.NOTIFICATIONS:
        return 3;
      case OnboardingRouteEnum.COOKIES:
        return 4;
      default:
        return 5;
    }
  }, [onboardingScreen]);

  return (
    <SafeAreaView className="flex flex-1 bg-app-primary px-4">
      <View
        className={cn(
          !skipVisible ? 'opacity-0' : 'opacity-100',
          'mb-8 flex w-full flex-row justify-end bg-app-primary',
        )}
      >
        <Button
          onPress={onSkip}
          textClassName="text-right text-white text-sm"
          font="MarianneRegular"
        >
          Passer <SkipArrow />
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
          <OnboardingStack.Screen
            name={OnboardingRouteEnum.COOKIES}
            component={Cookies}
          />
        </OnboardingStack.Navigator>
        {step !== 4 ? (
          <View className="mx-auto my-8 flex w-full flex-row justify-center">
            <Stepper step={step} onPress={onNext} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#3343BD" />
              ) : (
                <MyText font="MarianneBold" className="text-center text-black">
                  C'est parti !
                </MyText>
              )}
            </Stepper>
          </View>
        ) : (
          <View className="mx-auto my-8 flex w-full flex-row justify-center">
            <Pressable
              onPress={() => {
                navigate(RouteEnum.HOME);
              }}
              className="z-50 m-2  justify-center rounded-full bg-app-yellow px-8 pb-4 pt-3"
            >
              <MyText font="MarianneBold" className="text-center text-black">
                Je refuse
              </MyText>
            </Pressable>
            <Pressable
              onPress={onNext}
              className="z-50 m-2  justify-center rounded-full bg-app-yellow px-8 pb-4 pt-3"
            >
              <MyText font="MarianneBold" className="text-center text-black">
                J'accepte
              </MyText>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
