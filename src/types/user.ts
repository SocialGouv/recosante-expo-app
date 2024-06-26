import type { IndicatorsSlugEnum } from './indicator';
import type { NotificationIdEnum } from './notification';

export type User = {
  id: string;
  matomo_id: string;
  appversion: string;
  appbuild: string;
  appdevice: string;
  municipality_insee_code: string;
  municipality_name: string;
  municipality_zip_code: string;
  granularity: 'street' | 'city';
  udi: string;
  push_notif_token: string;
  created_at: string;
  updated_at: string;
  favorite_indicator: IndicatorsSlugEnum;
  notifications_preference: NotificationIdEnum[];
};
