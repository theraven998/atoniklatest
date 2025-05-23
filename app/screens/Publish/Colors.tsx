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
  PanResponder,
  Alert,
} from "react-native";
import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
} from "react";
import {
  useNavigation,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { ColorPicker } from "../../../components/ColorPicker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  useDerivedValue,
  ColorSpace,
} from "react-native-reanimated";
// import ColorsSvg from "../../../assets/svgs/Colors.svg";
import logo from "../../../assets/images/LogoLetras.png";
// import DescriptionSmall from "../../../assets/svgs/DescriptionSmall.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Empty from "./Empty";
import * as FileSystem from "expo-file-system";
import EventCard from "@/components/eventItem";
import EventCardCreating from "@/components/eventCreating";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import Ubicacion from "../../../assets/svgs/Ubication.svg";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import url from "../../../constants/url.json";
import { jwtDecode } from "jwt-decode"; // Asegúrate de que jwtDecode esté correctamente importado
import CustomModal from "@/components/modalAlert";
import CustomModalButton from "@/components/modalAlertButton";
import { Linking } from "react-native";

const screenWidth = Dimensions.get("window").width; // Ancho de la pantalla
const screenHeight = Dimensions.get("window").height; // Alto de la pantalla
const originalLogoWidth = 130;
const originalLogoHeight = 130;
const CIRCLE_SIZE = screenHeight * 0.1;
const PICKER_WIDTH = screenWidth * 0.8;
const originalSvgWidth = 389;
const originalSvgHeight = 546;
const proportionalLogoWidth = (screenWidth / 384) * originalLogoWidth;
const proportionalLogoHeight = (screenHeight / 783) * originalLogoHeight;
const proportionalSvgWidth = (screenWidth / 384) * originalSvgWidth;
const proportionalSvgHeight = (screenHeight / 783) * originalSvgHeight;
// Función para oscurecer el color
function darkenColor(color: string, factor: number): string {
  // Eliminar el "#" del color si existe
  color = color.replace("#", "");

  // Convertir el color hexadecimal a valores RGB
  const rgb = [
    parseInt(color.substring(0, 2), 16),
    parseInt(color.substring(2, 4), 16),
    parseInt(color.substring(4, 6), 16),
  ];

  // Oscurecer cada componente RGB aplicando el factor
  const darkened = rgb.map((c) =>
    Math.max(0, Math.min(255, Math.floor(c * factor)))
  );

  // Convertir de vuelta a formato hexadecimal
  const hex = darkened.map((c) => c.toString(16).padStart(2, "0")).join("");

  return `#${hex}`;
}
const Colors: React.FC = () => {
  const [color2, setColor2] = useState<string>("#ff0000");
  const state = true;
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
  const route = useRoute();
  const newDate = new Date(Fecha as string);
  const { imageUri } = route.params as { imageUri: string };
  const { imageUri2 } = route.params as { imageUri2: string };
  const { imageUri3 } = route.params as { imageUri3: string };
  const [is_organicer, setorganicer] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [AlertText, setAlertText] = useState("");
  const [imageurl, setimageurl] = useState("");
  const [imageurl2, setimageurl2] = useState("");
  const [imageurl3, setimageurl3] = useState("");
  const COLORS = [
    "orange",
    "yellow",
    "green",
    "cyan",
    "blue",
    "purple",
    "pink",
    "red",
  ];
  const [selectedImageUristring, setSelectedImageUristring] =
    useState<string>("");
  const navigation = useNavigation();
  const [image, setImage] = useState<string | null>(null);
  const pickedColor = useSharedValue<string | number>(COLORS[0]);
  const [gradientColor, setGradientColor] = useState<string>("#FFFFFF");

  const { width } = Dimensions.get("window");
  const event = {
    name: Nombre,
    place: `${barrio}, ${city}`,
    date: { $date: Fecha },
    price: Price,
    images: [imageUri, imageUri2, imageUri3],
    image: imageUri,
    description: Descripcion,
    hour: time,
    latitude: latitude,
    longitude: longitude,
    colors: [gradientColor, color2],
  };

  const toggleAlert = () => {
    setAlertVisible(!isAlertVisible);
  };
  const openModal = () => {
    setModalVisible(true);
  };
  const goWhatsapp = () => {
    const url = `whatsapp://send?phone=${573208435424}&text=${encodeURIComponent(
      "Hola, he creado mi evento pero tengo dudas"
    )}`;
    Linking.openURL(url)
      .then(() => {
      
      })
      .catch(() => {
        Alert.alert("Error", "No se pudo abrir WhatsApp");
      });
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const onColorChanged = (color: string | number) => {
    "worklet";
    let newColor = color;
    if (typeof color === "number") {
      const intToHex = (color: number): string => {
        const hexColor = (color >>> 0).toString(16);
        return `#${hexColor.slice(-6)}`;
      };
      newColor = intToHex(color);
    }
    pickedColor.value = newColor;
  };

  const updateGradientColor = (value: string | number) => {
    let newColor = value;
    if (typeof value === "number") {
      const intToHex = (color: number): string => {
        const hexColor = (color >>> 0).toString(16);
        return `#${hexColor.slice(-6)}`;
      };
      newColor = intToHex(value);
    }
    runOnJS(setGradientColor)(newColor as string);
    runOnJS(setColor2)(darkenColor(newColor as string, 0.1));
  };
  useDerivedValue(() => {
    console.log("pickedColor.value:", pickedColor.value);
    runOnJS(updateGradientColor)(pickedColor.value);
  });

  const checkToken = async () => {
    const storedToken = await AsyncStorage.getItem("access_token");
    if (storedToken) {
      const decodedToken = jwtDecode<DecodedToken>(storedToken);
      setDecodedToken(decodedToken);
      setToken(storedToken);
    } else {
      router.push({ pathname: "/screens/Account/Login" });
    }
  };

  const uploadImages = async () => {
    try {
      const formData = new FormData();
      const files = [
        { uri: imageUri, name: "image.jpg", type: "image/jpeg" },
        { uri: imageUri2, name: "image2.jpg", type: "image/jpeg" },
        { uri: imageUri3, name: "image3.jpg", type: "image/jpeg" },
      ];

      files.forEach((file, index) => {
        if (file.uri) {
          // Verificar si el uri está definido
          formData.append("file", {
            uri: file.uri,
            name: file.name,
            type: file.type,
          });
          formData.append(
            `public_id_${index}`,
            `${file.name}_${new Date().toISOString()}`
          );
        } else {
          console.warn(`El archivo ${file.name} no tiene un URI definido.`);
        }
      });

      if (!decodedToken?.sub?.user) {
        throw new Error("El usuario del token no está definido.");
      }

      formData.append("asset_folder", `events/event_${decodedToken.sub.user}`);



      const response = await axios.post(
        `${url.url}/api/upload_photoevent`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );



      if (response.status === 201) {
        if (response.data.urls.length === 3) {
          const [url1, url2, url3] = response.data.urls;
          setimageurl(url1);
          setimageurl2(url2);
          setimageurl3(url3);
        
          handleContinue(url1, url2, url3);
        } else {
       
        }
      } else {
      
      }
    } catch (error) {
      console.error("Error en la subida de imagenes", error);
    }
  };
  const goHome = () => {
    router.push({ pathname: "/(tabs)/home" });
  };
  const handleContinue = async (url1: string, url2: string, url3: string) => {
  
    try {
      const response = await axios.get(
        `${url.url}/api/is_organicer?username=${decodedToken.sub.user}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        if (response.data.is_organicer === true) {
    
          try {
            const response = await axios.post(
              `${url.url}/api/createevent`,
              {
                name: Nombre,
                date: newDate,
                price: Price,
                latitude: latitude,
                longitude: longitude,
                barrio: barrio,
                city: city,
                description: Descripcion,
                time: time,
                quantity: Cantidad,
                image: url1,

                images: [url1, url2, url3],

                colors: [pickedColor.value, color2],

                min_age: minedad,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.status === 200) {
              setAlertText("Evento creado correctamente, tienes alguda duda?");
              setAlertVisible(true);
            } else {
            
              setAlertVisible(true);
            }
          } catch (error) {
       
            setAlertVisible(true);
          }
        } else {
          setAlertText("Ha habido un error no eres organizador");
          setAlertVisible(true);
          router.push({ pathname: "/screens/Account/Login" });
        }
      }
    } catch (error) {
      setAlertText("Ha habido un error de conexion");
      setAlertVisible(true);
    }

  };

  useLayoutEffect(() => {
    checkToken();
  
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.divImg}>
        <Image style={styles.logo} source={logo} />
      </View>
      <KeyboardAvoidingView style={styles.svgcontainer}>
        {/* {screenHeight > 700 ? (
          <Ubicacion width={screenWidth * 0.95} height={screenHeight * 0.65} />
        ) : (
          <DescriptionSmall
            width={screenWidth * 0.9}
            height={screenHeight * 0.85}
          />
        )} */}
        <View style={styles.cajaPregunta}>
          <View style={styles.textRow}>
            <Text style={styles.buttontext}>Selecciona el </Text>
            <Text style={styles.buttontext}>diseno de tu</Text>
          </View>
          <Text style={styles.textbold}>evento</Text>
        </View>
        <View style={styles.divpreview}>
          <EventCardCreating
            event={event}
            gradientColors={[pickedColor.value, color2]}
            state={state}
          />
        </View>
        <View style={styles.cajaInput}>
          <ColorPicker
            colors={COLORS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
            maxWidth={PICKER_WIDTH}
            onColorChanged={onColorChanged}
          />
        </View>
        <View style={styles.buttondiv}>
          <Pressable
            style={[styles.quieroserbutton, pressed2 && styles.pressedButton]}
            onPressIn={() => setPressed2(true)}
            onPressOut={() => setPressed2(false)}
            onPress={uploadImages}
          >
            <Text style={styles.buttontextbold}>Crear Evento</Text>
          </Pressable>
        </View>

        <CustomModalButton
          buttonText="Ir a Whatsapp"
          onPress={goWhatsapp}
          onBackdropPress={goHome}
          isVisible={isAlertVisible}
          toggleModal={closeModal}
          modalText={
            "Tu evento se ha creado correctamente, tienes alguna duda?"
          }
        />
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
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
    top: screenHeight > 700 ? "25%" : "20%",
    marginTop: "10%",
    width: "95%",
    height: screenHeight > 700 ? screenHeight * 0.6 : screenHeight * 0.75,
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
    flexShrink: 1, // Permite que el contenedor se encoja si es necesario
    overflow: "hidden", // Evita que los elementos se desborden visiblemente
  },
  circle: {
    width: "90%",
    height: "90%",
  },
  poa: {
    width: "34%",
    height: "100%",
    marginTop: "auto",
    marginBottom: "auto",
  },
  circlediv: {
    position: "absolute",
    top: "20%",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "20%",
    borderRadius: CIRCLE_SIZE / 2,
  },
  gradient: {
    height: 40,
    width: PICKER_WIDTH,
    borderRadius: 20,
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
    position: "absolute",
    top: "50%",
    width: "90%",
    height: "25%",
    alignItems: "center",
    justifyContent: "center",
  },
  divImg: {
    position: "absolute",
    top: screenHeight > 700 ? "4%" : "0%",
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
    top: "75%",
    height: "15%",
    width: "65%",
    alignItems: "center",
    justifyContent: "center",
  },
  quieroserbutton: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
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
  colorPicker: {
    width: "100%", // Ajusta el ancho para que ocupe todo el ancho del contenedor
    height: "100%", // Ajusta la altura para que ocupe toda la altura del contenedor
  },
  opacityslider: {
    marginTop: "5%",
    width: "100%", // Ajusta el ancho para que ocupe todo el ancho del contenedor
    height: "10%", // Ajusta la altura para que ocupe toda la altura del contenedor
  },
  hueslider: {
    marginTop: "5%",
    width: "100%", // Ajusta el ancho para que ocupe todo el ancho del contenedor
    height: "10%", // Ajusta la altura para que ocupe toda la altura del contenedor
  },
  Panel1: {
    width: "100%", // Ajusta el ancho para que ocupe todo el ancho del contenedor
    height: "50%", // Ajusta la altura para que ocupe toda la altura del contenedor
  },
  colorText: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
  divpreview: {
    padding: screenHeight > 700 ? "2%" : "5%",
    borderColor: "white",
    position: "absolute",
    top: "20%",
    width: "95%",
    height: "20%",
  },
  pressedButton: {
    backgroundColor: "#430857", // Color más oscuro al presionar
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    elevation: 2, // Reduce la elevación al presionar
  },
  blur: {
    borderRadius: 20,
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 0,
    overflow: "hidden",
    backgroundColor: "#14112e",
    borderWidth: 0, // Grosor del borde
    borderColor: "#202020ef0",
    width: "100%",
    alignSelf: "center",
    height: 145,
    marginBottom: "10%",
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
});

export default Colors;
