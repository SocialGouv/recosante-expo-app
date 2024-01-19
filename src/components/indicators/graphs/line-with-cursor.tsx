import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { IndicatorService } from '~/services/indicator';
import { type IndicatorsSlugEnum } from '~/types/indicator';
import { cn } from '~/utils/tailwind';

interface LineChartProps {
  value?: number;
  slug: IndicatorsSlugEnum | undefined;
}

export function LineChartWithCursor(props: LineChartProps) {
  if (!props.slug) return null;
  const value = props.value ?? 2;
  const { color, range, valuesInRange } =
    IndicatorService.getDataVisualisationBySlug(props.slug);
  const rangeForValue =
    valuesInRange?.findIndex((range) => range.includes(value)) ?? 0;
  const trianglePosition = (110 / range) * rangeForValue;

  if (value === 0) {
    return <></>;
  }
  function Triangle() {
    return (
      <View
        className="transition-all duration-300 ease-in-out"
        style={{
          width: 0,
          left: `${trianglePosition}%`,
          borderStyle: 'solid',
          borderLeftWidth: 8,
          borderRightWidth: 8,
          borderBottomWidth: 14,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color[rangeForValue] ?? 'red',
          transform: 'rotate(180deg)',
        }}
      />
    );
  }

  function createLine() {
    return Array.from({ length: range }, (_, i) => i + 1).map((i) => {
      function rounded() {
        if (i === 1) return 'rounded-l-md';
        if (i === range) return 'rounded-r-md';
      }
      return (
        <View
          className={cn('h-3', rounded())}
          style={{
            backgroundColor: color[i - 1],
            width: `${100 / range}%`,
          }}
          key={i}
        ></View>
      );
    });
  }

  return (
    <View className="flex">
      <Triangle />
      <View className="mt-1 flex flex-row">{createLine()}</View>
    </View>
  );
}
