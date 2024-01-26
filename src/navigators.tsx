import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  type NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import * as SplashScreen from 'expo-splash-screen';
import { navigationRef } from '~/services/navigation';

import { logEvent } from './services/logEventsWithMatomo';
import { HomeIcon } from '~/assets/icons/home';
import { SettingsIcon } from '~/assets/icons/settings';
import { ShareIcon } from '~/assets/icons/share';

import MyText from './components/ui/my-text';
import { DashboardPage } from './scenes/dashboard/dashboard';
import { RouteEnum, type RootStackParamList } from './constants/route';
import { Onboarding } from './scenes/onboarding/onboarding';
import { SharePage } from './scenes/share';
import { SettingsPage } from './scenes/settings/settings';
import { LocationPage } from '~/scenes/location/location';
import { useAddress } from './zustand/address/useAddress';
import { IndicatorSelectorSheet } from './scenes/dashboard/indicator-selector-sheet';
import { useIndicatorsList } from './zustand/indicator/useIndicatorsList';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { IndicatorDetail } from './scenes/dashboard/indicator-detail';
import { LegalPage } from './scenes/legal/legal';
import { ConfidentialityPage } from './scenes/confidentiality/confidentiality';

interface TabBarLabelProps {
  children: React.ReactNode;
  focused: boolean;
}

function TabBarLabel(props: TabBarLabelProps) {
  return (
    <MyText
      font={props.focused ? 'MarianneBold' : 'MarianneRegular'}
      className={[
        '-mt-1 mb-1 text-xs',
        props.focused ? 'text-app-950' : 'text-gray-500',
      ].join(' ')}
    >
      {props.children}
    </MyText>
  );
}
// @ts-expect-error TODO
type HomeProps = NativeStackScreenProps<RootStackParamList, RouteEnum.HOME>;
const HomeBottomTab = createBottomTabNavigator();

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

  return (
    <HomeBottomTab.Navigator
      sceneContainerStyle={{ backgroundColor: '#3343BD' }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingHorizontal: 20,
          paddingBottom: -10,
          backgroundColor: '#3343BD',
          borderTopWidth: 0,
          borderRadius: 500,
          marginHorizontal: 30,
          marginVertical: 12,
          position: 'absolute',
          overflow: 'hidden',
          zIndex: 100,
          height: 70,
        },
        lazy: false,
      }}
    >
      <HomeBottomTab.Screen
        name={RouteEnum.DASHBOARD}
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
        name={RouteEnum.SHARE}
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
        name={RouteEnum.SETTINGS}
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
    </HomeBottomTab.Navigator>
  );
}
const RootStack = createNativeStackNavigator();
export function Navigators() {
  const { _hasHydrated, address } = useAddress((state) => state);
  const hasAddress = !!address?.citycode;

  async function onReady() {
    await SplashScreen.hideAsync();
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

            <RootStack.Screen
              name={RouteEnum.HOME}
              // @ts-expect-error TODO
              component={Home}
            />
            <RootStack.Screen name={RouteEnum.SHARE} component={SharePage} />
            <RootStack.Screen
              name={RouteEnum.INDICATORS_SELECTOR}
              // @ts-expect-error TODO
              component={IndicatorSelectorSheet}
              options={() => ({
                headerShown: false,
                presentation: 'transparentModal',
                //  TODO/FIXME: animation non on enter, fade on exit
                // animation: 'none',
              })}
            />
            <RootStack.Screen
              name={RouteEnum.INDICATOR_DETAIL}
              // @ts-expect-error TODOe
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
          </RootStack.Navigator>
        </NavigationContainer>
      </BottomSheetModalProvider>
    </AutocompleteDropdownContextProvider>
  );
}
