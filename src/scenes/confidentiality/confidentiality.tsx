import React, {
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Pressable, View, ScrollView } from 'react-native';
import MyText from '~/components/ui/my-text';
import BottomSheet from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { Close } from '~/assets/icons/close';
import { Switch } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_MATOMO_ID } from '~/constants/matamo';
import { initMatomo } from '~/services/logEventsWithMatomo';

interface LocationPageProps {
  navigation: any;
  route: any;
}

export function ConfidentialityPage(props: LocationPageProps) {
  const navigation = useNavigation();

  const [state, setState] = useState({
    matomoActive: true,
  });
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['80%'], []);
  const isOpenedRef = useRef(false);

  async function getMatomoId() {
    return await AsyncStorage.getItem(STORAGE_MATOMO_ID);
  }

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

  useEffect(() => {
    bottomSheetRef.current?.expand();
    getMatomoId().then((matomoId) => {
      if (matomoId) {
        setState({
          matomoActive: true,
        });
      } else {
        setState({
          matomoActive: false,
        });
      }
    });
  }, []);

  function handleSwitchChange() {
    if (state.matomoActive) {
      AsyncStorage.removeItem(STORAGE_MATOMO_ID);
    } else {
      initMatomo();
    }
    setState({
      matomoActive: !state.matomoActive,
    });
  }

  return (
    <View className="bg-red flex-1">
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
            Politique de confidentialité
          </MyText>
        </View>
        <Pressable
          onPress={closeBottomSheet}
          className="absolute right-2 top-0"
        >
          <Close />
        </Pressable>

        <ScrollView className="flex flex-1 bg-app-gray">
          <View className="px-4 pb-20 pt-6">
            <Title label="Qui est responsable de Recosanté ?" />
            <MyText font="MarianneRegular" className="mt-2 text-xs">
              Recosanté est développé au sein de la Fabrique numérique des
              ministères sociaux. La Direction générale de la santé (DGS) et la
              Direction générale de la prévention des risques (DGPR) sont les
              responsables du traitement de vos données à caractère personnel.
            </MyText>
            <Title label="Quel est l’objectif de Recosanté ? " />
            <MyText font="MarianneRegular" className="mt-2 text-xs">
              Transmettre des informations et des recommandations aux
              utilisateurs pour les aider à se protéger des impacts
              environnementaux sur leur santé.
            </MyText>
            <Title label="Confidentialité" />
            <MyText font="MarianneRegular" className="mt-2 text-xs">
              L’application Recosanté ne traite pas de données à caractère
              personnel, nous ne sommes pas en mesure de vous identifier ou vous
              réidentifier. Nous collectons uniquement les données de navigation
              anonymisées et les villes. Toutefois, les données de
              géolocalisation à l’échelle de la rue restent stockées sur votre
              appareil dans le but de vous proposer un historique.
            </MyText>
            <MyText font="MarianneRegular" className="mt-2 text-xs">
              Nous utilisons Matomo, une solution de mesure d’audience,
              configuré en mode « exempté » et ne nécessitant pas le recueil de
              votre consentement car votre adresse IP est anonymisée,
              conformément aux recommandations de la CNIL. Dès lors, aucune
              donnée à caractère personnel vous concernant n'est traitée.
            </MyText>
            <MyText font="MarianneRegular" className="mt-2 text-xs">
              Pour toute demande, vous pouvez écrire un email à l’équipe
              Recosanté: contact@recosante.beta.gouv.fr
            </MyText>
            <View className="mt-8 w-full flex-row items-center justify-between rounded-xl  border border-gray-300 p-2 ">
              <Switch
                className=" w-1/5"
                style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                onValueChange={handleSwitchChange}
                value={state.matomoActive}
              />
              <MyText
                font="MarianneRegular"
                className="wrap text-wrap w-4/5	 text-[12px]"
              >
                Vous êtes suivis de manière anonyme.{'\n'}Décochez la case pour
                ne pas être suivi même anonymement.
              </MyText>
            </View>
          </View>
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

interface TitleProps {
  label: string;
}
function Title(props: TitleProps) {
  return (
    <MyText font="MarianneExtraBold" className="mt-6 text-sm uppercase">
      {props.label}
    </MyText>
  );
}
