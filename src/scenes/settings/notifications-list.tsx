import { useEffect, useState } from 'react';
import { AppState, Switch, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import MyText from '~/components/ui/my-text';
import { registerForPushNotificationsAsync } from '~/services/expo-push-notifs';
import { logEvent } from '~/services/logEventsWithMatomo';
import {
  NotificationIdEnum,
  type NotificationType,
} from '~/types/notification';
import { useUser } from '~/zustand/user/useUser';
import { useFocusEffect } from '@react-navigation/native';

const notifications: NotificationType[] = [
  {
    id: NotificationIdEnum.MORNING,
    label: '☕️ Notifié le matin pour la journée',
    description: 'Recevez une notification sur vos indicateurs le matin à 7h.',
  },
  {
    id: NotificationIdEnum.EVENING,
    label: '🌇️ Notifié le soir pour le lendemain',
    description: 'Recevez une notification sur vos indicateurs le soir à 19h.',
  },
  {
    id: NotificationIdEnum.ALERT,
    label: '⚠️️ Notifié en cas de vigilance',
    description:
      'Recevez une notification dès qu’un indicateur dépasse un seuil d’alerte.',
  },
];

export function NotificationsList() {
  const { notifications_preference, setNotificationsPreferences } = useUser(
    (state) => state,
  );
  const [notificationsAreEnabled, setNotificationsAreEnabled] = useState(false);
  async function toggleSwitch(id: NotificationIdEnum) {
    if (!notificationsAreEnabled) {
      const token = await registerForPushNotificationsAsync({
        expo: true,
        force: true,
      });
      if (!token) return;
    }
    if (notifications_preference?.includes(id)) {
      logEvent({
        category: 'SETTINGS',
        action: 'NOTIFICATION',
        name: id.toLocaleUpperCase(),
        value: 0,
      });
      setNotificationsPreferences(
        notifications_preference.filter((item) => item !== id),
      );
    } else {
      logEvent({
        category: 'SETTINGS',
        action: 'NOTIFICATION',
        name: id.toLocaleUpperCase(),
        value: 1,
      });
      setNotificationsPreferences([...notifications_preference, id]);
    }
  }

  useFocusEffect(() => {
    Notifications.getPermissionsAsync().then(({ status }) => {
      setNotificationsAreEnabled(status === 'granted');
    });
  });

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        Notifications.getPermissionsAsync().then(({ status }) => {
          setNotificationsAreEnabled(status === 'granted');
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View className="space-y-2">
      {notifications?.map((notification) => {
        const isEnabled =
          notificationsAreEnabled &&
          notifications_preference?.includes(notification.id);
        return (
          <View
            key={notification.id}
            className="mt-4 flex flex-row items-center justify-between rounded-md border  border-gray-200 bg-white p-4"
          >
            <View className="w-5/6">
              <View>
                <MyText font="MarianneBold" className="text-md">
                  {notification.label}
                </MyText>
              </View>
              <View className="mt-1">
                <MyText
                  font="MarianneRegular"
                  className="text-sm text-gray-400"
                >
                  {notification.description}
                </MyText>
              </View>
            </View>
            <View className="">
              <Switch
                style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                trackColor={{ false: '#767577', true: '#3343BD' }}
                onValueChange={() => {
                  toggleSwitch(notification.id);
                }}
                value={isEnabled}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}
