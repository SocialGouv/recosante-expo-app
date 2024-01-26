import { Platform, Alert, Linking } from 'react-native';
// import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

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
  // if (Device.isDevice) {
  console.log('registerForPushNotificationsAsync 1');
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  console.log('registerForPushNotificationsAsync 2', existingStatus);
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    console.log('registerForPushNotificationsAsync 3');
    if (!force) {
      console.log('registerForPushNotificationsAsync 4');
      return null;
    }
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('registerForPushNotificationsAsync 5');
    Alert.alert(
      'Permission for Push notifications not granted',
      'You can change that in your settings',
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
    console.log('registerForPushNotificationsAsync 6');
    return;
  }
  console.log('registerForPushNotificationsAsync 7');
  const token = expo
    ? await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      })
    : await Notifications.getDevicePushTokenAsync();
  // } else {
  //   // alert("Must use physical device for Push Notifications");
  // }

  console.log('registerForPushNotificationsAsync 8');
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  console.log('registerForPushNotificationsAsync 9');
  return token;
}
