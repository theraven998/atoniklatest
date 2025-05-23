import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useAppTheme } from "@/constants/theme/useTheme";
import { useWindowDimensions } from 'react-native';
type Props = {
  currentStep: number;   // de 1 a totalSteps
  totalSteps: number;    // número total de secciones
  activeColor?: string;  // color de progreso
  inactiveColor?: string; // color base
};

export default function ProgressStepsBar({

  currentStep,
  totalSteps,
  activeColor, 
  inactiveColor,
}: Props) {
  const theme = useAppTheme();

  // Establecer colores por defecto si no vienen como prop
  const finalActiveColor = activeColor || theme.colors.primary;
  const finalInactiveColor = inactiveColor || theme.colors.separator;

  const progressWidth = useSharedValue(0);  
  useEffect(() => {

    progressWidth.value = 0;
    if (currentStep > 0) {
      progressWidth.value = withTiming(100, { duration: 600 });
    }
  }, [currentStep]);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isCurrent = currentStep === step;
        const isPassed = step < currentStep;

        const animatedStyle = useAnimatedStyle(() => {
            return {
              width: isCurrent ? `${progressWidth.value}%` : '100%',
              backgroundColor: isCurrent || isPassed ? finalActiveColor : finalInactiveColor,
            };
          });

        return (
          <View
            key={index}
            style={[styles.stepWrapper, {backgroundColor:theme.colors.separator},index < totalSteps - 1 && styles.separator]}
          >
            <Animated.View style={[styles.step, animatedStyle]} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 4,
    width: '100%',
    marginVertical: 20,
    borderRadius: 0,
    overflow: 'hidden',
  },
  stepWrapper: {
    flex: 1,
    borderRadius: 1,
    overflow: 'hidden',
  },
  step: {
    height: '100%',
    borderRadius: 4,
  },
  separator: {
    marginRight: 4,
  },
});
