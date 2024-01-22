import React from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import { APP_ENV } from '~/config';

const EnvironmentIndicator = () => {
  if (APP_ENV === 'production') return null;

  return (
    <SafeAreaView style={styles.container}>
      <Text allowFontScaling={false} style={styles.text}>
        {APP_ENV}
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
