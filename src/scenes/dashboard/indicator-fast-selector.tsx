import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { type RouteEnum, type RootStackParamList } from '~/constants/route';
import { useIndicatorsList } from '~/zustand/indicator/useIndicatorsList';
import Button from '~/components/ui/button';
import MyText from '~/components/ui/my-text';
import { logEvent } from '~/services/logEventsWithMatomo';

type IndicatorFastSelectorProps = NativeStackScreenProps<
  RootStackParamList,
  RouteEnum.INDICATOR_FAST_SELECTOR
>;

export function IndicatorFastSelector(props: IndicatorFastSelectorProps) {
  const selected = props.route.params.indicatorSlug;

  const { setFavoriteIndicator, indicators } = useIndicatorsList(
    (state) => state,
  );

  const indicatorItem = indicators.find(
    (indicator) => indicator.slug === selected,
  );

  const handleSubmit = () => {
    if (indicatorItem) {
      logEvent({
        category: 'DASHBOARD',
        action: 'INDICATOR_FAVORITE_SELECTED',
        name: indicatorItem.slug,
      });
      setFavoriteIndicator(indicatorItem);
      props.navigation.goBack();
    }
  };

  function handleSkip() {
    logEvent({
      category: 'DASHBOARD',
      action: 'INDICATOR_FAVORITE_SELECTED',
      name: 'SKIP',
    });
    props.navigation.goBack();
  }

  return (
    <View className="flex h-full w-full flex-1 items-center justify-center bg-app-primary/70">
      <View className="flex  rounded-md border-app-primary bg-app-gray p-4">
        <MyText
          className="mx-2  mb-4 text-[15px] text-black"
          font="MarianneRegular"
        >
          Choisir {indicatorItem?.name} comme indicateur favori{'\u00A0'}?
        </MyText>
        <View className="mt-6 flex flex-row justify-end ">
          <Button
            onPress={handleSkip}
            viewClassName="bg-white px-6 py-3 border border-gray-200 rounded-md opacity-60 mr-2 "
            textClassName="text-black text-[15px] "
            font="MarianneBold"
          >
            Non
          </Button>
          <Button
            onPress={handleSubmit}
            viewClassName="bg-white px-6 py-3 border border-gray-200 rounded-md  "
            textClassName="text-black text-[15px] "
            font="MarianneBold"
          >
            Oui
          </Button>
        </View>
      </View>
    </View>
  );
}
