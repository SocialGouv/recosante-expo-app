import React, { useMemo } from 'react';
import Svg, { Circle } from 'react-native-svg';

interface Props {
  value: number | undefined;
  size: number;
  selected: boolean | undefined;
}

const valuesToColor = {
  0: '#D9D9EF',
  1: '#b1f3ef',
  2: '#73c8ae',
  3: '#fef799',
  4: '#ee817e',
  5: '#a7546d',
};

export function Pollens(props: Props) {
  const bubble1 = useMemo(() => {
    if (props.selected === true) return '#3343BD';
    if (props.selected === false) return '#ffffff';
    switch (props.value) {
      case 5:
      case 4:
      case 3:
      case 2:
      case 1:
        return valuesToColor[props.value];
      default:
        return valuesToColor[0];
    }
  }, [props.value, props.selected]);

  const bubble2 = useMemo(() => {
    if (props.selected === true) return '#3343BD';
    if (props.selected === false) return '#ffffff';
    switch (props.value) {
      case 5:
      case 4:
      case 3:
      case 2:
        return valuesToColor[props.value];
      default:
        return valuesToColor[0];
    }
  }, [props.value, props.selected]);

  const bubble3 = useMemo(() => {
    if (props.selected === true) return '#3343BD';
    if (props.selected === false) return '#ffffff';
    switch (props.value) {
      case 5:
      case 4:
      case 3:
        return valuesToColor[props.value];
      default:
        return valuesToColor[0];
    }
  }, [props.value, props.selected]);

  const bubble4 = useMemo(() => {
    if (props.selected === true) return '#3343BD';
    if (props.selected === false) return '#ffffff';
    switch (props.value) {
      case 5:
      case 4:
        return valuesToColor[props.value];
      default:
        return valuesToColor[0];
    }
  }, [props.value, props.selected]);

  const bubble5 = useMemo(() => {
    if (props.selected === true) return '#3343BD';
    if (props.selected === false) return '#ffffff';
    switch (props.value) {
      case 5:
        return valuesToColor[props.value];
      default:
        return valuesToColor[0];
    }
  }, [props.value, props.selected]);

  return (
    <Svg
      width={(props.size * 21) / 31}
      height={props.size}
      viewBox="0 0 21 31"
      fill="none"
    >
      <Circle
        cx={3.54565}
        cy={3.54565}
        r={3.54565}
        transform="matrix(-1 0 0 1 18.273 23.183)"
        fill={bubble1}
      />
      <Circle
        cx={4.50025}
        cy={4.50025}
        r={4.50025}
        transform="matrix(-1 0 0 1 21 11.729)"
        fill={bubble3}
      />
      <Circle
        cx={4.50025}
        cy={4.50025}
        r={4.50025}
        transform="matrix(-1 0 0 1 9 7.91)"
        fill={bubble4}
      />
      <Circle
        cx={3.27291}
        cy={3.27291}
        r={3.27291}
        transform="matrix(-1 0 0 1 10.637 18.001)"
        fill={bubble2}
      />
      <Circle
        cx={5.18211}
        cy={5.18211}
        r={5.18211}
        transform="matrix(-1 0 0 1 19.363 0)"
        fill={bubble5}
      />
    </Svg>
  );
}
