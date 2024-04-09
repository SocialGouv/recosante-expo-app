import { TouchableOpacity, View } from 'react-native';
import MyText from '~/components/ui/my-text';
import { cn } from '~/utils/tailwind';

const options = [
  {
    label: 'Oui',
    value: 'yes',
  },
  {
    label: 'Non',
    value: 'no',
  },
];

export function Score({
  handleSelect,
  selected,
}: {
  handleSelect: (value: string) => void;
  selected: string;
}) {
  return (
    <View className="mt-2 w-full flex-row justify-start ">
      {options.map((option) => (
        <Option
          isSelected={selected === option.value}
          key={option.label}
          label={option.label}
          value={option.value}
          handleSelect={handleSelect}
        />
      ))}
    </View>
  );
}

function Option({
  label,
  value,
  handleSelect,
  isSelected,
}: {
  label: string;
  value: string;
  handleSelect: (value: string) => void;
  isSelected: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        handleSelect(value);
      }}
      className={cn(
        'mr-2 mt-2 rounded-sm border border-gray-200 px-12 py-2',
        isSelected ? 'bg-app-primary ' : 'bg-white',
      )}
    >
      <MyText
        className={isSelected ? 'text-white' : 'text-black'}
        font={isSelected ? 'MarianneBold' : 'MarianneRegular'}
      >
        {label}
      </MyText>
    </TouchableOpacity>
  );
}
