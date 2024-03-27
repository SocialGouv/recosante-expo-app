import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  type NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import * as SplashScreen from 'expo-splash-screen';
import { navigationRef } from '~/services/navigation';

import { logEvent } from './services/logEventsWithMatomo';

import { RouteEnum, type RootStackParamList } from './constants/route';
import { Onboarding } from './scenes/onboarding/onboarding';
import { LocationPage } from '~/scenes/location/location';
import { useUser } from './zustand/user/useUser';
import { IndicatorSelectorSheet } from './scenes/dashboard/indicator-selector-sheet';
import { useIndicatorsList } from './zustand/indicator/useIndicatorsList';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { IndicatorDetail } from './scenes/dashboard/indicator-detail';
import { LegalPage } from './scenes/legal/legal';
import { ConfidentialityPage } from './scenes/confidentiality/confidentiality';
import { FeedbackPage } from './scenes/feedback/feedback';
import { IndicatorFastSelector } from './scenes/dashboard/indicator-fast-selector';
import { BurgerMenu } from './components/burger-menu';

type HomeProps = NativeStackScreenProps<RootStackParamList, RouteEnum.HOME>;

function Home(props: HomeProps) {
  const { favoriteIndicator } = useIndicatorsList((state) => state);
  useEffect(() => {
    if (!favoriteIndicator) {
      props.navigation.navigate(RouteEnum.INDICATORS_SELECTOR, {
        enablePanDownToClose: false,
        eventCategory: 'ONBOARDING',
      });
    }
  }, []);

  return <BurgerMenu navigation={props.navigation} />;
}

const RootStack = createNativeStackNavigator<RootStackParamList>();
export function Navigators() {
  const { _hasHydrated, address } = useUser((state) => state);
  const hasAddress = !!address?.municipality_insee_code;

  async function onReady() {
    await SplashScreen.hideAsync();
    // wait for matomoid to be created here: https://github.com/SocialGouv/recosante-expo-app/blob/02aa1bb97a687df66b682fc059b92114ed097c51/src/services/logEventsWithMatomo.ts#L17
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await logEvent({ category: 'APP', action: 'APP_OPEN' });
  }
  const prevCurrentRouteName = useRef<string>(null);
  async function onNavigationStateChange() {
    if (!navigationRef.isReady()) return;
    const route = navigationRef.getCurrentRoute();
    if (route?.name === prevCurrentRouteName.current) return;
    if (!prevCurrentRouteName) return;
    if (!route?.name) return;
    // TODO:
    // @ts-expect-error check this
    prevCurrentRouteName.current = route.name;
    logEvent({ category: 'NAVIGATION', action: route.name });
  }
  if (!_hasHydrated) return null;

  return (
    <AutocompleteDropdownContextProvider>
      <BottomSheetModalProvider>
        <NavigationContainer
          onStateChange={onNavigationStateChange}
          onReady={onReady}
          ref={navigationRef}
        >
          <RootStack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={
              hasAddress ? RouteEnum.HOME : RouteEnum.ONBOARDING
            }
          >
            <RootStack.Screen
              name={RouteEnum.ONBOARDING}
              component={Onboarding}
            />

            <RootStack.Screen name={RouteEnum.HOME} component={Home} />
            <RootStack.Screen
              name={RouteEnum.INDICATORS_SELECTOR}
              component={IndicatorSelectorSheet}
              options={() => ({
                headerShown: false,
                presentation: 'transparentModal',
              })}
            />
            <RootStack.Screen
              name={RouteEnum.INDICATOR_DETAIL}
              component={IndicatorDetail}
              options={() => ({
                headerShown: false,
                presentation: 'transparentModal',
                customAnimationOnGestureEnd: {
                  animation: 'fade',
                  duration: 400,
                },
                customAnimationOnGestureStart: {
                  animation: 'fade',
                  duration: 400,
                },
              })}
            />
            <RootStack.Screen
              name={RouteEnum.LOCATION}
              component={LocationPage}
              options={() => ({
                headerShown: false,
                presentation: 'transparentModal',
                customAnimationOnGestureEnd: {
                  animation: 'fade',
                  duration: 400,
                },
                customAnimationOnGestureStart: {
                  animation: 'fade',
                  duration: 400,
                },
              })}
            />
            <RootStack.Screen
              name={RouteEnum.LEGAL}
              component={LegalPage}
              options={() => ({
                headerShown: false,
                presentation: 'transparentModal',
                customAnimationOnGestureEnd: {
                  animation: 'fade',
                  duration: 400,
                },
                customAnimationOnGestureStart: {
                  animation: 'fade',
                  duration: 400,
                },
              })}
            />
            <RootStack.Screen
              name={RouteEnum.FEEDBACK}
              component={FeedbackPage}
              options={() => ({
                headerShown: false,
                presentation: 'transparentModal',
                customAnimationOnGestureEnd: {
                  animation: 'fade',
                  duration: 400,
                },
                customAnimationOnGestureStart: {
                  animation: 'fade',
                  duration: 400,
                },
              })}
            />
            <RootStack.Screen
              name={RouteEnum.CONFIDENTIALITY}
              component={ConfidentialityPage}
              options={() => ({
                headerShown: false,
                presentation: 'transparentModal',
                customAnimationOnGestureEnd: {
                  animation: 'fade',
                  duration: 400,
                },
                customAnimationOnGestureStart: {
                  animation: 'fade',
                  duration: 400,
                },
              })}
            />
            <RootStack.Screen
              name={RouteEnum.INDICATOR_FAST_SELECTOR}
              component={IndicatorFastSelector}
              options={() => ({
                headerShown: false,
                presentation: 'transparentModal',
                animation: 'fade',
              })}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      </BottomSheetModalProvider>
    </AutocompleteDropdownContextProvider>
  );
}

// {
/* </Drawer.Navigator>
    <HomeBottomTab.Navigator
      sceneContainerStyle={{ backgroundColor: '#3343BD' }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarShowLabel: false,
        tabBarStyle: {
          display: 'none',
          paddingHorizontal: 20,
          paddingBottom: -10,
          backgroundColor: '#3343BD',
          borderTopWidth: 0,
          borderRadius: 500,
          marginHorizontal: 30,
          position: 'absolute',
          overflow: 'hidden',
          zIndex: 100,
          height: 70,
          bottom: 20,
        },
        lazy: false,
      }}
    >
      <HomeBottomTab.Screen
        name={HomeTabRouteEnum.DASHBOARD}
        options={{
          tabBarLabel: (props) => (
            <TabBarLabel {...props}>Dashboard</TabBarLabel>
          ),
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon size={20} color={color} focused={focused} />
          ),
        }}
        component={DashboardPage}
      />
      <HomeBottomTab.Screen
        name={HomeTabRouteEnum.SHARE}
        options={{
          tabBarLabel: (props) => (
            <TabBarLabel {...props}>Partager</TabBarLabel>
          ),
          tabBarIcon: ({ color, focused }) => (
            <ShareIcon size={20} color={color} focused={focused} />
          ),
        }}
        component={SharePage}
      />
      <HomeBottomTab.Screen
        name={HomeTabRouteEnum.SETTINGS}
        component={SettingsPage}
        options={{
          tabBarLabel: (props) => (
            <TabBarLabel {...props}>Paramètres</TabBarLabel>
          ),
          tabBarIcon: ({ color, focused }) => (
            <SettingsIcon size={20} color={color} focused={focused} />
          ),
        }}
      />
    </HomeBottomTab.Navigator> */
// }
