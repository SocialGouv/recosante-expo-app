import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Platform,
  Linking,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import MyText from '~/components/ui/my-text';
import { NotificationsList } from './notifications-list';
import { Arrow } from '~/assets/icons/arrow';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteEnum } from '~/constants/route';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appJson from '~/../app.json';
import { initMatomo, logEvent } from '~/services/logEventsWithMatomo';
import { useIndicatorsList } from '~/zustand/indicator/useIndicatorsList';
import { useIndicators } from '~/zustand/indicator/useIndicators';

export function SettingsPage({ navigation }: any) {
  const [onVersionClicked, setOnVersionClicked] = useState(0);
  const resetIndicatorsList = useIndicatorsList((state) => state.reset);
  const resetIndicators = useIndicators((state) => state.reset);

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
            navigation.navigate(RouteEnum.INDICATORS_SELECTOR, {
              enablePanDownToClose: true,
              eventCategory: 'SETTINGS',
            });
          }}
        />
        <Title label="Recosanté" />

        <TextRow
          text="Nous contacter"
          onPress={() => {
            logEvent({
              category: 'SETTINGS',
              action: 'CONTACT_US_BY_EMAIL',
            });
            Linking.openURL('mailto:contact@recosante.beta.gouv.fr');
          }}
        />
        <TextRow
          text="Nos mentions légales"
          onPress={() => {
            navigation.navigate(RouteEnum.LEGAL);
          }}
        />
        <TextRow
          text="La politique de confidentialité"
          onPress={() => {
            navigation.navigate(RouteEnum.CONFIDENTIALITY);
          }}
        />
        <View>
          {/* <View className="mb-4 mt-16 flex w-full  flex-row items-start justify-between space-x-2">
            <TouchableOpacity
              onPress={() => {
                logEvent({
                  category: 'SETTINGS',
                  action: 'CONTACT_US_BY_EMAIL',
                });
                Linking.openURL('mailto:contact@recosante.beta.gouv.fr');
              }}
              className="border-b pb-1"
            >
              <MyText font="MarianneBold">Nous contacter</MyText>
            </TouchableOpacity>
          </View> */}
          {/* <View className="mt-16 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(RouteEnum.LEGAL);
              }}
              className="border-b pb-1"
            >
              <MyText font="MarianneBold">Mentions légales</MyText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(RouteEnum.LEGAL);
              }}
              className="mt-2 border-b pb-1"
            >
              <MyText font="MarianneBold">Politique de confidentialité</MyText>
            </TouchableOpacity>
          </View> */}
          <TouchableOpacity
            onPress={async () => {
              if (onVersionClicked < 5) {
                setOnVersionClicked((c) => c + 1);
              } else {
                await AsyncStorage.clear();
                await initMatomo();
                resetIndicatorsList();
                const resetAction = CommonActions.reset({
                  index: 0,
                  routes: [{ name: RouteEnum.ONBOARDING }],
                });
                navigation.dispatch(resetAction);
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
      hitSlop={{
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      }}
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
