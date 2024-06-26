export enum IndicatorsSlugEnum {
  indice_atmospheric = 'indice_atmospheric',
  indice_uv = 'indice_uv',
  pollen_allergy = 'pollen_allergy',
  weather_alert = 'weather_alert',
  bathing_water = 'bathing_water',
  drinking_water = 'drinking_water',
}
export interface IndicatorItem {
  name: string;
  short_name: string;
  slug: IndicatorsSlugEnum;
}

export type IndicatorDay = 'j0' | 'j1';

export enum DrinkingWaterValuesEnum {
  C = 'C',
  D = 'D',
  N = 'N',
  S = 'S',
}

export type DrinkingWaterValue = {
  bacteriological: DrinkingWaterValuesEnum;
  chemical: DrinkingWaterValuesEnum;
};

export type DrinkingWaterMetadata = {
  parameters_count: number;
  prelevement_code: string;
  prelevement_date: string;
};

export type GenericIndicatorValue = number;

export type IndicatorByPeriodValue = {
  slug: string;
  name: string;
  value: GenericIndicatorValue | DrinkingWaterValue;
  link?: string; // specific for bathing water
  drinkingWater?: DrinkingWaterMetadata;
};

export interface GenericIndicatorByPeriodValue
  extends Omit<IndicatorByPeriodValue, 'drinkingWater'> {
  value: GenericIndicatorValue;
}

export type IndicatorByPeriodValues = IndicatorByPeriodValue[];

export interface IndicatorByPeriod {
  id: string;
  validity_start: string;
  validity_end: string;
  diffusion_date: string;
  created_at: string;
  updated_at: string;
  summary: {
    value: (number & DrinkingWaterValue) | null;
    status: string;
    status_description?: string;
    recommendations?: string[];
  };
  values?: IndicatorByPeriodValues;
  help_text?: string;
}

export interface Indicator {
  slug: IndicatorsSlugEnum;
  name: string;
  short_name: string;
  long_name: string;
  municipality_insee_code: string;
  about_title: string;
  about_description: string;
  j0: IndicatorByPeriod;
  j1?: IndicatorByPeriod;
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
