import { useMemo } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import type { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { IndicatorPreview } from '~/components/indicators/indicator-preview';
import { type IndicatorItem } from '~/types/indicator';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { DayEnum } from '~/types/day';
import { Loader } from '~/components/ui/loader';
import MyText from '~/components/ui/my-text';
import { Footer } from '~/components/footer';
import { CallToAction } from '~/components/call-to-action';

enum tabsEnum {
  TODAY = 'TODAY',
  TOMORROW = 'TOMORROW',
}

export type IndicatorsDaysTabParamList = {
  [tabsEnum.TODAY]: {
    day: DayEnum;
  };
  [tabsEnum.TOMORROW]: {
    day: DayEnum;
  };
};

const IndicatorsDaysTab =
  createMaterialTopTabNavigator<IndicatorsDaysTabParamList>();

type TabProps = MaterialTopTabScreenProps<IndicatorsDaysTabParamList>;

interface IndicatorsListPreviewProps {
  indicators: IndicatorItem[] | null;
  favoriteIndicator: IndicatorItem | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isError: string;
  onRefresh: () => void;
}
export function IndicatorsListPreview(props: IndicatorsListPreviewProps) {
  //   Remove the favorite indicator from the list of indicators
  const filteredIndicators = useMemo(
    () =>
      props.indicators?.filter(
        (indicator) =>
          indicator.slug !== props.favoriteIndicator?.slug &&
          (__DEV__ ? !undefined : indicator.slug !== 'drinking_water'),
      ),
    [props.indicators, props.favoriteIndicator],
  );
  if (!props.indicators) {
    return null;
  }

  function IndicatorListView(tabProps: TabProps) {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={props.isRefreshing}
            onRefresh={props.onRefresh}
          />
        }
        contentContainerStyle={styles.contentContainer}
      >
        {props.isLoading ? (
          <View className="flex-1 flex-row flex-wrap pb-24 pt-8">
            <Loader label="Chargement des indicateurs ..." />
          </View>
        ) : props.isError ? (
          <View className="h-full w-full flex-1 flex-row flex-wrap items-center justify-center bg-app-gray pb-24 pt-8">
            <MyText className="text-center">{props.isError}</MyText>
          </View>
        ) : (
          <View className="pb-4 ">
            {props.favoriteIndicator ? (
              <IndicatorPreview
                day={tabProps.route.params.day}
                indicator={props.favoriteIndicator}
                isFavorite
                index={0}
              />
            ) : null}
            {filteredIndicators?.map((indicator, index) => (
              <IndicatorPreview
                day={tabProps.route.params.day}
                key={indicator.slug}
                indicator={indicator}
                index={index}
              />
            ))}
          </View>
        )}
        <CallToAction />
        <Footer />
      </ScrollView>
    );
  }

  return (
    <IndicatorsDaysTab.Navigator
      initialRouteName={tabsEnum.TODAY}
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#ECF1FB',
          elevation: 2,
          shadowColor: '#3343BD',
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
          height: 1,
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#AEB1B7',
        tabBarAndroidRipple: {
          color: 'transparent',
          borderless: false,
        },
      }}
    >
      <IndicatorsDaysTab.Screen
        name={tabsEnum.TODAY}
        options={{
          tabBarLabel: "Aujourd'hui",
        }}
        component={IndicatorListView}
        initialParams={{ day: DayEnum.TODAY }}
      />
      <IndicatorsDaysTab.Screen
        name={tabsEnum.TOMORROW}
        options={{
          tabBarLabel: 'Demain',
        }}
        component={IndicatorListView}
        initialParams={{ day: DayEnum.TOMORROW }}
      />
    </IndicatorsDaysTab.Navigator>
  );
}
const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ECF1FB',
    minHeight: '100%',
  },
});
