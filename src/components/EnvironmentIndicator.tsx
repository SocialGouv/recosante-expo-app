import React, { useEffect } from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import { APP_ENV } from '~/config';
import API from '~/services/api';

const EnvironmentIndicator = () => {
  const [environment, setEnvironment] = React.useState(APP_ENV);
  useEffect(() => {
    // the init consist of knowing the environment of the app
    // preproduction or production
    API.get({ path: '/environment' }).then((envResponse) => {
      if (APP_ENV !== 'local' && envResponse.ok) {
        API.host = envResponse.data.api_host;
        setEnvironment(envResponse.data.environment);
      }
    });
  }, []);

  return null;
  if (environment === 'production') return null;
  return (
    <SafeAreaView style={styles.container}>
      <Text allowFontScaling={false} style={styles.text}>
        {environment}
      </Text>
    </SafeAreaView>
  );
};

export default EnvironmentIndicator;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    right: 20,
    zIndex: 9999,
    fontSize: 16,
  },
  text: {
    color: 'red',
  },
});
