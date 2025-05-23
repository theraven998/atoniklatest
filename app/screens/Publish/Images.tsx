import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Animated,
  Alert,
  Button,
} from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  useNavigation,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
// import Ubicacion from "../../../assets/svgs/Ubication.svg";
import logo from "../../../assets/images/logo.png";
// import DescriptionSmall from "../../../assets/svgs/DescriptionSmall.svg";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStore, combineReducers } from "redux";

import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width; // Ancho de la pantalla
const screenHeight = Dimensions.get("window").height; // Alto de la pantalla
const originalLogoWidth = 130;
const originalLogoHeight = 130;
const originalSvgWidth = 389;
const originalSvgHeight = 546;
const proportionalLogoWidth = (screenWidth / 384) * originalLogoWidth;
const proportionalLogoHeight = (screenHeight / 783) * originalLogoHeight;
const proportionalSvgWidth = (screenWidth / 384) * originalSvgWidth;
const proportionalSvgHeight = (screenHeight / 783) * originalSvgHeight;
const Images: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedImage2, setSelectedImage2] = useState<string | null>(null);
  const [selectedImage3, setSelectedImage3] = useState<string | null>(null);
  const [image, setImage] = useState(null);

  const [pressed2, setPressed2] = useState(false);
  const {
    Nombre,
    Fecha,
    Price,
    time,
    latitude,
    longitude,
    barrio,
    city,
    Descripcion,
    Cantidad,
    minedad,
  } = useLocalSearchParams();
  const navigation = useNavigation();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const [isWriting, setIsWriting] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Error", "Necesitas permisos para acceder a la galería");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });
  
    if (!result.canceled) {
      const { uri } = result.assets[0];
      setSelectedImage(uri);
      setPreview(uri);
    }
  };
  const pickImage2 = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Error", "Necesitas permisos para acceder a la galería");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      const { uri, type } = result.assets[0];
      const imageType = type ?? "image/jpeg"; // Asigna un valor predeterminado si `type` es `undefined`
      const fileName = `image_${Date.now()}`; // Nombre único basado en la fecha y hora
      setPreview2(uri);
    }
  };
  const pickImage3 = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Error", "Necesitas permisos para acceder a la galería");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });
    
    if (!result.canceled) {
      const { uri, type } = result.assets[0];
      const imageType = type ?? "image/jpeg"; // Asigna un valor predeterminado si `type` es `undefined`
      const fileName = `image_${Date.now()}`; // Nombre único basado en la fecha y hora
      setPreview3(uri);
    }
  };

  const setPreview = (uri: string) => {
    setSelectedImage(uri);
  };
  const setPreview2 = (uri: string) => {
    setSelectedImage2(uri);
  };
  const setPreview3 = (uri: string) => {
    setSelectedImage3(uri);
  };

  const handleContinue = () => {
   
    router.push({
      pathname: "/screens/Publish/Colors",
      params: {
        Nombre,
        Fecha,
        time,
        Price,
        latitude,
        longitude,
        barrio,
        city,
        Descripcion,
        Cantidad,
        minedad,
        imageUri: selectedImage,
        imageUri2: selectedImage2,
        imageUri3: selectedImage3,
      },
    });
  };

  useLayoutEffect(() => {
 
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.divImg}>
        <Image
          style={styles.logo}
          source={require("../../../assets/images/LogoLetras.png")}
        />
      </View>
      <KeyboardAvoidingView style={styles.svgcontainer}>
        {/* {screenHeight > 700 ? (
          <Ubicacion width={screenWidth * 0.95} height={screenHeight * 0.65} />
        ) : (
          <DescriptionSmall
            width={screenWidth * 0.8}
            height={screenHeight * 0.8}
          />
        )} */}
        <View style={styles.cajaPregunta}>
          <View style={styles.textRow}>
            <Text style={styles.buttontext}>Selecciona las</Text>
            <Text style={styles.buttontext}>imagenes para tu</Text>
          </View>
          <Text style={styles.textbold}>evento</Text>
        </View>
        <View style={styles.cajaInput}>
          {selectedImage ? (
            <View style={styles.cajita}>
              <Image style={styles.img} source={{ uri: selectedImage }} />
              <Pressable style={styles.buttoncajita} onPress={pickImage}>
                <Text>Editar</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.cajita}>
              <Pressable onPress={pickImage}>
                <Image
                  style={styles.iconuser}
                  source={require("../../../assets/images/add.png")}
                />
              </Pressable>
            </View>
          )}
          {selectedImage2 ? (
            <View style={styles.cajita}>
              <Image style={styles.img} source={{ uri: selectedImage2 }} />
              <Pressable style={styles.buttoncajita} onPress={pickImage2}>
                <Text>Editar</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.cajita}>
              <Pressable onPress={pickImage2}>
                <Image
                  style={styles.iconuser}
                  source={require("../../../assets/images/add.png")}
                />
              </Pressable>
            </View>
          )}
          {selectedImage3 ? (
            <View style={styles.cajita}>
              <Image style={styles.img} source={{ uri: selectedImage3 }} />
              <Pressable style={styles.buttoncajita} onPress={pickImage3}>
                <Text>Editar</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.cajita}>
              <Pressable onPress={pickImage3}>
                <Image
                  style={styles.iconuser}
                  source={require("../../../assets/images/add.png")}
                />
              </Pressable>
            </View>
          )}
        </View>
        <View style={styles.buttondiv}>
          <Pressable
            style={[styles.quieroserbutton, pressed2 && styles.pressedButton]}
            onPressIn={() => setPressed2(true)}
            onPressOut={() => setPressed2(false)}
            onPress={handleContinue}
          >
            <Text style={styles.buttontextbold}>Siguiente</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#131313",
  },
  svgcontainer: {
    position: "absolute",
    top: "30%",
    marginTop: "10%",
    width: "100%",
    height: screenHeight * 0.6,
    alignItems: "center",
    justifyContent: "center",
  },
  cajaPregunta: {
    display: "flex",
    flexDirection: "column",
    width: "80%",
    height: "30%",
    position: "absolute",
    top: "0%",
    alignItems: "center",
    justifyContent: "center", // Alinea el contenido al centro verticalmente
    overflow: "hidden", // Evita que los elementos se desborden visiblemente
  },
  textRow: {
    top: "0%",
    flexDirection: "column", // Cambia a columna para organizar las líneas de texto
    alignItems: "center",
  },
  buttontext: {
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Roboto-Light",
    color: "white",
  },
  buttoncajita: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "25%",
    backgroundColor: "white", // Color principal
    shadowColor: "gray", // Añade sombra
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 5, // Sombra en Android
  },
  textbold: {
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Roboto-Black", // Fuente en negrita
    color: "white",
    marginTop: 5, // Espacio entre la segunda línea y "evento"
  },
  cajaInput: {
    flexDirection: "row",
    marginTop: "10%",
    borderColor: "#8B8B8B",
    position: "absolute",
    top: "20%",
    width: screenHeight > 700 ? screenWidth * 0.95 : screenWidth * 0.8,
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  cajita: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#8B8B8B",
    width: "30%",
    height: "85%",
  },
  iconuser: {
    width: 35,
    height: 35,
  },

  input: {
    textAlignVertical: "top", // Alinea el texto en la parte superior del cuadro de texto
    width: "100%",
    height: "100%",
    color: "white",
    fontSize: 20,
    paddingVertical: 10, // Espaciado vertical
    paddingHorizontal: 10, // Espaciado horizontal
  },
  divImg: {
    position: "absolute",
    top: "10%",
    width: "30%",
    height: "20%",
  },
  logo: {
    top: "0%",
    resizeMode: "contain",
    width: "100%",
    height: "100%",
  },
  img: {
    width: "100%",
    height: "100%",
  },

  confirmButton: {
    width: "55%",
    height: "5%",
    alignItems: "center",
    position: "absolute",
    bottom: "28%",
    backgroundColor: "#722D86", // Color del botón
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Sombra en Android
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttontextbold: {
    padding: "5%",
    lineHeight: 30,
    fontSize: 24,
    fontFamily: "Roboto-Black",
    color: "white",
  },
  buttondiv: {
    marginTop: "0%",
    position: "absolute",
    top: screenHeight * 0.4,
    height: "20%",
    width: "65%",
    alignItems: "center",
    justifyContent: "center",
  },
  quieroserbutton: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "65%",
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
  pressedButton: {
    backgroundColor: "#430857", // Color más oscuro al presionar
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    elevation: 2, // Reduce la elevación al presionar
  },
});

export default Images;
