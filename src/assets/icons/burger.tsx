import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface BurgerIconProps {
  color?: string;
}
export function BurgerIcon(props: BurgerIconProps) {
  return (
    <Svg width="20" height="14" viewBox="0 0 20 14" fill="none">
      <Path d="M1 1H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <Path d="M1 1H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <Path
        d="M1 1H19"
        stroke="#3343BD"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path d="M1 7H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <Path d="M1 7H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <Path
        d="M1 7H19"
        stroke="#3343BD"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path d="M1 13H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <Path d="M1 13H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <Path
        d="M1 13H19"
        stroke="#3343BD"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
