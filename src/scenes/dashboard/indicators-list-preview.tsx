import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { IndicatorPreview } from '~/components/indicators/indicator-preview';
import { type IndicatorItem } from '~/types/indicator';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { DayEnum } from '~/types/day';

const Tab = createMaterialTopTabNavigator();

const tabsEnum = {
  TODAY: 'TODAY',
  TOMORROW: 'TOMORROW',
};

interface IndicatorsListPreviewProps {
  indicators: IndicatorItem[] | null;
  favoriteIndicator: IndicatorItem | null;
}
export function IndicatorsListPreview(props: IndicatorsListPreviewProps) {
  //   Remove the favorite indicator from the list of indicators
  const filteredIndicators = useMemo(
    () =>
      props.indicators?.filter(
        (indicator) => indicator.slug !== props.favoriteIndicator?.slug,
      ),
    [props.indicators, props.favoriteIndicator],
  );
  if (!props.indicators) {
    return null;
  }

  function IndicatorListView({ route }: any) {
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View className="flex-1 flex-row flex-wrap pb-24 pt-8">
          {props.favoriteIndicator ? (
            <IndicatorPreview
              day={route.params.day}
              indicator={props.favoriteIndicator}
              isFavorite
              index={0}
            />
          ) : null}
          {filteredIndicators?.map((indicator, index) => (
            <IndicatorPreview
              day={route.params.day}
              key={indicator.slug}
              indicator={indicator}
              index={index}
            />
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <Tab.Navigator
      initialRouteName={tabsEnum.TODAY}
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#ECF1FB',
          elevation: 0,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 10 }, // change this for more shadow
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: 'MarianneBold',
          marginBottom: -12,
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#555555',
          height: 2,
        },
        tabBarActiveTintColor: '#555555',
        tabBarInactiveTintColor: '#AEB1B7',
      }}
    >
      <Tab.Screen
        name={tabsEnum.TODAY}
        options={{
          tabBarLabel: "Aujourd'hui",
        }}
        component={IndicatorListView}
        initialParams={{ day: DayEnum.TODAY }}
      />
      <Tab.Screen
        name={tabsEnum.TOMORROW}
        options={{
          tabBarLabel: 'Demain',
        }}
        component={IndicatorListView}
        initialParams={{ day: DayEnum.TOMORROW }}
      />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ECF1FB',
  },
});
