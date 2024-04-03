import BottomSheet from '@gorhom/bottom-sheet';
import { RouteEnum } from '~/constants/route';
import { useMemo, useRef } from 'react';

interface BottomSheetWrapperProps {
  navigation: any;
  enablePanDownToClose: boolean;
  children: React.ReactNode;
}

export function BottomSheetWrapper(props: BottomSheetWrapperProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['80%'], []);

  function closeBottomSheet() {
    bottomSheetRef.current?.close();
    props.navigation.navigate(RouteEnum.HOME);
  }

  return (
    <BottomSheet
      style={{
        backgroundColor: '#FFF',
        borderRadius: 5,
        margin: 10,
        shadowColor: '#3343BD',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 80,
        elevation: 50,
      }}
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={props.enablePanDownToClose}
      onClose={closeBottomSheet}
      backgroundStyle={{
        borderTopRightRadius: 35,
        borderTopLeftRadius: 35,
      }}
      handleStyle={{
        paddingTop: -1,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
      }}
      handleIndicatorStyle={{
        backgroundColor: '#3343BD',
        height: 5,
        width: 40,
        marginTop: 15,
      }}
    >
      {props.children}
    </BottomSheet>
  );
}
