import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
const SignUpGoogle = ({ onPress }: { onPress: () => void }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.googleButton}>
        <Image
          source={require("@/assets/images/sign_up_light.png")}
          style={styles.googleIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SignUpGoogle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: "0%",
    justifyContent: "center",
    alignItems: "center",
  },
  googleButton: {
    borderRadius: 20,
    height: height * 0.065,
    paddingHorizontal: 5,
    width: width * 0.85,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  googleIcon: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
  buttonText: {
    color: "#e3e3e3",
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "500",
  },
});
