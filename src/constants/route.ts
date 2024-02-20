import type { DayEnum } from '~/types/day';
import type { IndicatorsSlugEnum, Indicator } from '~/types/indicator';
import { NavigatorScreenParams } from '@react-navigation/native';

export enum RouteEnum {
  INDICATORS_SELECTOR = 'INDICATORS_SELECTOR',
  INDICATOR_DETAIL = 'INDICATOR_DETAIL',
  HOME = 'HOME',
  ONBOARDING = 'ONBOARDING',
  LOCATION = 'LOCATION',
  LEGAL = 'LEGAL',
  CONFIDENTIALITY = 'CONFIDENTIALITY',
  INDICATOR_FAST_SELECTOR = 'INDICATOR_FAST_SELECTOR',
  FEEDBACK = 'FEEDBACK',
}

/*
https://reactnavigation.org/docs/typescript/
The type containing the mappings must be a type alias (e.g. type RootStackParamList = { ... }). It cannot be an interface (e.g. interface RootStackParamList { ... }). It also shouldn't extend ParamListBase (e.g. interface RootStackParamList extends ParamListBase { ... }). Doing so will result in incorrect type checking where it allows you to pass incorrect route names.
*/
export type RootStackParamList = {
  [RouteEnum.INDICATORS_SELECTOR]: {
    enablePanDownToClose: boolean;
    eventCategory: 'ONBOARDING' | 'SETTINGS';
  };
  [RouteEnum.INDICATOR_DETAIL]: {
    indicator: Indicator;
    day: DayEnum;
  };
  [RouteEnum.HOME]: undefined;
  [RouteEnum.ONBOARDING]: undefined;
  [RouteEnum.LOCATION]: {
    isOnboarding: boolean;
  };
  [RouteEnum.LEGAL]: undefined;
  [RouteEnum.CONFIDENTIALITY]: undefined;
  [RouteEnum.INDICATOR_FAST_SELECTOR]: {
    indicatorSlug: IndicatorsSlugEnum;
  };
  [RouteEnum.FEEDBACK]: undefined;
};

export enum HomeTabRouteEnum {
  SETTINGS = 'SETTINGS',
  DASHBOARD = 'DASHBOARD',
  SHARE = 'SHARE',
}

export type HomeTabParamList = {
  [HomeTabRouteEnum.DASHBOARD]: NavigatorScreenParams<RootStackParamList>;
  [HomeTabRouteEnum.SHARE]: undefined;
  [HomeTabRouteEnum.SETTINGS]: undefined;
};

export enum OnboardingRouteEnum {
  WELCOME = 'WELCOME',
  GEOLOCATION = 'GEOLOCATION',
  NOTIFICATIONS = 'NOTIFICATIONS',
}
