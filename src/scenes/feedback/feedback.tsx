import React, { useCallback, useRef, useEffect, useMemo } from 'react';
import { Pressable, View, ScrollView, StyleSheet } from 'react-native';
import MyText from '~/components/ui/my-text';
import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteEnum, RootStackParamList } from '~/constants/route';
import { Close } from '~/assets/icons/close';
import { InputCount } from './input-count';
import Button from '~/components/ui/button';
import { useToast } from '~/services/toast';
import API from '~/services/api';
import { MailService } from '~/services/mail';
import { logEvent } from '~/services/logEventsWithMatomo';
import { USER_ID } from '~/constants/matomo';

type InterfacePageProps = NativeStackScreenProps<
  RootStackParamList,
  RouteEnum.FEEDBACK
>;

const initialState = {
  score: 8,
  message: '',
  contact: '',
};

export function FeedbackPage(props: InterfacePageProps) {
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
    props.navigation.goBack();
  }
  function handleChange({ id, value }: { id: string; value: string | number }) {
    setValues({ ...values, [id]: value });
  }
  async function onSend() {
    const userId = await AsyncStorage.getItem(USER_ID);
    logEvent({
      category: 'FEEDBACK',
      action: 'SEND_FEEDBACK',
      name: 'SCORE',
      value: values.score,
    });
    API.post({
      path: '/feedback',
      body: {
        ...values,
      },
    });
    MailService.sendMail({
      subject: 'Feedback Recosanté',
      text: `MatomoId: ${userId}\nScore : ${values.score} \nMessage : ${values.message} \nContact : ${values.contact}`,
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
      <Pressable
        onPress={() => {
          logEvent({
            category: 'FEEDBACK',
            action: 'CLOSE_FEEDBACK',
            name: 'SCORE',
            value: values.score,
          });
          closeBottomSheet();
        }}
        className="absolute right-2 top-0"
      >
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
            onChange={(value) => {
              handleChange({
                id: 'score',
                value,
              });
            }}
          />
        </View>
        <View className="border-b border-gray-200 pb-6 pt-4">
          <MyText font="MarianneBold" className=" text-[15px] text-black">
            2. Avez-vous des suggestions pour améliorer Recosanté ?
          </MyText>
          <BottomSheetTextInput
            style={styles.textArea}
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
          <BottomSheetTextInput
            style={styles.textInput}
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
        <Button onPress={onSend} viewClassName="bg-app-primary py-4 mb-10">
          Envoyer
        </Button>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  textArea: {
    marginTop: 12,
    marginBottom: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black',
    textAlign: 'left',
  },
  textInput: {
    fontSize: 16,
    marginTop: 12,
    alignSelf: 'stretch',
    marginBottom: 12,
    padding: 12,
    minHeight: 50,
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black',
    textAlign: 'left',
  },
});
