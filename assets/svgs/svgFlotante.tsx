import * as React from "react";
import { View } from "react-native";
import Svg, {
  G,
  Path,
  Defs,
  Filter,
  FeFlood,
  FeColorMatrix,
  FeOffset,
  FeGaussianBlur,
  FeComposite,
  FeBlend,
  SvgProps,
} from "react-native-svg";

const SvgFlotante = (props: SvgProps) => (
  <Svg
    width={440}
    height={493}
    viewBox="0 0 440 493"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G filter="url(#filter0_d_750_186)">
      <Path
        d="M51 78C51 66.9543 59.9543 58 71 58H373C384.046 58 393 66.9543 393 78V333.384C393 340.976 388.7 347.915 381.901 351.294L227.586 427.984C221.875 430.823 215.153 430.767 209.49 427.835L61.8045 351.372C55.1673 347.935 51 341.085 51 333.611V78Z"
        fill="#232323"
      />
    </G>
    <Defs>
      <Filter
        id="filter0_d_750_186"
        x="-7"
        y="0"
        width="462"
        height="492.074"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <FeFlood floodOpacity="0" result="BackgroundImageFix" />
        <FeColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <FeOffset dx="2" dy="2" />
        <FeGaussianBlur stdDeviation="30" />
        <FeComposite in2="hardAlpha" operator="out" />
        <FeColorMatrix
          type="matrix"
          values="0 0 0 0 0.458974 0 0 0 0 0 0 0 0 0 0.860577 0 0 0 0.4 0"
        />
        <FeBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_750_186"
        />
        <FeBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_750_186"
          result="shape"
        />
      </Filter>
    </Defs>
  </Svg>
);

export default SvgFlotante;
