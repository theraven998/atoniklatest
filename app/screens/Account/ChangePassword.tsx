import React, { useState, useLayoutEffect } from "react";
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
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import url from "../../../constants/url.json";
import CustomModal from "@/components/modalAlert";
import Background from "@/components/Background";
import Logo from "@/components/Logo";
import SvgContainer from "@/components/SvgContainer";
import BotonRegister from "@/components/botonRegister";
import { useFonts } from "expo-font";
import { useAppTheme } from "@/constants/theme/useTheme";
import ModalRounded from "@/components/ModalRounded";
const { height } = Dimensions.get("window");
const ChangePassword: React.FC = () => {
  const [modalRoundedText, setModalRoundedText] = useState("");
  const [modalTextButton, setModalTextButton] = useState("Entendido");
  const theme = useAppTheme();
  const [fontsLoaded] = useFonts({
    "Inter-ExtraLightItalic": require("@/assets/fonts/Inter-4.0/extras/ttf/InterDisplay-ExtraLightItalic.ttf"),
    "Roboto-Medium": require("@/assets/fonts/Roboto-Medium.ttf"),
  });
  const { phoneNumber } = useLocalSearchParams();
  const [password, setPassword] = useState<string>("");
  const [isModalRoundedVisible, setModalRoundedVisible] =
    useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [AlertText, setAlertText] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const isPasswordSecure = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };
  const handleSubmit = () => {
    if (!isPasswordSecure(password)) {
      setModalRoundedText(
        "La contraseña debe tener 8 caracteres, una letra mayúscula, un número y un carácter especial"
      );
      setModalTextButton("Entendido");
      setModalRoundedVisible(true);
    }

    if (password !== confirmPassword) {
      setModalRoundedText(
        "Las contraseñas no coinciden. Por favor, inténtalo de nuevo."
      );
      setModalTextButton("Entendido");
      setModalRoundedVisible(true);
    }
    if (password.length < 8) {
      setModalRoundedText("La contraseña debe tener al menos 8 caracteres.");
      setModalTextButton("Entendido");
      setModalRoundedVisible(true);
    }
    if (isPasswordSecure(password) && password === confirmPassword) {
      handleUpdatePassword();
    }
  };
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

  const handleUpdatePassword = async () => {
    try {
      const response = await fetch(`${url.url}/api/forgot_password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          password: password,
        }),
      });
      if (response.status === 200) {
        setModalRoundedText(
          "La contraseña se ha actualizado correctamente. Por favor, inicia sesión."
        );
        setModalTextButton("Entendido");
        setModalRoundedVisible(true);
        setTimeout(() => {
          router.push("/screens/Account/Login");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      showModalAlert("Ha habido un error y no se ha cambiado la contraseña");
    }
  };

  return (
    <Background>
      <View style={styles.overlay}>
        <Logo existsDerechos={false} />
        <SvgContainer>
          <Text
            style={[
              {
                marginBottom: "2%",
                textAlign: "center",
                width: "100%",
                fontSize: 24,
                color: "white",
                fontFamily: "Inter-ExtraLightItalic",
              },
            ]}
          >
            Escribe tu nueva contraseña
          </Text>
          <View style={styles.cajaInputs}>
            <View style={styles.cajainput}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#aaa"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={styles.showPassword}
              >
                <Image
                  style={styles.iconpass}
                  source={
                    currentIcon === "closed"
                      ? require("../../../assets/images/closed.png")
                      : require("../../../assets/images/eye.png")
                  }
                />
              </TouchableOpacity>
            </View>

            <Text
              style={[
                {
                  marginTop: "8%",
                  textAlign: "center",
                  width: "100%",
                  marginBottom: "10%",
                  fontSize: 24,
                  color: "white",
                  fontFamily: "Inter-ExtraLightItalic",
                },
              ]}
            >
              Confirma tu contraseña
            </Text>
            <View style={[styles.cajainput, { marginBottom: "5%" }]}>
              <TextInput
                style={styles.input}
                placeholder="Confirmar contraseña"
                secureTextEntry={!isPasswordConfirmVisible}
                placeholderTextColor="#aaa"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={togglePasswordConfirmVisibility}
                style={styles.showPassword}
              >
                <Image
                  style={styles.iconpass}
                  source={
                    currentConfirmIcon === "closed"
                      ? require("../../../assets/images/closed.png")
                      : require("../../../assets/images/eye.png")
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.primary,
              marginTop: "10%",
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
              width: "60%", // Ensure the button width is responsive
              alignSelf: "center", // Center the button horizontally
            }}
            onPress={handleSubmit}
          >
            <Text
              style={{
                ...styles.buttonText,
                color: "white",
                fontSize: 18,
              }}
            >
              Actualizar contraseña
            </Text>
          </TouchableOpacity>
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
  buttonText: {
    fontFamily: "Roboto-ExtraLight.ttf",
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  iconpass: {
    position: "absolute",
    width: 30,
    height: 30,
  },
  button: {
    width: "65%",
    height: "12%",
    marginTop: "4%",
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
  showPassword: {
    width: "15%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cajainput: {
    width: "100%",
    height: "20%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
  },
  overlay: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  input: {
    width: "80%",
    height: 50,
    marginLeft: "6%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    color: "white",
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
    bottom: "10%",
    marginBottom: "2%",
    width: "40%",
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: "100%",
    height: "100%",
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
    marginTop: "3%",
    top: "20%",
    alignItems: "center",
  },
  registro: {
    fontStyle: "italic",
    position: "absolute",
    color: "white",
    fontSize: 24,
    fontWeight: "light",
  },
  cajaInputs: {
    width: "90%",
    marginTop: "10%",
    height: "50%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  inputCaja: {
    position: "relative",
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff",
    flexDirection: "row",
    marginBottom: "15%",
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

  inputUser: {},
  inputPass: {},
  buttonCaja: {
    top: "60%",
    height: "10%",
    width: "100%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChangePassword;
