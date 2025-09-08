import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { type RouteEnum, type RootStackParamList } from '~/constants/route';
import { useIndicatorsList } from '~/zustand/indicator/useIndicatorsList';
import Button from '~/components/ui/button';
import MyText from '~/components/ui/my-text';
import { logEvent } from '~/services/logEventsWithMatomo';
import { useUser } from '~/zustand/user/useUser';

type IndicatorFastSelectorProps = NativeStackScreenProps<
  RootStackParamList,
  RouteEnum.INDICATOR_FAST_SELECTOR
>;

export function IndicatorFastSelector(props: IndicatorFastSelectorProps) {
  const selected = props.route.params.indicatorSlug;

  const { indicators, setFavoriteIndicators } = useIndicatorsList(
    (state) => state,
  );

  const { address } = useUser((state) => state);
  const hasAddress = !!address?.municipality_insee_code;

  const indicatorItem = indicators.find(
    (indicator) => indicator.slug === selected,
  );

  const handleSubmit = () => {
    if (indicatorItem) {
      logEvent({
        category: 'DASHBOARD',
        action: 'INDICATOR_FAVORITE_SELECTED',
        name: indicatorItem.slug,
        value: hasAddress ? Number(address?.municipality_insee_code) : null,
      });
      setFavoriteIndicators([indicatorItem]);
      props.navigation.goBack();
    }
  };

  return (
    <View className="flex h-full w-full flex-1 items-center justify-center bg-white/70">
      <View className="flex max-w-[80%] rounded-2xl border-app-primary bg-app-primary p-4">
        <MyText className="mx-2  mb-4 text-white" font="MarianneBold">
          Choisir {indicatorItem?.name} comme indicateur favori{'\u00A0'}?
        </MyText>
        <View className="mx-auto mt-6">
          <Button
            onPress={handleSubmit}
            viewClassName="bg-app-yellow px-8 pb-4 pt-3"
            textClassName="text-black text-base"
            font="MarianneBold"
          >
            C'est parti !
          </Button>
        </View>
      </View>
    </View>
  );
}
