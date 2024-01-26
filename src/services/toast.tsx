import React, { useCallback, useRef, useState } from 'react';
import { Animated, View } from 'react-native';

import MyText from '~/components/ui/my-text';

const ViewContext = React.createContext({
  show: (caption: string | null, timeout?: number) => {},
  hide: () => {},
});

export const useToast = () => {
  const context = React.useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

const ToastProvider = (props: ToastProviderProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [caption, setCaption] = useState<string | null>('');

  const hide = useCallback(() => {
    setCaption(null);
  }, [setCaption]);

  const show = useCallback(
    (caption: string | null, timeout = 1500) => {
      const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      };

      const fadeOut = () => {
        // Will change fadeAnim value to 0 in 3 seconds
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      };
      setCaption(caption);
      fadeIn();
      setTimeout(() => {
        fadeOut();
        setTimeout(() => {
          setCaption(null);
        }, 150);
      }, timeout);
    },
    [setCaption, fadeAnim],
  );

  return (
    <ViewContext.Provider value={{ hide, show }} {...props}>
      {props.children}
      {Boolean(caption) && (
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="absolute top-[65px] flex w-full flex-row justify-center"
          pointerEvents={'box-none'}
        >
          <View className="mb-4 flex w-[90%]  items-center justify-center rounded-md  bg-white px-4 py-4 shadow-md">
            <MyText
              maxFontSizeMultiplier={2}
              testID="toast"
              className="py-2 text-center"
            >
              {caption}
            </MyText>
          </View>
        </Animated.View>
      )}
    </ViewContext.Provider>
  );
};

export default ToastProvider;
