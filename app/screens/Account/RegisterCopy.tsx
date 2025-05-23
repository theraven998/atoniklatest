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
import { useNavigation, router } from "expo-router";
import CustomModal from "@/components/modalAlert";

const RegisterCopy: React.FC = () => {
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
  const handleRegister = () => {

    if (password !== confirmPassword) {
      showModalAlert("Las contrasenas no coinciden");
      return;
    }
    else {
      router.push({
        pathname: "/screens/Account/Edad",
        params: { Number, Nombre, User ,password },
      })
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <ImageBackground
      source={require("../../../assets/images/backgroundLogin.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.divDerechos}>
          <Text style={styles.derechos}>DERECHOS RESERVADOS</Text>
        </View>
        <View style={styles.divImg}>
          <Image
            style={styles.logo}
            source={require("../../../assets/images/LogoLetras.png")}
          />
        </View>

        <View style={styles.container}>
          <View style={styles.cajaRegistro}>
            <Text style={styles.registro}>Regístrate</Text>
          </View>
          <View style={styles.cajaInputs}>
            <View style={styles.inputCaja}>
              <Image
                source={require("../../../assets/images/iconuser.png")}
                style={styles.iconUser}
              />
              <TextInput
                style={[styles.input, styles.inputUser]}
                placeholder=" Nombre"
                placeholderTextColor="#7C7C7C"
                value={Nombre}
                onChangeText={setNombre}
              />
            </View>
            <View style={styles.inputCaja}>
              <Image
                source={require("../../../assets/images/iconuser.png")}
                style={styles.iconUser}
              />
              <TextInput
                style={[styles.input, styles.inputUser]}
                placeholder=" Usuario"
                placeholderTextColor="#7C7C7C"
                value={User}
                onChangeText={setUser}
              />
            </View>
            <View style={styles.inputCaja}>
              <Image
                source={require("../../../assets/images/telefono.png")}
                style={styles.iconUser}
              />
              <TextInput
                style={[styles.input, styles.inputUser]}
                placeholder=" Numero de telefono (sin prefijo) "
                placeholderTextColor="#7C7C7C"
                value={Number}
                onChangeText={setNumber}
                keyboardType="numeric" // Restringe la entrada a números solamente
              />
            </View>
            <View style={styles.inputCaja}>
              <Image
                source={require("../../../assets/images/pass.png")}
                style={styles.iconUser}
              />
              <TextInput
                style={[styles.input, styles.inputPass]}
                placeholder=" Contraseña"
                placeholderTextColor="rgba(124, 124, 124, 1)"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.showPassword}
                onPress={togglePasswordVisibility}
              >
                <Image
                  source={
                    currentIcon === "closed"
                      ? require("../../../assets/images/closed.png")
                      : require("../../../assets/images/eye.png")
                  }
                  style={styles.iconPass}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputCaja}>
              <Image
                source={require("../../../assets/images/pass.png")}
                style={styles.iconUser}
              />
              <TextInput
                style={[styles.input, styles.inputPass]}
                placeholder=" Repite la contrasena"
                placeholderTextColor="rgba(124, 124, 124, 1)"
                secureTextEntry={!isPasswordConfirmVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.showPassword}
                onPress={togglePasswordConfirmVisibility}
              >
                <Image
                  source={
                    currentConfirmIcon === "closed"
                      ? require("../../../assets/images/closed.png")
                      : require("../../../assets/images/eye.png")
                  }
                  style={styles.iconPass}
                />
              </TouchableOpacity>
            </View>
          </View>
         
          <View style={styles.buttonCaja}>
            <Pressable
             style={styles.button}
              onPress={handleRegister}
            >
              <Text style={styles.buttonText}>Continuar</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.divSince}>
          <Text style={styles.since}>Since 2024</Text>
        </View>
      </View>
    </ImageBackground>
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

export default RegisterCopy;
