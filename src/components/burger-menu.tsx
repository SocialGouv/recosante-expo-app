import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { TouchableOpacity, View } from 'react-native';
import { BurgerIcon } from '~/assets/icons/burger';
import { HomeTabRouteEnum, type HomeTabParamList } from '~/constants/route';
import MyText from './ui/my-text';
import { DashboardPage } from '~/scenes/dashboard/dashboard';
import { SharePage } from '~/scenes/share';
import { SettingsPage } from '~/scenes/settings/settings';
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
        drawerPosition: 'right',
        drawerType: 'slide',
        headerTitle: '',

        headerTintColor: '#FFFFFF',
        headerRight: () => {
          return (
            <TouchableOpacity
              className="mr-4"
              onPress={() => {
                props.navigation.dispatch(DrawerActions.openDrawer());
              }}
            >
              <BurgerIcon />
            </TouchableOpacity>
          );
        },

        headerLeft: () => {
          return (
            <View>
              <MyText font="MarianneRegular" className="ml-6  text-xl">
                👋
              </MyText>
            </View>
          );
        },
      }}
    >
      <Drawer.Screen
        name={HomeTabRouteEnum.DASHBOARD}
        component={DashboardPage}
      />
      <Drawer.Screen name={HomeTabRouteEnum.SHARE} component={SharePage} />
      <Drawer.Screen
        name={HomeTabRouteEnum.SETTINGS}
        component={SettingsPage}
      />
    </Drawer.Navigator>
  );
}
