import { Switch, View } from 'react-native';
import MyText from '~/components/ui/my-text';
import { logEvent } from '~/services/logEventsWithMatomo';
import {
  NotificationIdEnum,
  type NotificationType,
} from '~/types/notification';
import { useUser } from '~/zustand/user/useUser';

const notifications: NotificationType[] = [
  {
    id: NotificationIdEnum.MORNING,
    label: '☕️ Notifié le matin pour la journée',
    description:
      'Recevez des informations sur votre indicateur favori le matin à 7h.',
  },
  {
    id: NotificationIdEnum.EVENING,
    label: '🌇️ Notifié le soir pour le lendemain',
    description:
      'Recevez des informations sur votre indicateur favori le soir à 19h.',
  },
  {
    id: NotificationIdEnum.ALERT,
    label: '⚠️️ Notifié en cas de vigilance',
    description:
      'Recevez une notification dès qu’un indicateur dépasse un seuil d’alerte',
  },
];

export function NotificationsList() {
  const { notifications_preference, setNotificationsPreferences } = useUser(
    (state) => state,
  );
  function toggleSwitch(id: NotificationIdEnum) {
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

  return (
    <View className="space-y-2">
      {notifications?.map((notification) => {
        const isEnabled = notifications_preference?.includes(notification.id);
        return (
          <View
            key={notification.id}
            className="mt-4 flex flex-row items-center justify-between rounded-2xl bg-white  p-4"
          >
            <View className="w-5/6">
              <View>
                <MyText font="MarianneBold" className="text-sm">
                  {notification.label}
                </MyText>
              </View>
              <View className="mt-1">
                <MyText
                  font="MarianneRegular"
                  className="text-xs text-gray-400"
                >
                  {notification.description}
                </MyText>
              </View>
            </View>
            <View className="">
              <Switch
                style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
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
