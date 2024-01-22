import { View } from 'react-native';

interface LineChartProps {
  value?: number;
  color?: string;
  range: number;
}

export function LineChart(props: LineChartProps) {
  const value = props.value ?? 2;
  if (value === 0) {
    return <></>;
  }

  function createLine() {
    return (
      <View
        className="h-[9px] rounded-full"
        style={{
          backgroundColor: props.color ?? 'blue',
          width: `${(100 / props.range) * value}%`,
        }}
      ></View>
    );
  }

  return (
    <View className="relative flex">
      <View className="h-[9px] rounded-full bg-app-gray-300 "></View>

      <View className="absolute  flex flex-row">{createLine()}</View>
    </View>
  );
}
