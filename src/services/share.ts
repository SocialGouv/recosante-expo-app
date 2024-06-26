import { Platform, Share } from 'react-native';
import { logEvent } from './logEventsWithMatomo';
import { capture } from './sentry';

export namespace ShareService {
  export async function shareApp() {
    const url = 'https://recosante.beta.gouv.fr/download';
    try {
      logEvent({
        category: 'SHARE_APP',
        action: 'PRESSED',
      });
      const result = await Share.share({
        message:
          'Bonjour, je te recommande l’application Recosanté du ministère de la santé et de l’environnement pour obtenir des informations et recommandations sur comment l’environnement impacte la santé.' +
          (Platform.OS === 'android' ? '\n' + url : ''),
        url: Platform.OS === 'ios' ? url : undefined,
      });
      if (result?.action === Share.sharedAction) {
        if (result?.activityType) {
          logEvent({
            category: 'SHARE_APP',
            action: 'SHARED',
            name: result?.activityType.toLocaleUpperCase(),
          });
        } else {
          logEvent({
            category: 'SHARE_APP',
            action: 'SHARED',
          });
        }
      } else if (result.action === Share.dismissedAction) {
        logEvent({
          category: 'SHARE_APP',
          action: 'DISMISSED',
        });
      }
    } catch (error: any) {
      capture('share app failure ' + error);
      logEvent({
        category: 'SHARE_APP',
        action: 'ERROR',
      });
    }
  }
}
