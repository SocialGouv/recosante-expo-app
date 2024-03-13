import { Dimensions, View } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRef, useMemo } from 'react';
import MyText from '~/components/ui/my-text';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CookiesList } from '~/components/cookies-list/cookies-list';
import {
  OnboardingRouteEnum,
  type RootStackParamList,
  type RouteEnum,
} from '~/constants/route';

type IndicatorSelectorSheetProps = NativeStackScreenProps<
  RootStackParamList,
  RouteEnum.COOKIES_SELECTOR
>;

const minHeight = 400;
const inPercentOfScreen = Math.round(
  (minHeight / Dimensions.get('window').height) * 100,
);

export function CookieSelectorSheet({
  navigation,
  route,
}: IndicatorSelectorSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(
    () =>
      [inPercentOfScreen, 75, 90, 100, 30]
        .sort((a, b) => (a > b ? 1 : -1))
        .map((snapPoint) => `${snapPoint}%`),
    [],
  );
  const startIndex = useMemo(() => {
    return snapPoints.findIndex(
      (snapPoint) => snapPoint === `${inPercentOfScreen}%`,
    );
  }, [snapPoints]);

  function closeBottomSheet() {
    bottomSheetRef.current?.close();
    navigation.navigate(OnboardingRouteEnum.COOKIES);
  }

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
      ref={bottomSheetRef}
      index={startIndex}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={closeBottomSheet}
      backgroundStyle={{
        borderTopRightRadius: 35,
        borderTopLeftRadius: 35,
      }}
      handleStyle={{
        backgroundColor: 'white',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
      }}
      handleIndicatorStyle={{
        backgroundColor: '#3343BD',
        height: 7,
        width: 83,
        marginTop: 35,
      }}
    >
      <View className="flex h-full w-full flex-1 border-t border-white bg-white p-2 pt-4">
        <MyText className="mx-2  mb-4 text-black" font="MarianneBold">
          Voici les cookies que nous utilisons
        </MyText>
        <CookiesList />
      </View>
    </BottomSheet>
  );
}
