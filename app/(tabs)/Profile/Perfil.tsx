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
  ActivityIndicator,
  useColorScheme,
  KeyboardAvoidingView,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ticketProfile from "@/assets/images/ticketProfile.png";
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
import * as FileSystem from "expo-file-system";
import Modal from "react-native-modal";
import Panel from "@/components/panelPushUp";
import drawerDark from "@/assets/images/drawer2.png";
import drawerLight from "@/assets/images/drawerLight.png";
import CustomModal from "@/components/modalAlert";
import EventListProfile from "@/components/eventListTopProfile";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import edit from "@/assets/images/editar.png";
import editLight from "@/assets/images/editarLight.png";
import add from "@/assets/images/add.png";
import addLight from "@/assets/images/addLight.png";
import shadowDark from "@/assets/images/userShadow.png";
import shadowLight from "@/assets/images/userShadowLight.png";
import logoDark from "@/assets/images/logo.png";
import logoLight from "@/assets/images/logoLight.png";

const { width, height } = Dimensions.get("window");
import { useProfilePhotoStore } from "@/app/utils/useStore";
import { useAppTheme } from "@/constants/theme/useTheme";
import { useFonts } from "expo-font";
const proportionalFontSize = (size: number) => {
  const baseWidth = 375; // Ancho base (puedes ajustarlo según tus necesidades)
  return (size * width) / baseWidth;
};

