import { Switch, View } from 'react-native';
import MyText from '~/components/ui/my-text';
import { logEvent } from '~/services/logEventsWithMatomo';
import { useUser } from '~/zustand/user/useUser';
import { CookiesIdEnum } from '~/types/cookies';

const cookies = [
  {
    id: CookiesIdEnum.META,
    label: 'Méta',
  },
  {
    id: CookiesIdEnum.GOOGLE,
    label: 'Google',
  },
];

export function CookiesList() {
  const { cookies_preference, setCookiesPreferences } = useUser(
    (state) => state,
  );
  console.log('cookies_preference', cookies_preference);
  async function toggleSwitch(id: CookiesIdEnum) {
    if (cookies_preference?.includes(id)) {
      logEvent({
        category: 'COOKIES_LIST',
        action: 'NOTIFICATION',
        name: id.toLocaleUpperCase(),
        value: 0,
      });
      setCookiesPreferences(cookies_preference.filter((item) => item !== id));
    } else {
      logEvent({
        category: 'COOKIES_LIST',
        action: 'NOTIFICATION',
        name: id.toLocaleUpperCase(),
        value: 1,
      });
      setCookiesPreferences([...cookies_preference, id]);
    }
  }

  return (
    <View className="space-y-2">
      {cookies?.map((cookie) => {
        const isEnabled = cookies_preference?.includes(cookie.id);
        return (
          <View
            key={cookie.id}
            className="mt-4 flex flex-row items-center justify-between rounded-2xl border border-app-primary  p-4"
          >
            <View className="w-5/6">
              <View>
                <MyText font="MarianneBold" className="text-sm text-black">
                  {cookie.label}
                </MyText>
              </View>
            </View>
            <View className="">
              <Switch
                style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                onValueChange={() => {
                  toggleSwitch(cookie.id);
                }}
                value={isEnabled}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}
