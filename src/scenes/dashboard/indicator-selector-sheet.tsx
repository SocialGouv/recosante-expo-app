import { View } from 'react-native';
import { useEffect } from 'react';
import MyText from '~/components/ui/my-text';
import { IndicatorsSelector } from '~/components/indicators/indicators-selector';
import { RouteEnum, type RootStackParamList } from '~/constants/route';
import { useIndicatorsList } from '~/zustand/indicator/useIndicatorsList';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { logEvent } from '~/services/logEventsWithMatomo';
import API from '~/services/api';
import { BottomSheetWrapper } from '~/components/ui/bottom-sheet';

type IndicatorSelectorSheetProps = NativeStackScreenProps<
  RootStackParamList,
  RouteEnum.INDICATORS_SELECTOR
>;

export function IndicatorSelectorSheet({
  navigation,
  route,
}: IndicatorSelectorSheetProps) {
  const { indicators, setIndicatorsList } = useIndicatorsList((state) => state);
  const { enablePanDownToClose, eventCategory } = route.params;

  function goBackHome() {
    navigation.navigate(RouteEnum.HOME);
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
    <BottomSheetWrapper
      navigation={navigation}
      enablePanDownToClose={enablePanDownToClose}
    >
      <View className="flex h-full w-full flex-1  bg-white p-2 pt-4">
        <MyText
          className="mx-6 mb-2  text-2xl text-app-primary"
          font="MarianneBold"
        >
          Indicateur favori
        </MyText>
        <MyText className="mx-6 mb-6 text-lg text-app-primary">
          Choisissez l'indicateur que vous souhaitez voir en premier.
        </MyText>
        <IndicatorsSelector
          onSubmit={(favoriteIndicator) => {
            logEvent({
              category: eventCategory,
              action: 'FAVORITE_INDICATOR_SELECTED',
              name: favoriteIndicator.toLocaleUpperCase(),
            });
            goBackHome();
          }}
          indicators={indicators}
        />
      </View>
    </BottomSheetWrapper>
  );
}
