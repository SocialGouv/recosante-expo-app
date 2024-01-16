import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  color: string;
  size: number;
  focused: boolean;
}

export function ShareIcon(props: Props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 21 21" fill="none">
      <Path
        d="M3.5 2.5L18.5 9.5L19 11.5L4.5 18.5H3L2.5 15L5 11L3.5 9.5L2.5 4L3.5 2.5Z"
        fill={props.focused ? '#7883D3' : 'none'}
      />
      <Path
        d="M19.17 7.38398L5.17001 0.881481C4.64029 0.634866 4.05884 0.564168 3.49451 0.677758C2.93018 0.791347 2.4066 1.08447 1.98575 1.52242C1.5649 1.96036 1.2644 2.5248 1.11983 3.14891C0.975262 3.77302 0.992675 4.43066 1.17001 5.04398L2.71001 10.5002L1.13001 15.9565C0.947881 16.5723 0.927422 17.234 1.07108 17.8626C1.21475 18.4911 1.51644 19.0597 1.94001 19.5002C2.48465 20.0684 3.19729 20.3891 3.94001 20.4002C4.33474 20.3999 4.72554 20.312 5.09001 20.1415L19.14 13.639C19.6872 13.383 20.1547 12.9504 20.4836 12.3958C20.8125 11.8412 20.988 11.1894 20.988 10.5227C20.988 9.85604 20.8125 9.20428 20.4836 8.64968C20.1547 8.09508 19.6872 7.66249 19.14 7.40648L19.17 7.38398ZM4.36001 18.0377C4.18361 18.1196 3.99007 18.143 3.80225 18.1051C3.61442 18.0672 3.44015 17.9697 3.30001 17.824C3.168 17.6821 3.07304 17.5022 3.02545 17.3039C2.97785 17.1056 2.97943 16.8964 3.03001 16.699L4.49001 11.6252H18.22L4.36001 18.0377ZM4.49001 9.37523L3.00001 4.34648C2.94943 4.1491 2.94785 3.93991 2.99545 3.74159C3.04304 3.54327 3.138 3.3634 3.27001 3.22148C3.36412 3.11042 3.47742 3.02218 3.60296 2.96221C3.7285 2.90223 3.86362 2.87178 4.00001 2.87273C4.13406 2.87302 4.26669 2.90363 4.39001 2.96273L18.22 9.37523H4.49001Z"
        fill={props.color}
      />
    </Svg>
  );
}
