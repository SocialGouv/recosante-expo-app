import NetInfo from '@react-native-community/netinfo';
import * as Sentry from '@sentry/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Matomo from './matomo';
import { MATOMO_URL, MATOMO_IDSITE } from '../config';
import API from './api';
import { MATOMO_TRACKING_ENABLED, USER_ID } from '~/constants/matomo';

// storage.delete('USER_ID');
export async function matomoInit() {
  let matomo_id = await AsyncStorage.getItem(USER_ID);
  // console.log('matomo_id', matomo_id);
  if (!matomo_id) {
    console.log('no matomo_id for matomo_id');
    matomo_id = Matomo.makeid();
    console.log('created matamo id', matomo_id);
    AsyncStorage.setItem(USER_ID, matomo_id);
    API.post({
      path: '/user',
      body: {
        matomo_id,
      },
    });
  }
  Sentry.setUser({ id: matomo_id });

  const prevVisits = await AsyncStorage.getItem('STORAGE_MATOMO_VISITS');
  const newVisits = prevVisits ? Number(prevVisits) + 1 : 1;
  AsyncStorage.setItem('STORAGE_MATOMO_VISITS', `${newVisits}`);

  Matomo.init({
    baseUrl: MATOMO_URL,
    idsite: MATOMO_IDSITE,
    userId: matomo_id,
    _idvc: newVisits,
  });

  const matomoTrackingEnabled = await AsyncStorage.getItem(
    MATOMO_TRACKING_ENABLED,
  );
  if (matomoTrackingEnabled === 'false') {
    Matomo.trackingEnabled = false;
  }

  // Matomo.setCustomDimensions({
  //   [1]: "",
  //   [2]: "",
  //   [3]: "",
  //   [4]: "",
  //   [5]: "",
  // });
}

const checkNetwork = async () => {
  const networkState = await NetInfo.fetch();
  if (!networkState.isConnected) return false;
  return true;
};

interface LogEventProps {
  category: string;
  action: string;
  name?: string;
  value?: number | null | undefined;
}
export const logEvent = async ({
  category,
  action,
  name,
  value,
}: LogEventProps): Promise<void> => {
  try {
    const canSend = await checkNetwork();
    if (!canSend) throw new Error('no network');
    // TODO: type Matomo.logEvent
    // @ts-expect-error TODO: type Matomo
    Matomo.logEvent({ category, action, name, value });
    const body = {
      event: { category, action, name, value },
      userId: Matomo.userId,
      dimensions: Matomo.dimensions,
    };
    API.post({
      path: '/event',
      body,
    });
  } catch (e) {
    console.log('logEvent error', e);
    console.log('logEvent error', { category, action, name, value });
  }
};
