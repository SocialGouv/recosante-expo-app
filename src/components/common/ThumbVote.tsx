import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThumbUp } from '~/assets/icons/thumbs';
import MyText from '../ui/my-text';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThumbVoteProps {
  indicatorId: string;
  question: string;
  onVoteYes?: () => void;
  onVoteNo?: () => void;
  yesText?: string;
  noText?: string;
  className?: string;
  disabled?: boolean;
}

export function ThumbVote({
  indicatorId,
  question,
  onVoteYes,
  onVoteNo,
  yesText = 'Oui',
  noText = 'Non',
  className = '',
  disabled = false,
}: ThumbVoteProps) {
  const [selectedVote, setSelectedVote] = useState<'yes' | 'no' | null>(null);
  const [loading, setLoading] = useState(true);

  const storageKey = `thumbVote_${indicatorId}`;

  console.log('storageKey', storageKey);

  useEffect(() => {
    // Charger l'état sauvegardé
    const loadVote = async () => {
      try {
        const value = await AsyncStorage.getItem(storageKey);
        if (value === 'yes' || value === 'no') {
          setSelectedVote(value);
        }
      } catch (e) {
        // Erreur de lecture, ignorer
      } finally {
        setLoading(false);
      }
    };
    loadVote();
  }, [storageKey]);

  const handleVoteYes = async () => {
    setSelectedVote('yes');
    await AsyncStorage.setItem(storageKey, 'yes');
    onVoteYes?.();
  };

  const handleVoteNo = async () => {
    setSelectedVote('no');
    await AsyncStorage.setItem(storageKey, 'no');
    onVoteNo?.();
  };

  const getButtonClassName = (type: 'yes' | 'no') => {
    const baseClassName = `border border-gray-300 rounded-md px-4 py-2 flex flex-row items-center space-x-2 ${
      disabled ? 'opacity-50' : ''
    }`;
    return baseClassName;
  };

  // Couleur grise pour le SVG non sélectionné
  const thumbDefaultColor = '#B0B0B0';
  const thumbSelectedColor = 'darkblue';

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View className={`flex flex-col items-center ${className}`}>
      <MyText className="mb-2 mt-1 text-center text-[13px] text-muted">
        {question}
      </MyText>
      <View className="flex flex-row items-center justify-center gap-2">
        <TouchableOpacity
          className={getButtonClassName('yes')}
          onPress={handleVoteYes}
          disabled={disabled}
        >
          <ThumbUp
            color={
              selectedVote === 'yes' ? thumbSelectedColor : thumbDefaultColor
            }
          />
          <MyText className="text-[13px] text-muted">{yesText}</MyText>
          {disabled && <ActivityIndicator size="small" className="ml-2" />}
        </TouchableOpacity>
        <TouchableOpacity
          className={getButtonClassName('no')}
          onPress={handleVoteNo}
          disabled={disabled}
        >
          <MyText className="mr-2 text-[13px] text-muted">{noText}</MyText>
          <ThumbUp
            rotate={180}
            color={
              selectedVote === 'no' ? thumbSelectedColor : thumbDefaultColor
            }
          />
          {disabled && <ActivityIndicator size="small" className="ml-2" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}
