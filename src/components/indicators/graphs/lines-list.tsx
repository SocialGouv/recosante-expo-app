import React, { useMemo } from 'react';
import { Linking, Pressable, TouchableOpacity, View } from 'react-native';
import {
  type IndicatorsSlugEnum,
  type GenericIndicatorByPeriodValue,
} from '~/types/indicator';
import { LineChart } from './line';
import MyText from '~/components/ui/my-text';
import { IndicatorService } from '~/services/indicator';
import ArrowTopRightOnSquare from '~/assets/icons/arrow-top-right-on-square';

interface LineChartProps {
  values?: GenericIndicatorByPeriodValue[];
  isPreviewMode?: boolean;
  onMorePress?: () => void;
  slug: IndicatorsSlugEnum;
}

const MAX_LINE = 5;

export function LineList(props: LineChartProps) {
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
                onPress: async () =>
                  line.link !== undefined
                    ? await Linking.openURL(line.link)
                    : null,
              }
            : {};
          return (
            <LineWrapper key={line.name} {...lineWrapperProps}>
              <View className="bottom-1 flex flex-row items-start ">
                <View className="mx-1">
                  {!!line.link && <ArrowTopRightOnSquare />}
                </View>
                <MyText
                  className="-mt-1 basis-1/4 text-[11px] text-muted-100"
                  font="MarianneBold"
                  numberOfLines={1}
                >
                  {line.name.charAt(0).toUpperCase() + line.name.slice(1)}
                </MyText>
                <View className="mb-2 w-full flex-1 ">
                  <LineChart
                    isSmall
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
          <MyText className="-mt-2 mb-2  text-center text-xs text-gray-400 ">
            Voir plus d'indicateurs {'+'}
          </MyText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
