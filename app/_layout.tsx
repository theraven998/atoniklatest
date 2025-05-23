import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context"; // ✅ Importado
import { useAppTheme } from "@/constants/theme/useTheme";
import { useColorScheme, useWindowDimensions } from "react-native";
import { StyleSheet } from "react-native";
import React, { useState, useCallback } from "react";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};
import CustomHeader from "@/components/headers/customHeader";
SplashScreen.preventAutoHideAsync();
SplashScreen.hideAsync();

export default function RootLayout() {
  const { height, width } = useWindowDimensions();
  return (
    <SafeAreaProvider>
      {" "}
      {/* ✅ Envolvemos toda la app */}
      <RootLayoutNav />
    </SafeAreaProvider>
  );
}

export const linking = {
  prefixes: [
    "https://go.atonikapp.com",
    "atonik://",
  ],
  config: {
    screens: {
      "(tabs)": {
        screens: {
          home: "home",
        },
      },
      event: {
        path: "event/:eventoId",
        parse: {
          eventoId: (id: string) => id,
        },
      },
    },
  },
};

function RootLayoutNav() {
  const [isAppReady, setIsAppReady] = useState(false);
  const theme = useAppTheme();
  const colorScheme = useColorScheme();
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        headerStyle: {
          backgroundColor: "#301446",
        },
        contentStyle: {
          backgroundColor: "#000", // 📌 Fondo oscuro para todas las pantallas
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="screens/Events/SeatMap"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="screens/Payment/Select"
        options={{
          header: () => <CustomHeader title="Select Payment" />, // Usando el header reutilizable
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text, // Cambiar el color de la flecha
        }}
      />
      <Stack.Screen
        name="screens/Payment/Card"
        options={{
          header: () => <CustomHeader title="Card Details" />, // Usando el header reutilizable
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text, // Cambiar el color de la flecha
        }}
      />
      <Stack.Screen
        name="screens/Payment/Resume"
        options={{
          header: () => <CustomHeader title="Card Details" />, // Usando el header reutilizable
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text, // Cambiar el color de la flecha
        }}
      />
      <Stack.Screen
        name="screens/Payment/CheckCard"
        options={{
          headerShown: true,
          title: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
        }}
      />
      <Stack.Screen
        name="screens/Account/ChangePassword"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/Account/User"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/Account/UserGoogle"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/Account/Number"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/Account/Nombre"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/Account/Edad"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/Account/Password"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/Account/Register"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/Account/UserProfile"
        options={{
          headerShown: true,
          title: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: colorScheme === "dark" ? "#fff" : "#000", // Cambiar el color de la flecha
        }}
      />
      <Stack.Screen name="screens/Payment/NequiForm" options={{}} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // 📌 Fondo oscuro para toda la aplicación
  },
});
