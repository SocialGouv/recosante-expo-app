// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const config = getSentryExpoConfig(__dirname);

module.exports = config;
