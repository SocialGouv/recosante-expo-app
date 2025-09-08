import React from 'react';
import { View, Text } from 'react-native';

export const toastConfig = {
  success: (props: any) => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginHorizontal: 16,
        marginTop: 60,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Text style={{ fontFamily: 'MarianneBold', fontSize: 16 }}>
        {props.text1}
      </Text>
    </View>
  ),
};
