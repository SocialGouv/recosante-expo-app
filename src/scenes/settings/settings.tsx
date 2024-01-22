import React from 'react';
import { ScrollView, Alert, TouchableOpacity, View } from 'react-native';
import MyText from '~/components/ui/my-text';
import { NotificationsList } from './notifications-list';
import { Arrow } from '~/assets/icons/arrow';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteEnum } from '~/constants/route';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function SettingsPage({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView className="flex flex-1 items-center justify-around bg-app-gray px-4">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        className="mt-8 flex w-full flex-1"
      >
        <MyText font="MarianneBold" className=" text-3xl">
          Vos préférences
        </MyText>
        <MyText font="MarianneBold" className=" mt-4 text-sm uppercase">
          Notifications
        </MyText>
        <NotificationsList />
        <Title label="Indicateurs" />

        <TextRow
          text="Votre indicateur favori"
          onPress={() =>
            navigation.navigate(RouteEnum.INDICATORS_SELECTOR, {
              enablePanDownToClose: true,
            })
          }
        />
        {__DEV__ && (
          <View className="mt-12 border-b border-app-gray">
            <TextRow
              text="Dev mode / Clear Cookies"
              onPress={async () => {
                await AsyncStorage.clear();
                console.log('AsyncStorage cleared');

                navigation.navigate(RouteEnum.ONBOARDING);
              }}
            />
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            Alert.alert('TODO');
          }}
        >
          <MyText
            font="MarianneExtraBold"
            className=" mt-8 text-xs uppercase underline"
          >
            nous contacter
          </MyText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('TODO');
          }}
        >
          <MyText
            font="MarianneRegular"
            className=" mt-8 text-xs uppercase underline"
          >
            Mentions légales
          </MyText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

interface TitleProps {
  label: string;
}
function Title(props: TitleProps) {
  return (
    <MyText font="MarianneBold" className="mt-8 text-sm uppercase">
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
      <MyText font="MarianneRegular" className="text-lg ">
        {props.text}
      </MyText>
      <View>
        <Arrow />
      </View>
    </TouchableOpacity>
  );
}
