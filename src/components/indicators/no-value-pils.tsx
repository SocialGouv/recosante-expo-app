import { View } from 'react-native';
import MyText from '../ui/my-text';
import { IndicatorsSlugEnum } from '~/types/indicator';

interface NoValuePilsProps {
  slug: IndicatorsSlugEnum;
}

export function NoValuePils(props: NoValuePilsProps) {
  function getLabel() {
    switch (props.slug) {
      //   case IndicatorsSlugEnum.bathing_water:
      //     return 'Hors saison';

      default:
        return 'Aucune donnée';
    }
  }

  if (props.slug === IndicatorsSlugEnum.drinking_water) {
    return;
  }

  return (
    <View className="rounded-full border border-gray-300 px-2">
      <MyText
        className="text-wrap  ml-1 rounded-full  text-[14px] uppercase text-muted"
        font="MarianneMedium"
      >
        {getLabel()}
      </MyText>
    </View>
  );
}
