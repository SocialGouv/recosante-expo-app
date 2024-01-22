import { View, TouchableOpacity } from 'react-native';
import { type IndicatorItem, type IndicatorDay } from '~/types/indicator';
import MyText from '../ui/my-text';
import { IndicatorService } from '~/services/indicator';
import dayjs from 'dayjs';
import { cn } from '~/utils/tailwind';
import { Info } from '~/assets/icons/info';
import { LineChartWithCursor } from './graphs/line-with-cursor';
import { useIndicators } from '~/zustand/indicator/useIndicators';
import { useAddress } from '~/zustand/address/useAddress';
import { useNavigation } from '@react-navigation/native';
import { RouteEnum } from '~/constants/route';
import { LineList } from './graphs/lines-list';

interface IndicatorPreviewProps {
  indicator: IndicatorItem;
  isFavorite?: boolean;
  day: IndicatorDay;
}

export function IndicatorPreview(props: IndicatorPreviewProps) {
  const { address } = useAddress((state) => state);
  const navigation = useNavigation();
  const { indicators } = useIndicators((state) => state);
  const currentIndicatorData = indicators?.find(
    (indicator) => indicator.slug === props.indicator.slug,
  );

  function handleSelect() {
    if (!currentIndicatorData) return;
    // @ts-expect-error TODO
    navigation.navigate(RouteEnum.INDICATOR_DETAIL, {
      indicator: currentIndicatorData,
      day: props.day,
    });
  }

  const indicatorDataInCurrentDay = currentIndicatorData?.[props.day];
  const indicatorRange = IndicatorService.getDataVisualisationBySlug(
    props.indicator.slug,
  )?.range;
  const indicatorColor = IndicatorService.getColorForValue(
    props.indicator.slug,
    indicatorDataInCurrentDay?.summary.value ?? 0,
  );

  if (!indicatorDataInCurrentDay) return <></>;
  return (
    <TouchableOpacity
      style={{
        borderColor: props.isFavorite
          ? indicatorColor // TODO getColorFromValue(currentDayIndicatorData.summary.value)
          : 'transparent',
      }}
      className={cn(
        'mx-auto my-5 basis-[47%] rounded-2xl bg-white p-2',
        props.isFavorite && 'mx-2 -mt-2 border-[3px]',
      )}
      onPress={handleSelect}
    >
      <View className="flex flex-row justify-between">
        <View className="flex w-full justify-center">
          <View
            className="mx-auto -mt-6 items-center rounded-full px-6 py-1"
            style={{
              backgroundColor: indicatorColor, // TODO getColorFromValue(currentDayIndicatorData.summary.value)
            }}
          >
            <MyText font="MarianneBold" className="uppercase">
              {indicatorDataInCurrentDay?.summary.status}
            </MyText>
          </View>

          <View className="-mt-2 flex items-end">
            <Info />
          </View>
          <View
            className={cn(
              props.isFavorite
                ? 'flex-row justify-between px-4'
                : 'mb-4 h-28 flex-col-reverse items-center',
              'items-center',
            )}
          >
            <MyText
              className="text-wrap text-md uppercase text-black"
              font="MarianneBold"
            >
              {props.indicator.name}
            </MyText>
            <View
              className={cn(
                'flex items-center justify-center opacity-70',
                props.isFavorite ? '' : 'mb-2',
              )}
            >
              {IndicatorService.getPicto({
                slug: props.indicator.slug,
                indicatorValue: indicatorDataInCurrentDay?.summary.value,
                color: indicatorColor,
              })}
            </View>
          </View>
          {/* <MyText
            className=" mb-4 text-xs uppercase text-gray-500"
            font="MarianneRegular"
          >
            {address?.label} {dayjs().format('DD/MM')}
          </MyText> */}
          <LineChartWithCursor
            value={indicatorDataInCurrentDay?.summary.value}
            slug={currentIndicatorData?.slug}
            withCursor={props.isFavorite}
          />

          {props.isFavorite && indicatorDataInCurrentDay?.values?.length ? (
            <LineList
              slug={currentIndicatorData?.slug}
              values={indicatorDataInCurrentDay?.values}
              range={indicatorRange}
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

          {currentIndicatorData?.slug != null ? (
            <MyText className="mt-4 text-xs">
              {indicatorDataInCurrentDay.summary.recommendations?.[0] ??
                'Pas de recommandations.'}
            </MyText>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}
