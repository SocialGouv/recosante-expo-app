import { DrawerActions } from '@react-navigation/native';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity } from 'react-native';
import { BurgerIcon } from '~/assets/icons/burger';
import { HomeTabRouteEnum, type HomeTabParamList } from '~/constants/route';
import { DashboardPage } from '~/scenes/dashboard/dashboard';
import { SharePage } from '~/scenes/share';
import { SettingsPage } from '~/scenes/settings/settings';
import MyText from './ui/my-text';
import { FeedbackPage } from '~/scenes/feedback/feedback';
const Drawer = createDrawerNavigator<HomeTabParamList>();

interface BurgerMenuProps {
  navigation: any;
}

export function BurgerMenu(props: BurgerMenuProps) {
  return (
    <Drawer.Navigator
      initialRouteName={HomeTabRouteEnum.DASHBOARD}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ECF1FB',
          shadowColor: 'transparent',
        },
        drawerContentStyle: {
          paddingVertical: 40,
        },
        drawerLabelStyle: {
          fontFamily: 'MarianneBold',
          fontSize: 16,
        },
        drawerActiveTintColor: '#FFFFFF',
        drawerInactiveTintColor: '#000',
        drawerPosition: 'right',
        drawerActiveBackgroundColor: '#3343BD',
        drawerType: 'front',
        headerTitle: '',
        headerTintColor: '#FFFFFF',
        headerLeft: () => {
          return (
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate(HomeTabRouteEnum.DASHBOARD);
              }}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <MyText font="MarianneRegular" className="ml-6  text-xl">
                👋
              </MyText>
            </TouchableOpacity>
          );
        },
        headerRight: () => {
          return (
            <TouchableOpacity
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              className="mr-4"
              onPress={() => {
                props.navigation.dispatch(DrawerActions.openDrawer());
              }}
            >
              <BurgerIcon />
            </TouchableOpacity>
          );
        },
      }}
    >
      <Drawer.Screen
        name={HomeTabRouteEnum.DASHBOARD}
        component={DashboardPage}
        options={{
          title: 'Tableau de bord',
        }}
      />
      <Drawer.Screen
        name={HomeTabRouteEnum.SHARE}
        component={SharePage}
        options={{
          title: 'Partager Recosanté',
        }}
      />
      <Drawer.Screen
        name={HomeTabRouteEnum.SETTINGS}
        component={SettingsPage}
        options={{
          title: 'Paramètres',
        }}
      />
      <Drawer.Screen
        name={HomeTabRouteEnum.FEEDBACK}
        component={FeedbackPage}
        options={{
          title: 'Laisser un avis',
        }}
      />
    </Drawer.Navigator>
  );
}
