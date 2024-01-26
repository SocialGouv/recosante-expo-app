import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { type Address, type Property } from '~/types/location';

export namespace LocationService {
  export async function requestLocation(): Promise<{
    status: Location.PermissionStatus;
    location: Location.LocationObject | null;
  }> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return {
        status,
        location: null,
      };
    }
    const lastKnownPosition = await Location.getLastKnownPositionAsync();
    if (lastKnownPosition) return { status, location: lastKnownPosition };
    const currentPosition = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return { status, location: currentPosition };
  }

  export function formatPropertyToAddress(property: Property): Address {
    return {
      id: property.id,
      title: property.label,
      label: property.label,
      city: property.city,
      citycode: property.citycode,
      postcode: property.postcode,
      context: property.context,
    };
  }

  export async function getAdressByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<Address | undefined> {
    const url = new URL('https://api-adresse.data.gouv.fr/reverse/');

    url.searchParams.append('lon', longitude.toString());
    url.searchParams.append('lat', latitude.toString());
    const response = await fetch(url).then(async (res) => await res.json());
    const currentAdress = response?.features[0]?.properties as Property;

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
