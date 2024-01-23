import { IndicatorsSlugEnum } from '~/types/indicator';
import { AirIcon } from '~/assets/icons/indicators/air';
import { PollensIcon } from '~/assets/icons/indicators/pollens';
import { WaterIcon } from '~/assets/icons/indicators/water';
import { UltraVioletIcon } from '~/assets/icons/indicators/ultra-violet';
import { WeatherIcon } from '~/assets/icons/indicators/weather';
import { Air } from '~/assets/icons/indicators/big/air';
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
        return <AirIcon selected={selected} />;
      case IndicatorsSlugEnum.indice_uv:
        return <UltraVioletIcon selected={selected} />;
      case IndicatorsSlugEnum.pollen_allergy:
        return <PollensIcon selected={selected} />;
      case IndicatorsSlugEnum.weather_alert:
        return <WeatherIcon selected={selected} />;
      case IndicatorsSlugEnum.episode_pollution_atmospheric:
        return <AirIcon selected={selected} />;
      case IndicatorsSlugEnum.tap_water:
        return <WaterIcon selected={selected} />;
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
        return <Atmo value={indicatorValue} />;
      case IndicatorsSlugEnum.indice_uv:
        return <Uv value={indicatorValue} color={color} />;
      case IndicatorsSlugEnum.pollen_allergy:
        return <Pollen value={indicatorValue} color={color} />;
      case IndicatorsSlugEnum.weather_alert:
        return <Weather value={indicatorValue} color={color} />;
      case IndicatorsSlugEnum.episode_pollution_atmospheric:
        return <Air value={indicatorValue} color={color} />;
      case IndicatorsSlugEnum.tap_water:
        return <Swimming value={indicatorValue} color={color} />;
      case IndicatorsSlugEnum.bathing_water:
        return <Swimming value={indicatorValue} color={color} />;
      default:
        console.log('No picto found');
      // throw new Error('No picto found');
    }
  }

  type DataVisualisation = {
    range: number;
    color: string[];
    valuesInRange?: number[][];
  };
  export function getDataVisualisationBySlug(
    slug: IndicatorsSlugEnum,
  ): DataVisualisation {
    if (!slug) return { range: 0, color: [] };
    switch (slug) {
      case IndicatorsSlugEnum.indice_atmospheric:
        return {
          range: 6,
          color: [
            '#b1f3ef',
            '#73c8ae',
            '#fef799',
            '#ee817e',
            '#a7546d',
            '#965f9b',
          ],
          valuesInRange: [[1], [2], [3], [4], [5], [6]],
        };
      case IndicatorsSlugEnum.indice_uv:
        return {
          range: 5,
          color: ['#b1f3ef', '#73c8ae', '#ee817e', '#a7546d', '#965f9b'],
          valuesInRange: [
            [1, 2],
            [3, 4, 5],
            [6, 7],
            [8, 9, 10],
            [11, 12, 13, 14, 15, 16],
          ],
        };
      case IndicatorsSlugEnum.pollen_allergy:
        return {
          range: 4,
          // TODO: not valid colors
          color: ['#00A3FF', '#FC373F', '#820026', '#6D50C6'],
          valuesInRange: [[1], [2], [3], [4]],
        };
      case IndicatorsSlugEnum.weather_alert:
        return {
          range: 4,
          color: ['#419240', '#D1C74B', '#E05E45', '#FC373F'],
          valuesInRange: [[1], [2], [3], [4]],
        };
      case IndicatorsSlugEnum.episode_pollution_atmospheric:
        return {
          range: 6,
          // TODO: not valid colors
          color: [
            '#419240',
            '#D1C74B',
            '#E05E45',
            '#FC373F',
            '#820026',
            '#6D50C6',
          ],
          valuesInRange: [[1], [2], [3], [4], [5], [6]],
        };
      case IndicatorsSlugEnum.tap_water:
        return {
          range: 2,
          // TODO: not valid colors
          color: ['#00A3FF', '#FC373F'],
          valuesInRange: [[1], [2]],
        };
      case IndicatorsSlugEnum.bathing_water:
        return {
          range: 4,
          // TODO: not valid colors
          color: ['#00A3FF', '#FC373F', '#419240', '#6D50C6'],
          valuesInRange: [[1], [2], [3], [4]],
        };
      default:
        throw new Error(`No range found for ${slug as string}`);
    }
  }
  export function getColorForValue(slug: IndicatorsSlugEnum, value: number) {
    const { valuesInRange, color } = getDataVisualisationBySlug(slug);
    const index = valuesInRange?.findIndex((range) => range.includes(value));
    if (value === 0) {
      return '#D9D9EF';
      // TODO:fix this "!"
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    } else return color[index!];
  }
}
