import React from 'react';
import { Linking, Pressable, TouchableOpacity, View } from 'react-native';
import {
  type IndicatorsSlugEnum,
  type IndicatorByPeriod,
} from '~/types/indicator';
import { LineChart } from './line';
import MyText from '~/components/ui/my-text';
import { useMemo } from 'react';
import { IndicatorService } from '~/services/indicator';
import { cn } from '~/utils/tailwind';
import ArrowTopRightOnSquare from '~/assets/icons/arrow-top-right-on-square';

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

  if (!sortedValues?.length) return <></>;
  return (
    <View className="mt-6 flex space-y-2">
      {sortedValues
        ?.map((line) => {
          if (line.value === 0) return null;
          const LineWrapper = line.link ? Pressable : React.Fragment;
          const lineWrapperProps = line.link
            ? {
                onPress: () => !!line.link && Linking.openURL(line.link),
              }
            : {};
          return (
            <LineWrapper key={line.name} {...lineWrapperProps}>
              <View className="bottom-1 flex flex-row items-center">
                <View className="mx-1">
                  {!!line.link && <ArrowTopRightOnSquare />}
                </View>
                <MyText
                  className="mr-3 basis-1/3 text-[11px] capitalize text-muted-100"
                  font="MarianneBold"
                  numberOfLines={1}
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
            </LineWrapper>
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
