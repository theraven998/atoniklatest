import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Alert,
  Image,
  Dimensions,
  useColorScheme,
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../constants/url.json";
import { jwtDecode } from "jwt-decode"; // Asegúrate de que jwtDecode esté correctamente importado
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Panel from "@/components/panelPushUp";
import { useProfilePhotoStore } from "@/app/utils/useStore";
import logoDark from "@/assets/images/logo.png";
import logoLight from "@/assets/images/logoLight.png";
import { useAppTheme } from "@/constants/theme/useTheme";
import Logo from "@/components/Logo";
import { SafeAreaView } from "react-native-safe-area-context";
SplashScreen.preventAutoHideAsync();
const { height, width } = Dimensions.get("window");
export default function Tab() {
  const theme = useAppTheme();
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Inter: require("../../assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("../../assets/fonts/InterDisplay-Bold.ttf"),
    "Inter-ExtraLight": require("../../assets/fonts/InterDisplay-ExtraLight.ttf"),
    "Roboto-Light": require("../../assets/fonts/Roboto-Light.ttf"),
    "Roboto-Black": require("../../assets/fonts/Roboto-Black.ttf"),
  });
  const [isVisible, setIsVisible] = useState(false);
  const [is_organicer, setorganicer] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [pressed2, setPressed2] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const checkOrganicer = async () => {
    if (is_organicer) {
      router.push({ pathname: "/screens/Publish/Nombre" });
    } else {
      if (token) {
        try {
          const response = await axios.get(
            `${url.url}/api/is_organicer?username=${decodedToken.sub.user}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.status === 200) {
            setorganicer(response.data.is_organicer);

            if (response.data.is_organicer === true) {
              router.push({ pathname: "/screens/Publish/Nombre" });
            } else {
            }
          }
        } catch (error) {
          setIsPanelVisible(true);
        }
      } else {
        setIsVisible(true);
      }
    }
  };
  const closePanel = () => {
    setIsVisible(false);
  };
  const checkToken = async () => {
    const storedToken = await AsyncStorage.getItem("access_token");
    if (storedToken) {
      const decodedToken = jwtDecode<DecodedToken>(storedToken);
      setDecodedToken(decodedToken);
      setToken(storedToken);
    }
  };

  const handlePress2 = async () => {
    try {
      await Linking.openURL(
        "https://api.whatsapp.com/send?phone=573208435424&text=Hola%20estoy%20interesado%20en%20ser%20organizador%20de%20eventos%20de%20atonik!!"
      );
    } catch (error) {
      console.error("Error opening URL:", error);
    } finally {
      setPressed2(false);
    }
  };

  const handlePress = async () => {
    setPressed(true);
    try {
      await Linking.openURL("https://atonikk.github.io/");
    } catch (error) {
      console.error("Error opening URL:", error);
    } finally {
      setPressed(false);
    }
  };

  useLayoutEffect(() => {
    const prepareApp = async () => {
      if (fontsLoaded) {
        await checkToken();
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    };
    prepareApp();
  }, [fontsLoaded]);

  useFocusEffect(
    React.useCallback(() => {
      checkToken();
      if (!token) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, [token])
  );

  useEffect(() => {
    if (token) {
      if (is_organicer) {
        router.push({ pathname: "/screens/Publish/Nombre" });
      } else {
        checkOrganicer();
      }
    } else {
      setIsVisible(true);
    }
  }, [token]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaView
      style={{ ...styles.container, backgroundColor: theme.colors.background }}
    >
      <SafeAreaView
        style={{
          position: "absolute",
          top: "8%",
          width: width,
          height: height * 0.18,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={[
            styles.logo,
            {
              width: "40%",
              height: "80%",
            },
          ]}
          source={colorScheme === "dark" ? logoDark : logoLight}
        />
        <Text
          style={{
            color: colorScheme === "dark" ? "white" : theme.colors.primary,
            fontFamily: "Inter-Black",
            fontSize: 64,
            textAlign: "center",
          }}
        >
          AtoniK
        </Text>
      </SafeAreaView>
      <View style={styles.medio}>
        <View style={styles.divquieres}>
          <Text style={{ ...styles.quieres, color: theme.colors.text }}>
            ¿Quieres crear tu propio
          </Text>
          <Text style={{ ...styles.quieresbold, color: theme.colors.text }}>
            evento?
          </Text>
        </View>
        <Text
          style={{
            ...styles.text,
            color: theme.colors.text, // Cambia el color del texto según el tema
            fontFamily: "Inter-ExtraLight",
          }}
        >
          Presiona el siguiente boton para contactarnos y habilitar el modo
          organizador
        </Text>
        <Pressable
          style={[styles.quieroserbutton, pressed && styles.pressedButton]}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={handlePress2}
        >
          <Text style={styles.buttontext}>QUIERO SER</Text>
          <Text style={styles.buttontextbold}>ORGANIZADOR</Text>
        </Pressable>
      </View>
      <View style={styles.inferior}>
        <Text style={{ ...styles.textlargo, color: theme.colors.text }}>
          "Al presionar en el botón superior, estás de acuerdo con los términos
          y condiciones aplicables al año en curso."
        </Text>
        <Pressable
          style={[styles.quieroserbutton, pressed && styles.pressedButton]}
          onPressIn={() => setPressed2(true)}
          onPressOut={() => setPressed2(false)}
          onPress={handlePress}
        >
          <Text style={styles.buttontextboldinferior}>
            TERMINOS Y CONDICIONES
          </Text>
        </Pressable>
      </View>
      <Panel
        isVisible={isVisible}
        togglePanel={togglePanel}
        closePanel={closePanel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    paddingBottom: height * 0.01,
    justifyContent: "center",
    alignItems: "center",
  },
  superior: {
    alignItems: "center",
    position: "absolute",
    height: "25%",
    width: "100%",
    backgroundColor: "red",
  },
  logo: {
    resizeMode: "contain",
  },
  divquieres: {
    marginBottom: "10%",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  quieres: {
    textAlign: "center",
    fontFamily: "Inter",
    fontSize: 30,
    top: "20%",
  },
  quieresbold: {
    color: "white",
    textAlign: "center",
    fontFamily: "Inter-Bold",
    fontSize: 30,
    top: "20%",
  },
  medio: {
    alignItems: "center",
    marginTop: "8%",
    height: "30%",
    width: "100%",
    position: "absolute",
    top: "28%",
  },
  text: {
    lineHeight: 30,
    justifyContent: "center",
    width: "100%",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Inter-ExtraLight",
    color: "white",
    marginBottom: "5%",
  },
  quieroserbutton: {
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
    height: height * 0.08,
    width: "60%", // Ensure the button width is responsive
    alignSelf: "center", // Center the button horizontally
  },
  pressedButton: {
    backgroundColor: "#430857", // Color más oscuro al presionar
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    elevation: 2, // Reduce la elevación al presionar
  },
  pressedButton2: {
    backgroundColor: "#430857", // Color más oscuro al presionar
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    elevation: 2, // Reduce la elevación al presionar
  },
  buttontext: {
    fontSize: 20,
    fontFamily: "Roboto-Light",
    color: "white",
  },
  buttontextbold: {
    lineHeight: 30,
    fontSize: 20,
    fontFamily: "Roboto-Black",
    color: "white",
  },
  inferior: {
    alignItems: "center",
    width: "100%",
    height: "35%",
    position: "absolute",
    top: "70%",
    padding: "3%",
  },
  buttontextboldinferior: {
    lineHeight: 30,
    fontSize: 15,
    fontFamily: "Roboto-Black",
    color: "white",
  },
  quieroserbutton2: {
    position: "absolute",
    top: Dimensions.get("window").width > 375 ? "70%" : "60%",
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    height: "27%",
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
  textlargo: {
    textAlign: "center",
    lineHeight: 30,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    fontSize: 20,
    fontFamily: "Inter-ExtraLight",
    color: "white",
  },
});
