import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  Dimensions,
  Alert,
  TextInput,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import url from "@/constants/url.json";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Modal from "react-native-modal";
import Panel from "@/components/panelPushUp";
import CustomModal from "@/components/modalAlert";
import EventListTopProfile from "@/components/eventListTopProfile";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/constants/theme/useTheme";
import { useProfilePhotoStore } from "@/app/utils/useStore";
import logoDark from "@/assets/images/logo.png";
import logoLight from "@/assets/images/logoLight.png";
import shadowDark from "@/assets/images/userShadow.png";
import shadowLight from "@/assets/images/userShadowLight.png";
import add from "@/assets/images/add.png";
import addLight from "@/assets/images/addLight.png";
import edit from "@/assets/images/editar.png";
import editLight from "@/assets/images/editarLight.png";
import { useFonts } from "expo-font";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const { width, height } = Dimensions.get("window");

const proportionalFontSize = (size: number) => {
  const baseWidth = 375;
  return (size * width) / baseWidth;
};

const UserProfile: React.FC = () => {
  const theme = useAppTheme();
  const colorScheme = useColorScheme();
  const [is_following, setIsFollowing] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const navigation = useNavigation();
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const {
    userId,
    getprofile_photo,
    getusuario,
    getfollowingnum,
    getfollowersnum,
    getdescription,
  } = useLocalSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [isPanelVisible, setisPanelVisible] = useState(false);
  const [AlertText, setAlertText] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);

  const showModalAlert = (message: string) => {
    setAlertText(message);
    setAlertVisible(true);
  };

  const togglePanel = () => {
    setisPanelVisible(!isPanelVisible);
  };

  const toggleAlert = () => {
    setAlertVisible(!isAlertVisible);
  };

  const checkToken = async () => {
    const storedToken = await AsyncStorage.getItem("access_token");
    setToken(storedToken);

    try {
      if (storedToken !== null) {
        setisPanelVisible(false);
        checkFollowing(getusuario as string, storedToken);
      } else {
        setisPanelVisible(true);
      }
    } catch (error) {
      console.error("Error al verificar el token", error);
    }
  };

  useEffect(() => {
    const followingNumConverted = Number(getfollowingnum);
    const followersNumConverted = Number(getfollowersnum);
    setFollowing(followingNumConverted);
    setFollowers(followersNumConverted);
    checkToken();
  }, []);

  const closePanel = () => {
    setIsVisible(false);
  };

  const cleanData = async () => {
    router.push("/screens/Account/Login");
  };

  const checkFollowing = async (username: string, tokencheck: string) => {
    try {
      const response = await axios.get(
        `${url.url}/api/check_following?username=${username}`,
        {
          headers: {
            Authorization: `Bearer ${tokencheck}`,
          },
        }
      );

      if (response.status === 200) {
        setIsFollowing(response.data.is_following);
      } else {
        Alert.alert(
          "Error",
          "No se pudo obtener la información de seguimiento"
        );
      }
    } catch (error) {
      setisPanelVisible(true);
    }
  };

  const followUser = async () => {
    try {
      const response = await axios.post(
        `${url.url}/api/follow`,
        {
          user_to_follow: getusuario,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        showModalAlert(`Has seguido a ${getusuario} :D`);
        setIsFollowing(true);
        setFollowers(followers + 1);
      } else {
        Alert.alert("Error", "No se pudo seguir al usuario");
      }
    } catch (error) {
      showModalAlert("Ha habido un error al intentar seguir al usuario");
    }
  };

  const unfollowUser = async () => {
    try {
      const response = await axios.post(
        `${url.url}/api/unfollow`,
        {
          user_to_unfollow: getusuario,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        showModalAlert(`Has dejado de seguir a ${getusuario} :(`);
        setIsFollowing(false);
        setFollowers(followers - 1);
      } else {
        Alert.alert("Error", "No se pudo dejar de seguir al usuario");
      }
    } catch (error) {
      console.error("Error al intentar dejar de seguir al usuario", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          ...styles.container,
          backgroundColor: theme.colors.background,
        }}
      >
        <View
          style={{
            ...styles.superior,
            borderBottomColor: theme.colors.text,
            borderBottomWidth: 2,
          }}
        >
          <Image
            source={colorScheme === "dark" ? logoDark : logoLight}
            style={styles.logo}
          />
          <View style={styles.cajauser}>
            <Text
              style={{
                ...styles.welcomeText,
                color: theme.colors.text,
              }}
            >
              {getusuario || "No disponible"}
            </Text>
          </View>
        </View>
        <View style={styles.middle}>
          <View style={styles.cajafoto}>
            {getprofile_photo ? (
              <Image
                source={{ uri: getprofile_photo as string }}
                style={styles.profilePhoto}
              />
            ) : (
              <Image
                source={colorScheme === "dark" ? shadowDark : shadowLight}
                style={{
                  width: 150,
                  height: 170,
                  marginLeft: "5%",
                  marginTop: "5%",
                  resizeMode: "contain",

                  borderRadius: 10,
                }}
              />
            )}
          </View>
          <View style={styles.cajainfo}>
            <View style={styles.cajaseguidores}>
              <View
                style={{
                  ...styles.seguidosinfo,
                  borderBottomColor:
                    colorScheme === "dark" ? "#ffffff" : "#000000",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 10,
                  borderRadius: 10,
                  shadowColor: colorScheme === "dark" ? "#000" : "#ffffff",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: colorScheme === "dark" ? 0.25 : 0.15,
                  shadowRadius: colorScheme === "dark" ? 3.84 : 2,
                  elevation: colorScheme === "dark" ? 5 : 2,
                }}
              >
                <Text
                  style={{
                    ...styles.seguidos,
                    color: colorScheme === "dark" ? "#FFFFFF" : "#333333",
                    fontSize: proportionalFontSize(12),
                  }}
                >
                  SIGUIENDO
                </Text>
                <View style={styles.seguidosvaluecaja}>
                  <Text
                    style={{
                      ...styles.value,
                      color: colorScheme === "dark" ? "#FFFFFF" : "#333333",
                      fontSize: proportionalFontSize(20),
                      fontWeight: "bold",
                    }}
                  >
                    {following || "0"}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  ...styles.seguidoresinfo,
                  borderBottomColor:
                    colorScheme === "dark" ? "#ffffff" : "#000000",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 10,
                  borderRadius: 10,
                  shadowColor: colorScheme === "dark" ? "#000" : "#ffffff",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: colorScheme === "dark" ? 0.25 : 0.15,
                  shadowRadius: colorScheme === "dark" ? 3.84 : 2,
                  elevation: colorScheme === "dark" ? 5 : 2,
                }}
              >
                <Text
                  style={{
                    ...styles.seguidos,
                    color: colorScheme === "dark" ? "#FFFFFF" : "#333333",
                    fontSize: proportionalFontSize(12),
                  }}
                >
                  SEGUIDORES
                </Text>
                <View style={styles.seguidosvaluecaja}>
                  <Text
                    style={{
                      ...styles.value,
                      color: colorScheme === "dark" ? "#FFFFFF" : "#333333",
                      fontSize: proportionalFontSize(20),
                      fontWeight: "bold",
                    }}
                  >
                    {followers || "0"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.cajadescripcion}>
              <Text
                style={{
                  ...styles.descripcion,
                  color: theme.colors.text,
                }}
              >
                {getdescription || "Me encanta Atonik!"}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.cajaboton}>
          <Pressable
            onPress={() => {
              if (is_following) {
                unfollowUser();
              } else {
                followUser();
              }
            }}
            style={{
              ...styles.button,
              backgroundColor: theme.colors.primary,
            }}
          >
            <Text
              style={{
                ...styles.buttonText,
                color: "#ffffff",
              }}
            >
              {is_following ? "Dejar de seguir" : "Seguir"}
            </Text>
          </Pressable>
        </View>
        <View style={styles.cajaeventos}>
          <EventListTopProfile usernameToget={getusuario as string} />
        </View>
        <CustomModal
          onBackdropPress={toggleAlert}
          isVisible={isAlertVisible}
          toggleModal={toggleAlert}
          modalText={AlertText}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  superior: {
    position: "relative",
    top: "1%",
    marginBottom: "5%",
    width: "100%",
    height: "13%",
    borderBottomWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  cajauser: {
    position: "absolute",
    bottom: "5%",
  },
  welcomeText: {
    marginTop: "0%",
    fontStyle: "italic",
    fontSize: proportionalFontSize(24),
  },
  middle: {
    flexDirection: "row", // Disposición horizontal
    height: "30%",
    top: "0%",
    width: "100%",
    position: "relative",
  },
  logo: {
    top: "0%",
    height: 50,
    width: 50,
    marginTop: width > 375 ? "0%" : "7%",
    position: "absolute",
  },
  cajafoto: {
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    width: "45%",
    height: "80%",
  },
  anadir: {
    position: "absolute",
    width: "15%",
    height: "15%",
    right: "0%",
    bottom: "0%",
  },
  profilePhoto: {
    marginLeft: "5%",
    marginTop: "5%",
    width: 150,
    height: 170,
    borderRadius: 55,
  },
  cajainfo: {
    width: "55%",
    height: "90%",
    left: "45%",
  },
  cajaseguidores: {
    marginLeft: proportionalFontSize(5),
    top: "2%",
    width: "100%",
    height: "40%",
    flexDirection: "row",
  },
  seguidosinfo: {
    width: "40%",
    height: height * 0.07,
    top: "10%",
    borderBottomWidth: 2,
  },
  seguidoresinfo: {
    width: "50%",
    marginLeft: "5%",
    height: height * 0.07,
    top: "10%",
    borderBottomWidth: 2,
  },
  seguidostextcaja: {
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#373737",
    backgroundColor: "black",
  },
  seguidos: {
    color: "white",
    fontSize: proportionalFontSize(15),
  },
  seguidosvaluecaja: {
    alignItems: "center",
  },
  value: {
    color: "white",
    fontSize: proportionalFontSize(18),
  },
  cajadescripcion: {
    position: "absolute",
    width: "90%",
    height: "65%",
    left: "5%",
    top: width > 375 ? "45%" : "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  descripcion: {
    textAlign: "center",
    color: "white",
    fontSize: proportionalFontSize(20),
    paddingHorizontal: 10, // Añade un poco de padding horizontal para evitar que el texto toque los bordes del contenedor
    lineHeight: proportionalFontSize(24), // Aumenta la altura de línea para mejorar la legibilidad
    flexShrink: 1, // Permite que el texto se reduzca en tamaño si es necesario para ajustarse al contenedor
  },
  editar: {
    position: "absolute",
    width: 20,
    height: 20,
    right: "10%",
    bottom: "10%",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    height: "45%",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 10,
  },
  button2: {
    alignItems: "center",
    flexDirection: "row",
    margin: "5%",
    position: "absolute",
    width: "40%",
    height: "45%",
    backgroundColor: "#f9342b",
    borderRadius: 10,
  },
  buttonText: {
    color: "black",
    fontSize: proportionalFontSize(16),
  },
  cajaboton: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "15%",
    marginTop: "-2%",
  },
  cajainferior: {
    width: "100%",
    height: "50%",
  },

  userinferior: {
    fontStyle: "italic",
    fontWeight: "bold",
    color: "white",
    fontSize: proportionalFontSize(16),
  },
  cajaquien: {
    marginLeft: "2%",
    alignItems: "center",
    flexDirection: "row",
  },
  mensaje: {
    marginLeft: "2%",
    color: "white",
    fontSize: proportionalFontSize(16),
  },
  cajahistorial: {
    position: "absolute",
    bottom: "5%",
    width: "100%",
    height: "20%",
  },
  cajaeventos: {
    position: "absolute",
    bottom: width > 375 ? "22%" : "25%", // Condicional para modificar la posición dependiendo del tamaño de la pantalla
    width: "100%",
    height: "20%",
  },
  cajaeventosimagenes: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  imageevents: {
    width: 90,
    height: 90,
    margin: 10,
  },
  cajaeventosfechas: {
    bottom: "0%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    justifyContent: "space-around",
  },
  cajaeventoshistorialfechas: {
    bottom: "12%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    justifyContent: "space-around",
  },
  whitetext: {
    color: "white",
  },
  saveButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  modalContent: {
    backgroundColor: "rgba(45, 10, 66, 1)",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  inputCaja: {
    alignItems: "center",
    position: "relative",
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff",
    flexDirection: "row",
    marginBottom: "10%",
  },
  input: {
    marginTop: "5%",
    padding: "2%",
    color: "#fff",
    fontSize: 17,
    width: "100%",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  iconUser: {
    bottom: "10%",
    position: "absolute",
    right: "0%",
    width: 25,
    height: 25,
  },
  alertmodal: {
    padding: "5%",
    borderRadius: 40,
    backgroundColor: "rgba(45, 10, 66, 1)",
    alignItems: "center",
    width: "100%",
    height: "20%",
    position: "absolute",
    top: "35%",
    left: "0%",
  },
  modaltext: {
    color: "white",
    textAlign: "center",
    fontSize: proportionalFontSize(20),
    paddingHorizontal: 5, // Añade un poco de padding horizontal para evitar que el texto toque los bordes del contenedor
    lineHeight: proportionalFontSize(24), // Aumenta la altura de línea para mejorar la legibilidad
  },
  modaltextbutton: {
    color: "black",
    textAlign: "center",
    fontSize: proportionalFontSize(20),
    lineHeight: proportionalFontSize(24), // Aumenta la altura de línea para mejorar la legibilidad
  },
  gologin: {
    top: "70%",
    position: "absolute",
    justifyContent: "center",
    width: "60%",
    height: "35%",
    backgroundColor: "white",
    borderRadius: 5,
    alignItems: "center",
  },
});
export default UserProfile;
