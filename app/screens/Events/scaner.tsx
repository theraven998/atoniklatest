import { Camera, CameraView } from "expo-camera";
import { Stack } from "expo-router";
import {
  AppState,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Overlay } from "./Overlay";
import { useEffect, useRef } from "react";
import { useNavigation } from '@react-navigation/native'; 
import url from "../../../constants/url.json"
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Home() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const navigation = useNavigation();
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const fetchEvents = async (id:any) => {

    try {
      const token = await AsyncStorage.getItem('access_token'); // Obtiene el token del almacenamiento
  
      if (!token) {
        throw new Error('Token no encontrado');
      }
  
      const response = await fetch(`${url.url}/api/tickets/scan/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token a los headers
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error al obtener los eventos: ${errorMessage}`);
      }
  
      const data = await response.json();
  
    } catch (error) {
      console.error('Error fetching events:', error.message);
    } finally {

    }
  };
 
const handleScan = async (id) => {

  try {
    
    await fetchEvents(id); // Asume que fetchEvents es una función async
    // Navega hacia atrás después de que fetchEvents se complete
 
    navigation.goBack();
  } catch (error) {
    console.error("Error al manejar el escaneo:", error);
  }
};
  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            setTimeout(async () => {
              await handleScan(data);
            }, 500);
          }
        }}
      />
      <Overlay />
    </SafeAreaView>
  );
}