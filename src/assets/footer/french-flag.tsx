import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function FrenchFlag() {
  return (
    <Svg width="352" height="3" viewBox="0 0 352 3" fill="none">
      <Path
        d="M0 1.5C0 0.671573 0.671573 0 1.5 0H117.333V3H1.5C0.671577 3 0 2.32843 0 1.5Z"
        fill="#000091"
      />
      <Path
        d="M0 1.5C0 0.671573 0.671573 0 1.5 0H117.333V3H1.5C0.671577 3 0 2.32843 0 1.5Z"
        fill="white"
      />
      <Path
        d="M0 1.5C0 0.671573 0.671573 0 1.5 0H117.333V3H1.5C0.671577 3 0 2.32843 0 1.5Z"
        fill="#305ECA"
      />
      <Path
        d="M117.333 1.5C117.333 0.671573 118.005 0 118.833 0H234.666V3H118.833C118.005 3 117.333 2.32843 117.333 1.5Z"
        fill="white"
      />
      <Path
        d="M234.667 0H350.5C351.329 0 352 0.671573 352 1.5C352 2.32843 351.329 3 350.5 3H234.667V0Z"
        fill="#D15854"
      />
    </Svg>
  );
}
