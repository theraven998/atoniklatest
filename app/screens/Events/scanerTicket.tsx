import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, View, Text, Button, Touchable, TouchableOpacity } from "react-native";
import { CameraView } from "expo-camera";
import Modal from "react-native-modal";
import { useState, useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Overlay } from "./Overlay";
import url from "../../../constants/url.json";
import { AntDesign, MaterialIcons } from "@expo/vector-icons"; // Iconos para darle estilo
import { Stack } from "expo-router";
import AwesomeButton, { ThemedButton } from "react-native-really-awesome-button";
export default function Home() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState(""); // Para manejar diferentes estilos de modal

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const scanTicket = async (id) => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        throw new Error("Token no encontrado");
      }

      const response = await fetch(`${url.url}/api/tickets/scan/state/${id}/${eventId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token a los headers
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        if (response.status === 200) {
          // Ticket escaneado exitosamente
          setModalMessage("¡Ticket escaneado y validado con éxito!\n¡Disfrute de su evento!");

          setModalType("success");
        } else if (response.status === 208) {
          // Ticket ya escaneado
          setModalMessage("Este ticket, ya ha sido escaneado anteriormente");
          setModalType("warning");
        }
      } else {
        const errorMessage = await response.text();
        throw new Error(`Error al escanear el ticket: ${errorMessage}`);
      }

      setModalVisible(true); // Mostrar modal
    } catch (error) {
      // Error al escanear el ticket
      setModalMessage("Hubo un error al intentar escanear el ticket.\n Por favor, inténtalo de nuevo");
      setModalType("error");
      setModalVisible(true); 
      console.error("Error fetching events:", error.message);
    }
  };

  const handleScan = async (id) => {

    try {
      await scanTicket(id);
    } catch (error) {
      console.error("Error al manejar el escaneo:", error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    qrLock.current = false; // Reset qrLock when modal is closed
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
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

      {/* Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        animationIn="slideInUp"  // Animación de entrada
        animationOut="slideOutDown" // Animación de salida
        backdropTransitionOutTiming={0}
      >
        <View
          style={[
            styles.modalContainer,
            modalType === "success" && styles.successModal,
            modalType === "warning" && styles.warningModal,
            modalType === "error" && styles.errorModal,
          ]}
        >
          {modalType === "success" && <AntDesign name="checkcircle" size={50} color="#44d644" />}
          {modalType === "warning" && <MaterialIcons name="warning" size={50} color="#5a5103" />}
          {modalType === "error" && <AntDesign name="closecircle" size={50} color="red" />}
          
          <Text style={styles.modalText}>{modalMessage}</Text>
          <ThemedButton
  name="rick"
  type="danger"
  onPress={() => { setModalVisible(false)
    qrLock.current = false;
  }}
  backgroundColor={
    modalType === "success"
      ? "#4df34d"
      : modalType === "warning"
      ? "#ffe605"
      : "red"
  }
  backgroundActive={
    modalType === "success"
      ? "#54af4c"
      : modalType === "warning"
      ? "#fad400"
      : "#D32F2F"
  }
  borderColor={
    modalType === "success"
      ? "#388E3C"
      : modalType === "warning"
      ? "#856404"
      : "#B71C1C"
  }
  backgroundDarker={
    modalType === "success"
      ? "#33993a"
      : modalType === "warning"
      ? "#bd9100"
      : "#9A0007"
  }
  width={200}
  height={70}
  raiseLevel={10}
  borderRadius={20}
>
  <View style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
    <Text  style={[
    styles.placeholderText,
    modalType === "success" && styles.placeholderTextBlack,
    modalType === "warning" && styles.placeholderTextBlack,

  ]}>Volver</Text>
  </View>
</ThemedButton>

        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalText: {
    fontSize: 21,
    marginTop:"10%",
    color:"#000000",
    fontWeight:"300",
    marginBottom: "10%",
    textAlign: "center",
    width:"90%"
  },
  successModal: {
    backgroundColor: "#c3fcd0",
  },
  warningModal: {
    backgroundColor: "#fff280",
  },
  errorModal: {
    backgroundColor: "#ff9da5",
  },
  placeholderText: {
    color: "white",
    fontSize: 20,
    fontWeight:"200",
    textAlign: "center",
    
  },
  placeholderTextBlack: {
    color: "#000000",
    fontSize: 20,
    fontWeight:"200",
    textAlign: "center",

  },
  
});
