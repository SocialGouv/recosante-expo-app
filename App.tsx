import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Navigators } from './src/navigators';
import EnvironmentIndicator from '~/components/environment-indicator';
import { InitializationService } from '~/services/initialization';
import ToastProvider from '~/services/toast';
import { toastConfig } from '~/services/toast-config';
import Toast from 'react-native-toast-message';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://e520427fc12683d34b17aee2fa67c866@sentry2.fabrique.social.gouv.fr/51',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

LogBox.ignoreAllLogs(true);
SplashScreen.preventAutoHideAsync();
InitializationService.firstTimeLaunch();
InitializationService.initMatomo();
function App() {
  InitializationService.useNotificationsListenerHook();
  const [fontsLoaded] = useFonts({
    MarianneBold: require('./src/assets/fonts/Marianne-Bold.otf'),
    MarianneBoldItalic: require('./src/assets/fonts/Marianne-BoldItalic.otf'),
    MarianneExtraBold: require('./src/assets/fonts/Marianne-ExtraBold.otf'),
    MarianneExtraBoldItalic: require('./src/assets/fonts/Marianne-ExtraBoldItalic.otf'),
    MarianneLight: require('./src/assets/fonts/Marianne-Light.otf'),
    MarianneLightItalic: require('./src/assets/fonts/Marianne-LightItalic.otf'),
    MarianneMedium: require('./src/assets/fonts/Marianne-Medium.otf'),
    MarianneMediumItalic: require('./src/assets/fonts/Marianne-MediumItalic.otf'),
    MarianneRegular: require('./src/assets/fonts/Marianne-Regular.otf'),
    MarianneRegularItalic: require('./src/assets/fonts/Marianne-RegularItalic.otf'),
    MarianneThin: require('./src/assets/fonts/Marianne-Thin.otf'),
    MarianneThinItalic: require('./src/assets/fonts/Marianne-ThinItalic.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <Navigators />
    </SafeAreaProvider>
  );
}

function AppWrapper() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className="flex-1">
        <ToastProvider>
          <App />
          <EnvironmentIndicator />
        </ToastProvider>
      </GestureHandlerRootView>
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
}
export default Sentry.wrap(AppWrapper);
