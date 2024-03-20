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
import { LineChartWithCursor } from '~/components/indicators/graphs/line-with-cursor';
import { DateService } from '~/services/date';
import type { RootStackParamList, RouteEnum } from '~/constants/route';
import { LineList } from '~/components/indicators/graphs/lines-list';
import { IndicatorService } from '~/services/indicator';
import { logEvent } from '~/services/logEventsWithMatomo';
import renderRules from '~/utils/md-rules';

import Svg, { Path } from 'react-native-svg';

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
      <View className="flex items-center justify-center border-t-2 border-app-primary bg-app-primary px-2 pb-2">
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
        <View className="px-6 pb-20 pt-6">
          <View className="mb-4 flex flex-row flex-wrap items-start justify-start">
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

          {indicatorValue != null && (
            <>
              <LineChartWithCursor
                value={indicatorValue}
                slug={indicator.slug}
                showCursor={true}
              />
              <LineList
                values={currentDayIndicatorData.values}
                slug={indicator.slug}
              />
              <MyText className="mt-4" font="MarianneRegularItalic">
                Source des données :{' '}
                {
                  IndicatorService.getDataSourceByIndicator(indicator.slug)
                    .label
                }
              </MyText>
              {/* <Image
                className="mt-2 h-12 w-16"
                source={
                  IndicatorService.getDataSourceByIndicator(indicator.slug).logo
                }
                contentFit="contain"
                transition={1000}
              /> */}

              <Title label="Nos recommandations" />
              {currentDayIndicatorData.summary?.recommendations?.map(
                (recommendation) => {
                  return (
                    <View
                      key={recommendation}
                      className="mt-3 flex flex-row items-center rounded-2xl bg-white p-2 px-3"
                    >
                      <MyText>{recommendation}</MyText>
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
          <View className="-mb-8 h-28 flex-1">
            <GouvLogo />
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
    <MyText font="MarianneBold" className=" mt-6 text-sm uppercase">
      {props.label}
    </MyText>
  );
}

function GouvLogo() {
  return (
    <Svg viewBox="0 0 8500 7670">
      <Path fill="transparent" d="M0 0h8500v7670H0z" />
      <Path
        d="M2145 1884c11-11 22-22 32-34 20-23 40-44 63-64 7-6 14-12 21-16 2-2 2-6 4-8-9 4-15 11-25 15-2 0-4-2-2-4 7-5 14-10 20-15h-1c-2 0-2-2-2-4-25-4-43 13-60 28-4 2-8-2-9-2-28 9-49 34-77 45v-4c-11 4-22 11-34 13-17 4-32 2-47 2-23 2-46 7-69 12-1 0-1 0-2 1-12 3-24 8-35 14l-4 4c-4 4-8 9-13 11-12 6-21 16-31 25-1 1-2 1-3 1-10 10-20 20-30 29-1 1-4 1-6 1 0-1 1-1 1-2 2-3 3-5 5-8l6-9c3-4 5-8 8-11 1-1 1-2 0-2-1-1-2-1-3-1 9-9 21-17 32-24-1 0-3-1-2-2 1-2 2-3 3-5 0-1 0-1 1-2 0-1-1-1-1-2l-9 6c-5 4-8 12-15 12h-3c-1 0-2 0-2-1v-1c0-1 1-1 1-2s1-1 1-2c0 0 0-1 1-1 0-1 1-2 1-2 0-1 1-1 1-2 1-1 2-3 2-4s1-1 1-2c1-1 1-2 2-3 1-2 0-3-1-3 3-5 8-8 13-11h-1c7-4 15-8 22-12l3-3c-11 4-20 9-30 15 0 0-2 1-3 2 0 0-2 1-5-2v-1c2-4 8-6 11-9 2 0 4 0 4 2 61-47 144-36 214-60 6-4 11-8 17-11 9-4 17-13 28-19 15-11 26-25 32-43 0-2-2-4-2-4-25 26-53 47-83 62-40 21-83 17-125 23 2-4 6-4 9-4 0-6 4-8 8-11h6c2 0 2-4 4-4 4 0 10-2 8-2-6-8-17 6-26 0 4-4 2-9 6-11h8c0-4 4-8 4-8 28-17 55-30 81-45-6 0-9 6-15 2 4 0 0-6 4-6 21-6 38-17 59-25-8 0-13 6-21 0 4-2 6-6 11-6v-6c0-2 2-2 4-2-2 0-4-2-4-2 2-4 8-2 11-6-2 0-6 0-6-2 6-8 15-9 25-11-2-4-8 0-8-4 0-2 2-2 4-2h-4c-4-2-2-6-2-8 11-13 11-30 17-45-2 0-4 0-4-2-19 21-49 28-77 36h-13c-9 4-23 4-32-2-8-4-11-9-19-15-15-9-30-17-47-23-47-15-96-23-145-21 21-11 44-12 66-19 32-9 62-21 96-19-6-2-13 0-19 0-26-2-53 6-81 11-19 4-36 11-55 15-11 4-17 15-30 13v-6c19-23 42-45 72-47 34-6 66 0 100 4 25 2 47 8 72 13 9 0 11 15 19 17 11 4 23 0 34 8 0-4-2-8 0-11 8-8 17 2 25-2 15-9-13-26-21-40 0-2 2-4 2-4 15 13 26 28 45 38 9 4 32 9 28-2-9-21-28-38-44-57v-8c-4 0-4-2-6-4v-8c-8-4-6-11-9-17-6-9-2-23-6-34s-6-21-8-32c-6-32-13-60-17-91-4-36 21-64 38-96 13-23 28-45 53-60 6-23 21-42 36-60s40-30 58-38c26-12 50-19 50-19H1000v1000h927c36-26 72-38 122-63 24-10 78-35 96-53m-290-136c-4 0-11 2-9-2 2-9 15-9 23-13 4-2 9-6 13-4 4 6 9 4 13 8-12 11-27 6-40 11m-290-41s-2-2-2-4c25-32 43-62 61-96 25-13 45-32 64-53 32-34 66-64 106-83 15-6 34-4 49 2-6 8-15 6-23 11-2 0-4 0-6-2 2-2 2-4 2-6-19 21-45 30-60 55-11 19-19 43-43 49-8 2 2-6-2-4-59 36-100 80-146 131m157-125c-2 4-4 4-6 8s-4 6-8 8c-2 0-4 0-4-2 2-8 8-15 15-17 3-1 3 1 3 3m88 283c-1 2-3 4-5 6 2 0 4 2 2 3-4 4-9 8-14 10h-3c-2 2-5 4-7 7-2 2-13 1-10-2 5-4 9-9 14-13 3-2 6-5 8-8 1-2 2-3 4-4 3-2 13-3 11 1m-34-15c-8 5-15 10-22 15-8 5-17 8-25 12-1-1-2-1-3-1-7 4-13 9-19 15l-3 3-3 3-4 4c-1 1-1 2-3 3-1 1-4 1-4-1-1 1-2 1-3 2s-2 1-3 2h-2c-2 2-5 4-7 6-4 4-8 7-11 12v1l-1 1s0 1-1 1c0 1-1 1-1 2 0 0-1 1-2 1l-1-1s0-1-1-1c-1-1-1-2-2-3v-1c2-2 4-4 6-7 1-1 1-2 2-2 1-1 2-3 3-4 0-1 1-1 1-2 2-3 4-5 6-8l1-1c1-1 2-3 3-4s1-2 2-4v-1c1-2 1-3 2-4v-1c0-1 0-1 1-2 0-1 0-2 1-3v-1c2-4 5-7 8-10h-1c-3 2-5 4-7 6s-6-1-3-3c2-1 3-3 4-4 3-3 6-7 10-10 2-2 4-3 6-4l1-1c1-2 3-3 4-5 18-17 49-17 72-28 9-4 21 2 30 0 6 0 11 0 17 4-17 3-32 14-48 24m39-132c-2-2 6 0 8-4h-15c-2 0-2-2-2-4-9 2-21 6-30 8-13 4-25 13-40 17-21 8-38 25-60 32-2 0-2-2-2-4 2-6 9-8 13-13 0-2 0-4-2-4 15-21 36-32 55-49v-6c6-8 15-11 19-21 2-6 10-13 19-17-2-2-6-2-6-6-8 0-15 4-23-2 4-3 8-5 12-7-2 0-3-1-4-3-2-4 4-8 9-9 8-2 17-2 23-8-13-2-28 4-42-4 9-25 25-45 47-57 2 0 6 0 6 2 0 9-6 17-15 19 15 4 30 4 45 11-2 4-6 2-8 2 9 6 21 2 30 9-6 6-11 0-17 0 59 17 121 30 170 68-42 21-85 30-130 40-6 0-9 0-15-2 0 2 0 6-2 6-8 0-13 0-19 4-7 6-18 8-24 2"
        fill="#000091"
      />
      <Path
        d="M3755 1000H2681s2 0 10 5c9 5 20 11 27 14 14 7 27 16 36 30 4 6 9 17 6 25-4 9-6 25-15 28-11 6-26 6-40 4-8 0-15-2-23-4 28 11 55 25 74 51 2 4 9 6 17 6 2 0 2 4 2 6-4 4-8 6-6 11h6c9-4 8-23 21-17 9 6 13 19 8 28-8 8-15 13-23 19-2 4-2 9 0 13 6 8 8 15 9 23 6 13 8 28 13 42 8 28 15 57 13 85 0 15-8 28-2 43 4 15 13 26 21 40 8 11 15 19 21 30 11 19 32 38 23 60-6 13-26 11-40 19-11 9-2 25 4 34 9 17-11 28-25 33 4 6 11 4 13 8 2 9 11 15 6 25-8 11-30 17-19 34 8 13 3 28-2 42-6 15-19 25-34 28-11 4-25 4-36 2-4-2-8-4-11-4-32-4-64-13-96-13-9 2-19 4-26 7-8 6-16 13-23 20-1 2-3 3-4 5-1 1-2 2-2 3l-2 2c-6 7-10 14-15 22 0 1-1 1-1 1 0 1-1 2-2 3-6 11-11 23-14 35-13 43-7 80 2 89 2 2 62 21 104 40 20 9 33 15 45 23h1055V1000z"
        fill="#e1000f"
      />
      <Path
        d="M2745 1366c8 2 19 2 19 6-4 15-26 19-38 34h-6c-6 4-4 13-9 13-6-2-11 0-17 2 8 8 17 13 28 11 2 0 6 4 6 8 0 0 2 0 4-2 2 0 4 0 4 2v8c-6 8-15 4-23 6 15 4 30 4 44 0 11-4 0-23 8-32-4 0 0-6-4-6 4-4 8-9 11-11 4 0 9-2 11-6 0-4-8-6-6-9 11-8 21-19 17-30-2-6-17-6-26-10s-21 0-32 2c-9 0-19 6-28 8-13 4-25 11-36 19 13-6 26-8 41-11 11-2 20-4 32-2"
        fill="gray"
      />
      <Path d="M1000 3250v-750h228q124 0 194 60 71 60 72 164 0 67-31 116-31 50-88 78l234 332h-181l-199-303h-77v303zm152-432h85q48 0 74-25 27-25 27-71 0-43-27-68t-74-24h-85zm563 432v-750h435v130h-284v173h241v130h-241v187h284v130zm147-814l120-145h156l-138 145zm473 814v-750h247q123 0 193 60 71 60 71 164t-71 163q-71 60-193 60h-95v303zm152-432h101q49 0 76-26 27-25 27-70 0-43-28-68-27-25-75-24h-101zm481 139v-457h152v469q0 75 40 118 40 42 111 42 70 0 110-42t40-118v-469h152v457q0 148-81 231t-222 83q-140 0-221-83-81-84-81-231zm803 293v-750h212q117 0 183 54 67 54 67 150 0 93-79 148 59 27 91 72 32 46 32 105 0 103-75 162-74 59-203 59zm151-130h86q53 0 83-26 30-27 30-73t-30-72q-30-25-83-25h-86zm0-326h64q43 0 67-22 24-21 24-61 0-38-24-59-23-22-67-22h-64zm520 456v-750h151v612h284v138zm579 0v-750h151v750zm336-222q-29-73-29-153t29-152q29-73 80-127 52-54 126-86 75-32 161-32t161 32q75 32 126 86t80 127q29 72 29 152 0 94-39 176t-108 137l45 43q79 72 156 71 32 0 54-8v129q-35 14-79 13-121 0-233-98l-89-80q-49 13-103 13-86 0-161-32-74-32-126-85-51-54-80-126zm195-334q-68 73-69 181 0 108 69 181 68 73 173 73 69 0 123-33 55-33 86-92 31-58 31-129 0-108-69-181-68-73-172-73-105 0-173 73zm710 263v-457h152v469q0 75 40 118 40 42 111 42 70 0 110-42t40-118v-469h152v457q0 148-81 231-81 84-222 83-140 0-221-83-81-84-81-231zm803 293v-750h435v130h-284v173h241v130h-241v187h284v130zM1000 4335v-750h435v130h-283v173h241v130h-241v317zm579 0v-750h228q123 0 195 60 71 60 71 164 0 67-31 117t-88 77l234 332h-181l-199-303h-77v303zm152-432h85q48 0 75-25t26-71q0-43-26-68t-75-24h-85zm500 432l283-750h198l283 750h-161l-72-195h-299l-71 195zm279-325h206l-103-281zm611 325v-750h194l334 537v-537h151v750h-194l-334-539v539zm836-375q0-80 29-152 29-73 80-127 52-54 126-85 75-32 162-32 99 0 180 40 82 41 134 112l-119 93q-33-47-83-75t-112-28q-105 0-173 73t-69 181q0 108 69 182 68 73 173 72 62 0 112-27 50-28 83-76l119 92q-44 61-110 100t-146 49l-93 156h-134l94-158q-95-17-169-73t-114-139q-40-83-39-178zm755 375l283-750h198l283 750h-161l-71-195h-299l-72 195zm280-325h205l-103-281zm610 325v-750h152v750zm304-104l110-101q34 44 76 68 43 24 89 24 45 0 70-23 26-23 26-64 0-24-14-44-15-20-39-33-24-14-55-28-31-15-63-29t-62-34q-31-20-55-44t-39-61q-15-37-15-81 0-91 68-154t172-63q156 0 261 126l-111 100q-72-94-149-94-38 0-63 23t-24 56q0 21 12 39 12 17 31 31 20 13 46 26l53 25q29 13 57 26 29 14 54 34 26 19 46 44 20 24 31 57 12 34 12 75-2 102-73 163-70 61-175 61-92 0-159-31-67-32-118-94zm694 104v-750h435v130h-283v173h241v130h-241v187h283v130zM3484 6391c22 0 41 17 31 56l-101 27c16-48 46-83 70-83m56 164h-20c-25 30-53 54-80 54-28 0-42-17-42-54 0-15 2-31 5-45l164-54c32-76-7-109-52-109-78 0-166 136-166 243 0 51 24 79 62 79 45 0 91-43 129-114m-26-244l93-85v-12h-62l-55 98h24zm-349 82h54l-86 236c-8 20 3 40 24 40 61 0 134-52 162-126h-15c-22 31-70 65-106 72l79-222h81l10-34h-79l30-85h-31l-56 85-67 9zm-56-12c7-22-8-34-19-34-47 0-104 43-126 102h15c15-22 41-46 66-50l-91 236c-8 22 8 34 20 34 45 0 98-43 120-102h-15c-15 22-41 46-66 50zm9-94c20 0 37-17 37-37s-17-37-37-37c-10 0-19 4-26 11s-11 16-11 26c0 21 16 37 37 37m-439 126c14 0 22 22 0 71l-64 142c-12 27 1 44 27 44 16 0 23-4 30-21l63-166c29-36 83-74 107-74 17 0 15 14 4 36l-97 185c-9 18 3 40 24 40 47 0 104-43 126-102h-17c-15 22-41 46-66 50l83-168c11-21 16-41 16-57 0-27-15-45-44-45-41 0-76 46-126 103v-44c0-31-10-59-38-59-33 0-63 52-87 102h15c17-24 32-37 44-37m-65 6c11-39 5-72-24-72-37 0-49 25-85 103v-44c0-31-10-59-38-59-33 0-63 52-87 102h15c16-23 31-37 43-37 14 0 22 22 0 71l-64 142c-12 27 1 44 27 44 16 0 23-4 30-21l61-166c18-22 34-41 54-62h68zm-349-28c22 0 41 17 31 56l-101 27c17-48 46-83 70-83m56 164h-20c-25 30-53 54-80 54-28 0-42-17-42-54 0-15 2-31 5-45l164-54c32-76-6-109-52-109-78 0-166 136-166 243 0 51 24 79 62 79 45 0 91-43 129-114m-375-162h54l-86 236c-8 20 3 40 24 40 61 0 135-52 162-126h-15c-22 31-70 65-106 72l79-222h81l10-34h-79l30-85h-31l-56 85-67 9zm-287 184c0-73 81-172 127-172 10 0 20 1 28 4l-47 126c-27 33-69 73-89 73-12 0-19-9-19-31m249-244l-25-2-28 28h-5c-119 0-247 148-247 265 0 27 15 45 44 45 35 0 69-50 108-103l-2 19c-5 54 12 84 40 84 33 0 63-52 86-102h-15c-16 23-31 37-43 37s-21-23 0-71zm-255 86c11-39 5-72-24-72-37 0-49 25-85 103v-44c0-31-10-59-39-59-33 0-63 52-86 102h15c16-23 31-37 43-37 14 0 22 22 0 71l-65 143c-12 27 1 44 27 44 16 0 23-4 30-21l63-167c18-22 34-41 54-62h67zm-419 239l6-18c-79-15-89-15-57-101l30-81h63c39 0 40 17 34 60h23l52-143h-23c-20 34-35 60-78 60h-63l43-117c15-42 22-50 76-50h14c55 0 62 15 62 73h22l18-97h-305l-6 18c63 13 69 19 40 101l-65 177c-30 81-42 88-115 101l-5 18h234zm1513-956c22 0 41 17 31 56l-101 27c16-48 46-83 70-83m56 164h-20c-25 30-53 54-80 54-28 0-42-17-42-54 0-15 2-31 5-45l164-54c32-76-7-109-52-109-78 0-166 136-166 243 0 51 24 79 62 79 45 1 91-43 129-114m-26-244l93-85v-12h-62l-55 98h24zm-349 82h54l-86 236c-8 20 3 40 24 40 61 0 134-52 162-126h-15c-22 31-70 65-106 72l79-222h81l10-34h-79l30-85h-31l-56 85-67 10zm-56-11c7-22-8-34-20-34-47 0-104 43-126 102h15c15-22 41-46 66-50l-91 236c-8 22 8 34 20 34 45 0 98-43 120-102h-15c-15 22-41 46-66 50zm9-94c20 0 37-17 37-37s-17-37-37-37c-13 0-25 7-32 18s-7 26 0 38c7 11 19 19 32 18m-290 330l150-398-5-7-104 12v12l20 15c18 14 12 27-4 72l-114 304c-10 18 3 40 24 40 47 0 98-43 120-102h-15c-16 23-48 47-72 52m-306-41c0-73 81-172 127-172 10 0 19 1 28 4l-48 126c-27 33-69 73-89 73-11 1-18-9-18-31m249-243l-25-2-28 28h-5c-119 0-247 148-247 265 0 27 15 45 44 45 35 0 69-50 108-103l-2 19c-5 54 12 84 40 84 33 0 63-52 86-102h-15c-16 23-31 37-43 37s-21-23 0-70zm-579 393c0-31 30-51 73-68 14 7 36 15 64 24 45 15 62 21 62 34 0 29-41 51-116 51-56 1-83-11-83-41m123-191c-20 0-27-17-27-36 0-59 28-130 73-130 20 0 27 17 27 36 0 58-29 130-73 130m128 162c0-38-34-52-89-68-47-14-69-18-69-34 0-12 10-27 30-38 78-4 127-74 127-136 0-11-2-21-5-30h53l10-34h-90c-12-8-27-12-44-12-82 0-135 72-135 136 0 41 24 69 62 74-38 18-60 37-60 61 0 14 5 24 17 33-88 26-124 59-124 97 0 41 54 58 118 58 108 1 199-58 199-107m-408-240c39 0 40 17 34 60h23l52-143h-23c-20 34-35 60-78 60h-87l43-117c15-42 23-50 76-50h38c55 0 62 15 62 73h22l18-97h-327l-6 18c63 13 69 19 40 101l-65 177c-30 81-42 88-115 101l-5 18h364l65-103h-25c-42 42-85 79-166 79-97 0-88-5-56-95l30-81h86zm47-244l93-68v-12h-62l-55 80zm1390-511c22 0 41 17 31 56l-101 27c16-49 46-83 70-83m56 164h-20c-25 30-53 54-80 54-28 0-42-17-42-54 0-15 2-31 5-45l164-54c32-76-7-109-52-109-78 0-166 136-166 243 0 51 24 79 62 79 45 0 91-43 129-114m-26-244l93-85v-12h-62l-55 98h24zm-349 81h55l-86 236c-8 20 3 40 24 40 61 0 135-52 162-126h-15c-22 31-70 65-106 72l79-222h81l10-34h-79l30-85h-31l-56 85-67 9v25zm-28 27c11-39 5-72-24-72-37 0-49 25-85 103v-44c0-31-10-59-38-59-33 0-63 52-87 102h15c16-23 31-37 43-37 14 0 22 22 0 71l-64 142c-12 27 1 44 27 44 16 0 23-4 30-21l63-166c18-22 34-41 54-62h66zm-349-28c22 0 41 17 31 56l-101 27c16-49 46-83 70-83m56 164h-20c-25 30-53 54-80 54-28 0-42-17-42-54 0-15 2-31 5-45l164-54c32-76-6-109-52-109-78 0-166 136-166 243 0 51 24 79 62 79 45 0 91-43 129-114m-382 66c-16 0-39-15-39-28 0-4 7-23 16-46l26-70c28-34 72-71 97-71 15 0 26 10 26 31-1 66-61 184-126 184m182-209c0-48-12-66-46-66-42 0-81 45-121 99l84-226-5-7-104 12v12l20 15c18 14 12 28-4 72l-91 239c-8 20-17 44-17 50 0 28 38 55 73 55 79 2 211-143 211-255m-307-31c6-22-8-34-20-34-47 0-104 43-126 102h15c15-22 41-46 66-50l-91 236c-8 22 8 34 20 34 45 0 98-43 120-102h-15c-15 22-41 46-66 50zm10-94c20 0 37-17 37-37s-17-37-37-37c-13 0-25 7-32 18s-7 26 0 38c7 11 19 19 32 18m-231-45h-216l-6 18c63 13 69 19 40 101l-65 177c-30 81-42 88-115 101l-5 18h328l71-127h-25c-41 45-88 102-161 102-55 0-63-10-32-95l65-177c30-81 42-88 115-101z" />
    </Svg>
  );
}
