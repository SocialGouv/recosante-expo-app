import * as React from 'react';
import Svg, { Mask, Path, G, Circle } from 'react-native-svg';

export function AirIcon({ selected }: { selected: boolean }) {
  return (
    <Svg className="h-9 w-9" viewBox="0 0 36 36" fill="none">
      <Mask
        id="a"
        maskUnits="userSpaceOnUse"
        x={0}
        y={3}
        width={36}
        height={28}
      >
        <Path
          d="M32.03 29.82c.86.498 1.97.206 2.38-.7a18 18 0 10-32.82 0c.41.906 1.52 1.198 2.38.7.861-.496 1.145-1.594.759-2.51a14.4 14.4 0 1126.542 0c-.386.916-.102 2.014.759 2.51z"
          fill={selected ? '#3343BD' : '#C4C4C4'}
        />
      </Mask>
      <G mask="url(#a)" fill={selected ? '#3343BD' : '#ffffff'}>
        <Path d="M33.589 30.72a18 18 0 002.36-10.345l-3.572.268a14.418 14.418 0 01-1.891 8.287l3.103 1.79z" />
        <Path d="M35.956 20.465a18 18 0 00-3.828-9.897l-2.811 2.22a14.417 14.417 0 013.065 7.927l3.574-.25z" />
        <Path d="M32.184 10.639a18 18 0 00-8.708-6.065l-1.09 3.413c2.76.881 5.191 2.574 6.975 4.857l2.823-2.205zM4.011 10.618a18 18 0 00-3.95 9.85l3.57.294a14.418 14.418 0 013.164-7.889l-2.784-2.255z" />
        <Path d="M.044 20.465A18 18 0 002.457 30.8l3.093-1.807a14.418 14.418 0 01-1.932-8.277l-3.574-.25zM23.443 4.563a18 18 0 00-19.77 6.26l2.865 2.18a14.4 14.4 0 0115.816-5.008l1.089-3.432z" />
      </G>
      <Circle
        cx={12.7641}
        cy={6.6}
        r={5.1}
        fill={selected ? '#3343BD' : '#ffffff'}
        stroke="#3343BD"
        strokeWidth={3}
      />
    </Svg>
  );
}
