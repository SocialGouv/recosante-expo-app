import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export function NotValidIcon() {
  return (
    <Svg width={15} height={15} viewBox="0 0 15 15" fill="none">
      <Circle cx={7.5} cy={7.5} r={7.5} fill="#FF797A" />
      <Path
        d="M10 5L7.5 7.5 5 10M10 10L7.5 7.5 5 5"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
