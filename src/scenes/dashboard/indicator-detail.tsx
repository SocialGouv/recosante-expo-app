import { View, Pressable } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRef, useMemo, useCallback, useEffect } from 'react';
import MyText from '~/components/ui/my-text';
import { Close } from '~/assets/icons/close';
import { LineChartWithCursor } from '~/components/indicators/graphs/line-with-cursor';
import { DateService } from '~/services/date';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList, RouteEnum } from '~/constants/route';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAddress } from '~/zustand/address/useAddress';
import dayjs from 'dayjs';
import { LineList } from '~/components/indicators/graphs/lines-list';
import { IndicatorService } from '~/services/indicator';
import { ScrollView } from 'react-native-gesture-handler';

type IndicatorSelectorSheetProps = NativeStackScreenProps<
  // @ts-expect-error TODO
  RootStackParamList,
  RouteEnum.INDICATOR_DETAIL
>;

export function IndicatorDetail(props: IndicatorSelectorSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { address } = useAddress((state) => state);

  const navigation = useNavigation();
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
  const isOpenedRef = useRef(false);
  const { indicator, day } = props.route.params;
  const currentDayIndicatorData = indicator?.[day];
  const handleSheetChanges = useCallback((index: number) => {
    if (index < 0) {
      isOpenedRef.current = false;
    }
  }, []);

  const indicatorRange = IndicatorService.getDataVisualisationBySlug(
    indicator.slug,
  )?.range;
  const indicatorColor = IndicatorService.getColorForValue(
    indicator.slug,
    currentDayIndicatorData?.summary.value ?? 0,
  );

  function closeBottomSheet() {
    bottomSheetRef.current?.close();
    isOpenedRef.current = false;
    navigation.goBack();
  }

  useEffect(() => {
    bottomSheetRef.current?.expand();
  }, []);

  if (!currentDayIndicatorData) {
    return <> </>;
  }

  return (
    <View className="flex-1">
      <BottomSheet
        ref={bottomSheetRef}
        index={2}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onClose={() => {
          closeBottomSheet();
        }}
        handleStyle={{
          backgroundColor: '#3343BD',
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
        }}
        handleIndicatorStyle={{
          backgroundColor: '#ebeefa',
        }}
        enablePanDownToClose
      >
        <View className="left-0 right-0 flex items-center justify-center bg-app-primary">
          <MyText font="MarianneBold" className=" text-2xl text-white">
            {indicator.name}
          </MyText>
          <MyText font="MarianneRegular" className="pb-2 text-sm text-white">
            Mise à jour{' '}
            {DateService.getTimeFromNow(currentDayIndicatorData.diffusion_date)}
          </MyText>
        </View>
        <Pressable
          onPress={() => {
            closeBottomSheet();
          }}
          className="absolute right-2 top-0"
        >
          <Close />
        </Pressable>
        <ScrollView className="flex flex-1 bg-app-gray">
          <View className="px-6 pt-6">
            <View className="mb-4 flex flex-row items-center justify-center">
              <View>
                <MyText
                  className="text-wrap text-2xl uppercase text-black"
                  font="MarianneExtraBold"
                >
                  {indicator.short_name}
                </MyText>

                <MyText
                  className="max-w-[80%] text-xs uppercase text-gray-500"
                  font="MarianneRegular"
                >
                  {address?.label} {dayjs().format('DD/MM')}
                </MyText>
              </View>
              <View
                className="mx-auto items-center rounded-full px-6 py-1"
                style={{
                  backgroundColor: indicatorColor,
                }}
              >
                <MyText font="MarianneBold" className="uppercase">
                  {currentDayIndicatorData.summary.status}
                </MyText>
              </View>
            </View>
            <LineChartWithCursor
              value={currentDayIndicatorData.summary.value}
              slug={indicator.slug}
            />
            <LineList
              values={currentDayIndicatorData.values}
              range={indicatorRange}
              slug={indicator.slug}
            />
            <Title
              label={`Recommandation title: ${currentDayIndicatorData.summary.status}`}
            />
            <View className="mt-2 ">
              <MyText className=" text-xs">
                {currentDayIndicatorData.summary.recommendations?.[0]}
              </MyText>
            </View>

            <Title label="Nos recommandations" />
            {currentDayIndicatorData.summary?.recommendations?.map(
              (recommendation) => {
                return (
                  <View
                    key={recommendation}
                    className="mt-2 flex flex-row items-center rounded-md bg-white p-2"
                  >
                    <MyText className=" text-xs">{recommendation}</MyText>
                  </View>
                );
              },
            )}
            <Title label="A propos" />
            <MyText className=" mt-2 ">{indicator?.about_title}</MyText>
            <MyText className="mb-8 mt-2 underline">En savoir plus</MyText>

            <View className="mb-8">
              {currentDayIndicatorData.values?.map((value) => {
                return (
                  <View key={value.slug}>
                    <MyText className="capitalize">{value.name}</MyText>
                    <MyText className="mb-4 mt-2 capitalize text-gray-500">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Voluptate molestias sequi quo soluta.
                    </MyText>
                  </View>
                );
              })}
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
    <MyText font="MarianneBold" className=" mt-8 text-sm uppercase">
      {props.label}
    </MyText>
  );
}
