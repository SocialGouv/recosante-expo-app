import { View, Pressable, Platform } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRef, useMemo, useCallback, useEffect } from 'react';
import supPlugin from 'markdown-it-sup';
import subPlugin from 'markdown-it-sub';
import { ScrollView } from 'react-native-gesture-handler';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MyText from '~/components/ui/my-text';
import { Close } from '~/assets/icons/close';
import { DateService } from '~/services/date';
import type { RootStackParamList, RouteEnum } from '~/constants/route';
import { LineList } from '~/components/indicators/graphs/lines-list';
import { IndicatorService } from '~/services/indicator';
import { logEvent } from '~/services/logEventsWithMatomo';
import renderRules from '~/utils/md-rules';
import { LineChart } from '~/components/indicators/graphs/line';
import { cn } from '~/utils/tailwind';
import { Footer } from '~/components/footer';

const markdownItInstance = MarkdownIt({ typographer: true })
  .use(supPlugin)
  .use(subPlugin);

type IndicatorSelectorSheetProps = NativeStackScreenProps<
  RootStackParamList,
  RouteEnum.INDICATOR_DETAIL
>;

export function IndicatorDetail(props: IndicatorSelectorSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
  const isOpenedRef = useRef(false);
  const hasScrollToEnd = useRef(false);
  const hasScroll = useRef(false);
  const { indicator, day } = props.route.params;
  const currentDayIndicatorData = indicator?.[day];
  const indicatorValue = currentDayIndicatorData?.summary.value;
  const indicatorMaxValue = IndicatorService.getDataVisualisationBySlug(
    indicator.slug,
  )?.maxValue;
  const handleSheetChanges = useCallback((index: number) => {
    if (index < 0) {
      isOpenedRef.current = false;
    }
  }, []);

  const { valuesToColor } = IndicatorService.getDataVisualisationBySlug(
    indicator.slug,
  );
  const indicatorColor = valuesToColor[indicatorValue ?? 0];

  function closeBottomSheet() {
    bottomSheetRef.current?.close();
    isOpenedRef.current = false;
    props.navigation.goBack();
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
      <View className="flex items-center justify-center  border-t-2 border-app-primary bg-app-primary px-2 pb-2">
        <MyText
          font="MarianneExtraBold"
          className="text-sm uppercase text-white"
        >
          {indicator.name}
        </MyText>
        <MyText font="MarianneBold" className="pb-1 text-xs text-app-gray-100">
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
        <View className="px-4 pb-20 pt-4">
          <View className="flex flex-row flex-wrap items-start justify-start">
            <View className="items-center rounded-full">
              <MyText
                className="text-wrap  mb-2 text-[17px] uppercase text-muted"
                font="MarianneExtraBold"
              >
                {indicator.short_name} :{' '}
                {currentDayIndicatorData.summary.status}
              </MyText>
            </View>
          </View>

          {indicatorValue !== 0 && indicatorValue !== null && (
            <>
              <Title label="global" className="mt-0 border" />
              <View className="mt-2 rounded-md border border-gray-200 bg-white px-4 py-2 pr-2 pt-6">
                <LineChart
                  value={indicatorValue}
                  color={indicatorColor}
                  maxValue={indicatorMaxValue}
                />
              </View>

              {currentDayIndicatorData.values ? (
                <>
                  <Title label="Sous indicateurs" />
                  <View className="mt-2 rounded-md border border-gray-200 bg-white px-2 py-2 ">
                    <LineList
                      values={currentDayIndicatorData.values}
                      slug={indicator.slug}
                    />
                  </View>
                </>
              ) : null}
              <MyText className="mt-4" font="MarianneRegularItalic">
                Source des données :{' '}
                {
                  IndicatorService.getDataSourceByIndicator(indicator.slug)
                    .label
                }
              </MyText>

              <Title label="Nos recommandations" />
              {currentDayIndicatorData.summary?.recommendations?.map(
                (recommendation: any) => {
                  return (
                    <View
                      key={recommendation}
                      className="mt-3 flex flex-row items-center rounded-md border border-gray-200 bg-white p-2 px-3"
                    >
                      <MyText className="text-[13px] text-muted">
                        {recommendation}
                      </MyText>
                    </View>
                  );
                },
              )}
              <MyText className="mt-2" font="MarianneRegularItalic">
                Source des recommandations : Gouvernement Francais.
              </MyText>
            </>
          )}
          <Title label={indicator?.about_title} />
          <View className="mt-2 w-full overflow-hidden">
            <Markdown
              rules={renderRules}
              style={{
                sup: {
                  lineHeight: 20,
                  fontSize: 10,
                  textAlignVertical: 'top',
                  textTransform: 'uppercase',
                },
                sub: {
                  lineHeight: Platform.select({ ios: 10, android: 20 }),
                  fontSize: 10,
                  textAlignVertical: 'bottom',
                  textTransform: 'uppercase',
                },
                heading4: {
                  fontSize: 10,
                  lineHeight: 16,
                  fontFamily: 'MarianneBold',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                },
                heading3: {
                  fontSize: 12,
                  lineHeight: 20,
                  fontFamily: 'MarianneBold',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                },
                heading2: {
                  fontSize: 14,
                  lineHeight: 20,
                  fontFamily: 'MarianneBold',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                },
              }}
              markdownit={markdownItInstance}
            >
              {indicator?.about_description}
            </Markdown>
          </View>
        </View>
        <Footer />
      </ScrollView>
    </BottomSheet>
  );
}

interface TitleProps {
  label: string;
  className?: string;
}
function Title(props: TitleProps) {
  return (
    <MyText
      font="MarianneBold"
      className={cn('mt-6 text-sm uppercase', props.className)}
    >
      {props.label}
    </MyText>
  );
}
