import { View, TouchableOpacity, Text } from 'react-native';
import {
  type DrinkingWaterValue,
  IndicatorsSlugEnum,
  type GenericIndicatorByPeriodValue,
  type IndicatorItem,
} from '~/types/indicator';
import type { DayEnum } from '~/types/day';
import type { DashboardProps } from '~/scenes/dashboard/dashboard';
import MyText from '../ui/my-text';
import { IndicatorService } from '~/services/indicator';
import { cn } from '~/utils/tailwind';
import { useIndicators } from '~/zustand/indicator/useIndicators';
import { useNavigation } from '@react-navigation/native';
import { RouteEnum } from '~/constants/route';
import { LineChart } from './graphs/line';
import { logEvent } from '~/services/logEventsWithMatomo';
import * as Haptics from 'expo-haptics';
import { LineList } from './graphs/lines-list';
import { DrinkingWaterResult } from './graphs/drinking-water-result';
import { NoValuePils } from './no-value-pils';
import { ThumbVote } from '~/components/common/ThumbVote';
import { sendIndicatorFeedback } from '~/api/indicator-feedback';
import { useToast } from '~/services/toast';
import React, { useState } from 'react';
import { useIndicatorFeedback } from '~/hooks/useIndicatorFeedback';
import { useIndicatorsList } from '~/zustand/indicator/useIndicatorsList';

interface IndicatorPreviewProps {
  indicator: IndicatorItem;
  isFavorite?: boolean;
  day: DayEnum;
  index: number;
}

