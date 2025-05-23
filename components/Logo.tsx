import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";
import logoDark from "@/assets/images/logo.png";
import logoLight from "@/assets/images/logoLight.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Dimensions } from "react-native";
import { useAppTheme } from "@/constants/theme/useTheme";
import { useColorScheme } from "react-native";
const { width, height } = Dimensions.get("window");

interface LogoProps {
  existsDerechos: boolean;
  width?: string | number;
  existsLetter?: boolean;
  height?: string | number;
  position?: "top" | "center" | "bottom";
}

const Logo = ({
  existsDerechos,
  width: customWidth,
  height: customHeight,
  existsLetter = true,
}: LogoProps) => {
  const theme = useAppTheme();
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    "Inter-Black": require("@/assets/fonts/Inter/Inter-Black.ttf"),
    "Inter-Bold": require("@/assets/fonts/Inter/InterBold.ttf"),
  });

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return null; // No renderizar hasta que las fuentes estén cargadas
  }

  return (
    <SafeAreaView
      style={{
        position: "absolute",
        top: keyboardVisible ? "2%" : "10%",
        width: customWidth || width,
        height:
          customHeight || (keyboardVisible ? height * 0.18 : height * 0.25),
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: width * 0.05, // Add padding for responsiveness
      }}
    >
      <Image
        style={[
          styles.logo,
          {
            width: keyboardVisible ? "60%" : "40%",
            height: keyboardVisible ? "60%" : "80%",
          },
        ]}
        source={colorScheme === "dark" ? logoDark : logoLight}
      />
      {existsLetter ? (
        <Text
          style={{
            color: colorScheme === "dark" ? "white" : theme.colors.primary,
            fontFamily: "Inter-Black",
            fontSize: keyboardVisible ? 48 : 64,
            textAlign: "center",
          }}
        >
          AtoniK
        </Text>
      ) : null}
      {/* <Text
        style={{
          color: colorScheme === "dark" ? "white" : theme.colors.primary,
          fontFamily: "Inter-Black",
          fontSize: keyboardVisible ? 48 : 64,
          textAlign: "center",
        }}
      >
        AtoniK
      </Text> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    resizeMode: "contain",
  },
});

export default Logo;
