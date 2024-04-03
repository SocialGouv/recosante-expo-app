import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export function ValidIcon() {
  return (
    <Svg width={15} height={15} viewBox="0 0 15 15" fill="none">
      <Circle cx={7.5} cy={7.5} r={7.5} fill="#4FCBAD" />
      <Path
        d="M4 7.308L6.45 10 11 5"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
