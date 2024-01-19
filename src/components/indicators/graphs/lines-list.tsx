import { Pressable, View } from 'react-native';
import {
  type IndicatorsSlugEnum,
  type IndicatorByPeriod,
} from '~/types/indicator';
import { LineChart } from './line';
import MyText from '~/components/ui/my-text';
import { useMemo } from 'react';
import { IndicatorService } from '~/services/indicator';

interface LineChartProps {
  values: IndicatorByPeriod['values'];
  range: number;
  isPreviewMode?: boolean;
  onMorePress?: () => void;
  slug: IndicatorsSlugEnum;
}

const MAX_LINE = 4;

export function LineList(props: LineChartProps) {
  // TODO: this should be sorted in the backend
  const sortedValues = useMemo(
    () => props.values?.sort((a, b) => b.value - a.value),
    [props.values],
  );
  const showSeeMore = sortedValues
    ? sortedValues.length > MAX_LINE && props.isPreviewMode
    : false;
  if (!props.slug) return <></>;
  return (
    <View className="mt-3 flex space-y-2">
      {sortedValues
        ?.map((line) => {
          if (line.value === 0) return null;
          return (
            <View key={line.name} className="flex  flex-row">
              <MyText className="bottom-1 mr-3 min-w-[75px] capitalize text-app-gray-200">
                {line.name}
              </MyText>
              <View className="w-full flex-1 ">
                <LineChart
                  color={IndicatorService.getColorForValue(
                    props.slug,
                    line.value,
                  )}
                  value={line.value}
                  //   TODO: fix this
                  range={props.range + 1}
                />
              </View>
            </View>
          );
        })
        .slice(0, props.isPreviewMode ? MAX_LINE : undefined)}
      {showSeeMore ? (
        <Pressable onPress={props.onMorePress}>
          <MyText className="text-center uppercase text-black underline">
            + d'allergènes
          </MyText>
        </Pressable>
      ) : null}
    </View>
  );
}
