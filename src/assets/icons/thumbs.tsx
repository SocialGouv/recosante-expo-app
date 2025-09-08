import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ThumbUpProps {
  rotate?: number;
  color?: string;
}

export function ThumbUp({ rotate, color = 'darkblue' }: ThumbUpProps) {
  return (
    <Svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      style={{ transform: [{ rotate: rotate ? `${rotate}deg` : '0deg' }] }}
    >
      <Path
        fill={color}
        d="M28.2,12h-6V6c0-2.2-1.8-4-4-4h-2.1c-1,0-1.8,0.7-2,1.7l-0.8,5.9L9.5,16H3v14h21c3.9,0,7-3.1,7-7v-7
        C31,13.8,29.8,12,28.2,12z M9,28H5V18h4V28z M29,23c0,2.8-2.2,5-5,5H11V17.3l4-6L15.9,5H18c0.6,0,1,0.4,1,1v8h9.2
        c0.5,0,0.8,0.4,0.8,1V23z"
      />
    </Svg>
  );
}
