import { View } from 'react-native';
import MyText from '~/components/ui/my-text';
import Animated, {
  ReduceMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '~/utils/tailwind';

interface LineChartProps {
  value?: number;
  color?: string;
  maxValue: number;
  isSmall?: boolean;
}

export function LineChart(props: LineChartProps) {
  const [viewWidth, setViewWitdh] = useState(0);
  const value = props.value ?? 0;

  const initialWidth = useSharedValue(0);

  const width = useMemo(
    () => Math.round((value * viewWidth) / props.maxValue),
    [value, viewWidth],
  );
  const minValue = 0;

  useEffect(() => {
    initialWidth.value = withSpring(width, {
      damping: 50,
      stiffness: 100,
      overshootClamping: false,
      restDisplacementThreshold: 0.1,
      reduceMotion: ReduceMotion.Never,
    });
  }, [width]);

  if (value === 0) {
    return <></>;
  }

  const isDoubleDigit = value > 9;
  return (
    <View>
      <View
        className="mr-2  h-[9px] flex-row rounded-full bg-app-gray"
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setViewWitdh(width);
        }}
      >
        <Animated.View
          className="h-[9px] rounded-full"
          style={{
            backgroundColor: props.color,
            width: initialWidth,
          }}
        />
        <View
          className="-left-[14px] -top-[4px]"
          style={{
            backgroundColor: props.color,
            width: isDoubleDigit ? 20 : 17,
            height: isDoubleDigit ? 20 : 17,
            borderRadius: 50,
          }}
        >
          <MyText
            font="MarianneBold"
            className={cn(
              '-top-[2.5px] text-center text-white',
              isDoubleDigit ? 'top-[1px] text-xs' : '-top-[2.5px]',
            )}
          >
            {value}
          </MyText>
        </View>
      </View>
      <View
        className={cn(
          ' flex-row justify-between',
          props.isSmall ? 'mt-[2px]' : 'mt-[6px]',
        )}
      >
        <MyText className="text-xs text-[#D1D1D1]">{minValue}</MyText>
        <MyText className="mr-2 text-xs text-[#D1D1D1]">
          {props.maxValue}
        </MyText>
      </View>
    </View>
  );
}
