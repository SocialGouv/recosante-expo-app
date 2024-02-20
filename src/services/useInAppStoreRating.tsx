import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import * as StoreReview from 'expo-store-review';

export function useInAppStoreRating() {
  const [isRatingVisible, setIsRatingVisible] = useState(false);
  const [isRatingDone, setIsRatingDone] = useState(false);
  const [isRatingSupported, setIsRatingSupported] = useState(false);
  const [isRatingError, setIsRatingError] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StoreReview.isAvailableAsync().then((isAvailable) => {
        setIsRatingSupported(isAvailable);
      });
    }
  }, []);

  const handleRating = useCallback(() => {
    if (Platform.OS === 'ios') {
      StoreReview.requestReview();
    } else {
      setIsRatingError(true);
    }
  }, []);

  return {
    isRatingVisible,
    setIsRatingVisible,
    isRatingDone,
    setIsRatingDone,
    isRatingSupported,
    isRatingError,
    handleRating,
  };
}
