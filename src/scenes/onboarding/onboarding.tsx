import { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Welcome } from './screens/welcome';
import { Geolocation } from './screens/geolocation';
import { Notifications } from './screens/notifications';
import { OnboardingRouteEnum } from '~/constants/route';
import Button from '~/components/ui/button';
import { cn } from '~/utils/tailwind';
import { useOnboardingNavigation } from './utils';

import MyText from '~/components/ui/my-text';
import { Stepper } from './stepper';

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
      default:
        return 4;
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
          <Stepper step={step} onPress={onNext} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="black" />
            ) : (
              <MyText font="MarianneBold" className="text-center text-black">
                C'est parti !
              </MyText>
            )}
          </Stepper>
        </View>
      </View>
    </SafeAreaView>
  );
}
