import { View, TouchableOpacity } from 'react-native';
import {
  type DrinkingWaterValue,
  IndicatorsSlugEnum,
  type IndicatorItem,
} from '~/types/indicator';
import type { DayEnum } from '~/types/day';
import type { DashboardProps } from '~/scenes/dashboard/dashboard';
import MyText from '../ui/my-text';
import { IndicatorService } from '~/services/indicator';
import { cn } from '~/utils/tailwind';
import { useIndicators } from '~/zustand/indicator/useIndicators';
import { useNavigation } from '@react-navigation/native';
import { RouteEnum } from '~/constants/route';
import { LineChart } from './graphs/line';
import { logEvent } from '~/services/logEventsWithMatomo';
import * as Haptics from 'expo-haptics';
import { LineList } from './graphs/lines-list';
import { DrinkingWaterResult } from './graphs/drinking-water-result';

interface IndicatorPreviewProps {
  indicator: IndicatorItem;
  isFavorite?: boolean;
  day: DayEnum;
  index: number;
}

export function IndicatorPreview(props: IndicatorPreviewProps) {
  const navigation = useNavigation<DashboardProps['navigation']>();
  const { indicators } = useIndicators((state) => state);
  const currentIndicatorData = indicators?.find(
    (indicator) => indicator.slug === props.indicator.slug,
  );
  const slug = props.indicator.slug;
  const indicatorDataInCurrentDay = currentIndicatorData?.[props.day];
  if (!indicatorDataInCurrentDay) return <></>;
  const indicatorMaxValue =
    IndicatorService.getDataVisualisationBySlug(slug)?.maxValue;

  const indicatorValue = indicatorDataInCurrentDay?.summary.value ?? 0;
  const { valuesToColor } = IndicatorService.getDataVisualisationBySlug(slug);
  const indicatorColor = valuesToColor[indicatorValue];

  const isUnavailable = !indicatorDataInCurrentDay?.summary.value;
  const status = indicatorDataInCurrentDay?.summary.status;
  const isWaterBathingIndicator = slug === IndicatorsSlugEnum.bathing_water;
  const isDrinkingWaterIndicator = slug === IndicatorsSlugEnum.drinking_water;
  const showLine = !isDrinkingWaterIndicator;
  const showLineList = props.isFavorite && !isDrinkingWaterIndicator;

  function handlePress() {
    if (!currentIndicatorData) return;
    if (!props.day) return;
    logEvent({
      category: 'DASHBOARD',
      action: 'INDICATOR_SELECTED',
      name: props.indicator.slug.toLocaleUpperCase(),
      value: props.isFavorite ? 1 : 0,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(RouteEnum.INDICATOR_DETAIL, {
      indicator: currentIndicatorData,
      day: props.day,
    });
  }

  function handleLongPress() {
    if (!currentIndicatorData) return;
    if (!props.day) return;
    if (props.isFavorite) return;
    if (isUnavailable) return;
    logEvent({
      category: 'DASHBOARD',
      action: 'INDICATOR_LONG_PRESS',
      name: props.indicator.slug.toLocaleUpperCase(),
      value: 1,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(RouteEnum.INDICATOR_FAST_SELECTOR, {
      indicatorSlug: props.indicator.slug,
    });
  }

  return (
    <TouchableOpacity
      className={cn(
        'm-2 mx-3',
        isUnavailable ? 'opacity-40' : '',
        props.isFavorite ? ' shadow-md' : 'scale-[0.98]',
      )}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={1}
    >
      <View
        className={cn(
          'overflow-scroll rounded-md border-[1px] border-gray-300 bg-white px-3 py-4',
        )}
      >
        <View className="flex flex-row justify-between">
          <View className="flex w-full justify-center">
            <View className="flex-row items-center justify-between">
              <View
                className={cn(
                  'flex w-full flex-row items-center justify-between',
                  isUnavailable ? '' : ' pb-2',
                )}
              >
                <View className="">
                  <MyText
                    className={cn(
                      '"text-wrap  uppercase text-muted',
                      props.isFavorite ? ' text-[17px]' : ' text-[15px]',
                      isUnavailable ? '' : 'mb-2',
                    )}
                    font={
                      props.isFavorite ? 'MarianneExtraBold' : 'MarianneBold'
                    }
                  >
                    {props.isFavorite
                      ? props.indicator.name
                      : props.indicator.short_name}{' '}
                    {isUnavailable || isDrinkingWaterIndicator
                      ? null
                      : `: ${status}`}
                  </MyText>
                  {isDrinkingWaterIndicator ? (
                    <DrinkingWaterResult
                      indicatorValue={
                        indicatorValue as DrinkingWaterValue | null
                      }
                    />
                  ) : null}
                </View>
                {isUnavailable ? (
                  <View className="rounded-full border border-gray-300 px-2">
                    <MyText
                      className="text-wrap  ml-1 rounded-full  text-[15px] uppercase text-muted"
                      font="MarianneExtraBold"
                    >
                      aucune donnée
                    </MyText>
                  </View>
                ) : null}
              </View>
            </View>

            {showLine ? (
              <LineChart
                color={indicatorColor}
                value={indicatorValue}
                maxValue={indicatorMaxValue}
              />
            ) : null}

            {showLineList ? (
              <>
                <LineList
                  slug={currentIndicatorData?.slug}
                  values={indicatorDataInCurrentDay?.values}
                  isPreviewMode
                  onMorePress={() => {
                    navigation.navigate(RouteEnum.INDICATOR_DETAIL, {
                      indicator: currentIndicatorData,
                      day: props.day,
                    });
                  }}
                />
              </>
            ) : null}
            {isUnavailable && isWaterBathingIndicator ? (
              <MyText className="mt-1 text-[13px] text-muted">
                La saison de la collecte des données des eaux de baignades n’a
                pas encore commencée.
              </MyText>
            ) : null}
            {isUnavailable ? (
              ''
            ) : (
              <MyText className="mt-1 text-[13px] text-muted">
                {indicatorDataInCurrentDay.summary.recommendations?.[0]}
              </MyText>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
