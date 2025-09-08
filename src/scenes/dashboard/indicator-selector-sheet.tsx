import { Dimensions, View } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRef, useMemo, useEffect } from 'react';
import MyText from '~/components/ui/my-text';
import { IndicatorsSelector } from '~/components/indicators/indicators-selector';
import { RouteEnum, type RootStackParamList } from '~/constants/route';
import { useIndicatorsList } from '~/zustand/indicator/useIndicatorsList';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { logEvent } from '~/services/logEventsWithMatomo';
import API from '~/services/api';

type IndicatorSelectorSheetProps = NativeStackScreenProps<
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
  const { indicators, setIndicatorsList } = useIndicatorsList((state) => state);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { enablePanDownToClose, eventCategory } = route.params;
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
      navigation.navigate(RouteEnum.HOME);
    }, 500);
  }

  async function refreshIndicatorsList() {
    // to avoid having to quit the app to see the new indicators
    const response = await API.get({ path: '/indicators/list' });
    if (!response.ok) return;
    setIndicatorsList(response.data);
  }
  useEffect(() => {
    setTimeout(() => {
      refreshIndicatorsList();
      // if we don't put this timeout, the transition is very ugly :(
    }, 1500);
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
      <View className="flex h-full w-full flex-1 border-t border-app-primary bg-app-primary p-2 pt-4">
        <MyText className="mx-2  mb-4 text-white" font="MarianneBold">
          Choisissez votre indicateur favori, les autres s'afficheront aussi.
        </MyText>
        <IndicatorsSelector
          onSubmit={(favoriteIndicators) => {
            logEvent({
              category: eventCategory,
              action: 'FAVORITE_INDICATOR_SELECTED',
              name: favoriteIndicators
                .map((slug) => slug.toLocaleUpperCase())
                .join(','),
            });
            closeBottomSheet();
          }}
          indicators={indicators}
        />
      </View>
    </BottomSheet>
  );
}
