import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { useFonts } from "expo-font";
const BotonRegister = ({
  textboton,
  onPress,
  width = styles.quieroserbutton.width,
  height = styles.quieroserbutton.height,
}: {
  textboton: string;
  onPress: () => void;
  width?: number;
  height?: number;
}) => {
  return (
    <TouchableOpacity
      style={[styles.quieroserbutton, { width, height }]}
      onPress={onPress}
    >
      <Text
        style={{
          color: "white",
          fontFamily: "Inter-ExtraLightItalic",
          fontSize: 28,
          textAlign: "center",
          width: "100%",
        }}
      >
        {textboton}
      </Text>
    </TouchableOpacity>
  );
};

export default BotonRegister;
const styles = StyleSheet.create({
  quieroserbutton: {
    width: width * 0.5,
    height: height * 0.065,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6438D7", // Color principal
    borderColor: "#321c6b", // Color del borde
    borderRadius: 15,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    shadowRadius: 5,
    elevation: 5, // Sombra en Android
  },
});
