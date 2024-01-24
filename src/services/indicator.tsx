import { IndicatorsSlugEnum } from '~/types/indicator';
import { Uv } from '~/assets/icons/indicators/big/uv';
import { Pollens } from '~/assets/icons/indicators/big/pollens';
import { Weather } from '~/assets/icons/indicators/big/weather';
import { Swimming } from '~/assets/icons/indicators/big/swimming';
import { Atmo } from '~/assets/icons/indicators/big/atmo';

export namespace IndicatorService {
  export function getIconBySlug(slug: IndicatorsSlugEnum, selected: boolean) {
    switch (slug) {
      case IndicatorsSlugEnum.indice_atmospheric:
        return <Atmo size={30} selected={selected} value={undefined} />;
      case IndicatorsSlugEnum.indice_uv:
        return (
          <Uv size={28} value={11} color={selected ? '#3343BD' : '#D9D9EF'} />
        );
      case IndicatorsSlugEnum.pollen_allergy:
        return <Pollens size={30} selected={selected} value={undefined} />;
      case IndicatorsSlugEnum.weather_alert:
        return <Weather size={30} selected={selected} value={undefined} />;
      case IndicatorsSlugEnum.bathing_water:
        return <Swimming size={30} selected={selected} value={undefined} />;
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
        return (
          <Pollens size={60} value={indicatorValue} selected={undefined} />
        );
      case IndicatorsSlugEnum.weather_alert:
        return (
          <Weather size={60} value={indicatorValue} selected={undefined} />
        );
      case IndicatorsSlugEnum.bathing_water:
        return (
          <Swimming size={60} value={indicatorValue} selected={undefined} />
        );
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
    if (!slug) {
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
    }
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
            5: '#a7546d',
          },
        };
      case IndicatorsSlugEnum.weather_alert:
        return {
          maxValue: 4,
          valuesToColor: {
            0: '#D9D9EF',
            1: '#73c8ae',
            2: '#fef799',
            3: '#ee817e',
            4: '#a7546d',
            5: '#965f9b',
          },
        };
      case IndicatorsSlugEnum.bathing_water:
        return {
          maxValue: 4,
          valuesToColor: {
            0: '#D9D9EF',
            1: '#b1f3ef',
            2: '#73c8ae',
            3: '#ee817e',
            4: '#a7546d',
          },
        };
      default:
        throw new Error(`No range found for ${slug as string}`);
    }
  }
}
