import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const ArrowTopRightOnSquare = () => (
  <Svg
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="h-4 w-4 text-muted-100"
    viewBox="0 0 24 24"
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
    />
  </Svg>
);
export default ArrowTopRightOnSquare;
