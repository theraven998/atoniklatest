// components/LiquidProgressBar.tsx

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, { Path, Defs, ClipPath, Rect } from "react-native-svg";
import LottieView from "lottie-react-native";

import { useAppTheme } from "@/constants/theme/useTheme";
const LiquidProgressBar = () => {
const { colors } = useAppTheme();
  const [progress] = useState(new Animated.Value(0));
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false,
    }).start(() => {
      setCompleted(true);
    });
  }, []);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      {!completed && (
        <>
          <Text style={styles.text}>Validando...</Text>
          <View style={styles.progressContainer}>
            <Svg height="20" width="100%" style={{ position: "absolute" }}>
              <Defs>
                <ClipPath id="clip">
                  <Rect x="0" y="0" width="100%" height="20" />
                </ClipPath>
              </Defs>
              <Path
           
                fill="#b13ec0"
                clipPath="url(#clip)"
              />
            </Svg>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width,
                  backgroundColor: colors.background,
                },
              ]}
            />
          </View>
        </>
      )}

      {completed && (
        <View style={styles.checkContainer}>
          <LottieView
            source={require("@/assets/json/check.json")} // Usa tu animación aquí
            autoPlay
            loop={false}
            style={{ width: 100, height: 100 }}
          />
          <Text style={styles.successText}>¡Validado!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    marginTop: 50,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  progressContainer: {
    width: "80%",
    height: 20,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    overflow: "hidden",
    justifyContent: "center",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
  },
  checkContainer: {
    alignItems: "center",
  },
  successText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
  },
});

export default LiquidProgressBar;
