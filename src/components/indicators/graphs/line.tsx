import { View } from 'react-native';

interface LineChartProps {
  value?: number;
  color?: string;
  range: number;
}

export function LineChart(props: LineChartProps) {
  const value = props.value ?? 0;
  if (value === 0) {
    return <></>;
  }

  const width = Math.round((value / props.range) * 100);

  return (
    <View className="relative flex">
      <View className="h-[9px] rounded-full bg-app-gray-300 "></View>
      <View className="absolute flex w-full flex-row">
        <View
          className="h-[9px] rounded-full"
          style={{
            backgroundColor: props.color,
            width: `${width}%`,
          }}
        />
      </View>
    </View>
  );
}
