import * as Progress from 'react-native-progress';
import { View } from 'react-native';
import MyText from './my-text';

interface Props {
  label: string;
}

export function Loader(props: Props) {
  return (
    <View className="flex-1 items-center">
      <Progress.Circle size={20} indeterminate={true} color="#3343BD" />
      <MyText className="text-app-primary">
        {props.label ?? 'Chargement ...'}
      </MyText>
    </View>
  );
}
