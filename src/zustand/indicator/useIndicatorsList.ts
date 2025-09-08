import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type IndicatorItem } from '~/types/indicator';
import { INDICATOR_STORAGE } from '~/constants/indicator';
import API from '~/services/api';

interface State {
  indicators: IndicatorItem[];
  favoriteIndicators: IndicatorItem[];
  setFavoriteIndicators: (indicators: IndicatorItem[]) => void;
  setIndicatorsList: (indicators: IndicatorItem[]) => void;
  _hasHydrated: boolean;
  setHasHydrated: (hydrationState: boolean) => void;
  reset: () => void;
}

export const useIndicatorsList = create<State>()(
  persist(
    (set, _get) => ({
      indicators: [],
      favoriteIndicators: [],
      setIndicatorsList: async (indicators) => {
        set({ indicators });
      },
      setFavoriteIndicators: async (favoriteIndicators) => {
        console.log('setFavoriteIndicators', favoriteIndicators);
        set({ favoriteIndicators });
        API.put({
          path: '/user',
          body: {
            favorite_indicators: favoriteIndicators.map((i) => i.slug),
          },
          // TODO: handle error
        });
      },
      _hasHydrated: false,
      setHasHydrated: (hydrationState) => {
        set({
          _hasHydrated: hydrationState,
        });
      },
      reset: () => {
        set({ indicators: [], favoriteIndicators: [] });
        API.get({ path: '/indicators/list' }).then((response) => {
          const indicators = response.data as IndicatorItem[];
          set({ indicators });
        });
      },
    }),
    {
      name: INDICATOR_STORAGE,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        API.get({ path: '/indicators/list' }).then((response) => {
          const indicators = response.data as IndicatorItem[];
          state?.setIndicatorsList(indicators);
        });
        if (state?.favoriteIndicators && state.favoriteIndicators.length > 0) {
          API.put({
            path: '/user',
            body: {
              favorite_indicators: state.favoriteIndicators.map((i) => i.slug),
            },
          });
        }
      },
    },
  ),
);
