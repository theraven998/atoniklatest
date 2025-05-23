import { Animated, Text, useColorScheme } from "react-native";
import React, { useEffect, useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
}

const AnimatedNumber = ({ value, duration = 1500 }: AnimatedNumberProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const currentValue = useRef(0);
  const [displayValue, setDisplayValue] = React.useState(0);
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === "dark";
  useEffect(() => {
    animatedValue.addListener(({ value }) => {
      currentValue.current = value;
      setDisplayValue(Math.floor(value));
    });

    animatedValue.setValue(currentValue.current); // Reset animatedValue to the current value
    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();

    return () => {
      animatedValue.removeAllListeners();
    };
  }, [value]);

  return (
    <Text
      style={{
        fontSize: 20,
        fontWeight: "bold",
        color: isDarkMode ? "#BB86FC" : "#6200EE",
      }}
    >
      {displayValue}
    </Text>
  );
};
export default AnimatedNumber;
