import React, { useCallback, useRef, useEffect, useMemo } from 'react';
import { Pressable, View, ScrollView } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteEnum, RootStackParamList } from '~/constants/route';
import MyText from '~/components/ui/my-text';
import { Close } from '~/assets/icons/close';

type LegalPageProps = NativeStackScreenProps<
  RootStackParamList,
  RouteEnum.LEGAL
>;

export function LegalPage(props: LegalPageProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['90%'], []);
  const isOpenedRef = useRef(false);

  const handleSheetChanges = useCallback((index: number) => {
    if (index < 0) {
      isOpenedRef.current = false;
    }
  }, []);

  function closeBottomSheet() {
    bottomSheetRef.current?.close();
    isOpenedRef.current = false;
    props.navigation.goBack();
  }

  useEffect(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <BottomSheet
      style={{
        backgroundColor: '#3343BD',
        borderRadius: 35,
        shadowColor: '#3343BD',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.7,
        shadowRadius: 20,
        elevation: 2,
      }}
      enablePanDownToClose={true}
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      onClose={() => {
        closeBottomSheet();
      }}
      backgroundStyle={{
        borderTopRightRadius: 35,
        borderTopLeftRadius: 35,
      }}
      handleStyle={{
        backgroundColor: '#3343BD',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
      }}
      handleIndicatorStyle={{
        backgroundColor: 'white',
        height: 7,
        width: 83,
      }}
    >
      <View className="-mt-2 flex items-center justify-center border-t border-app-primary bg-app-primary p-2 pb-6">
        <MyText font="MarianneBold" className="text-xl text-white">
          Mentions légales
        </MyText>
      </View>
      <Pressable onPress={closeBottomSheet} className="absolute right-2 top-0">
        <Close />
      </Pressable>

      <ScrollView className="flex flex-1 bg-app-gray">
        <View className="px-4 pb-20 pt-6">
          <Title label="Editeur de la plateforme" />
          <MyText font="MarianneRegular" className="mt-2 text-xs">
            L’application «Recosanté» est éditée par la Fabrique des ministères
            sociaux, située{'\u00a0'}:{'\n'}Tour Mirabeau{'\n'}39-43 Quai André
            Citroën
            {'\n'}
            75015 Paris France{'\n'}01 44 38 36 40
          </MyText>
          <Title label="Directrice de la publication" />
          <MyText font="MarianneRegular" className="mt-2 text-xs">
            Madame Anne JeanJean,{'\n'}Directrice du numérique des ministères
            sociaux
          </MyText>
          <Title label="Hébergement de la Plateforme" />
          <MyText font="MarianneRegular" className="mt-2 text-xs">
            Cette application est hébergée par OVH, situé{'\u00a0'}:{'\n'}2, rue
            Kellermann
            {'\n'}59100 Roubaix{'\n'}France.
          </MyText>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

interface TitleProps {
  label: string;
}
function Title(props: TitleProps) {
  return (
    <MyText font="MarianneExtraBold" className="mt-6 text-sm uppercase">
      {props.label}
    </MyText>
  );
}
