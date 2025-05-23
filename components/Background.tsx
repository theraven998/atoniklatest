import { StyleSheet, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
  LinearGradient,
  Stop,
} from "react-native-svg";
import { useAppTheme } from "@/constants/theme/useTheme";
import { useColorScheme } from "react-native";
interface BackgroundProps {
  children: React.ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
  const theme = useAppTheme();
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,

      }}
    >
      <Svg
        width="195"
        height="227"
        viewBox="0 0 170 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <G filter="url(#filter0_d_750_237)">
          <Path
            d="M155 0C155 25.6078 150.551 50.9648 141.907 74.6233C133.263 98.2818 120.594 119.778 104.622 137.886C88.6507 155.993 69.6895 170.357 48.8215 180.157C27.9535 189.956 5.58736 195 -17 195V0H155Z"
            fill="url(#paint0_linear_750_237)"
          />
        </G>
        <Defs>
          <Filter
            id="filter0_d_750_237"
            x="-57"
            y="-36"
            width="252"
            height="275"
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
            <FeOffset dy="4" />
            <FeGaussianBlur stdDeviation="20" />
            <FeComposite in2="hardAlpha" operator="out" />
            <FeColorMatrix
              type="matrix"
              values="0 0 0 0 0.139423 0 0 0 0 0.483654 0 0 0 0 1 0 0 0 0.25 0"
            />
            <FeBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_750_237"
            />
            <FeBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_750_237"
              result="shape"
            />
          </Filter>
          <LinearGradient
            id="paint0_linear_750_237"
            x1="-17"
            y1="-195"
            x2="-17"
            y2="195"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0.490385" stopColor="#A663F7" />
            <Stop offset="1" stopColor="#3A6D91" />
          </LinearGradient>
        </Defs>
      </Svg>
      <View
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
        }}
      >
        {children}
      </View>
      <Svg
        width="299"
        height="172"
        viewBox="0 0 299 172"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
      >
        <G filter="url(#filter0_d_750_254)">
          <Path
            d="M368.33 47.6415C336.29 38.693 302.281 34.9306 268.244 36.5691C234.208 38.2076 200.811 45.215 169.961 57.1911C139.111 69.1672 111.411 85.8776 88.4431 106.368C65.4753 126.858 47.6894 150.728 36.1008 176.613L280.085 244.755L368.33 47.6415Z"
            fill="url(#paint0_linear_750_254)"
          />
        </G>
        <Defs>
          <Filter
            id="filter0_d_750_254"
            x="0.10083"
            y="0.195557"
            width="412.229"
            height="288.559"
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
            <FeOffset dx="4" dy="4" />
            <FeGaussianBlur stdDeviation="20" />
            <FeComposite in2="hardAlpha" operator="out" />
            <FeColorMatrix
              type="matrix"
              values="0 0 0 0 0.421154 0 0 0 0 0.173077 0 0 0 0 1 0 0 0 0.68 0"
            />
            <FeBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_750_254"
            />
            <FeBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_750_254"
              result="shape"
            />
          </Filter>
          <LinearGradient
            id="paint0_linear_750_254"
            x1="273.365"
            y1="36.3633"
            x2="286.805"
            y2="453.147"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#A25CED" />
            <Stop offset="0.509615" stopColor="#42664E" />
          </LinearGradient>
        </Defs>
      </Svg>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    marginTop: 0,
  },
  textLogo: {
    fontFamily: "Inter-Black",
    fontSize: 20,
    color: "#232323",
  },
});

export default Background;
