import { View } from 'react-native';
import { ValidIcon } from '~/assets/icons/check';
import { NotValidIcon } from '~/assets/icons/not-valid';
import MyText from '~/components/ui/my-text';
import {
  DrinkingWaterValuesEnum,
  type DrinkingWaterValues,
} from '~/types/indicator';

interface DrinkingWaterResultProps {
  indicatorValue: DrinkingWaterValues;
}
export function DrinkingWaterResult(props: DrinkingWaterResultProps) {
  return (
    <View className="flex-row">
      <Label
        label="Bacteriologique"
        value={props.indicatorValue.bacteriological}
      />
      <Label label="Chimique" value={props.indicatorValue.chemical} />
    </View>
  );
}

function renderValue({ value }: { value: DrinkingWaterValuesEnum }) {
  switch (value) {
    case DrinkingWaterValuesEnum.C:
      return <ValidIcon />;
    case DrinkingWaterValuesEnum.D:
      return <ValidIcon />;
    case DrinkingWaterValuesEnum.N:
      return <NotValidIcon />;
    case DrinkingWaterValuesEnum.S:
      return (
        <View className="rounded-full border border-gray-300 px-2">
          <MyText
            className="text-wrap  ml-1 rounded-full  text-xs uppercase text-muted"
            font="MarianneRegular"
          >
            aucune donnée
          </MyText>
        </View>
      );
  }
}

interface LabelProps {
  label: string;
  value: DrinkingWaterValues[keyof DrinkingWaterValues];
}
function Label({ label, value }: LabelProps) {
  return (
    <View className="mr-6 flex-row">
      <MyText
        font="MarianneRegular"
        className=" mr-1 flex items-center text-xs uppercase text-muted"
      >
        {label}
      </MyText>
      {renderValue({ value })}
    </View>
  );
}
