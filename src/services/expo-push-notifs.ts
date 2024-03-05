import { Platform, Alert, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { capture } from './sentry';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications
// async function sendPushNotification(expoPushToken) {
//   const message = {
//     to: expoPushToken,
//     sound: "default",
//     title: "Original Title",
//     body: "And here is the body!",
//     data: { someData: "goes here" },
//   };

//   await fetch("https://exp.host/--/api/v2/push/send", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Accept-encoding": "gzip, deflate",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(message),
//   });
// }

export async function registerForPushNotificationsAsync({
  force = false,
  expo = false,
} = {}) {
  try {
    // if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      if (!force) {
        return null;
      }
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Les notifications sont désactivées',
        'Vous pouvez activer les notifications dans les paramètres de votre téléphone.',
        [
          {
            text: 'Open Settings',
            onPress: async () => {
              await Linking.openSettings();
            },
          },
          { text: 'OK', style: 'cancel', onPress: () => {} },
        ],
      );
      return;
    }
    const token = expo
      ? await Notifications.getExpoPushTokenAsync({
          // https://docs.expo.dev/versions/latest/sdk/notifications/#expopushtokenoptions
          // "[...] it is recommended to set it manually."
          projectId: '8d8b446e-c8db-4641-b730-5cef195e96da',
          // projectId: Constants.expoConfig?.extra?.eas.projectId,
        })
      : await Notifications.getDevicePushTokenAsync();
    // } else {
    //   // alert("Must use physical device for Push Notifications");
    // }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;
  } catch (e) {
    capture(e);
    return;
  }
}
