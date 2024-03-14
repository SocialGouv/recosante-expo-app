import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Platform,
  Linking,
} from 'react-native';
import * as StoreReview from 'expo-store-review';
import { CommonActions } from '@react-navigation/native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  type HomeTabRouteEnum,
  RouteEnum,
  type HomeTabParamList,
  type RootStackParamList,
} from '~/constants/route';
import MyText from '~/components/ui/my-text';
import { NotificationsList } from './notifications-list';
import { Arrow } from '~/assets/icons/arrow';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appJson from '~/../app.json';
import { initSession, logEvent } from '~/services/logEventsWithMatomo';
import { useIndicatorsList } from '~/zustand/indicator/useIndicatorsList';
import { useIndicators } from '~/zustand/indicator/useIndicators';
import { Singular } from 'singular-react-native';

export type SettingsProps = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, HomeTabRouteEnum.SETTINGS>,
  NativeStackScreenProps<RootStackParamList>
>;

export function SettingsPage(props: SettingsProps) {
  const [onVersionClicked, setOnVersionClicked] = useState(0);
  const resetIndicatorsList = useIndicatorsList((state) => state.reset);
  const resetIndicators = useIndicators((state) => state.reset);
  const [canAskForReview, setCanAskForReview] = useState(false);

  useEffect(() => {
    StoreReview.isAvailableAsync().then((isAvailable) => {
      setCanAskForReview(isAvailable);
    });
  }, []);

  return (
    <SafeAreaView className="flex flex-1 items-center justify-around bg-app-gray">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        className="flex w-full flex-1 px-4 pb-20 pt-8"
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        <MyText font="MarianneBold" className="text-2xl">
          Vos préférences
        </MyText>
        <Title label="Notifications" />

        <NotificationsList />
        <Title label="Indicateurs" />

        <TextRow
          text="Changer votre indicateur favori"
          onPress={() => {
            Singular.event('SETTINGS_CHANGE_INDICATOR');
            props.navigation.navigate(RouteEnum.INDICATORS_SELECTOR, {
              enablePanDownToClose: true,
              eventCategory: 'SETTINGS',
            });
          }}
        />
        <Title label="Recosanté" />
        <TextRow
          text="Donner mon avis"
          onPress={() => {
            props.navigation.navigate(RouteEnum.FEEDBACK);
          }}
        />
        {canAskForReview && (
          <TextRow
            text="Noter 5 étoiles"
            onPress={() => {
              StoreReview.requestReview().then((lof) => {
                logEvent({
                  category: 'STORE_REVIEW',
                  action: 'TRIGGERED_FROM_SETTINGS',
                });
              });
            }}
          />
        )}
        <TextRow
          text="Laisser une revue sur les stores"
          onPress={() => {
            Linking.openURL(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              Platform.select({
                ios: `${appJson.expo.ios.appStoreUrl}?action=write-review`,
                android: `market://details?id=${appJson.expo.android.package}&showAllReviews=true`,
              })!,
            );
          }}
        />
        <TextRow
          text="Nos mentions légales"
          onPress={() => {
            props.navigation.navigate(RouteEnum.LEGAL);
          }}
        />
        <TextRow
          text="La politique de confidentialité"
          onPress={() => {
            props.navigation.navigate(RouteEnum.CONFIDENTIALITY);
          }}
        />
        <View>
          <TouchableOpacity
            onPress={async () => {
              if (onVersionClicked < 5) {
                setOnVersionClicked((c) => c + 1);
              } else {
                await AsyncStorage.clear();
                await initSession();
                resetIndicatorsList();
                const resetAction = CommonActions.reset({
                  index: 0,
                  routes: [{ name: RouteEnum.ONBOARDING }],
                });
                props.navigation.dispatch(resetAction);
                resetIndicators();
              }
            }}
            className=" mt-2 opacity-30"
          >
            <MyText font="MarianneRegularItalic" className="text-left text-xs">
              Version {appJson.expo.version} (
              {Platform.select({
                ios: appJson.expo.ios.buildNumber,
                android: `${appJson.expo.android.versionCode}`,
              })}
              )
            </MyText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface TitleProps {
  label: string;
}
function Title(props: TitleProps) {
  return (
    <MyText font="MarianneExtraBold" className="mt-8 text-xs uppercase">
      {props.label}
    </MyText>
  );
}

interface TextRowProps {
  text: string;
  onPress: () => void;
}
function TextRow(props: TextRowProps) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      className="flex flex-row items-center justify-between py-4 pr-4"
    >
      <MyText font="MarianneRegular" className="text-[14px]">
        {props.text}
      </MyText>
      <View>
        <Arrow />
      </View>
    </TouchableOpacity>
  );
}
