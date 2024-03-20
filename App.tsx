import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import * as Sentry from '@sentry/react-native';
import { Navigators } from './src/navigators';
import EnvironmentIndicator from '~/components/environment-indicator';
import ToastProvider from '~/services/toast';
import { InitializationService } from '~/services/initialization';

LogBox.ignoreAllLogs(true);
SplashScreen.preventAutoHideAsync();
InitializationService.initSentry();
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
    <>
      <SafeAreaProvider>
        <GestureHandlerRootView className="flex-1">
          <ToastProvider>
            <App />
          </ToastProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
      <EnvironmentIndicator />
    </>
  );
}
export default Sentry.wrap(AppWrapper);
