import { View } from 'react-native';
import { useState } from 'react';
import { type IndicatorItem } from '~/types/indicator';
import { cn } from '~/utils/tailwind';
import { useIndicatorsList } from '~/zustand/indicator/useIndicatorsList';
import Button from '../ui/button';
import * as Haptics from 'expo-haptics';
import { SkipArrow } from '~/assets/icons/skip';

interface IndicatorsSelectorProps {
  indicators: IndicatorItem[] | null;
  onSubmit: (slug: string) => void;
}
export function IndicatorsSelector(props: IndicatorsSelectorProps) {
  const { setFavoriteIndicator, favoriteIndicator } = useIndicatorsList(
    (state) => state,
  );
  const [state, setState] = useState<IndicatorItem | null>(favoriteIndicator);

  function handleSelectIndicator(indicator: IndicatorItem) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setState(indicator);
  }

  function handleSubmit() {
    setFavoriteIndicator(state);
    props.onSubmit(state?.slug ?? '');
  }

  return (
    <View className="flex flex-col ">
      <View className="flex flex-col ">
        {props.indicators?.map((indicator) => {
          const isFavorite = state?.slug === indicator.slug;
          return (
            <Button
              onPress={() => {
                handleSelectIndicator(indicator);
              }}
              viewClassName={cn(
                isFavorite
                  ? ' border-app-primary bg-app-primary '
                  : ' border-app-primary',
                'border rounded-md mx-6 my-2 items-center flex py-2',
              )}
              textClassName={cn(
                isFavorite ? 'text-white' : 'text-app-primary',
                'text-[15px]',
              )}
              key={indicator.slug}
              icon={null}
            >
              {indicator.name}
            </Button>
          );
        })}
      </View>
      {state?.slug ? (
        <View className="mr-6 mt-6 items-end">
          <Button
            onPress={handleSubmit}
            viewClassName="bg-white px-6 py-3 border border-gray-200 rounded-md "
            textClassName="text-black text-[15px] "
            font="MarianneBold"
            icon={<SkipArrow color="black" />}
          >
            C'est parti
          </Button>
        </View>
      ) : null}
    </View>
  );
}
