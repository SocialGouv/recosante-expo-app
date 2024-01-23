import { TouchableOpacity, View } from 'react-native';
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
  const { valuesToColor, maxValue } =
    IndicatorService.getDataVisualisationBySlug(props.slug);

  return (
    <View className="mt-6 flex space-y-2">
      {sortedValues
        ?.map((line) => {
          if (line.value === 0) return null;
          return (
            <View key={line.name} className="flex  flex-row">
              <MyText
                className="bottom-1 mr-3 min-w-[75px] text-[11px] capitalize text-muted-100"
                font="MarianneBold"
              >
                {line.name}
              </MyText>
              <View className="w-full flex-1 ">
                <LineChart
                  color={valuesToColor[line.value]}
                  value={line.value}
                  maxValue={maxValue}
                />
              </View>
            </View>
          );
        })
        .slice(0, props.isPreviewMode ? MAX_LINE : undefined)}
      {showSeeMore ? (
        <TouchableOpacity onPress={props.onMorePress}>
          <MyText className="text-center text-[10px] uppercase text-muted underline">
            Voir plus d'indicateurs {'>'}
          </MyText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