const Profile: React.FC = () => {
  const theme = useAppTheme();
  const colorScheme = useColorScheme();
  const setIsPromoter = useProfilePhotoStore(state => state.setIsPromoter);
  const isPromoter = useProfilePhotoStore(state => state.isPromoter);
  const profilePhoto = useProfilePhotoStore((state) => state.profilePhoto);
  const setProfilePhoto = useProfilePhotoStore(
    (state) => state.setProfilePhoto
  );

  const [isLoading, setIsLoading] = useState(false);
  const [eventUsers, setEventUsers] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [descriptionProfile, setdescriptionProfile] = useState<string | null>(
    null
  );
  const [followers, setFollowers] = useState<string | null>(null);
  const [following, setFollowing] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [updateImage, setUpdateImage] = useState<string | null>(null);
  const [newDescription, setnewDescription] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [AlertText, setAlertText] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  // const requestUserPermission = async () => {
  //   const authStatus = await getMessaging.requestPermission();
  //   const enabled =
  //     authStatus === getMessaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === getMessaging.AuthorizationStatus.PROVISIONAL;
  //   if (enabled) {
  //     console.log("Authorization status:", authStatus);
  //   }
  // };
  // useEffect(() => {
  //   if (requestUserPermission()) {
  //     console.log("Permisos de notificaciones concedidos");
  //     messaging()
  //       .getToken()
  //       .then((token) => {
  //         console.log("Token de notificación:", token);
  //       });
  //   } else {
  //     console.log("Permisos de notificaciones denegados");
  //   }
  // }, []);
  const showModalAlert = (message: string) => {
    setAlertText(message);
    setAlertVisible(true);
  };
  const toggleAlert = () => {
    setAlertVisible(!isAlertVisible);
  };
  const togglePanel = () => {
    setIsVisible((prev) => !prev);
  };

  const closePanel = () => {
    setIsVisible(false);
  };
  const [fontsLoaded] = useFonts({
    "Inter-Light": require("@/assets/fonts/Inter/Inter-Light.ttf"),
    "Inter-Bold": require("@/assets/fonts/Inter/Inter-Bold.ttf"),
    "Roboto-Medium": require("@/assets/fonts/Roboto-Medium.ttf"),
  });
  const openModal = () => {
    setAlertText("Escribe una nueva descripción");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const checkToken = async () => {
    console.log("Verificando token...");
    try {
      const storedToken = await AsyncStorage.getItem("access_token");
      console.log("Token almacenado:", storedToken);
      if (storedToken !== null) {
        const decoded: any = jwtDecode(storedToken);
        setToken(storedToken);
        setUsername(decoded.sub.user);
        fetchUserData(decoded.sub.user, storedToken);
        console.log("Decoded token en profile :", decoded);
        setProfilePhoto(decoded.sub.profilePhoto);
      } else {
        setToken(null);
        setIsVisible(true);
      }
    } catch (error) {
      console.error("Error al verificar el token", error);
    }
  };
  const fetchUserData = async (user: string, token: string) => {
    const finalUsername = user;
    console.log("Fetching user data for:", finalUsername);
    try {
      const response = await fetch(
        `${url.url}/api/get_myuser_details/${finalUsername}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("User data:", data.isPromoter);
        setIsPromoter(data.isPromoter);
        setdescriptionProfile(data.description);
        setProfilePhoto(data.profile_photo);
        setFollowers(data.followersnum);
        setFollowing(data.followingnum);
      } else {
        const errorData = await response.json();
        console.log("Error data:", errorData);
        showModalAlert(
          "Tu sesion ha caducado por favor inicia sesion de nuevo"
        );
        setTimeout(() => {
          cleanData();
        }, 3500);
      }
    } catch (error) {
      showModalAlert("Ha habido un error de conexion");
    }
  };
  const cleanData = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");
      setdescriptionProfile(null);
      setProfilePhoto("");
      setUsername(null);
      setProfilePhoto("");
      setFollowers(null);
      setFollowing(null);
      setDecodedToken(null);
      setIsLoading(false);
      setTimeout(() => {
        router.push({
          pathname: "/(tabs)/home",
        });
      }, 1500);
    } catch (error) {
      console.error("Error al limpiar datos", error);
      router.push("/screens/Account/Login");
    }
  };

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

  const pickImage = async () => {
    const { status: galleryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (galleryStatus !== "granted" || cameraStatus !== "granted") {
      Alert.alert(
        "Error",
        "Necesitas permisos para acceder a la galería y la cámara"
      );
      return;
    }

    const showOptions = async () => {
      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ["Cancelar", "Abrir galería", "Tomar foto"],
            cancelButtonIndex: 0,
          },
          async (buttonIndex) => {
            if (buttonIndex === 1) {
              await openGallery();
            } else if (buttonIndex === 2) {
              await openCamera();
            }
          }
        );
      } else {
        const response = await new Promise((resolve) => {
          Alert.alert(
            "Seleccionar una opción",
            "Elige cómo quieres añadir tu imagen",
            [
              {
                text: "Cancelar",
                style: "cancel",
                onPress: () => resolve(null),
              },
              { text: "Abrir galería", onPress: () => resolve("gallery") },
              { text: "Tomar foto", onPress: () => resolve("camera") },
            ]
          );
        });

        if (response === "gallery") {
          await openGallery();
        } else if (response === "camera") {
          await openCamera();
        }
      }
    };
    const fetchUserData = async (user: string, token: string) => {};
    const openGallery = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
        allowsEditing: true,
        aspect: [3, 3],
      });
      if (!result.canceled) {
        const { uri } = result.assets[0];

        uploadImage(uri, username ? username : "user");
      }
    };

    const openCamera = async () => {
      const result = await ImagePicker.launchCameraAsync({
        quality: 1,
        allowsEditing: true,
        aspect: [3, 3],
      });
      if (!result.canceled) {
        const { uri } = result.assets[0];

        uploadImage(uri, username ? username : "user");
      }
    };

    await showOptions();
  };
  const uploadImage = async (imageUri: string, fileName: string) => {
    console.log("Subiendo imagen", fileName);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: `${fileName}.jpg`, // Nombre del archivo con extensión
        type: "image/jpeg", // Tipo MIME del archivo
      });
      const response = await axios.post(`${url.url}/upload_photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("Imagen subida con éxito");
        setProfilePhoto(imageUri);
      } else {
        console.log("Error al subir la imagen");
      }
    } catch (error) {
      console.error("Error en la subida de imagen", error);
    }
  };
  const updateDescription = async () => {
    try {
      const response = await fetch(`${url.url}/api/upload_description`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: newDescription,
          username: username,
        }),
      });
      if (response.ok) {
        closeModal();
        setdescriptionProfile(newDescription);
      }
    } catch (error) {
      console.error("Error al actualizar la descripción", error);
      Alert.alert("Error", "No se pudo actualizar la descripción");
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
          {token ? (
            <Pressable
              onPress={() => navigation.openDrawer()}
              style={{
                position: "absolute",
                left: "2%",
                height: 40,
                width: 40,
                top: height * 0.005,
              }}
            >
              <Image
                source={colorScheme === "dark" ? drawerDark : drawerLight}
                style={{ resizeMode: "contain", width: 40, height: 40 }}
              />
            </Pressable>
          ) : null}

          <Image
            source={colorScheme === "dark" ? logoDark : logoLight}
            style={styles.logo}
          />
          <View style={styles.cajauser}>
            <Text
              style={{
                ...styles.welcomeText,
                color: theme.colors.text, // Cambia el color según el tema
              }}
            >
              {username ? username : ""}
            </Text>
          </View>
        </View>
        <View style={styles.middle}>
          <View style={styles.cajafoto}>
            {profilePhoto !== "" ? (
              <Image
                source={{ uri: profilePhoto }}
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

            {token && (
              <Pressable
                onPress={pickImage}
                style={({ pressed }) => [
                  {
                    transform: pressed ? [{ scale: 0.8 }] : [{ scale: 1 }],
                    opacity: pressed ? 0.8 : 1,
                  },
                  styles.anadir,
                ]}
              >
                <Image
                  source={colorScheme === "dark" ? add : addLight}
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    right: "0%",
                    bottom: "0%",
                  }}
                />
              </Pressable>
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

            {descriptionProfile === null ? (
              <View style={{ marginTop: 20 }}>
                <Pressable
                  onPress={() => router.push("/screens/Account/Login")}
                  style={({ pressed }) => [
                    {
                      transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
                      opacity: pressed ? 0.8 : 1,
                      width: "95%",
                      backgroundColor: theme.colors.primary,
                      paddingVertical: 12,
                      paddingHorizontal: 20,
                      borderRadius: 8,
                      alignItems: "center",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 19,
                      color: "#ffffffc0",
                      fontWeight: "200",
                    }}
                  >
                    Iniciar Sesión
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.cajadescripcion}>
                {isModalVisible ? (
                  <>
                    <TextInput
                      placeholder="Escribe la nueva descripción"
                      placeholderTextColor="#7C7C7C"
                      style={{
                        ...styles.descripcion,
                        color: theme.colors.text,
                        borderBottomWidth: 1,
                        borderBottomColor: theme.colors.text,
                        padding: 5,
                      }}
                      onChangeText={setnewDescription}
                      value={newDescription || ""}
                      editable={true}
                      maxLength={50}
                      multiline={true}
                    />
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <Pressable
                        onPress={updateDescription}
                        style={{
                          flex: 1,
                          backgroundColor: theme.colors.primary,
                          paddingVertical: 12,
                          borderRadius: 8,
                          alignItems: "center",
                          marginRight: 8,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: proportionalFontSize(16),
                            fontWeight: "bold",
                          }}
                        >
                          Guardar
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          setModalVisible(false);
                          setnewDescription(null);
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: "#f0f0f0",
                          paddingVertical: 12,
                          borderRadius: 8,
                          alignItems: "center",
                          marginLeft: 8,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: "#333",
                            fontSize: proportionalFontSize(16),
                            fontWeight: "bold",
                          }}
                        >
                          Cancelar
                        </Text>
                      </Pressable>
                    </View>
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        ...styles.descripcion,
                        color: theme.colors.text,
                      }}
                    >
                      {descriptionProfile}
                    </Text>
                    <Pressable
                      onPress={() => setModalVisible(true)}
                      style={({ pressed }) => [
                        {
                          transform: pressed
                            ? [{ scale: 0.8 }]
                            : [{ scale: 1 }],
                          opacity: pressed ? 0.8 : 1,
                        },
                        styles.editar,
                      ]}
                    >
                      <Image
                        source={colorScheme === "dark" ? edit : editLight}
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          right: "0%",
                          bottom: "0%",
                        }}
                      />
                    </Pressable>
                  </>
                )}
              </View>
            )}
          </View>
        </View>
        {token ? (
          <View style={styles.cajaboton}>
            <Pressable
              onPress={cleanData}
              style={{
                ...styles.button,
                backgroundColor: colorScheme === "dark" ? "#d4d4d4" : "#535353",
              }}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <Text
                  style={{
                    ...styles.buttonText,
                    color: colorScheme === "dark" ? "black" : "white", // Cambia el color según el tema
                  }}
                >
                  Cerrar sesion
                </Text>
              )}
            </Pressable>
          </View>
        ) : (
          <></>
        )}
        {/* 
        <View style={styles.cajainferior}>
          {username ? (
            <View style={styles.cajaquien}>
              <Text style={styles.userinferior}>
                {username ? username : ""}
              </Text>
              <Text style={styles.mensaje}>estara en estos eventos ...</Text>
            </View>
          ) : (
            <></>
          )}
        </View> */}
        <View style={styles.cajaeventos}>
          {token ? (
            eventUsers > 0 ? (
              <></>
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 20,
                  marginTop: "10%",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: "15%",
                    fontSize: proportionalFontSize(18),
                    color: theme.colors.text,
                    fontFamily: "Inter-Light",
                    fontStyle: "italic",
                  }}
                >
                  Esta muy vacio por aqui ...
                </Text>
                <Image
                  source={ticketProfile}
                  style={{
                    width: "90%", // Agrandado
                    height: "80%", // Agrandado

                    resizeMode: "contain",
                    marginTop: "5%",
                  }}
                />
              </View>
            )
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: proportionalFontSize(20),
                  color: theme.colors.text,
                  marginBottom: 10,
                  fontFamily: "Inter-Light",
                  fontStyle: "italic",
                }}
              >
                Iniciar sesión para ver tus futuros {"\n"}
                <Text style={{ fontFamily: "Inter-Bold", fontWeight: "bold" }}>
                  eventos
                </Text>
              </Text>

              <Image
                source={ticketProfile}
                style={{
                  width: "90%", // Agrandado
                  height: "80%", // Agrandado
                  resizeMode: "contain",
                }}
              />
            </View>
          )}
        </View>
      </View>
      <Panel
        isVisible={isVisible}
        togglePanel={togglePanel}
        closePanel={closePanel}
      />{" "}
      <Panel
        isVisible={isVisible}
        togglePanel={togglePanel}
        closePanel={closePanel}
      />
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

export default Profile;
