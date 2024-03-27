import React from 'react';
import { ScrollView, Pressable, View } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  type HomeTabRouteEnum,
  type HomeTabParamList,
  type RootStackParamList,
} from '~/constants/route';
import { ShareLink } from '~/assets/icons/share-link';
import { Illu } from '~/assets/share/illu';
import MyText from '~/components/ui/my-text';
import { ShareService } from '~/services/share';

export type ShareProps = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, HomeTabRouteEnum.SHARE>,
  NativeStackScreenProps<RootStackParamList>
>;

export function SharePage(props: ShareProps) {
  return (
    <View className="flex flex-1 items-center justify-start  bg-app-gray">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        className="flex w-full flex-1 px-6 pb-20 "
        contentContainerStyle={{
          paddingBottom: 200,
          alignItems: 'center',
          gap: 20,
        }}
      >
        <View className="flex w-full">
          <MyText font="MarianneBold" className="text-2xl">
            Partagez l’application{'\n'}Recosanté !
          </MyText>
          <MyText font="MarianneRegular" className="mt-4 text-[14px]">
            Pour agir ensemble en faveur de votre santé et de l'environnement.
          </MyText>
        </View>
        <View className="w-full">
          <Illu />
        </View>
        <View>
          <MyText
            font="MarianneRegular"
            className="px-8 text-center text-[14px]"
          >
            Vous tenez à eux !{'\n'} Permettez à vos proches de recevoir des
            <MyText font="MarianneBold"> informations essentielles</MyText> pour
            <MyText font="MarianneBold">
              {' '}
              protéger leur santé au quotidien.
            </MyText>
          </MyText>
        </View>

        <View className="mt-8">
          <Pressable
            className=" flex flex-row items-center justify-center space-x-4 rounded-full bg-app-yellow p-4 px-6"
            onPress={async () => {
              await ShareService.shareApp();
            }}
          >
            <ShareLink />
            <MyText font="MarianneBold" className="text-[15px]">
              Partager l’application
            </MyText>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
