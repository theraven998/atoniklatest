import React, { useState, useCallback, useLayoutEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { jwtDecode } from "jwt-decode";
import QRCode from "react-native-qrcode-svg";
import logo from "../../../assets/images/logo.png";
import left from "../../../assets/images/left.png";
import right from "../../../assets/images/right.png";
import Panel from "../../../components/panelPushUp";
import url from "../../../constants/url.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { center } from "@shopify/react-native-skia";
export default function Tab() {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [isIn, setIsin] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [decodedToken, setDecodedToken] = useState<string | null>(null);
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

  const handlePress = () => {
    if (!isIn) {
      togglePanel();
    } else {
      openModal();
    }
    // Puedes agregar lógica adicional si necesitas hacer algo más cuando no es válido
  };

  const countFalseStatus = (tickets): number => {
    return tickets.filter((ticket) => !ticket.status).length;
  };

  const route = useRoute();
  const { event } = route.params;

  const fetchEvents = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await fetch(`${url.url}/api/protected`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
      }
      setIsin(true);
      const data = await response.json();

      // Manejar diferentes códigos de respuesta
      switch (response.status) {
        case 200:
          // Respuesta exitosa
    
          break;
        case 201:
          // Recurso creado con éxito
          console.log("Recurso creado con éxito");
          break;
        case 422:
          setIsin(false);
          console.log("Error de validación o datos inválidos:", data);
          break;
        case 204:
          // Sin contenido pero exitoso
          console.log("Sin contenido, pero la solicitud fue exitosa");
          break;
        default:
          console.log(
            "Respuesta recibida con un código inesperado:",
            response.status
          );
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getDecodedToken();
      fetchEvents();

      navigation.setOptions({
        headerShown: false,
      });

      // Aquí puedes devolver una función de limpieza si fuera necesario
      return () => {
        // cleanup actions, si es necesario
      };
    }, [navigation])
  );

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <LinearGradient colors={event.colors} style={styles.container}>
      <Image style={styles.logo} source={logo} />

      <View style={styles.imageRow}>
        <Image style={styles.row} tintColor="white" source={left} />
        <Image style={styles.eventImage} source={{ uri: event.image }} />
        <Image style={styles.row} tintColor="white" source={right} />
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.cardTitle}>{event.name}</Text>
        <Text style={styles.eventDescription}>{event.description}</Text>

        <View style={styles.eventDetails}>
          <View style={styles.cardText1}>
            <Text style={styles.Border1}>Tickets vendidos:</Text>
            <Text style={styles.cardText2}>{event.tickets.length}</Text>
          </View>
          <View style={styles.cardText1}>
            <Text style={styles.Border1}>Tickets usados</Text>
            <Text style={styles.cardText2}>
              {countFalseStatus(event.tickets)}
            </Text>
          </View>
          <View style={[styles.cardText1, styles.noMargin]}>
            <Text style={styles.Border1}>Escaners activos</Text>
            <Text style={styles.cardText2}>{event.scanners.length}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={handlePress} style={styles.buyButton}>
        <Text style={styles.buyButtonText}>Añadir escaner</Text>
      </TouchableOpacity>

      <Panel
        isVisible={isVisible}
        togglePanel={togglePanel}
        closePanel={closePanel}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{fontSize:18,paddingHorizontal:30 ,paddingBottom:25, fontWeight:"100",textAlign:"center"}} >Escanea con otro dispositivo desde Escanear Tickets/Añadir Evento. </Text>
            <QRCode value={event.scan_Id} size={200} />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#47193c",
    alignItems: "center",
  },
  logo: {
    height: 50,
    width: 50,
    marginTop: "12%",
  },
  imageRow: {
    flexDirection: "row",
    display: "flex",
  },
  row: {
    height: 45,
    width: 30,
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: 15,
    marginRight: 15,
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
    flexWrap: "nowrap",
    gap: 10,
    width: "100%",
    paddingTop: "8%",
    borderTopColor: "#c4f1ff",
    borderTopWidth: 1,
  },
  cardText: {
    width: "40%",
    fontWeight: "100",
    fontSize: 19,
    flexDirection: "column",
    color: "white",
    paddingLeft: 5,
  },
  cardText2: {
    width: "50%",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 30,
    flexDirection: "column",
    color: "white",
    paddingLeft: 20,
  },
  cardText1: {
    width: "30%",
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
    marginTop: "auto",
    width: "100%",
    height: 60,
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
    marginTop: 14
,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom:"0%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    marginBottom:"20%",
    width: 300,
    paddingBottom:"10%",
    height: 380,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#694fdb",
    borderRadius: 10,
  },
  closeButtonText: { color: "white", fontSize: 18 },
});
