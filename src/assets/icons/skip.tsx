import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SvgProps {
  color: string;
  className?: string;
}

export function SkipArrow(props: SvgProps) {
  return (
    <Svg
      width={18}
      height={9}
      viewBox="0 0 18 9"
      fill="none"
      className={props.className}
    >
      <Path
        d="M0 4.667h17m0 0L13.53 1M17 4.667L13.53 8"
        stroke={props.color}
        strokeWidth={1}
      />
    </Svg>
  );
}
