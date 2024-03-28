import { View } from 'react-native';
import MyText from './ui/my-text';
import { useEffect, useState } from 'react';
import API from '~/services/api';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { RouteEnum } from '~/constants/route';
import { type DashboardProps } from '~/scenes/dashboard/dashboard';
import { logEvent } from '~/services/logEventsWithMatomo';

enum CallToActionEnum {
  FEEDBACK = 'FEEDBACK',
}

type CallToActionType = {
  data: {
    show: boolean;
    title: string;
    label: string;
    action: CallToActionEnum;
  };
};

export function CallToAction() {
  const navigation = useNavigation<DashboardProps['navigation']>();

  const [results, setResults] = useState<CallToActionType | null>(null);
  useEffect(() => {
    let ignore = false;
    API.get({
      path: '/call-to-action',
    }).then((json) => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  function getAction() {
    logEvent({
      category: 'DASHBOARD',
      action: 'CALL_TO_ACTION_CLICKED',
      name: results?.data.action,
    });

    switch (results?.data.action) {
      case CallToActionEnum.FEEDBACK:
        navigation.navigate(RouteEnum.FEEDBACK);
        break;
      default:
        break;
    }
  }

  if (!results?.data?.show) {
    return null;
  }
  return (
    <View>
      <View className="mx-auto  w-20 border-[0.3px] border-gray-400" />
      <View className="mx-3 my-6 rounded-md border border-dashed border-app-primary bg-white px-3 py-4">
        <MyText font="MarianneMedium" className="text-[16px] text-muted">
          {results.data.title}
        </MyText>
        <TouchableOpacity
          className="mx-auto mt-4 self-start truncate rounded-full bg-app-primary px-5 py-1 text-center text-xl text-white"
          onPress={getAction}
        >
          <MyText
            font="MarianneMedium"
            className="text-[14px] uppercase text-white"
            numberOfLines={1}
          >
            {results.data.label}
          </MyText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
