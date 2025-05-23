import React, { useState, useCallback, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Pressable,
  Share,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import logo from "../../../assets/images/logo.png";
import left from "../../../assets/images/left.png";
import right from "../../../assets/images/right.png";
import Panel from "../../../components/panelPushUp";
import * as Branch from "expo-branch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Circle } from "react-native-maps";
export default function Tab() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [isIn, setIsin] = useState(false);
  const [images, setImages] = useState(0);
  const [image, setImage] = useState("https://dummyimage.com/400x400/000/fff");
  const route = useRoute();
  const [loadingImages, setLoadingImages] = useState(true);
  const { event } = route.params;
  const BRANCH_KEY = "key_live_nzyeeUbybY15u9id4qYNzpliABovlD64"; // 👈 tu Branch key aquí

  const crearLinkEvento = async (eventoId: string): Promise<string | null> => {
    const body = {
      branch_key: BRANCH_KEY,
      channel: "app",
      feature: "share",
      data: {
        $deeplink_path: `event/${eventoId}`,
        eventoId, // esto va en los parámetros para que lo capture tu listener
      },
    };
    try {
      const response = await fetch("https://api2.branch.io/v1/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error creando link:", error);
      return null;
    }
  };
  const compartirEvento = async (eventoId: string) => {
    const url = await crearLinkEvento(eventoId);

    if (!url) return;

    await Share.share({
      message: `Revisa este evento: ${url}`,
    });

    console.log("Link generado y compartido:", url);
  };

  async function getDecodedToken() {
    try {
      // Obtener el token desde AsyncStorage
      const token = await AsyncStorage.getItem("access_token");

      if (token) {
        const decodedToken = jwtDecode<DecodedToken>(token);

        // Hacer algo con el token decodificado

        setUsername(decodedToken.sub.user);
        return decodedToken.sub.user;
      } else {
        console.log("No token found");
        return null;
      }
    } catch (error) {
      console.error("Error getting or decoding token:", error);
    }
  }

  const togglePanel = () => {
    setIsVisible((prev) => !prev);
  };

  const closePanel = () => {
    setIsVisible(false);
  };
  const goforpay = (eventId: any) => {
    router.push({
      pathname: "screens/Payment/Resume",
      params: { eventId }, // pasa el parámetro aquí
    });
  };

  const handlePress = () => {
    if (isIn) {
      togglePanel();
    } else {
      goforpay(event._id);

      // createTicket()
    }
    // Puedes agregar lógica adicional si necesitas hacer algo más cuando no es válido
  };

  useFocusEffect(
    useCallback(() => {
      setImage(event.images[0]);
      getDecodedToken();
      preloadImages();

      // Aquí puedes devolver una función de limpieza si fuera necesario
      return () => {
        // cleanup actions, si es necesario
      };
    }, [])
  );
  const handleLeft = () => {
    if (images == 0) {
      setImages(event.images.length - 1);
    } else {
      setImages(images - 1);
    }
    setImage(event.images[images]);
  };
  const handleRight = () => {
    if (images == event.images.length - 1) {
      setImages(0);
    } else {
      setImages(images + 1);
    }
    setImage(event.images[images]);
  };

  const preloadImages = async () => {
    try {
      await Promise.all(event.images.map((img) => Image.prefetch(img)));
      setLoadingImages(false); // Cambiar el estado a falso cuando las imágenes estén listas
    } catch (error) {
      console.error("Error precargando imágenes:", error);
    }
  };
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient colors={event.colors} style={styles.container}>
          <Pressable
            onPress={() => {
              compartirEvento(event._id);
            }}
            style={styles.overlay}
          >
            <Text> Compartir </Text>
          </Pressable>
          <Image style={styles.logo} source={logo} />
          <View style={styles.imageRow}>
            <Pressable onPress={handleLeft}>
              <Image style={styles.row} tintColor="white" source={left} />
            </Pressable>
            <Image style={styles.eventImage} source={{ uri: image }} />
            <Pressable onPress={handleRight}>
              <Image style={styles.row} tintColor="white" source={right} />
            </Pressable>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.cardTitle}>{event.name}</Text>
            <Text style={styles.eventDescription}>{event.description}</Text>

            <View style={styles.eventDetails}>
              <View style={styles.cardText1}>
                <Text style={styles.Border1}>Lugar:</Text>
                <Text style={styles.cardText}>{event.place}</Text>
              </View>
              <View style={styles.cardText1}>
                <Text style={styles.Border1}>Fecha:</Text>
                <Text style={styles.cardText}>
                  {" "}
                  {new Date(event.date.$date).toLocaleDateString("en-GB", {
                    timeZone: "UTC",
                  })}
                </Text>
              </View>
              <View style={[styles.cardText1, styles.noMargin]}>
                <Text style={styles.Border}>Precio:</Text>
                <Text style={styles.cardText}>$ {event.price}</Text>
              </View>
              <View style={styles.cardText1}>
                <Text style={styles.Border}>Hora:</Text>
                <Text style={styles.cardText}>10 PM</Text>
              </View>
            </View>
          </View>

          {/* Map Section */}
          <View style={styles.mapContainer}>
            <Text
              style={{
                color: "white",
                fontSize: 27,
                fontWeight: 100,
                textAlign: "center",
                marginBottom: 15,
              }}
            >
              Ubicación
            </Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: parseFloat(event.latitude), // Plaza de Bolívar latitude
                longitude: parseFloat(event.longitude), // Plaza de Bolívar longitude
                latitudeDelta: 0.01, // Zoom level
                longitudeDelta: 0.01,
              }}
            >
              <Circle
                center={{
                  latitude: parseFloat(event.latitude),
                  longitude: parseFloat(event.longitude),
                }}
                radius={300} // Radius in meters
                strokeColor={event.colors[1]}
                fillColor={hexToRgb(event.colors[0], 0.3)}
              />
            </MapView>
          </View>
        </LinearGradient>
      </ScrollView>
      <TouchableOpacity onPress={handlePress} style={styles.buyButton}>
        <Text style={styles.buyButtonText}>Adquirir entrada</Text>
      </TouchableOpacity>

      <Panel
        isVisible={isVisible}
        togglePanel={togglePanel}
        closePanel={closePanel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    overflow: "hidden", // Asegura que el mapa no sobresalga del contenedor
    marginTop: "5%",
    width: "95%",
    height: "36%",
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#47193c",
    alignItems: "center",
    paddingBottom: "78%",
  },
  logo: {
    height: 50,
    width: 50,
    marginTop: "3%",
  },
  imageRow: {
    flexDirection: "row",
    display: "flex",
  },
  scrollContainer: {},
  row: {
    height: 45,
    width: 30,
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: 8,
    marginRight: 8,
  },
  eventImage: {
    aspectRatio: 1,
    marginTop: 30,
    width: "78%",
    borderRadius: 20,
  },
  descriptionContainer: {
    borderRadius: 0,
    alignContent: "center",
    paddingHorizontal: 10,
    overflow: "hidden",
    borderWidth: 0,
    borderColor: "#131313",
    width: "100%",
    height: 320,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    marginTop: 20,
    elevation: 120,
  },
  eventDescription: {
    marginLeft: 10,
    fontSize: 20,
    color: "white",
    textAlign: "left",
    width: "90%",
    marginTop: 10,
    fontWeight: "200",
  },
  eventDetails: {
    marginLeft: 11,
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 40,
    width: "90%",
    paddingTop: "8%",
    marginBottom: 20,
    borderTopColor: "#ffffff",
    borderTopWidth: 1,
  },
  cardText: {
    width: "100%",
    fontWeight: "100",
    fontSize: 19,
    flexDirection: "column",
    color: "white",
    paddingLeft: 5,
  },
  cardText1: {
    width: "40%",
    flexDirection: "column",
    color: "white",
  },
  noMargin: {
    marginRight: 0,
  },
  Border: {
    width: "100%",
    color: "#94c8f3",
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 0,
    fontSize: 22,
    fontWeight: "300",
  },
  Border1: {
    width: "100%",
    color: "#94c8f3",
    paddingLeft: 5,
    marginBottom: 0,
    fontSize: 22,
    fontWeight: "300",
  },
  buyButton: {
    backgroundColor: "white",
    width: "100%", // Ocupar el ancho completo de la pantalla
    height: 60,
    position: "absolute",
    bottom: 0, // Fija el botón a la parte inferior
    justifyContent: "center", // Centra el contenido verticalmente
    alignItems: "center", // Centra el texto horizontalmente
    // Asegura que el botón esté sobre otros elementos
  },

  buyButtonText: {
    fontSize: 18,
    fontWeight: "300",
    textAlign: "center",
    marginBottom: "auto",
    marginTop: "auto",
  },
  cardTitle: {
    color: "#e783e7",
    fontSize: 25,
    marginLeft: 10,
    fontWeight: "400",
  },
  panel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: "#161616",
    justifyContent: "center",
    alignItems: "center",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  panelContent: {
    width: Dimensions.get("window").width * 1,
    alignItems: "center",
    height: 300,
  },
  panelText: {
    fontSize: 18,
    color: "#ffffff86",
    fontWeight: "200",
    marginTop: 14,
  },
  panelButton: {
    marginTop: 20,
    backgroundColor: "#694fdb",
    paddingHorizontal: "17%",
    paddingVertical: 10,
    borderRadius: 10,
  },

  panelButton2: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    paddingHorizontal: "12%",
    paddingVertical: 10,
    borderRadius: 10,
  },
  panelButtonText: {
    fontSize: 19,
    color: "#ffffffc0",
    fontWeight: "200",
  },
  panelButtonText2: {
    fontSize: 19,
    color: "#000000c0",
    fontWeight: "200",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
});
