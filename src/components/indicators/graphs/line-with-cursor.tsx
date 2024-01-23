import { Dimensions, View } from 'react-native';
import { IndicatorService } from '~/services/indicator';
import { type IndicatorsSlugEnum } from '~/types/indicator';
import { cn } from '~/utils/tailwind';

interface LineChartProps {
  value?: number;
  slug: IndicatorsSlugEnum;
  showCursor?: boolean;
}

export function LineChartWithCursor(props: LineChartProps) {
  const { maxValue, valuesToColor } =
    IndicatorService.getDataVisualisationBySlug(props.slug);
  const value = Math.min(props.value ?? 0, maxValue);
  // let's  find out how big is a value in the chart, in %
  const widthForEachValue = 1 / maxValue;
  // the triangleStart is the start of the range for the value

  const triangleWidth = 8; // in px
  const paddingX = 10; // in px
  const triangleWidthInPercent =
    (triangleWidth + paddingX) / Dimensions.get('window').width;

  const trianglePosition =
    value * widthForEachValue -
    widthForEachValue / 2 -
    triangleWidthInPercent / 2;

  if (value === 0) {
    return <></>;
  }

  function createLine() {
    return Array.from({ length: maxValue }, (_, i) => i + 1).map((i) => {
      return (
        <View
          className={cn(
            'h-[9px]',
            i === 1 && 'rounded-l-md',
            i === maxValue && 'rounded-r-md',
          )}
          style={{
            backgroundColor: valuesToColor[i],
            width: `${widthForEachValue * 100}%`,
          }}
          key={i}
        />
      );
    });
  }

  const borderTopColor = valuesToColor[value];

  return (
    <View className="flex w-full">
      {props.showCursor && (
        <View
          // className="transition-all duration-300 ease-in-out"
          style={{
            width: 0,
            left: `${trianglePosition * 100}%`,
            borderStyle: 'solid',
            borderLeftWidth: 8,
            borderRightWidth: 8,
            borderTopWidth: 12,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor,
            marginBottom: 4,
          }}
        />
      )}
      <View className="flex flex-row">{createLine()}</View>
    </View>
  );
}
