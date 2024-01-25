import { View } from 'react-native';
import { useState } from 'react';
import { type IndicatorItem } from '~/types/indicator';
import { IndicatorService } from '~/services/indicator';
import { cn } from '~/utils/tailwind';
import { useIndicatorsList } from '~/zustand/indicator/useIndicatorsList';
import Button from '../ui/button';
import * as Haptics from 'expo-haptics';

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
      <View className="flex  flex-row flex-wrap items-start ">
        {props.indicators?.map((indicator) => {
          const isFavorite = state?.slug === indicator.slug;
          return (
            <Button
              onPress={() => {
                handleSelectIndicator(indicator);
              }}
              viewClassName={cn(
                isFavorite
                  ? 'bg-app-yellow border-app-primary'
                  : 'bg-app-primary border-white ',
                'border-2 rounded-full m-2 items-center flex',
              )}
              textClassName={cn(
                isFavorite ? 'text-app-primary' : 'text-white',
                'text-[15px]',
              )}
              key={indicator.slug}
              icon={IndicatorService.getIconBySlug(indicator.slug, isFavorite)}
            >
              {indicator.name}
            </Button>
          );
        })}
      </View>
      {state?.slug ? (
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
