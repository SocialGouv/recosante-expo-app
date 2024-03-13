import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MUNICIPALITY_FULL_NAME, USER_STORAGE } from '~/constants/municipality';
import API from '~/services/api';
import { type UserAddress } from '~/types/location';
import { type User } from '~/types/user';
import { NotificationIdEnum } from '~/types/notification';
import { CookiesIdEnum } from '~/types/cookies';

interface UserState {
  address: UserAddress | null;
  setAddress: (location: UserAddress) => void;
  notifications_preference: NotificationIdEnum[];
  cookies_preference: CookiesIdEnum[];
  setCookiesPreferences: (cookies: CookiesIdEnum[]) => void;
  setNotificationsPreferences: (notifications: NotificationIdEnum[]) => void;
  _hasHydrated: boolean;
  setHasHydrated: (hydrationState: boolean) => void;
}

const setUser = (
  set: (fn: (state: UserState) => UserState) => void,
  user: User,
) => {
  set((state) => ({
    ...state,
    address: {
      municipality_insee_code: user.municipality_insee_code,
      municipality_name: user.municipality_name,
      municipality_zip_code: user.municipality_zip_code,
    },
    notifications_preference: user.notifications_preference,
    cookies_preference: user.cookies_preference,
  }));
};

export const useUser = create<UserState>()(
  persist(
    (set, _get) => ({
      address: null,
      setAddress: async (address) => {
        API.put({
          path: '/user',
          body: {
            municipality_insee_code: address.municipality_insee_code,
            municipality_name: address.municipality_name,
            // can't send municipality_full_name to the DB for GDPR purposes
            // municipality_full_name: address.municipality_full_name,
            municipality_zip_code: address.municipality_zip_code,
          },
        }).then((res) => {
          // user reconciliation
          if (res.data) {
            AsyncStorage.setItem(
              MUNICIPALITY_FULL_NAME,
              address.title ?? '',
            ).then(() => {
              const user: User = res.data;
              setUser(set, user);
            });
          }
        });
      },
      cookies_preference: [CookiesIdEnum.META, CookiesIdEnum.GOOGLE],
      notifications_preference: [
        NotificationIdEnum.MORNING,
        NotificationIdEnum.EVENING,
        NotificationIdEnum.ALERT,
      ],
      setCookiesPreferences: async (cookies_preference) => {
        set({ cookies_preference });
      },
      setNotificationsPreferences: async (notifications_preference) => {
        set({ notifications_preference });
        API.put({
          path: '/user',
          body: {
            notifications_preference,
          },
        }).then((res) => {
          // user reconciliation
          if (res.data) {
            const user: User = res.data;
            setUser(set, user);
          }
        });
      },
      _hasHydrated: false,
      setHasHydrated: (hydrationState) => {
        set({
          _hasHydrated: hydrationState,
        });
      },
    }),
    {
      name: USER_STORAGE,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        if (state?.address?.municipality_insee_code) {
          API.put({
            path: '/user',
            body: {
              municipality_insee_code: state.address.municipality_insee_code,
              municipality_name: state.address.municipality_name,
              municipality_zip_code: state.address.municipality_zip_code,
            },
          }).then((res) => {
            // user reconciliation
            if (res.data) {
              const user: User = res.data;
              state.address = {
                municipality_insee_code: user.municipality_insee_code,
                municipality_name: user.municipality_name,
                municipality_zip_code: user.municipality_zip_code,
              };
              state.setNotificationsPreferences(user.notifications_preference);
              state.setCookiesPreferences(user.cookies_preference);
            }
          });
        }
      },
    },
  ),
);
