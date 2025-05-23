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
import React, { useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Background from "@/components/Background";
const { width, height } = Dimensions.get("window");
const UserGoogle = () => {
  const { email, familyName, givenName, id, name, photo } =
    useLocalSearchParams();
  const [username, setUsername] = useState<string>("");
  const [isModalRoundedVisible, setModalRoundedVisible] =
    useState<boolean>(false);
  const [modalRoundedText, setModalRoundedText] = useState<string>("");
  const [modalTextButton, setModalTextButton] = useState<string>("");
  useEffect(() => {
    console.log("Entrando a usergoogle");
    console.log("Email:", email);
    console.log("Family Name:", familyName);
    console.log("Given Name:", givenName);
    console.log("ID:", id);
    console.log("Name:", name);
    console.log("Photo:", photo);
  }, []);
  const registerInDataBase = async () => {
    try {
      const response = await axios.post(`${url.url}/fast_register`, {
        name,
        email,
        photo,
        familyName,
        givenName,
        id,
        username,
      });
      if (response.status === 201) {
        const token = response.data.access_token;
        await AsyncStorage.setItem("access_token", response.data.access_token);
        console.log("Token obtenido de la respuesta:", token);
        router.replace({
          pathname: "/(tabs)/home",
          params: {
            username: username,
            photo: photo,
          },
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Error response:", error.response.data);
          setModalRoundedText(
            `Error al registrar el usuario: ${
              error.response.data.msg || "Error desconocido"
            }`
          );
          setModalTextButton("Aceptar");
          setModalRoundedVisible(true);
        } else {
          console.error("Error message:", error.message);
          setModalRoundedText(
            `Error al registrar el usuario: ${error.message}`
          );
          setModalTextButton("Aceptar");
          setModalRoundedVisible(true);
        }
      } else {
        console.error("Unexpected error:", error);
        setModalRoundedText(
          "Hubo un error inesperado al registrar el usuario. Por favor, inténtalo de nuevo."
        );
        setModalTextButton("Aceptar");
        setModalRoundedVisible(true);
      }
    }
  };
  const checkUsername = async (username: string) => {
    if (!username) {
      setModalRoundedText("Por favor, ingresa un nombre de usuario.");
      setModalTextButton("Aceptar");
      setModalRoundedVisible(true);
      return;
    }
    try {
      const response = await axios.get(`${url.url}/check_user/${username}`);
      if (response.status === 200) {
        registerInDataBase();
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setModalRoundedText(
          "El nombre de usuario ya está en uso, por favor elige otro."
        );
        setModalTextButton("Aceptar");
        setModalRoundedVisible(true);
      } else {
        console.error("Error checking username:", error);
      }
    }
  };
  const [fontsLoaded] = useFonts({
    "Inter-ExtraLightItalic": require("@/assets/fonts/Inter-4.0/extras/ttf/InterDisplay-ExtraLightItalic.ttf"),
    "Roboto-Medium": require("@/assets/fonts/Roboto-Medium.ttf"),
  });
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
              height: "90%",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "15%",
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Inter-ExtraLightItalic",
                fontSize: 28,
                marginTop: "0%",
                textAlign: "center",
                width: "100%",
              }}
            >
              {" "}
              Escribe tu nombre de usuario
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
              value={username}
              onChangeText={(text) => setUsername(text)}
              maxLength={20}
              autoCorrect={false}
              autoComplete="off"
              autoFocus={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                checkUsername(username);
              }}
              blurOnSubmit={false}
              enablesReturnKeyAutomatically={true}
              textContentType="username"
              keyboardType="default"
              placeholder="Ej: usuariodeatonik"
              placeholderTextColor="#FFFFFF"
              autoCapitalize="none"
            />
            <BotonRegister
              textboton="Continuar"
              onPress={() => checkUsername(username)}
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

export default UserGoogle;

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
