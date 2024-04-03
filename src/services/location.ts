import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { type UserAddress, type GeoApiFeature } from '~/types/location';
import { capture } from './sentry';

type LocationRequestResponse = {
  status: Location.PermissionStatus;
  location: Location.LocationObject | null;
  from?: string;
};

export namespace LocationService {
  export async function requestLocation(): Promise<LocationRequestResponse> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('status', status);
      if (status !== 'granted') {
        return {
          status,
          location: null,
        };
      }
      const requestLocationPromise = new Promise<LocationRequestResponse>(
        // eslint-disable-next-line no-async-promise-executor
        async (resolve, reject) => {
          try {
            console.log('requestLocationPromise');
            const gpsEnabled = await Location.hasServicesEnabledAsync();
            console.log('gpsEnabled', gpsEnabled);
            if (!gpsEnabled) {
              console.log('!gpsEnabled');
              resolve({
                status: Location.PermissionStatus.DENIED,
                location: null,
                from: 'gps',
              });
            }

            const lastKnownPosition =
              await Location.getLastKnownPositionAsync();
            console.log('lastKnownPosition', lastKnownPosition);
            if (lastKnownPosition) {
              console.log('lastKnownPosition');
              resolve({ status, location: lastKnownPosition, from: 'cache' });
            } else {
              console.log('else');
              const currentPosition = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
              });
              resolve({
                status,
                location: currentPosition,
                from: 'currentPosition',
              });
            }
          } catch (error) {
            reject(error);
          }
        },
      );

      const timerPromise = new Promise<LocationRequestResponse>((resolve) =>
        setTimeout(() => {
          console.log('timerPromise');
          resolve({
            status: Location.PermissionStatus.UNDETERMINED,
            location: null,
            from: 'timer',
          });
        }, 6000),
      );

      console.log('bim');
      const faster = await Promise.race([requestLocationPromise, timerPromise]);
      console.log('faster', faster);
      return faster;
    } catch (error) {
      capture(error);
    }
    console.log('return');
    return {
      status: Location.PermissionStatus.UNDETERMINED,
      location: null,
    };
  }

  export function formatPropertyToAddress(feature: GeoApiFeature): UserAddress {
    return {
      coordinates: feature?.geometry.coordinates, // Not saved in the database but used to get Udi for drinking water
      id: feature?.properties.id,
      title: feature?.properties.label, // technical field for autocomplete
      label: feature?.properties.label, // technical field for autocomplete
      municipality_name: feature?.properties.city,
      municipality_insee_code: feature?.properties.citycode,
      municipality_zip_code: feature?.properties.postcode,
    };
  }

  export async function getAdressByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<UserAddress | undefined> {
    const url = new URL('https://api-adresse.data.gouv.fr/reverse/');

    url.searchParams.append('lon', longitude.toString());
    url.searchParams.append('lat', latitude.toString());
    const response = await fetch(url).then(async (res) => await res.json());
    const currentAdress = response?.features?.[0] as GeoApiFeature;

    if (!currentAdress) {
      await new Promise((resolve) => {
        Alert.alert(
          "Désolé, votre lieu n'est pas disponible",
          'Les indicateurs fournis par Recosanté sont uniquement valable en France 🇫🇷, DOM-TOM compris',
          [
            {
              text: 'OK',
              onPress: resolve,
              style: 'cancel',
            },
          ],
        );
      });
      return undefined;
    } else {
      const formatedAdress =
        LocationService.formatPropertyToAddress(currentAdress);
      return formatedAdress;
    }
  }
}
