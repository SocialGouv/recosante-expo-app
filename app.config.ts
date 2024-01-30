import { ExpoConfig, ConfigContext } from 'expo/config';

// FIXME: not working, env variables not loading
export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: 'Recosante',
    slug: 'recosante',
    // android: {
    //   googleServicesFile:
    //     process.env.EAS_BUILD === 'local'
    //       ? './google-services.json'
    //       : process.env.GOOGLE_SERVICES_JSON,
    //   ...config.android,
    // },
    // hooks: {
    //   postPublish: [
    //     {
    //       file: 'sentry-expo/upload-sourcemaps',
    //       config: {
    //         organization: 'incubateur',
    //         project: 'recosante-expo-app',
    //         url: 'https://sentry.fabrique.social.gouv.fr/',
    //         authToken: process.env.SENTRY_AUTH_TOKEN,
    //       },
    //     },
    //   ],
    // },
  };
};
