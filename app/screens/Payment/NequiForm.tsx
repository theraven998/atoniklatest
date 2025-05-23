import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLayoutEffect } from "react";
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import url from "../../../constants/url.json";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Rect, Circle } from "react-native-svg";
import nequiLogo from "@/assets/images/nequiClaro.png";
import Logo from "@/components/Logo";
import { useFonts } from "expo-font";
const { height } = Dimensions.get("window");
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const NequiForm = () => {
  const [number, setNumber] = React.useState("");
  const [name, setName] = React.useState("");
  const { id } = useLocalSearchParams();
  const [token, setToken] = React.useState<string | null>(null);
  const [fontsLoaded] = useFonts({
    "Inter-Light": require("@/assets/fonts/Inter/Inter-Light.ttf"),
    "Inter-Bold": require("@/assets/fonts/Inter/Inter-Bold.ttf"),
    "Roboto-Medium": require("@/assets/fonts/Roboto-Medium.ttf"),
  });
  const checkToken = async () => {
    const storedToken = await AsyncStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      router.push({ pathname: "/screens/Account/Login" });
    }
  };

  const makePayment = async () => {
    try {
      const response = await axios.post(
        `${url.url}/api/make_payment`,
        {
          event_id: "6824c39aebfe1f046e8bfd72",
          full_name: name,
          phone_number: number,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        router.push({
          pathname: "/screens/Payment/CheckNequi",
          params: {
            messageid: response.data.messageid,
            clientid: response.data.clientid,
            transactionid: response.data.transactionid,
          },
        });
      }
    } catch (error) {
      console.error("Error en el pago", error);
    }
  };

  const navigation = useNavigation();

  useLayoutEffect(() => {
    checkToken();
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#232323" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Logo
          existsDerechos={false}
          width={windowWidth} // Adjust width relative to screen size
          height={windowWidth * 0.6 * 0.6} // Maintain aspect ratio (example: 5:2)
        />

        <Svg
          height={windowHeight * 0.4}
          width={windowWidth * 0.9}
          style={styles.svgContainer}
        >
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="20"
            fill="#ffffff"
            shadowColor="#000"
            shadowOpacity={0.2}
            shadowRadius={10}
          />
        </Svg>

        <View style={styles.formContainer}>
          <View
            style={{
              position: "absolute",
              top: "5%",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Image
              source={nequiLogo}
              style={{
                width: windowWidth * 0.5, // Adjust width relative to screen size
                height: windowWidth * 0.5 * 0.4, // Maintain aspect ratio (example: 5:2)
                resizeMode: "contain",
              }}
            />
          </View>

          <View
            style={{
              ...styles.inputBox,
              marginTop: "35%",
            }}
          >
            <Image
              source={require("../../../assets/images/userblack.png")}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor="#7C7C7C"
              onChangeText={(text) => setName(text)}
              value={name}
            />
          </View>
          <View style={styles.inputBox}>
            <Image
              source={require("../../../assets/images/phoneblack.png")}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Número de teléfono (sin +57)"
              placeholderTextColor="#7C7C7C"
              keyboardType="numeric"
              onChangeText={(text) => setNumber(text)}
            />
          </View>
          <Pressable onPress={makePayment} style={styles.button}>
            <Text style={styles.buttonText}>Continuar</Text>
          </Pressable>
        </View>
        <Text
          style={{
            position: "absolute",
            fontFamily: "Inter-Bold",
            top: height * 0.75,
            color: "#ffffff",
            fontSize: 22,
            textAlign: "center",
            paddingHorizontal: 20,
            lineHeight: 30,
            letterSpacing: 1,
            textShadowColor: "#000",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 3,
          }}
        >
          ¡Último paso para asegurar tu entrada!
        </Text>
        <Image
          source={require("@/assets/images/ticketdark.png")}
          style={{
            position: "absolute",
            top: height * 0.85,
            width: windowWidth * 0.5,
            height: windowWidth * 0.5 * 0.4, // Maintain aspect ratio (example: 5:2)
            resizeMode: "contain",
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    position: "absolute",
    top: "5%",
    backgroundColor: "red",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
  svgContainer: {
    position: "absolute",
    top: "32%",
    height: "100%",
  },
  formContainer: {
    position: "absolute",
    top: "30%",
    height: height * 0.4,
    width: "80%",
    flexDirection: "column",
    alignItems: "center",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "100%",
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#DB0083",
    borderRadius: 10,
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NequiForm;
