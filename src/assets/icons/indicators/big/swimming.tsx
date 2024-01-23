import React, { useMemo } from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  value: number | undefined;
  size: number;
  selected: boolean | undefined;
}

const valuesToColor = {
  0: '#D9D9EF',
  1: '#b1f3ef',
  2: '#73c8ae',
  3: '#ee817e',
  4: '#a7546d',
};

export function Swimming(props: Props) {
  const wave1 = useMemo(() => {
    if (props.selected === true) return '#3343BD';
    if (props.selected === false) return '#ffffff';
    switch (props.value) {
      case 4:
      case 3:
      case 2:
      case 1:
        return valuesToColor[props.value];
      default:
        return valuesToColor[0];
    }
  }, [props.value, props.selected]);

  const wave2 = useMemo(() => {
    if (props.selected === true) return '#3343BD';
    if (props.selected === false) return '#ffffff';
    switch (props.value) {
      case 4:
      case 3:
      case 2:
        return valuesToColor[props.value];
      default:
        return valuesToColor[0];
    }
  }, [props.value, props.selected]);

  const wave3 = useMemo(() => {
    if (props.selected === true) return '#3343BD';
    if (props.selected === false) return '#ffffff';
    switch (props.value) {
      case 4:
      case 3:
        return valuesToColor[props.value];
      default:
        return valuesToColor[0];
    }
  }, [props.value, props.selected]);

  return (
    <Svg
      width={props.size}
      height={(props.size * 72) / 75}
      viewBox="0 0 91 75"
      fill="none"
      {...props}
    >
      <Path
        d="M11.2891 18.75C20.6348 18.75 27.6431 9.375 27.6431 9.375C27.6431 9.375 34.6515 18.75 43.9954 18.75C53.3411 18.75 62.6849 9.375 62.6849 9.375C62.6849 9.375 72.0307 18.75 79.039 18.75"
        stroke={wave3}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.2891 42.1875C20.6348 42.1875 27.6431 32.8125 27.6431 32.8125C27.6431 32.8125 34.6515 42.1875 43.9954 42.1875C53.3411 42.1875 62.6849 32.8125 62.6849 32.8125C62.6849 32.8125 72.0307 42.1875 79.039 42.1875"
        stroke={wave2}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.2891 65.625C20.6348 65.625 27.6431 56.25 27.6431 56.25C27.6431 56.25 34.6515 65.625 43.9954 65.625C53.3411 65.625 62.6849 56.25 62.6849 56.25C62.6849 56.25 72.0307 65.625 79.039 65.625"
        stroke={wave1}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
