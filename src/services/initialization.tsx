import { matomoInit, logEvent } from '~/services/logEventsWithMatomo';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import API from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const __DEV__ = process.env.NODE_ENV === 'development';
export namespace InitializationService {
  export async function initMatomo() {
    await matomoInit();
  }
  export async function firstTimeLaunch() {
    if (__DEV__) return;
    const FIRST_TIME_LAUNCH = 'first_time_launch';
    AsyncStorage.getItem(FIRST_TIME_LAUNCH).then((isFirstTime) => {
      if (!isFirstTime) {
        // log the event, backend will handle post webhook on mattermost.
        logEvent({ category: 'APP', action: 'FIRST_TIME_LAUNCH' });
        AsyncStorage.setItem(FIRST_TIME_LAUNCH, 'true');
      }
    });
  }

  export function useNotificationsListenerHook() {
    const notificationListener = useRef() as any;
    const responseListener = useRef() as any;
    const [, setNotification] = useState<Notifications.Notification | null>(
      null,
    );
    useEffect(() => {
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          const isClicked = 'expo.modules.notifications.actions.DEFAULT';
          if (response.actionIdentifier === isClicked) {
            logEvent({
              category: 'NOTIFICATIONS',
              action: 'CLICKED',
              name: response.notification.request.identifier ?? '',

              // send the status to api
            });
            API.post({
              path: '/notification',
              body: {
                id: response.notification.request.identifier,
                status: 'CLICKED',
              },
            });
          }
        });

      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);
  }
}
