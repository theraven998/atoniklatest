import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useNavigation, router } from "expo-router";
import CustomModal from "@/components/modalAlert";
import { StatusBar } from "expo-status-bar";
import SignUpGoogle from "@/components/SignUpGoogle";
import SvgContainer from "@/components/SvgContainer";
import Logo from "@/components/Logo";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { useFonts } from "expo-font";
import axios from "axios";
import url from "@/constants/url.json";
import ModalRounded from "@/components/ModalRounded";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import Background from "@/components/Background";
const { width, height } = Dimensions.get("window");

const ChooseLogin: React.FC = () => {
  const [fontsLoaded] = useFonts({
    "Inter-ExtraLightItalic": require("@/assets/fonts/Inter-4.0/extras/ttf/InterDisplay-ExtraLightItalic.ttf"),
    "Roboto-Medium": require("@/assets/fonts/Roboto-Medium.ttf"),
  });
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isModalRoundedVisible, setModalRoundedVisible] =
    useState<boolean>(false);
  const [modalRoundedText, setModalRoundedText] = useState<string>("");
  const [modalTextButton, setModalTextButton] = useState<string>("");
  const navigation = useNavigation();
  const [Number, setNumber] = useState<string>("");
  const [Nombre, setNombre] = useState<string>("");
  const [User, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [AlertText, setAlertText] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId:
      "667525490941-33md41dk3m35r6ddte2n4tttfj16ip9e.apps.googleusercontent.com",
  });
  useEffect(() => {
    console.log("Comprobando si ya hay sesión iniciada...");
    const checkIfSignedIn = async () => {
      const accessToken = await AsyncStorage.getItem("access_token");
      if (accessToken) {
        console.log("Ya hay sesión iniciada");
        router.push({
          pathname: "/(tabs)/home",
        });
      } else {
        console.log("No hay sesión iniciada");
      }
    };

    checkIfSignedIn();
  }, []);
  const checkUser = async (
    email: string,
    familyName: string,
    givenName: string,
    id: string,
    name: string,
    photo: string,
    idToken: string
  ) => {
    try {
      const response = await axios.post(`${url.url}/validate_token`, {
        token: idToken,
      });
      if (response.status === 200) {
        console.log("Usuario encontrado en la base de datos");
        await AsyncStorage.setItem("access_token", response.data.access_token);
        router.replace({
          pathname: "/(tabs)/home",
        });
      }
      if (response.status === 201) {
        console.log("Este usuario no ha sido registrado");
        setModalRoundedText(
          "Este usuario no ha sido registrado, por favor registrate"
        );
        setModalTextButton("Ir a registro");
        setModalRoundedVisible(true);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.log("Usuario no encontrado, redirigiendo a registro");
        const { google_id, name, email, profile_photo } = error.response.data;
      } else {
        console.log("Error validando token:", error.message);
      }
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      console.log("Usuario loggeado");
      setTimeout(() => {
        const decodedToken = JSON.parse(
          atob(response.params.id_token.split(".")[1])
        );
        const {
          email,
          family_name: familyName,
          given_name: givenName,
          sub: id,
          name,
          picture: photo,
        } = decodedToken;
        console.log("Datos de usuario:", response.params);
        checkUser(
          email,
          familyName,
          givenName,
          id,
          name,
          photo,
          response.params.id_token
        );
      }, 100); // incluso 50ms puede bastar
    }
  }, [response]);

  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] =
    useState<boolean>(false);
  const [currentIcon, setCurrentIcon] = useState<string>("closed");
  const [currentConfirmIcon, setCurrentConfirmIcon] =
    useState<string>("closed");

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    setCurrentIcon(currentIcon === "closed" ? "pass" : "closed");
  };

  const togglePasswordConfirmVisibility = () => {
    setIsPasswordConfirmVisible(!isPasswordConfirmVisible);
    setCurrentConfirmIcon(currentConfirmIcon === "closed" ? "pass" : "closed");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <>
      <Background>
        <View style={styles.overlay}>
          <Logo existsDerechos={false} />
          <SvgContainer>
            <View
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "Inter-Bold",
                  fontSize: 28,
                  textAlign: "center",
                  position: "absolute",
                  top: "0%",
                  width: "100%",
                }}
              >
                {" "}
                Elige un método de {"\n"} inicio
              </Text>
              <View
                style={{
                  width: "80%",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  height: "50%",
                  marginTop: "15%",
                  paddingVertical: 20,
                }}
              >
                <GoogleLoginButton onPress={() => promptAsync()} />
                <View
                  style={{
                    width: "100%",
                    height: "40%",
                    marginTop: "15%",
                    paddingHorizontal: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <Image
                    source={require("../../../assets/images/line.png")}
                    style={{
                      height: 2,
                      alignSelf: "center",
                    }}
                  />
                  <Text
                    style={{
                      color: "white",
                      fontSize: 24,
                      fontFamily: "Inter-ExtraLightItalic",
                      marginHorizontal: 10,
                      textAlign: "center",
                    }}
                  >
                    O
                  </Text>
                  <Image
                    source={require("../../../assets/images/line.png")}
                    style={{
                      height: 2,
                      alignSelf: "center",
                    }}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: "/screens/Account/Login",
                    });
                  }}
                  style={{
                    marginTop: "5%",
                    backgroundColor: "#6438D7", // Color principal
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
                >
                  <View
                    style={{
                      width: "16%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={require("@/assets/images/phone.png")}
                      style={{
                        resizeMode: "contain",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </View>

                  <Text
                    style={{
                      color: "white",
                      fontSize: 18,
                      textAlign: "center", // Center the text
                      fontFamily: "Inter-Light",
                    }}
                  >
                    Iniciar con teléfono
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </SvgContainer>
          <ModalRounded
            text={modalRoundedText}
            textbutton={modalTextButton}
            isVisible={isModalRoundedVisible}
            onClose={() => {
              setModalRoundedVisible(false);
            }}
          />
        </View>
      </Background>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  divDerechos: {
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
  divSince: {
    justifyContent: "center",
    alignItems: "center",
    bottom: "10%",
    width: "100%",
    height: "4%",
    position: "relative",
  },
  since: {
    position: "absolute",
    bottom: "2%",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontStyle: "italic",
    color: "white",
    fontSize: 20,
  },
  divImg: {
    bottom: "15%",
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
    width: "70%",
    height: "70%",
    resizeMode: "contain",
  },
  container: {
    bottom: "20%",
    width: 300,
    height: 500,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cajaRegistro: {
    width: "100%",
    height: "10%",
    position: "absolute",
    top: "5%",
    alignItems: "center",
  },
  registro: {
    fontStyle: "italic",
    position: "absolute",
    color: "white",
    fontSize: 30,
    fontWeight: "light",
  },
  cajaInputs: {
    marginTop: "8%",
    position: "absolute",
    width: "90%",
    top: "12%",
    alignItems: "flex-start",
  },
  inputCaja: {
    position: "relative",
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff",
    flexDirection: "row",
    marginBottom: "10%",
  },
  iconUser: {
    marginRight: 5,
    top: 0,
    width: 30,
    height: 30,
  },
  iconPass: {
    position: "absolute",
    width: 30,
    height: 30,
  },
  showPassword: {
    position: "absolute",
    left: "85%",
    top: 0,
    width: 30,
    height: 30,
  },
  input: {
    color: "#fff",
    fontSize: 17,
    width: "100%",
  },
  inputUser: {},
  inputPass: {},
  buttonCaja: {
    top: "75%",
    height: "10%",
    width: "100%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "80%",
    height: "80%",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 10,
  },
  buttonText: {
    color: "#000000",
    fontSize: 17,
    fontWeight: "500",
  },
});

export default ChooseLogin;
