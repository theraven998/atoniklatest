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

import { Container } from "@shopify/react-native-skia/lib/typescript/src/renderer/Container";
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
const DescriptionEvent: React.FC = () => {
  const [Descripcion, setDescripcion] = useState<string>("");
  const [pressed2, setPressed2] = useState(false);
  const { Nombre, Fecha, Price, time, barrio, city, latitude, longitude } = useLocalSearchParams();
  const navigation = useNavigation();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const [isWriting, setIsWriting] = useState(false);
  const handleContinue = () => {
  
    router.push({
      pathname: "/screens/Publish/Cantidad",
      params: {
        Nombre,
        Fecha,
        Price,
        barrio,
        city,
        Descripcion,
        latitude,
        longitude,
        time
      },
    });
  }
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
          <Ubicacion width={screenWidth * 0.95} height={546} />
        ) : (
          // <DescriptionSmall
          //   width={screenWidth * 0.80}
          //   height={screenHeight * 0.75}
          // />
        )} */}
        <View style={styles.cajaPregunta}>
          <View style={styles.textRow}>
            <Text style={styles.buttontext}>Ingresa la </Text>
            <Text style={styles.textbold}>descripcion</Text>
          </View>
          <Text style={styles.buttontext}>publica de tu evento</Text>
        </View>
        <View style={styles.cajaInput}>
          <TextInput
            style={styles.input}
            placeholder="No puedes incluir medios de contacto ni ubicaciones. (Maximo 140 Caracteres)"
            placeholderTextColor="rgba(255, 255, 255, 0.5)" // Color del placeholder
            multiline // Permite múltiples líneas si es necesario
            maxLength={140}
            value={Descripcion}
            onChangeText={setDescripcion}
          />
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
    marginTop: '10%',
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
    top: "5%",
    alignItems: "center",
    flexShrink: 1, // Permite que el contenedor se encoja si es necesario
    overflow: "hidden", // Evita que los elementos se desborden visiblemente
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttontext: {
    height: "100%",
    lineHeight: 40,
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Roboto-Light",
    color: "white",
  },
  textbold: {
    lineHeight: 40, // Mantén la misma altura de línea para que los textos estén alineados
    fontSize: 24,
    fontFamily: "Roboto-Black",
    color: "white",
  },
  cajaInput: {
    marginTop: "10%",
    borderWidth: 2,
    borderColor: "#8B8B8B",
    position: "absolute",
    top: "20%",
    width: 270,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
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

export default DescriptionEvent;
