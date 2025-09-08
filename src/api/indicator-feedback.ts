import API from '~/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_ID } from '~/constants/matomo';

interface IndicatorFeedbackPayload {
  indicator: string;
  helpful: boolean;
  message?: string;
}

export async function sendIndicatorFeedback({
  indicator,
  helpful,
  message,
}: IndicatorFeedbackPayload) {
  try {
    const matomo_user_id = await AsyncStorage.getItem(USER_ID);

    const response = await API.post({
      path: '/feedback-indicator',
      body: {
        indicator,
        helpful,
        message,
        matomo_user_id,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending indicator feedback:', error);
    throw error;
  }
}
