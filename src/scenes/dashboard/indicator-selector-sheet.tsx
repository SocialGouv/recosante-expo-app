import { Dimensions, View } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRef, useMemo } from 'react';
import MyText from '~/components/ui/my-text';
import { IndicatorsSelector } from '~/components/indicators/indicators-selector';
import { type RouteEnum, type RootStackParamList } from '~/constants/route';
import { useIndicatorsList } from '~/zustand/indicator/useIndicatorsList';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type IndicatorSelectorSheetProps = NativeStackScreenProps<
  // @ts-expect-error TODO
  RootStackParamList,
  RouteEnum.INDICATORS_SELECTOR
>;

const minHeight = 600;
const inPercentOfScreen = Math.round(
  (minHeight / Dimensions.get('window').height) * 100,
);

export function IndicatorSelectorSheet({
  navigation,
  route,
}: IndicatorSelectorSheetProps) {
  const { indicators } = useIndicatorsList((state) => state);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { enablePanDownToClose } = route.params;

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
    setTimeout(() => {
      // to make animation smoother
      navigation.goBack();
    }, 500);
  }

  return (
    <BottomSheet
      // enableDynamicSizing={true}
      style={{
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 150,
        elevation: 2,
      }}
      ref={bottomSheetRef}
      index={startIndex}
      snapPoints={snapPoints}
      enablePanDownToClose={enablePanDownToClose}
      onClose={closeBottomSheet}
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
        marginTop: 35,
      }}
    >
      <View className="flex h-full w-full flex-1 bg-app-primary p-2 pt-4">
        <MyText className="mx-2 mb-4 text-xl text-white" font="MarianneBold">
          Sélectionnez votre indicateur favori
        </MyText>
        <IndicatorsSelector
          onSubmit={closeBottomSheet}
          indicators={indicators}
        />
      </View>
    </BottomSheet>
  );
}
