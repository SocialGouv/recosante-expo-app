export interface NotificationType {
  id: NotificationIdEnum;
  label: string;
  description: string;
}

export enum NotificationIdEnum {
  MORNING = 'morning',
  EVENING = 'evening',
  ALERT = 'alert',
}
