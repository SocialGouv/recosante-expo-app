import { useState } from 'react';
import { sendIndicatorFeedback } from '~/api/indicator-feedback';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

interface UseIndicatorFeedbackProps {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useIndicatorFeedback({
  onSuccess,
  onError,
}: UseIndicatorFeedbackProps = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async (
    indicator: string,
    helpful: boolean,
    message?: string,
  ) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await sendIndicatorFeedback({
        indicator,
        helpful,
        message,
      });

      Toast.show({
        type: 'success',
        text1: 'Merci pour votre retour !',
      });

      onSuccess?.();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Une erreur est survenue',
        text2: "Impossible d'envoyer votre retour",
      });

      onError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitFeedback,
  };
}
