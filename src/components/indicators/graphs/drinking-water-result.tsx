import { View } from 'react-native';
import { ValidIcon } from '~/assets/icons/check';
import { NotValidIcon } from '~/assets/icons/not-valid';
import MyText from '~/components/ui/my-text';
import {
  DrinkingWaterValuesEnum,
  type DrinkingWaterValue,
} from '~/types/indicator';

interface DrinkingWaterResultProps {
  indicatorValue: DrinkingWaterValue | null;
}

export function DrinkingWaterResult(props: DrinkingWaterResultProps) {
  if (!props.indicatorValue) return null;
  return (
    <View className="flex-col">
      <Label
        label="Conformité Bacteriologique"
        value={props.indicatorValue.bacteriological}
      />
      <Label
        label="Conformité Chimique"
        value={props.indicatorValue.chemical}
      />
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
  value: DrinkingWaterValue[keyof DrinkingWaterValue];
}
function Label({ label, value }: LabelProps) {
  return (
    <View className="mb-1 mr-6 flex-row items-center">
      <View className="  min-w-[215px] ">
        <MyText
          font="MarianneRegular"
          className="mr-1  items-center border text-xs uppercase text-muted"
        >
          {label}
        </MyText>
      </View>
      {renderValue({ value })}
    </View>
  );
}
