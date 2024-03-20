import * as Sentry from '@sentry/react-native';
import { matomoInit, logEvent } from '~/services/logEventsWithMatomo';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import API from './api';

export namespace InitializationService {
  export function initSentry() {
    Sentry.init({
      dsn: 'https://011d0bf5c5f24f5eb273e83fed66e5eb@sentry.fabrique.social.gouv.fr/94',
      enabled: !__DEV__,
      debug: !__DEV__,
      tracesSampleRate: 0.05,
    });
  }
  export function initMatomo() {
    matomoInit();
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
