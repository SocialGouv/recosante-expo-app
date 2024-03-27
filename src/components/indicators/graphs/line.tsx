import { View } from 'react-native';
import MyText from '~/components/ui/my-text';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect, useMemo, useState } from 'react';

interface LineChartProps {
  value?: number;
  color?: string;
  maxValue: number;
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
    });
  }, [width]);

  if (value === 0) {
    return <></>;
  }

  return (
    <View className="relative">
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
          className="-left-[14px] -top-[6px]"
          style={{
            backgroundColor: props.color,
            width: 21,
            height: 21,
            borderRadius: 50,
          }}
        >
          <MyText
            font="MarianneBold"
            className="-top-[1px] text-center text-white"
          >
            {value}
          </MyText>
        </View>
      </View>
      <View className="mt-[6px] flex-row justify-between">
        <MyText className="text-xs text-[#D1D1D1]">{minValue}</MyText>
        <MyText className="mr-2 text-xs text-[#D1D1D1]">
          {props.maxValue}
        </MyText>
      </View>
    </View>
  );
}
