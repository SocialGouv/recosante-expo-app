import { Dimensions, Image, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Image as ExpoImage, type ImageSource } from 'expo-image';

const windowWidth = Dimensions.get('window').width;
const DEFAULT_IMAGE_HEIGHT = 120;

interface DynamicHeightImageProps {
  source: ImageSource;
  alt: string;
}

export function DynamicHeightImage({ source, alt }: DynamicHeightImageProps) {
  const [height, setHeight] = useState(DEFAULT_IMAGE_HEIGHT);
  const imageWidth = windowWidth * 0.85;

  useEffect(() => {
    if (source.uri === undefined) return;
    Image.getSize(
      source.uri,
      (width, height) => {
        if (width && height) {
          const computed = (imageWidth * height) / width;
          setHeight(
            Number.isFinite(computed) && computed > 0
              ? computed
              : DEFAULT_IMAGE_HEIGHT,
          );
        } else {
          setHeight(DEFAULT_IMAGE_HEIGHT);
        }
      },
      () => setHeight(DEFAULT_IMAGE_HEIGHT),
    );
  }, [source]);

  return (
    <View className="w-full items-center justify-center">
      <ExpoImage
        style={{
          width: imageWidth,
          height,
        }}
        source={source}
        contentFit="contain"
        transition={1000}
        accessibilityLabel={alt}
        accessible={!!alt}
      />
    </View>
  );
}
