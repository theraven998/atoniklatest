import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useFonts } from "expo-font";
import SvgContainer from "@/components/SvgContainer";
import Logo from "@/components/Logo";
import BotonRegister from "@/components/botonRegister";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import url from "@/constants/url.json";
import { router, useLocalSearchParams } from "expo-router";
import ModalRounded from "@/components/ModalRounded";
import { Dimensions } from "react-native";
import { enableScreens } from "react-native-screens";
import { useAppTheme } from "@/constants/theme/useTheme";
import { useColorScheme } from "react-native";
import Background from "@/components/Background";
const { width, height } = Dimensions.get("window");
const Nombre = () => {
  enableScreens(false);
  const theme = useAppTheme();
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState<string>("");
  const { username, phoneNumber } = useLocalSearchParams();
  const [nombre, setNombre] = useState<string>("");
  const [isModalRoundedVisible, setModalRoundedVisible] =
    useState<boolean>(false);
  const [modalRoundedText, setModalRoundedText] = useState<string>("");
  const [modalTextButton, setModalTextButton] = useState<string>("");

  const [fontsLoaded] = useFonts({
    "Inter-ExtraLightItalic": require("@/assets/fonts/Inter-4.0/extras/ttf/InterDisplay-ExtraLightItalic.ttf"),
    "Roboto-Medium": require("@/assets/fonts/Roboto-Medium.ttf"),
  });
  const goToNextStep = () => {
    if (nombre.length < 8) {
      setModalRoundedText(
        "El nombre y apellido debe ser de mas de 8 caracteres"
      );
      setModalTextButton("Entendido");
      setModalRoundedVisible(true);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setModalRoundedText("Por favor, ingresa un correo electrónico válido");
      setModalTextButton("Entendido");
      setModalRoundedVisible(true);
      return;
    }
    console.log("Nombre:", nombre);
    console.log("Telefono:", phoneNumber);
    console.log("Username:", username);
    router.push({
      pathname: "/screens/Account/Edad",
      params: {
        email: email,
        phoneNumber: phoneNumber,
        username: username,
        nombre: nombre,
      },
    });
  };
  if (!fontsLoaded) {
    return null;
  }
  return (
    <Background>
      <StatusBar style="light" backgroundColor="#000000" />

      <View style={styles.overlay}>
        <Logo existsDerechos={false} />
        <SvgContainer>
          <View
            style={{
              width: "90%",
              height: height * 0.32,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: "15%",
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Inter-ExtraLightItalic",
                fontSize: 24,
                textAlign: "center",
                width: "100%",
              }}
            >
              {" "}
              Escribe tu nombre y apellido
            </Text>
            <TextInput
              style={{
                width: "100%",
                height: "15%",
                borderBottomWidth: 1,
                borderBottomColor: "#FFFFFF",
                fontFamily: "Inter-ExtraLightItalic",
                borderRadius: 20,
                textAlign: "center",
                marginBottom: "12%",
                fontSize: 24,
                color: "white",
              }}
              value={nombre}
              onChangeText={(text) => setNombre(text)}
              maxLength={20}
              autoCorrect={false}
              autoComplete="off"
              autoFocus={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                goToNextStep();
              }}
              blurOnSubmit={false}
              enablesReturnKeyAutomatically={true}
              textContentType="username"
              keyboardType="default"
              placeholder="Ej: Juan Perez"
              placeholderTextColor="#494848"
              autoCapitalize="words"
            />
            <Text
              style={{
                color: "white",
                fontFamily: "Inter-ExtraLightItalic",
                fontSize: 24,
                textAlign: "center",
                width: "100%",
              }}
            >
              {" "}
              Escribe tu correo electronico
            </Text>
            <TextInput
              style={{
                width: "100%",
                height: "20%",
                borderBottomWidth: 1,
                borderBottomColor: "#FFFFFF",
                fontFamily: "Inter-ExtraLightItalic",
                borderRadius: 20,
                textAlign: "center",
                fontSize: 24,
                color: "white",
                marginBottom: "15%",
              }}
              value={email}
              onChangeText={(text) => setEmail(text)}
              maxLength={50}
              autoCorrect={false}
              autoComplete="email"
              autoFocus={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                goToNextStep();
              }}
              blurOnSubmit={false}
              enablesReturnKeyAutomatically={true}
              textContentType="emailAddress"
              keyboardType="email-address"
              placeholder="Ej: correo@ejemplo.com"
              placeholderTextColor="#494848"
              autoCapitalize="none"
            />
            <BotonRegister
              textboton="Continuar"
              onPress={() => goToNextStep()}
              width={width * 0.4}
              height={height * 0.06}
            />
          </View>
        </SvgContainer>
      </View>
      <ModalRounded
        text={modalRoundedText}
        textbutton={modalTextButton}
        isVisible={isModalRoundedVisible}
        onClose={() => {
          setModalRoundedVisible(false);
        }}
      />
    </Background>
  );
};

export default Nombre;

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
});
