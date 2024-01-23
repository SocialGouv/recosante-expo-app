import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import MyText from '~/components/ui/my-text';
import { cn } from '~/utils/tailwind';

type StepperProps = {
  step: 1 | 2 | 3 | 4;
  disabled?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
};

export function Stepper(props: StepperProps) {
  return (
    <TouchableOpacity
      className={cn('relative', props.disabled ? 'opacity-30' : 'opacity-100')}
      onPress={props.onPress}
    >
      <View
        className={cn(
          'absolute left-0 top-0 h-[47%] w-[49%] rounded-tl-full border-4 bg-app-primary',
          props.step >= 4 ? 'border-app-yellow' : 'bg-app-primary opacity-20',
        )}
      >
        <View className="absolute -bottom-4 right-0 h-4 w-full bg-app-primary" />
        <View className="absolute -right-4 bottom-0 h-full w-4 bg-app-primary" />
      </View>
      <View
        className={cn(
          'absolute right-0 top-0 h-[47%] w-[49%] rounded-tr-full border-4 bg-app-primary',
          props.step >= 1 ? 'border-app-yellow' : 'bg-app-primary opacity-20',
        )}
      >
        <View className="absolute -bottom-4 left-0 h-4 w-full bg-app-primary" />
        <View className="absolute -left-4 bottom-0 h-full w-4 bg-app-primary" />
      </View>

      <View
        className={cn(
          'absolute bottom-0 right-0 h-[47%] w-[49%] rounded-br-full border-4 bg-app-primary',
          props.step >= 2 ? 'border-app-yellow' : 'bg-app-primary opacity-20',
        )}
      >
        <View className="absolute -top-4 right-0 h-4 w-full bg-app-primary" />
        <View className="absolute -left-4 bottom-0 h-full w-4 bg-app-primary" />
      </View>
      <View
        className={cn(
          'absolute bottom-0 left-0 h-[47%] w-[49%] rounded-bl-full border-4 bg-app-primary',
          props.step >= 3 ? 'border-app-yellow' : 'bg-app-primary opacity-20',
        )}
      >
        <View className="absolute -top-4 left-0 h-4 w-full bg-app-primary" />
        <View className="absolute -right-4 bottom-0 h-full w-4 bg-app-primary" />
      </View>
      <View className="m-2 min-w-[200px] justify-center rounded-full bg-app-yellow px-8 pb-4 pt-3">
        <View className="items-center justify-center">{props.children}</View>
      </View>
    </TouchableOpacity>
  );
}
