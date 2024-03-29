import React, { useMemo } from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  value: number | undefined;
  size: number;
  selected: boolean | undefined;
}

const valuesToColor = {
  0: '#D9D9EF',
  1: '#73c8ae',
  2: '#fef799',
  3: '#ee817e',
  4: '#a7546d',
  5: '#965f9b',
};

export function Weather(props: Props) {
  const stroke = useMemo(() => {
    if (props.selected === false) return '#3343BD';
    return '#ffffff';
  }, [props.selected]);
  const cloud1 = useMemo(() => {
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

  const cloud2 = useMemo(() => {
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

  const cloud3 = useMemo(() => {
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

  return (
    <Svg
      viewBox="0 0 110 64"
      height={props.size}
      width={((props.size * 110) / 64) * 0.8} // too big if full width
      fill="none"
      {...props}
    >
      <Path
        d="M52.077 11.246l-.12.179v.215c0 9.217-1.216 15.13-6.44 18.859-2.645 1.888-6.378 3.26-11.65 4.157-5.268.895-12.023 1.305-20.672 1.305h-.71v.71c0 8.669 8.067 15.568 17.558 15.568h61.098c9.491 0 17.557-6.9 17.557-15.568 0-7.583-6.217-13.816-14.075-15.255-.237-11.205-10.505-20.125-22.922-20.125-8.146 0-15.516 3.798-19.624 9.955z"
        fill={cloud3}
        stroke={stroke}
        strokeWidth={1.41899}
      />
      <Path
        d="M26.42 18.236c-6.703 0-12.398 4.281-13.682 10.064C6.37 29.403 1.291 34.432 1.291 40.59c0 6.986 6.493 12.516 14.096 12.516h48.546c7.604 0 14.097-5.53 14.097-12.516 0-6.072-4.944-11.049-11.187-12.242-.26-8.941-8.47-16.015-18.356-16.015-6.283 0-11.995 2.824-15.349 7.45a15.13 15.13 0 00-6.718-1.547z"
        fill={cloud2}
        stroke={stroke}
        strokeWidth={1.41899}
      />
      <Path
        d="M46.43 33.45c-5.575 0-10.33 3.541-11.442 8.357-5.287.95-9.51 5.143-9.51 10.293 0 5.872 5.452 10.496 11.806 10.496h40.24c6.353 0 11.805-4.624 11.805-10.496 0-5.073-4.101-9.218-9.276-10.248-.273-7.443-7.121-13.296-15.333-13.296-5.206 0-9.948 2.324-12.76 6.143a12.674 12.674 0 00-5.53-1.25z"
        fill={cloud1}
        stroke={stroke}
        strokeWidth={1.41899}
      />
    </Svg>
  );
}
