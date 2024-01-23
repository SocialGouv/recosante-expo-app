import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

// TODO: Il n'y qu'un quart de soleil. Il faut ajouter les autres

interface Props {
  value: number | undefined;
  size: number;
  color: string | undefined;
}

const maxValue = 11;
export function Uv(props: Props) {
  const color = props.color ?? '#D9D9EF';
  const value = Math.min(props.value ?? 0, maxValue);

  return (
    <Svg
      className="w-auto -rotate-90 overflow-visible"
      viewBox="0 0 48 48"
      width={props.size}
      height={props.size}
    >
      <Circle cx="24" cy="24" r="12" fill="#D9D9EF" />
      <Circle
        strokeDashoffset={
          2 * Math.PI * (value >= maxValue ? 6 : 5.5) * (1 - value / maxValue)
        }
        strokeDasharray={2 * Math.PI * (value >= maxValue ? 6 : 5.5)}
        strokeWidth={2 * 6}
        stroke={color}
        cx="24"
        cy="24"
        r="6"
        fill="none"
      />
      <Path // 0
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        stroke={value > 0 ? color : '#D9D9EF'}
        d="M46 24L40.6896 24"
      />
      <Path // 1
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        stroke={value > 0 ? color : '#D9D9EF'}
        d="M43.0527 35L38.414 32.3448"
      />
      <Path // 2
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        stroke={value > 1 ? color : '#D9D9EF'}
        d="M35 43.0527L32.3448 38.414"
      />
      <Path // 3
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        stroke={value > 2 ? color : '#D9D9EF'}
        d="M24 46V40.6896"
      />
      <Path // 4
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        stroke={value > 3 ? color : '#D9D9EF'}
        d="M15.6553 38.4141L13.0001 43.0529"
      />
      <Path // 5
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        stroke={value > 4 ? color : '#D9D9EF'}
        d="M9.58691 32.3447L4.94815 34.9999"
      />
      <Path // 6
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        stroke={value > 5 ? color : '#D9D9EF'}
        d="M7.31055 24H2.00019"
      />
      <Path // 7
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        stroke={value > 6 ? color : '#D9D9EF'}
        d="M9.58691 15.6548L4.94815 12.9996"
      />
      <Path // 8
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        stroke={value > 7 ? color : '#D9D9EF'}
        d="M15.6553 9.58594L13.0001 4.94717"
      />
      <Path // 9
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        stroke={value > 8 ? color : '#D9D9EF'}
        d="M24 7.31055L24 2.00019"
      />
      <Path // 10
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        stroke={value > 9 ? color : '#D9D9EF'}
        d="M35 4.94727L32.3448 9.58602"
      />
      <Path // 11
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        stroke={value > 10 ? color : '#D9D9EF'}
        d="M43.0527 13L38.414 15.6552"
      />
    </Svg>
  );
}
