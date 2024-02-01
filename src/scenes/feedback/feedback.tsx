import React, { useCallback, useRef, useEffect, useMemo } from 'react';
import {
  Pressable,
  View,
  ScrollView,
  TextInput,
  TextInputChangeEventData,
  NativeSyntheticEvent,
} from 'react-native';
import MyText from '~/components/ui/my-text';
import BottomSheet from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { Close } from '~/assets/icons/close';
import { InputCount } from './input-count';
import Button from '~/components/ui/button';
import { useToast } from '~/services/toast';
import API from '~/services/api';
import { MailService } from '~/services/mail';

interface LocationPageProps {
  navigation: any;
  route: any;
}

const initialState = {
  score: 8,
  message: '',
  contact: '',
};

export function FeedbackPage(props: LocationPageProps) {
  const navigation = useNavigation();
  const { show } = useToast();
  const [values, setValues] = React.useState(initialState);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['90%'], []);
  const isOpenedRef = useRef(false);

  const handleSheetChanges = useCallback((index: number) => {
    if (index < 0) {
      isOpenedRef.current = false;
    }
  }, []);

  function closeBottomSheet() {
    bottomSheetRef.current?.close();
    isOpenedRef.current = false;
    navigation.goBack();
  }
  function handleChange({ id, value }: { id: string; value: string | number }) {
    setValues({ ...values, [id]: value });
  }
  function onSend() {
    API.post({
      path: '/feedback',
      body: {
        ...values,
      },
    });
    MailService.sendMail({
      subject: 'Feedback Recosanté',
      text: `Score : ${values.score} \nMessage : ${values.message} \nContact : ${values.contact}`,
    }).then((res) => {
      if (res.ok) {
        closeBottomSheet();
        show('💌 Message envoyé, Merci pour votre retour !', 4000);
      } else {
        show('Une erreur est survenue, veuillez réessayer plus tard', 4000);
      }
    });
  }

  useEffect(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <BottomSheet
      style={{
        backgroundColor: '#3343BD',
        borderRadius: 35,
        shadowColor: '#3343BD',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.7,
        shadowRadius: 20,
        elevation: 2,
      }}
      enablePanDownToClose={true}
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      onClose={() => {
        closeBottomSheet();
      }}
      backgroundStyle={{
        borderTopRightRadius: 35,
        borderTopLeftRadius: 35,
      }}
      handleStyle={{
        backgroundColor: '#3343BD',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
      }}
      handleIndicatorStyle={{
        backgroundColor: 'white',
        height: 7,
        width: 83,
      }}
    >
      <View className="-mt-2 flex items-center justify-center border-t border-app-primary bg-app-primary p-2 pb-6">
        <MyText font="MarianneBold" className="text-xl text-white">
          Améliorons ensemble Recosanté
        </MyText>
        <MyText font="MarianneRegular" className=" text-white">
          en 20 secondes !
        </MyText>
      </View>
      <Pressable onPress={closeBottomSheet} className="absolute right-2 top-0">
        <Close />
      </Pressable>

      <ScrollView className="flex flex-1 bg-app-gray px-4">
        <View className="border-b border-gray-200 pb-6 pt-4">
          <MyText font="MarianneBold" className=" text-[15px] text-black">
            1. Ce service vous a-t-il été utile ?
          </MyText>
          <InputCount
            max={10}
            value={values.score}
            onChange={(value) =>
              handleChange({
                id: 'score',
                value,
              })
            }
          />
        </View>
        <View className="border-b border-gray-200 pb-6 pt-4 ">
          <MyText font="MarianneBold" className=" text-[15px] text-black">
            2. Avez-vous des suggestions pour améliorer Recosanté ?
          </MyText>
          <TextInput
            value={values.message}
            onChange={(event) => {
              handleChange({
                id: 'message',
                value: event.nativeEvent.text,
              });
            }}
            multiline={true}
            numberOfLines={10}
            className="mt-4 h-24  rounded-lg bg-white px-4 py-4"
            placeholderTextColor="#9C9C9C"
            placeholder="Un besoin sur de nouveaux indicateurs ? Une amélioration sur l'interface ? (facultatif)"
          />
        </View>
        <View className="border-b border-gray-200 pb-6 pt-4 ">
          <MyText font="MarianneBold" className=" text-[15px] text-black">
            3. Peut-on vous recontacter pour en savoir plus ?
          </MyText>
          <TextInput
            value={values.contact}
            onChange={(event) => {
              handleChange({
                id: 'contact',
                value: event.nativeEvent.text,
              });
            }}
            autoComplete="email"
            autoCapitalize="none"
            placeholderTextColor="#9C9C9C"
            className="mt-4 rounded-lg bg-white px-4 py-4"
            placeholder="Votre numéro de téléphone ou adresse mail (facultatif)"
          />
        </View>
        <Button onPress={onSend} viewClassName="bg-app-primary py-4">
          Envoyer
        </Button>
      </ScrollView>
    </BottomSheet>
  );
}