export function IndicatorPreview(props: IndicatorPreviewProps) {
  const navigation = useNavigation<DashboardProps['navigation']>();
  const { indicators } = useIndicators((state) => state);
  const { favoriteIndicators, setFavoriteIndicators } = useIndicatorsList(
    (state) => state,
  );
  const currentIndicatorData = indicators?.find(
    (indicator) => indicator.slug === props.indicator.slug,
  );
  const slug = props.indicator.slug;
  const indicatorDataInCurrentDay = currentIndicatorData?.[props.day];
  if (!indicatorDataInCurrentDay) return <></>;
  const indicatorMaxValue =
    IndicatorService.getDataVisualisationBySlug(slug)?.maxValue;
  const indicatorMinValue =
    IndicatorService.getDataVisualisationBySlug(slug)?.minValue;

  const indicatorValue = indicatorDataInCurrentDay?.summary.value ?? 0;
  const { valuesToColor } = IndicatorService.getDataVisualisationBySlug(slug);

  const indicatorHasNoValue = !indicatorDataInCurrentDay?.summary.value;
  const status = indicatorDataInCurrentDay?.summary.status;
  const isDrinkingWaterIndicator = slug === IndicatorsSlugEnum.drinking_water;

  const showLine = !isDrinkingWaterIndicator;
  const showLineList = props.isFavorite && !isDrinkingWaterIndicator;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { show } = useToast();

  const { isSubmitting: useIndicatorFeedbackIsSubmitting, submitFeedback } =
    useIndicatorFeedback({
      onSuccess: () => {
        logEvent({
          category: 'INDICATOR_FEEDBACK',
          action: 'FEEDBACK_SUBMITTED',
          name: props.indicator.slug.toLocaleUpperCase(),
        });
      },
    });

  function handlePress() {
    if (!currentIndicatorData) return;
    if (!props.day) return;
    logEvent({
      category: 'DASHBOARD',
      action: 'INDICATOR_SELECTED',
      name: props.indicator.slug.toLocaleUpperCase(),
      value: props.isFavorite ? 1 : 0,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(RouteEnum.INDICATOR_DETAIL, {
      indicator: currentIndicatorData,
      day: props.day,
    });
  }

  function handleLongPress() {
    if (!currentIndicatorData) return;
    if (!props.day) return;
    if (props.isFavorite) return;
    if (indicatorHasNoValue) return;
    logEvent({
      category: 'DASHBOARD',
      action: 'INDICATOR_LONG_PRESS',
      name: props.indicator.slug.toLocaleUpperCase(),
      value: 1,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(RouteEnum.INDICATOR_FAST_SELECTOR, {
      indicatorSlug: props.indicator.slug,
    });
  }

  // Gestion étoile favoris
  const isFavorite = favoriteIndicators.some((i) => i.slug === slug);
  const handleToggleFavorite = (e: any) => {
    e.stopPropagation && e.stopPropagation();
    if (isFavorite) {
      setFavoriteIndicators(favoriteIndicators.filter((i) => i.slug !== slug));
    } else {
      setFavoriteIndicators([...favoriteIndicators, props.indicator]);
    }
  };

  console.log(
    'IndicatorService.getDataVisualisationBySlug(slug)',
    IndicatorService.getDataVisualisationBySlug(slug),
  );

  console.log('indicatorDataInCurrentDay', indicatorDataInCurrentDay);

  console.log('indicator value', indicatorValue);

  const handleFeedback = async (isRelevant: boolean) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await sendIndicatorFeedback({
        indicator: props.indicator.slug,
        helpful: isRelevant,
      });
      show('Merci pour votre retour !');
    } catch (error) {
      show("Une erreur est survenue. Impossible d'envoyer votre retour");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TouchableOpacity
      className={cn(
        'm-2 mx-3',
        indicatorHasNoValue ? 'opacity-50' : '',
        isFavorite ? ' shadow-md' : 'scale-[0.98]',
      )}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={1}
    >
      <View
        className={cn(
          'overflow-scroll rounded-md border-[1px] border-gray-300 bg-white px-3 py-4',
        )}
        style={{ position: 'relative' }}
      >
        <TouchableOpacity
          onPress={handleToggleFavorite}
          activeOpacity={0.7}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 2,
            elevation: 2,
            zIndex: 10,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: isFavorite ? '#FFD700' : '#B0B0B0',
              fontWeight: 'bold',
            }}
          >
            {isFavorite ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
        <View className="flex flex-row justify-between">
          <View className="flex w-full justify-center">
            <View className="flex-row items-center justify-between">
              <View
                className={cn(
                  'flex w-full flex-row items-center justify-between',
                  indicatorHasNoValue ? '' : ' pb-2',
                )}
              >
                <View>
                  <MyText
                    className={cn(
                      '"text-wrap  uppercase text-muted',
                      props.isFavorite ? ' text-[17px]' : ' text-[15px]',
                      indicatorHasNoValue ? '' : 'mb-2',
                    )}
                    font={
                      props.isFavorite ? 'MarianneExtraBold' : 'MarianneBold'
                    }
                  >
                    {props.isFavorite
                      ? props.indicator.name
                      : props.indicator.short_name}{' '}
                    {indicatorHasNoValue || isDrinkingWaterIndicator
                      ? null
                      : `: ${status}`}
                  </MyText>
                  {isDrinkingWaterIndicator ? (
                    <DrinkingWaterResult
                      indicatorValue={
                        indicatorValue as DrinkingWaterValue | null
                      }
                    />
                  ) : null}
                </View>
                {indicatorHasNoValue ? <NoValuePils slug={slug} /> : null}
              </View>
            </View>
            {showLine ? (
              <LineChart
                color={valuesToColor[indicatorValue]}
                value={indicatorValue}
                maxValue={indicatorMaxValue}
                minValue={indicatorMinValue}
              />
            ) : null}

            {showLineList ? (
              <>
                <LineList
                  slug={currentIndicatorData?.slug}
                  values={
                    indicatorDataInCurrentDay?.values as
                      | GenericIndicatorByPeriodValue[]
                      | undefined
                  }
                  isPreviewMode
                  onMorePress={() => {
                    navigation.navigate(RouteEnum.INDICATOR_DETAIL, {
                      indicator: currentIndicatorData,
                      day: props.day,
                    });
                  }}
                />
              </>
            ) : null}
            <ThumbVote
              indicatorId={props.indicator.slug}
              question="Cet indicateur vous parait-il pertinent ?"
              className="mt-4"
              onVoteYes={() => submitFeedback(props.indicator.slug, true)}
              onVoteNo={() => submitFeedback(props.indicator.slug, false)}
              disabled={useIndicatorFeedbackIsSubmitting}
            />
            <MyText className="mt-1 text-[13px] text-muted">
              {indicatorHasNoValue
                ? currentIndicatorData?.j0.help_text
                : indicatorDataInCurrentDay.summary.recommendations}
            </MyText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
