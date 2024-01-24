import { View, TouchableOpacity } from 'react-native';
import { type IndicatorItem, type IndicatorDay } from '~/types/indicator';
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

interface IndicatorPreviewProps {
  indicator: IndicatorItem;
  isFavorite?: boolean;
  day: IndicatorDay;
}

export function IndicatorPreview(props: IndicatorPreviewProps) {
  const navigation = useNavigation();
  const { indicators } = useIndicators((state) => state);
  const currentIndicatorData = indicators?.find(
    (indicator) => indicator.slug === props.indicator.slug,
  );

  function handleSelect() {
    if (!currentIndicatorData) return;
    logEvent({
      category: 'DASHBOARD',
      action: 'INDICATOR_SELECTED',
      name: props.indicator.slug.toLocaleUpperCase(),
      value: props.isFavorite ? 1 : 0,
    });
    // @ts-expect-error TODO
    navigation.navigate(RouteEnum.INDICATOR_DETAIL, {
      indicator: currentIndicatorData,
      day: props.day,
    });
  }
  const slug = props.indicator.slug;
  const indicatorDataInCurrentDay = currentIndicatorData?.[props.day];
  const indicatorMaxValue =
    IndicatorService.getDataVisualisationBySlug(slug)?.maxValue;

  // const indicatorValue = 4;
  const indicatorValue = indicatorDataInCurrentDay?.summary.value ?? 0;
  const { valuesToColor } = IndicatorService.getDataVisualisationBySlug(slug);
  const indicatorColor = valuesToColor[indicatorValue];

  const showLineList =
    props.isFavorite && indicatorDataInCurrentDay?.values?.length;
  if (!indicatorDataInCurrentDay) return <></>;
  return (
    <TouchableOpacity
      style={{
        borderColor: props.isFavorite ? indicatorColor : 'transparent',
      }}
      className={cn(
        'mx-auto my-5 basis-[47%] rounded-2xl bg-white p-2',
        props.isFavorite && ' -mt-2 border-[3px]',
      )}
      onPress={handleSelect}
    >
      <View className="flex flex-row justify-between">
        <View className="flex w-full justify-center">
          <View
            className="mx-auto -mt-6 items-center rounded-full px-6 py-1"
            style={{
              backgroundColor: indicatorColor,
            }}
          >
            <MyText
              font="MarianneExtraBold"
              className="uppercase text-[#232323]"
            >
              {indicatorDataInCurrentDay?.summary.status}
            </MyText>
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
                // @ts-expect-error TODO
                navigation.navigate(RouteEnum.INDICATOR_DETAIL, {
                  indicator: currentIndicatorData,
                  day: props.day,
                });
              }}
            />
          ) : null}

          <MyText className="mt-4 text-[10px] text-muted">
            {indicatorDataInCurrentDay.summary.recommendations?.[0] ??
              'Pas de recommandations.'}
          </MyText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
