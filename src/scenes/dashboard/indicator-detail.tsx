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
import { LineList } from '~/components/indicators/graphs/lines-list';
import { IndicatorService } from '~/services/indicator';
import { ScrollView } from 'react-native-gesture-handler';
import Markdown from 'react-native-markdown-display';
import { logEvent } from '~/services/logEventsWithMatomo';

type IndicatorSelectorSheetProps = NativeStackScreenProps<
  // @ts-expect-error TODO
  RootStackParamList,
  RouteEnum.INDICATOR_DETAIL
>;

export function IndicatorDetail(props: IndicatorSelectorSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const navigation = useNavigation();
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
  const isOpenedRef = useRef(false);
  const hasScrollToEnd = useRef(false);
  const hasScroll = useRef(false);
  const { indicator, day } = props.route.params;
  const currentDayIndicatorData = indicator?.[day];
  const indicatorValue = currentDayIndicatorData?.summary.value ?? 0;

  const handleSheetChanges = useCallback((index: number) => {
    if (index < 0) {
      isOpenedRef.current = false;
    }
  }, []);

  const { valuesToColor } = IndicatorService.getDataVisualisationBySlug(
    indicator.slug,
  );
  const indicatorColor = valuesToColor[indicatorValue];

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

  function isCloseToBottom({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 100
    ); // almost to bottom
  }

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
      ref={bottomSheetRef}
      index={2}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      onClose={closeBottomSheet}
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
      enablePanDownToClose
    >
      <View className="flex items-center justify-center border-t-2 border-app-primary bg-app-primary px-2 pb-2">
        <MyText
          font="MarianneExtraBold"
          className="text-sm uppercase text-white"
        >
          {indicator.name}
        </MyText>
        <MyText
          font="MarianneBold"
          className="mt-2 pb-1 text-xs text-app-gray-100"
        >
          Mis à jour{' '}
          {DateService.getTimeFromNow(currentDayIndicatorData.diffusion_date)}
        </MyText>
      </View>
      <Pressable onPress={closeBottomSheet} className="absolute right-2 top-0">
        <Close />
      </Pressable>
      <ScrollView
        className="flex flex-1 bg-app-gray"
        onScroll={({ nativeEvent }) => {
          if (!hasScroll.current) {
            hasScroll.current = true;
            logEvent({
              category: 'INDICATOR_DETAIL',
              action: 'SCROLL',
              name: indicator.slug.toLocaleUpperCase(),
            });
          }
          if (isCloseToBottom(nativeEvent) && !hasScrollToEnd.current) {
            hasScrollToEnd.current = true;
            logEvent({
              category: 'INDICATOR_DETAIL',
              action: 'SCROLL_TO_BOTTOM',
              name: indicator.slug.toLocaleUpperCase(),
            });
          }
        }}
        scrollEventThrottle={400}
      >
        <View className="px-6 pb-20 pt-6">
          <View className="mb-4 flex flex-row flex-wrap items-start justify-start">
            {/* <View className="mb-5 flex basis-2/3">
              <MyText
                className="text-wrap text-2xl uppercase text-black"
                font="MarianneExtraBold"
              >
                {address?.city}
              </MyText>
            </View> */}
            <View
              className="items-center rounded-full px-6 py-1"
              style={{
                backgroundColor: indicatorColor,
              }}
            >
              <MyText
                font="MarianneExtraBold"
                className="text-[13px] uppercase text-dark"
              >
                {currentDayIndicatorData.summary.status}
              </MyText>
            </View>
          </View>
          <LineChartWithCursor
            value={indicatorValue}
            slug={indicator.slug}
            showCursor={true}
          />
          <LineList
            values={currentDayIndicatorData.values}
            slug={indicator.slug}
          />
          <Title
            label={`${indicator.long_name ?? indicator.name}: ${
              currentDayIndicatorData.summary.status
            }`}
          />
          <View className="mt-2 ">
            <MyText className=" text-xs leading-5" font="MarianneRegular">
              {currentDayIndicatorData.summary.recommendations?.[0]}
            </MyText>
          </View>

          <Title label="Nos recommandations" />
          {currentDayIndicatorData.summary?.recommendations?.map(
            (recommendation) => {
              return (
                <View
                  key={recommendation}
                  className="mt-3 flex flex-row items-center rounded-2xl bg-white p-2 px-3"
                >
                  <MyText className="text-xs">{recommendation}</MyText>
                </View>
              );
            },
          )}
          <MyText className="mt-2 text-xs opacity-50" font="MarianneLight">
            Ces recommandations sont issues du Gouvernement Francais.
          </MyText>
          <Title label={indicator?.about_title} />
          <View className="mt-2 w-full overflow-hidden">
            <Markdown>{indicator?.about_description}</Markdown>
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

interface TitleProps {
  label: string;
}
function Title(props: TitleProps) {
  return (
    <MyText font="MarianneExtraBold" className=" mt-6 text-xs uppercase">
      {props.label}
    </MyText>
  );
}
