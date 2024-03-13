import { Alert, Linking, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fetchRetry from 'fetch-retry';
import * as StoreReview from 'expo-store-review';
import appJson from '~/../app.json';
import { getRoute } from './navigation';
import { API_SCHEME, API_HOST } from '../config';
import { USER_ID } from '~/constants/matomo';
import { ERROR_NO_NETWORK } from '~/constants/errors';
import { logEvent } from './logEventsWithMatomo';

// AsyncStorage.clear();

export const checkNetwork = async (test = false) => {
  const isConnected = await NetInfo.fetch().then((state) => state.isConnected);
  if (!isConnected || test) {
    await new Promise((res) => setTimeout(res, 1500));
    // Alert.alert('Pas de réseau', 'Veuillez vérifier votre connexion');
    return false;
  }
  return true;
};

class ApiService {
  scheme = API_SCHEME;
  host = API_HOST;
  getUrl = (path, query) => {
    const url = new URL(path, `${this.scheme}://${this.host}`);
    Object.keys(query).forEach((key) => {
      url.searchParams.append(key, query[key]);
    });
    return url.toString();
  };

  fetch = fetchRetry(fetch);
  execute = async ({
    method = 'GET',
    path = '',
    query = {},
    headers = {},
    body = null,
  }) => {
    try {
      const matomo_id = await AsyncStorage.getItem(USER_ID);
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          appversion: appJson.expo.version,
          appbuild: Platform.select({
            ios: `${appJson.expo.ios.buildNumber}`,
            android: `${appJson.expo.android.versionCode}`,
          }),
          appdevice: Platform.OS,
          currentroute: getRoute(),
          authorization: matomo_id,
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
        retries: method === 'GET' ? 3 : 0,
        retryDelay: 800,
      };

      const url = this.getUrl(path, query);
      // console.log('url: ', url);
      const canFetch = await checkNetwork();
      if (!canFetch) return { ok: false, error: ERROR_NO_NETWORK };

      const response = await this.fetch(url, config);

      if (response.json) {
        try {
          const readableRes = await response.json();
          if (readableRes.askForReview) {
            setTimeout(() => {
              StoreReview.isAvailableAsync().then((isAvailable) => {
                if (isAvailable) {
                  StoreReview.requestReview().then(() => {
                    logEvent({
                      category: 'STORE_REVIEW',
                      action: 'ASKED_FROM_API',
                    });
                  });
                }
              });
            }, 2000);
          }
          if (readableRes.sendInApp) {
            const [title, subTitle, actions = [], options = {}] =
              readableRes.sendInApp;
            if (!actions?.length) {
              Alert.alert(title, subTitle);
            } else {
              const actionsWithNavigation = actions.map((action) => {
                if (action.navigate) {
                  action.onPress = () => {
                    navigationRef?.navigate(...action.navigate);
                    if (action.event) logEvent(action.event);
                  };
                }
                if (action.link) {
                  action.onPress = () => {
                    Linking.openURL(action.link);
                    if (action.event) logEvent(action.event);
                  };
                }
                return action;
              });
              Alert.alert(title, subTitle, actionsWithNavigation, options);
            }
          }
          return readableRes;
        } catch (e) {
          console.log('ERROR IN RESPONSE JSON', response);
          console.log(e);
        }
      }

      return response;
    } catch (e) {
      console.log(' error in api');
      console.log(e);
      return {
        ok: false,
        error:
          "Veuillez nous excuser, cette erreur est inattendue : l'équipe technique a été prévenue. Veuillez retenter dans quelques instants ou nous contacter si l'erreur persiste.",
      };
    }
  };

  get = async (args) => await this.execute({ method: 'GET', ...args });
  post = async (args) => await this.execute({ method: 'POST', ...args });
  put = async (args) => await this.execute({ method: 'PUT', ...args });
  delete = async (args) => await this.execute({ method: 'DELETE', ...args });
}

const API = new ApiService();
export default API;
