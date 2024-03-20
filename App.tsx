import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import * as Sentry from '@sentry/react-native';
import { Navigators } from './src/navigators';
import { initSession } from '~/services/logEventsWithMatomo';
import EnvironmentIndicator from '~/components/environment-indicator';
import ToastProvider from '~/services/toast';
import { Singular, SingularConfig } from 'singular-react-native';
const config = new SingularConfig(
  'fragile_b0f032b7',
  '878faa6f1413be1a744c78c791ef49f4',
);

// To enable META Install Referrer
config.withFacebookAppId('2091749431177634');
// iOS - Enable SKAdNetwork
config.withSkAdNetworkEnabled(true);
// iOS - Wait 5m for tracking authorization before sending any events
config.withWaitForTrackingAuthorizationWithTimeoutInterval(300);

Singular.init(config);
Singular.limitDataSharing(true);

LogBox.ignoreAllLogs(true);

SplashScreen.preventAutoHideAsync();
Sentry.init({
  dsn: 'https://011d0bf5c5f24f5eb273e83fed66e5eb@sentry.fabrique.social.gouv.fr/94',
  enabled: !__DEV__,
  debug: !__DEV__,
  tracesSampleRate: 0.05,
});

initSession();

function App() {
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
