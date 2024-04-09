import { IndicatorsSlugEnum } from '~/types/indicator';

export namespace IndicatorService {
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
            1: '#73c8ae',
            2: '#73c8ae',
            3: '#fef799',
            4: '#fef799',
            5: '#fef799',
            6: '#E38136',
            7: '#E38136',
            8: '#FF797A',
            9: '#FF797A',
            10: '#FF797A',
            11: '#965f9b', // could be until 16 but we show only until 11
          },
        };
      case IndicatorsSlugEnum.pollen_allergy:
        return {
          maxValue: 5,
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
          },
        };
      case IndicatorsSlugEnum.bathing_water:
        return {
          maxValue: 4,
          valuesToColor: {
            0: '#D9D9EF', // Site non classé - Site n'ayant pas suffisamment de prélèvements cette saison pour être classé
            1: '#b1f3ef', // bon qualité
            2: '#fef799', // moyen qualité
            3: '#ee817e', // mauvais
            4: '#965f9b', // interdiction
          },
        };

      // TODO: FIX THIS
      case IndicatorsSlugEnum.drinking_water:
        return {
          maxValue: 4,
          valuesToColor: {
            0: '#D9D9EF', // Site non classé - Site n'ayant pas suffisamment de prélèvements cette saison pour être classé
            1: '#b1f3ef', // bon qualité
            2: '#fef799', // moyen qualité
            3: '#ee817e', // mauvais
            4: '#965f9b', // interdiction
          },
        };
      default:
        console.error(`No range found for ${slug as string}`);
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
  }
  export function getDataSourceByIndicator(slug: IndicatorsSlugEnum): {
    label: string;
  } {
    switch (slug) {
      case IndicatorsSlugEnum.indice_atmospheric:
        return {
          label: 'ATMO France',
        };
      case IndicatorsSlugEnum.indice_uv:
        return {
          label: 'Météo France',
        };
      case IndicatorsSlugEnum.pollen_allergy:
        return {
          label: 'RNSA',
        };
      case IndicatorsSlugEnum.weather_alert:
        return {
          label: 'Météo France',
        };
      case IndicatorsSlugEnum.bathing_water:
        return {
          label: ' ',
        };
      case IndicatorsSlugEnum.drinking_water:
        return {
          label: 'Ministere de la Santé et de la prévention',
        };
      default:
        return {
          label: 'ATMO France',
        };
    }
  }
}
