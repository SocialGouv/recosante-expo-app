import React from 'react';
import Toast from 'react-native-toast-message';

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
  const show = React.useCallback((caption: string | null, timeout = 1500) => {
    console.log('Toast show called with:', caption);
    if (!caption) return;

    Toast.show({
      type: 'success',
      text1: caption,
      position: 'top',
      visibilityTime: timeout,
      autoHide: true,
      topOffset: 60,
    });
  }, []);

  const hide = React.useCallback(() => {
    Toast.hide();
  }, []);

  return (
    <ViewContext.Provider value={{ hide, show }} {...props}>
      {props.children}
      <Toast />
    </ViewContext.Provider>
  );
};

export default ToastProvider;
