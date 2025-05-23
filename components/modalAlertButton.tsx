import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  Dimensions,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";

import Modal from "react-native-modal";

const { width } = Dimensions.get("window");

const proportionalFontSize = (size: number) => {
  const baseWidth = 375; // Ancho base (puedes ajustarlo según tus necesidades)
  return (size * width) / baseWidth;
};

interface CustomModalButtonProps {
  isVisible: boolean;
  toggleModal: () => void;
  modalText: string;
  buttonText: string;
  onPress: () => void;
  onBackdropPress: () => void;
}

const CustomModalButton: React.FC<CustomModalButtonProps> = ({
  isVisible,
  toggleModal,
  modalText,
  buttonText,
  onPress,
  onBackdropPress,
}) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onBackdropPress}>
      <View style={styles.alertmodal}>
        <Text style={styles.modaltext}>{modalText}</Text>
        <Pressable onPress={onPress} style={styles.gologin}>
          <Text style={styles.modaltextbutton}>{buttonText}</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  alertmodal: {
    padding: "5%",
    borderRadius: 40,
    backgroundColor: "rgba(45, 10, 66, 1)",
    alignItems: "center",
    width: "100%",
    height: "20%",
    position: "absolute",
    top: "35%",
    left: "0%",
  },
  modaltext: {
    color: "white",
    textAlign: "center",
    fontSize: proportionalFontSize(20),
    paddingHorizontal: 5, // Añade un poco de padding horizontal para evitar que el texto toque los bordes del contenedor
    lineHeight: proportionalFontSize(24), // Aumenta la altura de línea para mejorar la legibilidad
  },
  modaltextbutton: {
    color: "black",
    textAlign: "center",
    fontSize: proportionalFontSize(20),
    lineHeight: proportionalFontSize(24), // Aumenta la altura de línea para mejorar la legibilidad
  },
  gologin: {
    top: "70%",
    position: "absolute",
    justifyContent: "center",
    width: "60%",
    height: "35%",
    backgroundColor: "white",
    borderRadius: 5,
    alignItems: "center",
  },
});
export default CustomModalButton;
