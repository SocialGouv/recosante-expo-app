import React, { useState } from 'react';
import {
  ScrollView,
  Alert,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import MyText from '~/components/ui/my-text';
import { NotificationsList } from './notifications-list';
import { Arrow } from '~/assets/icons/arrow';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteEnum, type RootStackParamList } from '~/constants/route';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appJson from '~/../app.json';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type SettingsProps = BottomTabScreenProps<
  // @ts-expect-error TODO
  RootStackParamList,
  RouteEnum.SETTINGS
>;

export function SettingsPage({ navigation }: SettingsProps) {
  const [onVersionClicked, setOnVersionClicked] = useState(0);

  return (
    <SafeAreaView className="flex flex-1 items-center justify-around bg-app-gray">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        className="flex w-full flex-1 px-4 pb-20 pt-8"
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        <MyText font="MarianneBold" className="text-3xl">
          Vos préférences
        </MyText>
        <Title label="Notifications" />

        <NotificationsList />
        <Title label="Indicateurs" />

        <TextRow
          text="Changer votre indicateur favori"
          onPress={() =>
            navigation.navigate(RouteEnum.INDICATORS_SELECTOR, {
              enablePanDownToClose: true,
            })
          }
        />
        <View className="mt-16 w-full items-center">
          <TouchableOpacity onPress={() => {}}>
            <MyText font="MarianneRegular" className="text-xs underline">
              Nous contacter
            </MyText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <MyText font="MarianneRegular" className="mt-4 text-xs underline">
              Mentions légales
            </MyText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (onVersionClicked < 5) {
                setOnVersionClicked((c) => c + 1);
              } else {
                AsyncStorage.clear();
                const resetAction = CommonActions.reset({
                  index: 0,
                  routes: [{ name: RouteEnum.ONBOARDING }],
                });
                navigation.dispatch(resetAction);
              }
            }}
            className="opacity-30"
          >
            <MyText font="MarianneRegular" className="mt-4 text-xs">
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
    <MyText font="MarianneExtraBold" className="mt-8 text-sm uppercase">
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
      hitSlop={{
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      }}
      className="flex flex-row items-center justify-between py-4 pr-4"
    >
      <MyText font="MarianneRegular" className="">
        {props.text}
      </MyText>
      <View>
        <Arrow />
      </View>
    </TouchableOpacity>
  );
}
