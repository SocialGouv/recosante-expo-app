import { View, TouchableOpacity } from 'react-native';
import { type IndicatorItem, type IndicatorDay } from '~/types/indicator';
import type { DayEnum } from '~/types/day';
import type { DashboardProps } from '~/scenes/dashboard/dashboard';
import MyText from '../ui/my-text';
import { IndicatorService } from '~/services/indicator';
import { cn } from '~/utils/tailwind';
import { Info } from '~/assets/icons/info';
import { LineChartWithCursor } from './graphs/line-with-cursor';
import { useIndicators } from '~/zustand/indicator/useIndicators';
import { useNavigation } from '@react-navigation/native';
import { RouteEnum } from '~/constants/route';
import { LineList } from './graphs/lines-list';
import { LineChart } from './graphs/line';
import { logEvent } from '~/services/logEventsWithMatomo';
import * as Haptics from 'expo-haptics';

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

  // const indicatorValue = 4;
  const indicatorValue = indicatorDataInCurrentDay?.summary.value ?? 0;
  const { valuesToColor } = IndicatorService.getDataVisualisationBySlug(slug);
  const indicatorColor = valuesToColor[indicatorValue];

  const showLineList =
    props.isFavorite && indicatorDataInCurrentDay?.values?.length;

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
        'my-5',
        props.isFavorite ? 'mx-5 -mt-2' : 'basis-[50%] flex-row px-1.5',
        props.isFavorite ? '' : props.index % 2 === 0 ? 'pl-5' : 'pr-5',
      )}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={1}
    >
      <View
        className="self-stretch rounded-2xl border-[3px] bg-white p-2"
        style={{
          borderColor: props.isFavorite ? indicatorColor : 'transparent',
        }}
      >
        <View className="flex flex-row justify-between">
          <View className="flex w-full justify-center">
            <View
              className="mx-auto -mt-6 flex-row items-center justify-center rounded-full py-1"
              style={{
                backgroundColor: indicatorColor,
              }}
            >
              <View className="shrink basis-6" />
              <MyText
                font="MarianneExtraBold"
                className="-mt-0.5 text-center uppercase text-[#232323]"
              >
                {indicatorDataInCurrentDay?.summary.status}
              </MyText>
              <View className="shrink basis-6" />
            </View>

            <View className="flex items-end">
              <Info />
            </View>
            <View
              className={cn(
                props.isFavorite
                  ? 'flex-row justify-between pb-2 '
                  : 'mb-6 mt-3 flex-col-reverse items-center justify-between',
                'items-center',
              )}
            >
              <View
                className={cn(
                  'flex w-full flex-row items-center',
                  props.isFavorite ? 'w-fit' : '',
                )}
              >
                <MyText
                  className="text-wrap text-md uppercase text-muted "
                  font="MarianneBold"
                >
                  {props.isFavorite
                    ? props.indicator.name
                    : props.indicator.short_name}
                </MyText>
              </View>
              <View
                className={cn(
                  'flex items-center justify-center',
                  props.isFavorite ? 'mr-6' : 'mb-6 ',
                )}
              >
                {IndicatorService.getPicto({
                  slug: props.indicator.slug,
                  indicatorValue,
                  color: indicatorColor,
                })}
              </View>
            </View>
            {props.isFavorite ? (
              <LineChartWithCursor
                value={indicatorValue}
                slug={currentIndicatorData?.slug}
                showCursor={props.isFavorite}
              />
            ) : (
              <LineChart
                color={indicatorColor}
                value={indicatorValue}
                maxValue={indicatorMaxValue}
              />
            )}

            {showLineList ? (
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
            ) : null}

            <MyText className="mt-4 text-[10px] text-muted">
              {indicatorDataInCurrentDay.summary.recommendations?.[0] ??
                `Aucune donnée disponible pour cet indicateur dans cette zone ${
                  props.day === 'j0' ? "aujourd'hui" : 'demain'
                }`}
            </MyText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
