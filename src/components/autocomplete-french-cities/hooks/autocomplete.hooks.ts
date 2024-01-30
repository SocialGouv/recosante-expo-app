import { useState, useRef, useCallback } from 'react';
import { LocationService } from '~/services/location';
import { type GeoApiFeature, type UserAddress } from '~/types/location';

export function useAutoComplete() {
  const [loading, setLoading] = useState(false);
  const [addressList, setAddressList] = useState<UserAddress[]>([]);
  const dropdownController = useRef(null);
  const searchRef = useRef(null);

  const getSuggestions = useCallback(async (query: string | number) => {
    if (typeof query !== 'string' || query.length < 3) {
      setAddressList([]);
      return;
    }

    const search = query.toLowerCase();
    setLoading(true);
    const url = new URL('https://api-adresse.data.gouv.fr/search/');
    url.searchParams.append('q', search);

    const response = await fetch(url);
    const items = await response.json();
    const geoApiReponse: Array<UserAddress> = items.features.map(
      (feature: GeoApiFeature) => {
        return LocationService.formatPropertyToAddress(feature.properties);
      },
    );
    setAddressList(geoApiReponse);
    setLoading(false);
  }, []);

  const onClearPress = useCallback(() => {
    setAddressList([]);
  }, []);

  const onOpenSuggestionsList = useCallback(() => {}, []);

  return {
    addressList,
    loading,
    getSuggestions,
    dropdownController,
    searchRef,
    onClearPress,
    onOpenSuggestionsList,
  };
}
