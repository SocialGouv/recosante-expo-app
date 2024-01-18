export interface IndicatorItem {
  name: string;
  slug: IndicatorsSlugEnum;
}

export type IndicatorDay = 'j0' | 'j1';

export type IndicatorsDto = Partial<
  Record<IndicatorsSlugEnum, IndicatorCommonData>
>;

export enum IndicatorsSlugEnum {
  indice_atmospheric = 'indice_atmospheric',
  indice_uv = 'indice_uv',
  pollen_allergy = 'pollen_allergy',
  weather_alert = 'weather_alert',
  episode_pollution_atmospheric = 'episode_pollution_atmospheric',
  tap_water = 'tap_water',
  bathing_water = 'bathing_water',
}

export type IndicatorDataPerDay = {
  value: number;
  color: string;
  label: LabelEnum;
  recommendation: string;
  values?: Array<{
    name: string;
    color: string;
    value: number;
  }>;
};

export interface IndicatorCommonData {
  id: string;
  slug: IndicatorsSlugEnum;
  name: string;
  municipality_insee_code: string;
  validity_start: string;
  validity_end: string;
  diffusion_date: string;
  created_at: string;
  updated_at: string;
  recommendations: string[];
  about: string;
  j0: IndicatorDataPerDay; // specific to each indicator
  j1?: IndicatorDataPerDay; // specific to each indicator
}

export enum IndicatorColorEnum {
  EXTREME = '#9F5C9F',
  ABSOLUE = '#B44E',
  MAUVAIS = '#FF797A',
  MODEREE = '#FFF78B',
  MOYEN = '#4FCBAD',
  BON = '#9DF5F0',
  NUL = '#F5F5FE',
}

export enum LabelEnum {
  EXTREME = 'Extrême',
  ABSOLUE = 'Absolue',
  MAUVAIS = 'Mauvais',
  MODEREE = 'Modérée',
  MOYEN = 'Moyen',
  BON = 'Bon',
  NUL = 'Nul',
}

// Pollens

export enum PollensRiskNumberEnum {
  NO_RISK = 0,
  VERY_LOW = 1,
  LOW = 2,
  MODERATE = 3,
  HIGH = 4,
  VERY_HIGH = 5,
}

export interface PollensDto {
  cypres: PollensRiskNumberEnum;
  noisetier: PollensRiskNumberEnum;
  aulne: PollensRiskNumberEnum;
  peuplier: PollensRiskNumberEnum;
  saule: PollensRiskNumberEnum;
  frene: PollensRiskNumberEnum;
  charme: PollensRiskNumberEnum;
  bouleau: PollensRiskNumberEnum;
  platane: PollensRiskNumberEnum;
  chene: PollensRiskNumberEnum;
  olivier: PollensRiskNumberEnum;
  tilleul: PollensRiskNumberEnum;
  chataignier: PollensRiskNumberEnum;
  rumex: PollensRiskNumberEnum;
  graminees: PollensRiskNumberEnum;
  plantain: PollensRiskNumberEnum;
  urticacees: PollensRiskNumberEnum;
  armoises: PollensRiskNumberEnum;
  ambroisies: PollensRiskNumberEnum;
  total: PollensRiskNumberEnum;
}
