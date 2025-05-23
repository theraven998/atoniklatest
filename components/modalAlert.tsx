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
import { useAppTheme } from "@/constants/theme/useTheme";

import Modal from "react-native-modal";

const { width } = Dimensions.get("window");

const proportionalFontSize = (size: number) => {
  const baseWidth = 375; // Ancho base (puedes ajustarlo según tus necesidades)
  return (size * width) / baseWidth;
};

interface CustomModalProps {
  isVisible: boolean;
  toggleModal: () => void;
  modalText: string;
  onBackdropPress: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  toggleModal,
  modalText,
  onBackdropPress,
}) => {
  const theme = useAppTheme();
  return (
    <Modal isVisible={isVisible} onBackdropPress={onBackdropPress as any}>
      <View
        style={{ ...styles.alertmodal, backgroundColor: theme.colors.primary }}
      >
        <Text style={styles.modaltext}>{modalText}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  alertmodal: {
    padding: "5%",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: "15%",
    position: "absolute",
    top: "30%",
    left: "5%",
  },
  modaltext: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    fontSize: proportionalFontSize(18),
    paddingHorizontal: 5, // Añade un poco de padding horizontal para evitar que el texto toque los bordes del contenedor
    lineHeight: proportionalFontSize(20), // Aumenta la altura de línea para mejorar la legibilidad
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
export default CustomModal;
