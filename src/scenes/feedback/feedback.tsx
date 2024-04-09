import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import MyText from '~/components/ui/my-text';
import * as Notifications from 'expo-notifications';
import appJson from '~/../app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '~/components/ui/button';
import { useToast } from '~/services/toast';
import API from '~/services/api';
import { MailService } from '~/services/mail';
import { logEvent } from '~/services/logEventsWithMatomo';
import { USER_ID } from '~/constants/matomo';
import { useUser } from '~/zustand/user/useUser';
import { Score } from './score';
import { cn } from '~/utils/tailwind';
import { TouchableOpacity } from 'react-native-gesture-handler';

const initialState = {
  helpful: 'pas de réponse',
  message: '',
  contact: '',
};

interface FeedbackProps {
  navigation: any;
}

export function FeedbackPage(props: FeedbackProps) {
  const { show } = useToast();
  const { address, notifications_preference } = useUser((state) => state);
  const [values, setValues] = React.useState(initialState);

  function handleChange({ id, value }: { id: string; value: string | number }) {
    setValues({ ...values, [id]: value });
  }
  async function onSend() {
    const userId = await AsyncStorage.getItem(USER_ID);
    logEvent({
      category: 'FEEDBACK',
      action: 'SEND_FEEDBACK',
    });
    API.post({
      path: '/feedback',
      body: {
        ...values,
      },
    }).then((res) => {
      if (res.ok) {
        setValues(initialState);
        props.navigation.goBack();
      } else {
        show('Une erreur est survenue, veuillez réessayer plus tard', 4000);
      }
    });
    const notifs = await Notifications.getPermissionsAsync();
    const textEmail = `
    Message : ${values.message}
    ---
    MatomoId : ${userId}
    Ville: ${address?.municipality_insee_code} - ${address?.municipality_name}
    Notifications : ${notifications_preference?.join(', ')}
    Notifications activées : ${notifs.status === 'granted' ? 'Oui' : 'Non'}
    Application utile : ${values.helpful}
    Contact : ${values.contact}
    Device : ${Platform.OS}
    Device Version : ${Platform.Version}
    App Version : ${appJson.expo.version} (${Platform.select({
      ios: appJson.expo.ios.buildNumber,
      android: `${appJson.expo.android.versionCode}`,
    })})
`;

    MailService.sendMail({
      subject: 'Feedback Recosanté',
      text: textEmail,
    }).then((res) => {
      if (res.ok) {
        show('💌 Message envoyé, Merci pour votre retour !', 4000);
      } else {
        show('Une erreur est survenue, veuillez réessayer plus tard', 4000);
      }
    });
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className=" flex  flex-1 bg-app-gray px-6">
        <MyText font="MarianneRegular" className="text-xl">
          Donnez votre avis et améliorons ensemble Recosante.
        </MyText>
        <MyText font="MarianneRegular" className="mt-1 text-[14px]">
          Moins de 20 secondes.
        </MyText>
        <View className="mt-12 border-b border-gray-200 pb-6">
          <MyText font="MarianneRegular" className=" text-[15px] text-black">
            L'application est utile ?
          </MyText>

          <Score
            selected={values.helpful}
            handleSelect={(value) => {
              handleChange({
                id: 'helpful',
                value,
              });
            }}
          />
        </View>
        <View className="border-b border-gray-200 pb-6 pt-4">
          <MyText font="MarianneRegular" className=" text-[15px] text-black">
            Avez-vous des suggestions pour l'améliorer ?
          </MyText>
          <TextInput
            focusable
            style={styles.textArea}
            value={values.message}
            onChange={(event) => {
              handleChange({
                id: 'message',
                value: event.nativeEvent.text,
              });
            }}
            multiline={true}
            className={cn(
              'mt-2 h-24  rounded-sm border border-gray-200 bg-white px-4 py-4',
            )}
            placeholderTextColor="#9C9C9C"
            placeholder={
              "Un besoin sur de nouveaux indicateurs ?\nUne amélioration sur l'interface ? (facultatif)"
            }
          />
        </View>
        <View className="pb-6 pt-4 ">
          <MyText font="MarianneRegular" className=" text-[15px] text-black">
            Peut-on vous recontacter pour en savoir plus ?
          </MyText>
          <TextInput
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
            className="mt-2 rounded-sm border border-gray-200 bg-white px-4 py-4"
            placeholder="Téléphone ou adresse mail (facultatif)"
          />
        </View>
        <View className="flex-row items-center  justify-end">
          <TouchableOpacity
            onPress={() => {
              setValues(initialState);
              props.navigation.goBack();
            }}
          >
            <MyText className="mr-8 text-sm text-app-primary">Annuler</MyText>
          </TouchableOpacity>
          <Button onPress={onSend} viewClassName="bg-app-primary   rounded-sm ">
            Envoyer
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textArea: {
    backgroundColor: 'white',
    color: 'black',
    textAlign: 'left',
  },
  textInput: {
    minHeight: 50,
    backgroundColor: 'white',
    color: 'black',
    textAlign: 'left',
  },
});
