import React, { useState, useLayoutEffect } from "react";
import {
  View,
  TextInput,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import axios from "axios";
import { useNavigation, router } from "expo-router";
import { useFonts } from "expo-font";
import Background from "@/components/Background";
import SvgContainer from "@/components/SvgContainer";
import Logo from "@/components/Logo";
// import auth from "@react-native-firebase/auth";

import url from "../../../constants/url.json";
import CustomModal from "@/components/modalAlert";
import { useColorScheme } from "react-native";
import { Dimensions } from "react-native";
import { useAppTheme } from "@/constants/theme/useTheme";
import ModalRounded from "@/components/ModalRounded";
const { width, height } = Dimensions.get("window");
const VerificationPassword: React.FC = () => {
  const theme = useAppTheme();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [AlertText, setAlertText] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [modalRoundedText, setModalRoundedText] = useState<string>("");
  const [isModalRoundedVisible, setModalRoundedVisible] =
    useState<boolean>(false);
  const [modalTextButton, setModalTextButton] = useState<string>("");

  const signInWithPhoneNumber = async () => {
    const formattedNumber = `+57${phoneNumber}`;
    try {
      // const confirmation = await auth().signInWithPhoneNumber(formattedNumber);
      setConfirmation(confirmation);
      console.log("Código enviado");
      setIsCodeSent(true);
    } catch (error) {
      console.error("Error al enviar el código:", error);
    }
  };
  const confirmCode = async () => {
    try {
      const userCredential = await confirmation.confirm(verificationCode);
      const user = userCredential.user;
      console.log("Código confirmado");
      router.push({
        pathname: "/screens/Account/ChangePassword",
        params: {
          phoneNumber: phoneNumber,
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

  const checkPhone = async () => {
    try {
      const response = await axios.get(
        `${url.url}/check_phone_db/${phoneNumber}`
      );
      if (response.status === 200) {
        console.log("Número de teléfono encontrado en la base de datos ");
        setIsCodeSent(true);
        startTimer();

        await signInWithPhoneNumber(phoneNumber);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setModalRoundedText(
          "El número de teléfono no esta asociado a una cuenta, verificalo."
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
  const showModalAlert = (message: string) => {
    setAlertText(message);
    setAlertVisible(true);
  };
  const toggleAlert = () => {
    setAlertVisible(!isAlertVisible);
  };
  const sendVerificationCode = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert("Error", "Por favor ingrese un número de teléfono válido.");
      return;
    }

    try {
      const response = await axios.post(
        `${url.url}/api/send_verification_code`,
        {
          phone: phoneNumber,
        }
      );

      if (response.status === 200) {
        setIsCodeSent(true);
        startTimer();
      }
    } catch (error) {
      console.error(error);
      showModalAlert("Hubo un problema al enviar el código de verificación.");
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // const handleContinue = async () => {
  //   if (verificationCode.length !== 6) {
  //     Alert.alert(
  //       "Error",
  //       "Por favor ingrese un código de verificación válido."
  //     );
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(`${url.url}/api/verify_code`, {
  //       phone: phoneNumber,
  //       code: verificationCode,
  //     });

  //     if (response.status === 200) {
  //       Alert.alert("El código de verificación correcto.");
  //       router.push({
  //         pathname: "/screens/Account/ChangePassword",
  //         params: { phoneNumber },
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error verifying code:", error);
  //     Alert.alert(
  //       "Error",
  //       "Hubo un problema al verificar el código de verificación."
  //     );
  //   }
  // };

  return (
    <Background>
      <View style={styles.overlay}>
        <Logo existsDerechos={false} />
        <SvgContainer>
          <View style={styles.cajabienvenida}>
            {!isCodeSent ? (
              <Text
                style={{
                  color: "white",
                  fontFamily: "Inter-Bold",
                  fontSize: 24,
                  textAlign: "center",
                  position: "absolute",
                  top: "5%",
                  width: "100%",
                }}
              >
                Ingresa tu numero de{"\n"} telefono
              </Text>
            ) : (
              <Text
                style={{
                  color: "white",
                  fontFamily: "Inter-Bold",
                  fontSize: 20,
                  position: "absolute",
                  textAlign: "center",
                  width: "90%",
                  lineHeight: 28,
                  paddingHorizontal: 10,
                }}
              >
                Ingresa el código que llegó {"\n"} a los SMS de tu {"\n"}{" "}
                teléfono
              </Text>
            )}
          </View>

          <View style={styles.cajainputs}>
            {!isCodeSent ? (
              <TextInput
                style={styles.input}
                placeholder="Teléfono sin prefijo"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            ) : (
              <TextInput
                style={styles.input}
                placeholder="Código"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                keyboardType="numeric"
                value={verificationCode}
                onChangeText={setVerificationCode}
              />
            )}
          </View>

          <View style={styles.cajabotones}>
            {isCodeSent ? (
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.primary,
                  marginTop: "30%",
                  borderColor: "#321c6b", // Color del borde
                  borderRadius: 15,
                  borderBottomWidth: 5,
                  borderRightWidth: 5,
                  shadowRadius: 5,
                  elevation: 5, // Sombra en Android
                  marginVertical: 10,
                  paddingHorizontal: 10,
                  justifyContent: "space-around",
                  alignItems: "center",
                  flexDirection: "row",
                  height: height * 0.06,
                  width: "92%", // Ensure the button width is responsive
                  alignSelf: "center", // Center the button horizontally
                }}
                onPress={confirmCode}
              >
                <Text
                  style={{
                    ...styles.buttonText,
                    color: "white",
                    fontSize: 20,
                  }}
                >
                  Verificar
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.primary,
                  marginTop: "35%",
                  borderColor: "#321c6b", // Color del borde
                  borderRadius: 15,
                  borderBottomWidth: 5,
                  borderRightWidth: 5,
                  shadowRadius: 5,
                  elevation: 5, // Sombra en Android
                  marginVertical: 10,
                  paddingHorizontal: 10,
                  justifyContent: "space-around",
                  alignItems: "center",
                  flexDirection: "row",
                  height: height * 0.06,
                  width: "92%", // Ensure the button width is responsive
                  alignSelf: "center", // Center the button horizontally
                }}
                onPress={checkPhone}
              >
                <Text
                  style={{
                    ...styles.buttonText,
                    color: "white",
                    fontSize: 20,
                  }}
                >
                  Enviar código
                </Text>
              </TouchableOpacity>
            )}

            {isCodeSent &&
              (timer > 0 ? (
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontStyle: "italic",
                    marginTop: 10,
                    textAlign: "center",
                  }}
                >
                  Reenviar en {timer}s
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setTimer(60);
                    setIsCodeSent(true);
                    startTimer();
                    signInWithPhoneNumber();
                  }}
                >
                  <Text
                    style={{
                      color: theme.colors.primary,
                      fontSize: 16,
                      fontStyle: "italic",
                      marginTop: 10,
                      textAlign: "center",
                      textDecorationLine: "underline",
                    }}
                  >
                    Reenviar código
                  </Text>
                </TouchableOpacity>
              ))}
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

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  divderechos: {
    marginBottom: "5%",
    marginTop: "40%",
    bottom: "20%",
    width: "50%",
    height: "8%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  derechos: {
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    fontSize: 24,
  },
  since: {
    position: "absolute",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontStyle: "italic",
    color: "white",
    fontSize: 20,
  },
  divsince: {
    justifyContent: "center",
    alignItems: "center",
    bottom: "5%",
    width: "100%",
    height: "4%",
    position: "relative",
  },
  divimg: {
    bottom: "20%",
    marginBottom: "2%",
    width: "40%",
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  container: {
    bottom: "18%",
    width: 320,
    height: 344,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  button: {
    top: "45%",
    width: "85%",
    height: "35%",
    position: "absolute",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "500",
  },
  cajabienvenida: {
    width: "100%",
    height: "10%",
    alignItems: "center",
  },
  bienvenida: {
    position: "absolute",
    color: "white",
    fontSize: 24,
  },
  cajainputs: {
    color: "white",
    display: "flex",
    flexDirection: "row",
    marginTop: "24%",
    width: "100%",
    height: "15%",
    alignItems: "center",
    justifyContent: "center",
  },
  cajabotones: {
    width: "70%",
    height: "35%",
    position: "absolute",
    top: "42%",
    alignItems: "center",
  },
  cajareenviar: {
    height: "20%",
    width: "100%",
    left: "0%",
    color: "white",
    fontSize: 12,
  },
  reenviar: {
    top: "0%",
    fontStyle: "italic",
    left: "0%",
    color: "#654869",
    fontSize: 16,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: "70%",
    height: 50,
    fontSize: 20,
    textAlign: "center",
    borderRadius: 10,
    color: "white",
  },
});

export default VerificationPassword;
