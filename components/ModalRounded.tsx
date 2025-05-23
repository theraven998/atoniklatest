import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import React from "react";
import BotonRegister from "./botonRegister";
import { useFonts } from "expo-font";
const ModalRounded = ({
  text,
  isVisible,
  textbutton,
  onClose,
}: {
  text: string;
  isVisible: boolean;
  textbutton: string;
  onClose: () => void;
}) => {
  const [fontsLoaded] = useFonts({
    "Inter-ExtraLightItalic": require("@/assets/fonts/Inter-4.0/extras/ttf/InterDisplay-ExtraLightItalic.ttf"),
    "Roboto-ExtraLight.ttf": require("@/assets/fonts/Roboto-ExtraLight.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <Modal transparent visible={isVisible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{text}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>{textbutton}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalRounded;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
  },
  modalContainer: {
    width: "75%",
    height: "32%", // Siempre ocupará la mitad de la pantalla
    backgroundColor: "#301446",
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  modalText: {
    fontFamily: "Inter-ExtraLightItalic",
    fontSize: 24,
    marginBottom: "15%",
    color: "white",
    textAlign: "center",
  },
  closeButton: {
    width: "70%",
    height: "35%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#722D86", // Color principal
    borderRadius: 15,
    borderColor: "#430857", // Borde más oscuro
    borderBottomWidth: 5,
    borderRightWidth: 5,
    shadowColor: "#5E0D75", // Añade sombra
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Sombra en Android
  },
  closeButtonText: {
    fontFamily: "Roboto-ExtraLight.ttf",
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
});
