import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Text,
} from 'react-native';
import MyText from '~/components/ui/my-text';
import { useUser } from '~/zustand/user/useUser';
import { type UserAddress } from '~/types/location';
import { useNavigation } from '@react-navigation/native';
import { RouteEnum } from '~/constants/route';

// Exemple de liste de villes (à remplacer par la vraie source de données)
const ALL_CITIES: UserAddress[] = [
  {
    municipality_insee_code: '75056',
    municipality_name: 'Paris',
    municipality_zip_code: '75000',
    granularity: 'city',
    title: 'Paris',
  },
  {
    municipality_insee_code: '69123',
    municipality_name: 'Lyon',
    municipality_zip_code: '69000',
    granularity: 'city',
    title: 'Lyon',
  },
  {
    municipality_insee_code: '13055',
    municipality_name: 'Marseille',
    municipality_zip_code: '13000',
    granularity: 'city',
    title: 'Marseille',
  },
  // ...
];

export function FavoriteCitiesScreen() {
  const navigation = useNavigation<any>();
  const { favoriteCities, addFavoriteCity, removeFavoriteCity, setAddress } =
    useUser();

  const handleAddCity = () => {
    navigation.navigate(RouteEnum.LOCATION, { isOnboarding: false });
  };

  const handleSelectCity = (city: UserAddress) => {
    setAddress(city);
    navigation.navigate(RouteEnum.HOME);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-app-gray px-4 pt-8">
      <MyText font="MarianneBold" className="mb-4 text-xl">
        Mes villes favorites
      </MyText>
      <FlatList
        data={favoriteCities}
        keyExtractor={(item) => item.municipality_insee_code}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="mb-2 flex-row items-center justify-between rounded-md bg-white px-4 py-3 shadow"
            onPress={() => handleSelectCity(item)}
          >
            <MyText className="text-base">{item.municipality_name}</MyText>
            <TouchableOpacity onPress={() => removeFavoriteCity(item)}>
              <Text
                style={{ fontSize: 20, color: '#FFD700', fontWeight: 'bold' }}
              >
                ★
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <MyText className="mb-4 text-muted">Aucune ville favorite</MyText>
        }
      />
      <TouchableOpacity
        className="mt-8  flex-row items-center justify-center rounded-md bg-app-primary px-6 py-3"
        onPress={handleAddCity}
      >
        <Text style={{ fontSize: 20, color: 'white', marginRight: 8 }}>+</Text>
        <MyText className="text-base font-bold text-white">
          Ajouter une ville
        </MyText>
      </TouchableOpacity>
      <TouchableOpacity
        className="mb-8 mt-8 flex-row items-center justify-center rounded-md bg-app-gray px-6 py-3"
        onPress={handleBack}
      >
        <MyText className="text-base font-bold text-app-primary">Retour</MyText>
      </TouchableOpacity>
    </View>
  );
}
