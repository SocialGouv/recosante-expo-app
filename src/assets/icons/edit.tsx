import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface LocationIconProps {
  color?: string;
}
export function EditIcon(props: LocationIconProps) {
  return (
    <Svg width="17" height="18" viewBox="0 0 17 18" fill="none">
      <Path
        d="M5.19069 15.1198L0.999957 16.5817L2.08093 12.418L12.4168 1.4021C12.4433 1.37372 12.4754 1.35065 12.5111 1.33423C12.5469 1.3178 12.5857 1.30834 12.6252 1.30637C12.6648 1.30441 12.7044 1.30999 12.7417 1.3228C12.779 1.3356 12.8134 1.35538 12.8428 1.38099L15.5035 3.6995C15.5329 3.72504 15.5569 3.75592 15.5739 3.79038C15.591 3.82485 15.6008 3.86221 15.6028 3.90034C15.6049 3.93847 15.5991 3.97661 15.5858 4.01257C15.5725 4.04854 15.552 4.08163 15.5254 4.10994L5.19069 15.1198Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.7666 3.14734L13.8777 5.85883"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
