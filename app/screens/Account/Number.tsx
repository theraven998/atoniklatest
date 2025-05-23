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
import { router, useLocalSearchParams, useRouter } from "expo-router";
// import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import ModalRounded from "@/components/ModalRounded";
import Background from "@/components/Background";
import { Dimensions } from "react-native";
import { LightTheme, DarkTheme } from "@/constants/theme/themes";
import { Theme } from "@/constants/theme/types";
import { useAppTheme } from "@/constants/theme/useTheme";
import { useColorScheme } from "react-native";
const { width, height } = Dimensions.get("window");
const Number = () => {
  const theme = useAppTheme();
  const colorScheme = useColorScheme();
  const { username } = useLocalSearchParams();
  const [isVerified, setIsVerified] = useState(false);
  const [number, setNumber] = useState<string>("");
  const router = useRouter();
  const [code, setCode] = useState<string>("");
  const [confirmation, setConfirmation] = useState<any>(null);
  const [isModalRoundedVisible, setModalRoundedVisible] =
    useState<boolean>(false);
  const [modalRoundedText, setModalRoundedText] = useState<string>("");
  const [modalTextButton, setModalTextButton] = useState<string>("");

  const signInWithPhoneNumber = async (phoneNumber: string) => {
    const formattedNumber = `+57${phoneNumber}`;
    try {
      // const confirmation = await auth().signInWithPhoneNumber(formattedNumber);
      setConfirmation(confirmation);
      console.log("Código enviado");
    } catch (error) {
      console.error("Error al enviar el código:", error);
    }
  };
  const confirmCode = async (code: string) => {
    try {
      const userCredential = await confirmation.confirm(code);
      const user = userCredential.user;
      console.log("Código confirmado");
      router.push({
        pathname: "/screens/Account/Nombre",
        params: {
          phoneNumber: number,
          username: username,
        },
      });
    } catch (error) {
      console.error("Error al confirmar el código:", error);
      Alert.alert(
        "Error",
        "El código ingresado es incorrecto. Por favor, inténtalo de nuevo.",
        [
          {
            text: "OK",
            onPress: () => {
              console.log("Código incorrecto");
            },
          },
        ]
      );
    }
  };

  const checkPhone = async (number: any) => {
    try {
      const response = await axios.get(`${url.url}/check_phone/${number}`);
      if (response.status === 200) {
        console.log("Número de teléfono disponible");
        setIsVerified(true);
        await signInWithPhoneNumber(number);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setModalRoundedText(
          "El número de teléfono ya está en uso, por favor elige otro."
        );
        setModalTextButton("Aceptar");
        setModalRoundedVisible(true);
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
      <View style={styles.overlay}>
        <Logo existsDerechos={false} />
        <SvgContainer>
          <View
            style={{
              width: "90%",
              height: "90%",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: "0%",
            }}
          >
            {!confirmation ? (
              <View
                style={{
                  width: "90%",
                  height: "90%",
                  alignItems: "center",
                  position: "absolute",
                  top: "8%",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Inter-ExtraLightItalic",
                    fontSize: 28,
                    marginBottom: "5%",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  {" "}
                  Escribe tu número de teléfono
                </Text>

                <TextInput
                  style={{
                    width: "100%",
                    height: height * 0.05,
                    borderBottomWidth: 1,
                    borderBottomColor: 'white',
                    fontFamily: "Inter-ExtraLightItalic",
                    borderRadius: 20,
                    textAlign: "center",
                    fontSize: 24,
                    marginBottom: "15%",
                    color: 'white',
                  }}
                  value={number}
                  onChangeText={(text) => setNumber(text)}
                  maxLength={10}
                  autoCorrect={false}
                  autoComplete="off"
                  keyboardType="phone-pad"
                  placeholder="Ej: 3208435424"
                  placeholderTextColor="#c0c0c0"
                />
                <BotonRegister
                  textboton="Continuar"
                  onPress={() => checkPhone(number)}
                />
              </View>
            ) : (
              <View
                style={{
                  width: "100%",
                  height: height * 0.32,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  top: "0%",
                  
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Inter-ExtraLightItalic",
                    fontSize: 24,
                    textAlign: "center",
                    width: "100%",
                    marginBottom: "7%",

                  }}
                >
                  {" "}
                  Escribe el codigo de verificacion que llego a tu telefono
                </Text>
                <TextInput
                  style={{
                    width: "100%",
                    height: height * 0.05,
                    borderBottomWidth: 1,
                    borderBottomColor: 'white',
                    fontFamily: "Inter-ExtraLightItalic",
                    borderRadius: 20,
                    textAlign: "center",
                    fontSize: 24,
                    marginBottom: "15%",
                    color: 'white',
                  }}
                  value={code}
                  onChangeText={(text) => setCode(text)}
                  maxLength={6}
                  autoCorrect={false}
                  autoComplete="off"
                  autoFocus={true}
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    confirmCode(code);
                  }}
                  blurOnSubmit={false}
                  enablesReturnKeyAutomatically={true}
                  textContentType="oneTimeCode"
                  keyboardType="numeric"
                  placeholder="EJ. 123456"
                  placeholderTextColor="#575757"
                  autoCapitalize="none"
                />
                <BotonRegister
                  textboton="Verificar"
                  onPress={() => confirmCode(code)}
                />
              </View>
            )}
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

export default Number;

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
