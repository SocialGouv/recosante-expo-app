import { IndicatorsSlugEnum } from '~/types/indicator';
import { AirIcon } from '~/assets/icons/indicators/air';
import { PollensIcon } from '~/assets/icons/indicators/pollens';
import { WaterIcon } from '~/assets/icons/indicators/water';
import { UltraVioletIcon } from '~/assets/icons/indicators/ultra-violet';
import { WeatherIcon } from '~/assets/icons/indicators/weather';
import { Uv } from '~/assets/icons/indicators/big/uv';
import { Pollen } from '~/assets/icons/indicators/big/pollen';
import { Weather } from '~/assets/icons/indicators/big/weather';
import { Swimming } from '~/assets/icons/indicators/big/swimming';
import { Atmo } from '~/assets/icons/indicators/big/atmo';

export namespace IndicatorService {
  // export function getColorByLabel(
  //   label: LabelEnum | undefined,
  // ): IndicatorColorEnum {
  //   if (!label) return IndicatorColorEnum.NUL;
  //   switch (label) {
  //     case LabelEnum.EXTREME:
  //       return IndicatorColorEnum.EXTREME;
  //     case LabelEnum.ABSOLUE:
  //       return IndicatorColorEnum.ABSOLUE;
  //     case LabelEnum.MAUVAIS:
  //       return IndicatorColorEnum.MAUVAIS;
  //     case LabelEnum.MODEREE:
  //       return IndicatorColorEnum.MODEREE;
  //     case LabelEnum.MOYEN:
  //       return IndicatorColorEnum.MOYEN;
  //     case LabelEnum.BON:
  //       return IndicatorColorEnum.BON;
  //     case LabelEnum.NUL:
  //       return IndicatorColorEnum.NUL;
  //     default:
  //       return IndicatorColorEnum.NUL;
  //       throw new Error('No color found');
  //   }
  // }
  export function getIconBySlug(slug: IndicatorsSlugEnum, selected: boolean) {
    switch (slug) {
      case IndicatorsSlugEnum.indice_atmospheric:
        return <Atmo size={30} selected={selected} value={undefined} />;
      case IndicatorsSlugEnum.indice_uv:
        return (
          <Uv size={30} value={11} color={selected ? '#3343BD' : '#D9D9EF'} />
        );
      case IndicatorsSlugEnum.pollen_allergy:
        return <PollensIcon selected={selected} />;
      case IndicatorsSlugEnum.weather_alert:
        return <WeatherIcon selected={selected} />;
      case IndicatorsSlugEnum.bathing_water:
        return <WaterIcon selected={selected} />;
      default:
        throw new Error('No icon found');
    }
  }
  export function getPicto({
    slug,
    indicatorValue,
    color,
  }: {
    slug: IndicatorsSlugEnum;
    indicatorValue: number | undefined;
    color: string | undefined;
  }) {
    switch (slug) {
      case IndicatorsSlugEnum.indice_atmospheric:
        return <Atmo size={60} value={indicatorValue} selected={undefined} />;
      case IndicatorsSlugEnum.indice_uv:
        return <Uv size={60} value={indicatorValue} color={color} />;
      case IndicatorsSlugEnum.pollen_allergy:
        return <Pollen value={indicatorValue} color={color} />;
      case IndicatorsSlugEnum.weather_alert:
        return <Weather value={indicatorValue} color={color} />;
      case IndicatorsSlugEnum.bathing_water:
        return <Swimming value={indicatorValue} color={color} />;
      default:
        console.log('No picto found');
      // throw new Error('No picto found');
    }
  }

  type DataVisualisation = {
    maxValue: number;
    valuesToColor: Record<number, string>;
  };
  export function getDataVisualisationBySlug(
    slug: IndicatorsSlugEnum,
  ): DataVisualisation {
    if (!slug)
      return {
        maxValue: 0,
        valuesToColor: {
          0: '#D9D9EF',
          1: '#00A3FF',
          2: '#FC373F',
          3: '#820026',
          4: '#6D50C6',
        },
      };
    switch (slug) {
      case IndicatorsSlugEnum.indice_atmospheric:
        return {
          maxValue: 6,
          valuesToColor: {
            0: '#D9D9EF',
            1: '#b1f3ef',
            2: '#73c8ae',
            3: '#fef799',
            4: '#ee817e',
            5: '#a7546d',
            6: '#965f9b',
          },
        };
      case IndicatorsSlugEnum.indice_uv:
        return {
          maxValue: 11,
          valuesToColor: {
            0: '#D9D9EF',
            1: '#b1f3ef',
            2: '#b1f3ef',
            3: '#73c8ae',
            4: '#73c8ae',
            5: '#73c8ae',
            6: '#ee817e',
            7: '#ee817e',
            8: '#a7546d',
            9: '#a7546d',
            10: '#a7546d',
            11: '#965f9b', // could be until 16 but we show only until 11
          },
        };
      case IndicatorsSlugEnum.pollen_allergy:
        return {
          maxValue: 4,
          valuesToColor: {
            0: '#D9D9EF',
            1: '#b1f3ef',
            2: '#73c8ae',
            3: '#fef799',
            4: '#ee817e',
          },
        };
      case IndicatorsSlugEnum.weather_alert:
        return {
          maxValue: 4,
          valuesToColor: {
            0: '#D9D9EF',
            1: '#b1f3ef',
            2: '#73c8ae',
            3: '#fef799',
            4: '#ee817e',
          },
        };
      case IndicatorsSlugEnum.bathing_water:
        return {
          maxValue: 4,
          valuesToColor: {
            0: '#D9D9EF',
            1: '#00A3FF',
            2: '#FC373F',
            3: '#820026',
            4: '#6D50C6',
          },
        };
      default:
        throw new Error(`No range found for ${slug as string}`);
    }
  }
}
