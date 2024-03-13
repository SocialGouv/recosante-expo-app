import { Singular, SingularConfig } from 'singular-react-native';
const config = new SingularConfig(
  'fragile_b0f032b7',
  '878faa6f1413be1a744c78c791ef49f4',
);
export namespace SingularService {
  // To enable META Install Referrer
  config.withFacebookAppId('2091749431177634');
  // Enables deep linking
  // iOS - Enable SKAdNetwork
  config.withSkAdNetworkEnabled(true);
  // iOS - Wait 5m for tracking authorization before sending any events
  config.withWaitForTrackingAuthorizationWithTimeoutInterval(300);
}
export function init() {
  Singular.init(config);
  Singular.event('Init');
}
