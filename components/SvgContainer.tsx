import React, { useEffect, useState } from "react";
import { Keyboard, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SvgFlotante from "@/assets/svgs/svgFlotante";
import Svg from "react-native-svg";
const { height, width } = Dimensions.get("window");

const SvgContainer = ({ children }) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideListener = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        position: "absolute",
        top: keyboardVisible ? "20%" : "40%",
        width: width,
        height: height * 0.4,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SvgFlotante width={400} height={460} />

      <View
        style={{
          position: "absolute",
          top: keyboardVisible ? "6%" : "4%",
          width: "80%",
          height: keyboardVisible ? "60%" : "80%",
          alignItems: "center",
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

export default SvgContainer;
