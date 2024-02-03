import { useState } from 'react';
import { Dimensions, View } from 'react-native';
import Slider from '@react-native-community/slider';
import MyText from '~/components/ui/my-text';

interface InputCountProps {
  max: number;
  value: number;
  onChange: (value: number) => void;
}

export function InputCount(props: InputCountProps) {
  const windowWidth = Dimensions.get('window').width - 40;

  return (
    <View className="mx-auto mt-2">
      <View className="mx-auto">
        <MyText
          font="MarianneExtraBold"
          className="text-center text-xl text-app-primary"
        >
          {props.value}
        </MyText>
      </View>
      <Slider
        value={props.value}
        onValueChange={(value) => props.onChange(value)}
        style={{ width: windowWidth, height: 40 }}
        minimumValue={0}
        maximumValue={props.max}
        maximumTrackTintColor="#FFFFFF"
        minimumTrackTintColor="#3343BD"
        tapToSeek={true}
        step={1}
      />
    </View>
  );
}
