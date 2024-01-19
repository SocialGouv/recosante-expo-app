import { View } from 'react-native';
import { useState } from 'react';
import { IndicatorsSlugEnum, type IndicatorItem } from '~/types/indicator';
import { IndicatorService } from '~/services/indicator';
import { cn } from '~/utils/tailwind';
import { useIndicatorsList } from '~/zustand/indicator/useIndicatorsList';
import Button from '../ui/button';

interface IndicatorsSelectorProps {
  indicators: IndicatorItem[] | null;
  onSubmit: () => void;
}
export function IndicatorsSelector(props: IndicatorsSelectorProps) {
  const { setFavoriteIndicator, favoriteIndicator } = useIndicatorsList(
    (state) => state,
  );
  const [state, setState] = useState<IndicatorItem | null>(favoriteIndicator);

  function handleSelectIndicator(indicator: IndicatorItem) {
    setState(indicator);
  }

  function handleSubmit() {
    setFavoriteIndicator(state);
    props.onSubmit();
  }

  const indicatorsAvailableList = [
    IndicatorsSlugEnum.weather_alert,
    IndicatorsSlugEnum.pollen_allergy,
    IndicatorsSlugEnum.bathing_water,
  ];
  return (
    <View className="flex flex-col ">
      <View className="flex  flex-row flex-wrap items-start ">
        {props.indicators?.map((indicator) => {
          const isFavorite = state?.slug === indicator.slug;
          return (
            <Button
              disabled={!indicatorsAvailableList.includes(indicator.slug)}
              onPress={() => {
                handleSelectIndicator(indicator);
              }}
              viewClassName={cn(
                `${isFavorite ? 'bg-app-yellow' : ''}
               border-white border-2 rounded-full  m-2  items-center flex`,
              )}
              textClassName="text-white text-base"
              key={indicator.slug}
              icon={IndicatorService.getIconBySlug(indicator.slug)}
            >
              {indicator.name}
            </Button>
          );
        })}
      </View>
      {state?.slug ? (
        <View className="mx-auto mt-2">
          <Button
            onPress={handleSubmit}
            viewClassName="bg-app-yellow px-4 py-3 mt-4"
            textClassName="text-black"
            font="MarianneMedium"
          >
            C'est parti !
          </Button>
        </View>
      ) : null}
    </View>
  );
}
