import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  Dimensions,
  Alert,
  ScrollView,
  TextInput,
  Platform,
  Button,
  ActionSheetIOS,
  useColorScheme,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import {
  useNavigation,
  useFocusEffect,
  router,
  useLocalSearchParams,
} from "expo-router";
import url from "@/constants/url.json";
import { RootStackParamList } from "@/app/_layout";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import drawerDark from "@/assets/images/drawer2.png";
import drawerLight from "@/assets/images/drawerLight.png";
import * as FileSystem from "expo-file-system";
import Modal from "react-native-modal";
import Logo from "@/components/Logo";
import Panel from "@/components/panelPushUp";
import CustomModal from "@/components/modalAlert";
import EventListProfile from "@/components/eventListTopProfile";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useProfilePhotoStore } from "@/app/utils/useStore";
import { useAppTheme } from "@/constants/theme/useTheme";
const { width, height } = Dimensions.get("window");

export default function Delete() {
  const setProfilePhoto = useProfilePhotoStore.getState().setProfilePhoto;
  const theme = useAppTheme();
  const colorScheme = useColorScheme();

  useEffect(() => {
    checkToken();
  }, []);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [token, setToken] = useState<string | null>(null);

  const checkToken = async () => {
    console.log("Verificando token...");
    try {
      const storedToken = await AsyncStorage.getItem("access_token");
      console.log("Token almacenado:", storedToken);
      if (storedToken !== null) {
        const decoded: any = jwtDecode(storedToken);
        setToken(storedToken);
        console.log("Decoded token:", decoded);
      } else {
        setToken(null);
      }
    } catch (error) {
      console.error("Error al verificar el token", error);
    }
  };
  const cleanData = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");
      setProfilePhoto("");
      setTimeout(() => {
        router.push({
          pathname: "/(tabs)/home",
        });
      }, 1500);
    } catch (error) {
      console.error("Error al limpiar datos", error);
      router.push("/(tabs)/home");
    }
  };

  const deleteaccount = async () => {
    if (!token) {
      Alert.alert(
        "Error",
        "Token no encontrado. Por favor, inicie sesión nuevamente."
      );
      return;
    }
    try {
      const response = await fetch(`${url.url}/api/delete_account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        Alert.alert("Se ha eliminado la cuenta");
        await cleanData();
        router.replace("/(tabs)/home"); // Redirect to login after account deletion
      } else {
        const errorData = await response.json();
        console.error("Error al eliminar la cuenta", errorData);
        Alert.alert(
          "Error",
          errorData.message || "No se pudo eliminar la cuenta"
        );
      }
    } catch (error) {
      console.error("Error al eliminar la cuenta", error);
      Alert.alert("Error", "No se pudo eliminar la cuenta");
    }
  };
  return (
    <View
      style={{ ...styles.container, backgroundColor: theme.colors.background }}
    >
      <View style={styles.superior}>
        <Pressable
          onPress={() => navigation.openDrawer()}
          style={styles.drawerButton}
        >
          <Image
            source={colorScheme === "dark" ? drawerDark : drawerLight}
            style={{
              position: "absolute",
              left: "2%",
              height: 40,
              width: 40,
              top: height * 0.005,
            }}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContainer}
      >
        <Logo existsDerechos={false} />
        <View style={styles.content}>
          {" "}
          <Text style={{ ...styles.infoText, color: theme.colors.text }}>
            Al borrar su cuenta, todos sus datos serán eliminados
            permanentemente. Esto incluye los tickets vigentes, los cuales no
            serán reembolsados. Por favor, asegúrese de estar seguro antes de
            proceder.
          </Text>
          <Text style={{ ...styles.infoText, color: theme.colors.text }}>
            Si presenta algún problema con su cuenta, puede hablar con soporte
            utilizando el botón "Hablar con soporte".
          </Text>
        </View>

        <Pressable
          onPress={() => {
            const phoneNumber = "+573125034112";
            const message = "Hola Atonik, tengo problemas con mi cuenta.";
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
              message
            )}`;
            router.push(url);
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Hablar con soporte</Text>
        </Pressable>
        {/* <Pressable onPress={deleteaccount} style={styles.button2}>
          <Text style={styles.buttonText}>Eliminar Cuenta</Text>
        </Pressable> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "25%",
  },
  superior: {
    position: "relative",
    top: "1%",
    width: "100%",
    height: "6%",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    width: "90%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  drawerButton: {
    position: "absolute",
    left: "2%",
    top: "0%",
    height: 40,
    width: 40,
    zIndex: 10, // Ensure the button is above other elements
  },
  drawerIcon: {
    resizeMode: "contain",
    width: 40,
    height: 40,
  },
  content: {
    marginTop: "95%",
    marginBottom: 20,
    alignItems: "center",
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 10,
    paddingHorizontal: 10,
    fontWeight: "500",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    width: "80%",
  },
  button2: {
    backgroundColor: "#FF4500",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
