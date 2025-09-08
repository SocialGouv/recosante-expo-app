import { View } from 'react-native';
import { useState } from 'react';
import { type IndicatorItem } from '~/types/indicator';
import { cn } from '~/utils/tailwind';
import { useIndicatorsList } from '~/zustand/indicator/useIndicatorsList';
import Button from '../ui/button';
import * as Haptics from 'expo-haptics';

interface IndicatorsSelectorProps {
  indicators: IndicatorItem[] | null;
  onSubmit: (slugs: string[]) => void;
}
export function IndicatorsSelector(props: IndicatorsSelectorProps) {
  const { setFavoriteIndicators, favoriteIndicators } = useIndicatorsList(
    (state) => state,
  );
  const [state, setState] = useState<IndicatorItem[]>(favoriteIndicators ?? []);

  function handleToggleIndicator(indicator: IndicatorItem) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setState((prev) => {
      const exists = prev.find((i) => i.slug === indicator.slug);
      if (exists) {
        return prev.filter((i) => i.slug !== indicator.slug);
      } else {
        return [...prev, indicator];
      }
    });
  }

  function handleSubmit() {
    setFavoriteIndicators(state);
    props.onSubmit(state.map((i) => i.slug));
  }

  return (
    <View className="flex flex-col ">
      <View className="flex  flex-row flex-wrap items-start ">
        {props.indicators?.map((indicator) => {
          if (indicator.slug === 'drinking_water' && !__DEV__) return null;
          const isSelected = state.some((i) => i.slug === indicator.slug);
          return (
            <Button
              onPress={() => {
                handleToggleIndicator(indicator);
              }}
              viewClassName={cn(
                isSelected
                  ? 'bg-app-yellow border-app-primary'
                  : 'bg-app-primary border-white ',
                'border-2 rounded-full m-2 items-center flex',
              )}
              textClassName={cn(
                isSelected ? 'text-app-primary' : 'text-white',
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
      {state.length > 0 ? (
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
      ) : null}
    </View>
  );
}
