import React, { useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  ImageBackground,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  Pressable,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, router, useFocusEffect } from "expo-router";
import url from "../../../constants/url.json";
import { jwtDecode } from "jwt-decode";
import CustomModal from "../../../components/modalAlert";
import Logo from "@/components/Logo";
import SvgContainer from "@/components/SvgContainer";
import { useProfilePhotoStore } from "@/app/utils/useStore";
import Background from "@/components/Background";
import { useFont } from "@shopify/react-native-skia";
import { useFonts } from "expo-font";
const { width, height } = Dimensions.get("window");
const buttonWidth = width * 0.5;
const buttonHeight = height * 0.05;

const Login: React.FC = () => {
  const [fontsLoaded] = useFonts({
    "Inter-Light": require("@/assets/fonts/Inter/Inter-Light.ttf"),
    "Inter-Bold": require("@/assets/fonts/Inter/Inter-Bold.ttf"),
    "Roboto-Medium": require("@/assets/fonts/Roboto-Medium.ttf"),
  });
  const setProfilePhoto = useProfilePhotoStore.getState().setProfilePhoto;
  const profile_photo = useProfilePhotoStore.getState().profilePhoto;
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [currentIcon, setCurrentIcon] = useState<string>("closed");
  const [AlertText, setAlertText] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    setCurrentIcon(currentIcon === "closed" ? "pass" : "closed");
  };
  const toggleAlert = () => {
    setAlertVisible(!isAlertVisible);
  };
  useFocusEffect(
    React.useCallback(() => {
      const handleBackButtonPress = () => {
        router.push("/(tabs)/home");
        return true; // Evita que el navegador realice la acción de retroceso por defecto
      };

      const backHandler = () => {
        BackHandler.addEventListener(
          "hardwareBackPress",
          handleBackButtonPress
        );

        return () =>
          BackHandler.removeEventListener(
            "hardwareBackPress",
            handleBackButtonPress
          );
      };

      return backHandler();
    }, [])
  );

  const logueo = async () => {
    try {
      const response = await axios.post(`${url.url}/api/login`, {
        usuario,
        password,
      });

      if (response && response.data) {
        await AsyncStorage.setItem("access_token", response.data.access_token);
        setTimeout(() => {
          router.replace({
            pathname: "/(tabs)/home",
          });
        }, 2000);
        const token = response.data.access_token;
        const decoded: any = jwtDecode(token);
        console.log("Decoded JWT:", decoded);
        setProfilePhoto(decoded.sub.profile_photo);
        console.log("Foto de perfil:", decoded.sub.profile_photo);
        await AsyncStorage.setItem("access_token", response.data.access_token);
        setTimeout(() => {
          router.push({
            pathname: "/(tabs)/home",
          });
        }, 1000);
      } else {
        Alert.alert("Error", "La respuesta no contiene datos");
      }
    } catch (err) {
      const error = err as AxiosError; // Tratamos el error como un AxiosError

      if (error.response && error.response.data) {
        const errorMsg =
          (error.response.data as any).msg || "Error al iniciar sesión";
        setAlertText(errorMsg); // Establecemos el mensaje en el modal
        setAlertVisible(true); // Mostramos el modal
      } else {
        setAlertText("Error de conexión al servidor"); // Mensaje de error genérico
        setAlertVisible(true); // Mostramos el modal
      }
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Oculta el encabezado
    });
  }, [navigation]);

  return (
    <Background>
      <View style={styles.overlay}>
        <Logo existsDerechos={false} />
        <SvgContainer>
          <View
            style={{
              width: "80%",
            }}
          >
            <Text style={styles.titulo}>Bienvenido</Text>

            <View style={styles.cajainputs}>
              <View style={styles.inputcaja}>
                <TextInput
                  style={styles.input}
                  placeholder="Usuario o Número de teléfono"
                  autoCapitalize="none"
                  placeholderTextColor="#7C7C7C"
                  value={usuario}
                  onChangeText={setUsuario}
                />
              </View>

              <View style={styles.inputcaja}>
                <TextInput
                  style={[styles.input, styles.inputPass]}
                  placeholder="Contraseña"
                  placeholderTextColor="rgba(124, 124, 124, 1)"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.showpassword}
                  onPress={togglePasswordVisibility}
                >
                  <Image
                    source={
                      currentIcon === "closed"
                        ? require("../../../assets/images/closed.png")
                        : require("../../../assets/images/eye.png")
                    }
                    style={styles.iconpass}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.cajaforgot}>
                <Pressable
                  onPress={() =>
                    router.push("/screens/Account/VerificationPassword")
                  }
                >
                  <Text style={styles.contrasenaolvidada}>
                    Olvidé mi contraseña
                  </Text>
                </Pressable>
              </View>
            </View>

            <TouchableOpacity style={styles.botonContinuar} onPress={logueo}>
              <Text style={styles.textoContinuar}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </SvgContainer>
      </View>

      <CustomModal
        onBackdropPress={toggleAlert}
        isVisible={isAlertVisible}
        toggleModal={toggleAlert}
        modalText={AlertText}
      />
    </Background>
  );
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
  },
  titulo: {
    color: "white",
    fontFamily: "Inter-Bold",
    fontSize: 28,
    textAlign: "center",
    marginBottom: "5%",
  },
  cajainputs: {},
  inputcaja: {
    marginBottom: 15,
    position: "relative",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "white",
    fontSize: 16,
    width: "100%",
  },
  inputPass: {
    paddingRight: 45, // espacio para el icono
  },
  showpassword: {
    position: "absolute",
    right: 10,
    top: "30%",
  },
  iconpass: {
    width: 24,
    height: 24,
    tintColor: "#ccc",
  },
  cajaforgot: {
    alignItems: "flex-end",
    marginTop: 5,
  },
  contrasenaolvidada: {
    color: "#ccc",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  botonContinuar: {
    backgroundColor: "#6438D7",
    borderColor: "#321c6b",
    borderRadius: 15,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.06,
    width: "80%",
    alignSelf: "center",
  },
  textoContinuar: {
    color: "white",
    fontSize: 18,
    fontFamily: "Inter-Light",
  },
});

export default Login;
