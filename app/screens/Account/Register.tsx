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
import Background from "@/components/Background";
import Svg, { Path } from "react-native-svg";
import { useNavigation, router } from "expo-router";
import CustomModal from "@/components/modalAlert";
import { StatusBar } from "expo-status-bar";
import SignUpGoogle from "@/components/SignUpGoogle";
import SvgContainer from "@/components/SvgContainer";
import Logo from "@/components/Logo";
import url from "@/constants/url.json";
import { useFonts } from "expo-font";
import { InteractionManager } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useProfilePhotoStore } from "@/app/utils/useStore";
import { jwtDecode } from "jwt-decode";
import Constants from "expo-constants";

const { width, height } = Dimensions.get("window");
interface User {
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  name: string;
  photo: string;
}
const Register: React.FC = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "667525490941-33md41dk3m35r6ddte2n4tttfj16ip9e.apps.googleusercontent.com",
  });
  const profilePhoto = useProfilePhotoStore((state) => state.profilePhoto);
  const setProfilePhoto = useProfilePhotoStore(
    (state) => state.setProfilePhoto
  );
  const [fontsLoaded] = useFonts({
    "Inter-Light": require("@/assets/fonts/Inter/Inter-Light.ttf"),
    "Inter-Bold": require("@/assets/fonts/Inter/Inter-Bold.ttf"),
    "Roboto-Medium": require("@/assets/fonts/Roboto-Medium.ttf"),
  });
  const [params, setParams] = useState<User>();

  const setUserParams = (user: User) => {
    setParams({
      email: user.email,
      familyName: user.familyName,
      givenName: user.givenName,
      id: user.id,
      name: user.name,
      photo: user.photo,
    });
  };
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  useEffect(() => {
    if (params) {
      const { email, familyName, givenName, id, name, photo } = params;
      // router.push({
      //   pathname: "/screens/Account/UserGoogle",
      //   params: { email, familyName, givenName, id, name, photo },
      // });
    }
  }, []);
  // const checkIfSignedIn = async () => {
  //   const isSignedIn = (await GoogleSignin.getCurrentUser()) !== null;
  //   if (isSignedIn) {
  //     const userInfo = await GoogleSignin.getCurrentUser();
  //     console.log("Ya hay sesión iniciada:", userInfo?.user.photo);
  //     router.push({
  //       pathname: "/(tabs)/profile",
  //     });
  //   } else {
  //     console.log("No hay sesión iniciada.");
  //   }
  // };
  // useEffect(() => {
  //   console.log("Comprobando si ya hay sesión iniciada...");

  //   checkIfSignedIn()
  //     .then(() => {
  //       console.log("Comprobación de sesión completada.");
  //     })
  //     .catch((error) => {
  //       console.error("Error al comprobar la sesión:", error);
  //     });
  // }, []);
  const goToUserGoogle = (
    email: string,
    familyName: string,
    givenName: string,
    id: string,
    name: string,
    photo: string,
    idToken: string
  ) => {
    router.push({
      pathname: "/screens/Account/UserGoogle",
      params: { email, familyName, givenName, id, name, photo },
    });
  };
  const navigation = useNavigation();
  const [Number, setNumber] = useState<string>("");
  const [Nombre, setNombre] = useState<string>("");
  const [User, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [AlertText, setAlertText] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);

  const showModalAlert = (message: string) => {
    setAlertText(message);
    setAlertVisible(true);
  };
  const toggleAlert = () => {
    setAlertVisible(!isAlertVisible);
  };
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
        const decodedToken = jwtDecode(response.data.access_token);
        setProfilePhoto(decodedToken.sub.profile_photo);
        router.replace({
          pathname: "/(tabs)/home",
        });
      }
      if (response.status === 201) {
        console.log("Nuevo usuario registrado exitosamente");
        router.replace({
          pathname: "/screens/Account/UserGoogle",
          params: {
            email,
            familyName,
            givenName,
            id,
            name,
            photo,
          },
        });
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
  return (
    <Background>
      <StatusBar style="light" backgroundColor="#000000" />
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
                top: "5%",
                width: "100%",
              }}
            >
              {" "}
              Elige un método de {"\n"} registro
            </Text>
            <View
              style={{
                marginTop: "30%",
                width: "80%",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "column",
                height: "50%",
                paddingVertical: 20,
              }}
            >
              <SignUpGoogle
                onPress={() => {
                  if (request) {
                    promptAsync();
                  } else {
                    console.warn("Google Auth Request no está listo.");
                  }
                }}
              />

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
                    pathname: "/screens/Account/User",
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
                    width: "15%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("@/assets/images/phone.png")}
                    style={{
                      resizeMode: "contain",
                      width: "90%",
                      height: "90%",
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
                  Regístrate con teléfono
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SvgContainer>
      </View>
    </Background>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

export default Register;
