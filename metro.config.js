// This replaces `const { getDefaultConfig } = require('expo/metro-config');`
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

// This replaces `const config = getDefaultConfig(__dirname);`
const config = getSentryExpoConfig(__dirname);

module.exports = config;
