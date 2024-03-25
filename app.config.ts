// Without dotenv, you can access .env
import 'dotenv/config';
import { type ExpoConfig, type ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Recosante',
  slug: 'recosante',
  updates: {
    url:
      process.env.EXPO_PUBLIC_EXPO_UPDATES ??
      // When using expo updates, the env is not available
      'https://u.expo.dev/8d8b446e-c8db-4641-b730-5cef195e96da',
  },

  extra: {
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    EXPO_PUBLIC_API_SCHEME: process.env.EXPO_PUBLIC_API_SCHEME,
    EXPO_PUBLIC_API_HOST: process.env.EXPO_PUBLIC_API_HOST,
    EXPO_PUBLIC_APP_ENV: process.env.EXPO_PUBLIC_APP_ENV,
    eas: {
      projectId:
        process.env.EXPO_PUBLIC_PROJECT_ID ??
        // When using expo updates, the env is not available
        '8d8b446e-c8db-4641-b730-5cef195e96da',
    },
  },

  runtimeVersion: {
    policy: 'appVersion',
  },
});
