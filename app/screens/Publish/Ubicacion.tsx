import MapView, { Marker, Circle } from "react-native-maps";
import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import axios from "axios";

import {
  useNavigation,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
// import Ubicacion from "../../../assets/svgs/Ubication.svg";
import showModarAlert from "@/components/modalAlert";
import Modal from "react-native-modal";
import CustomModal from "@/components/modalAlert";
const { width } = Dimensions.get("window");

const proportionalFontSize = (size: number) => {
  const baseWidth = 375; // Ancho base (puedes ajustarlo según tus necesidades)
  return (size * width) / baseWidth;
};
const UbicacionEvent: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const navigation = useNavigation();
  const { Nombre, Fecha, time , Price } = useLocalSearchParams();
  const { width, height } = Dimensions.get("window");
  const buttonWidth = width * 0.5;
  const buttonHeight = height * 0.05;
  const [cityName, setCityName] = useState("");
  const [barrioName, setBarrioName] = useState("");
  const [radius, setRadius] = useState(200); // Radio en metros
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [AlertText, setAlertText] = useState("");

  const toggleAlert = () => {
    setAlertVisible(!isAlertVisible);
  };
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const handleSelectLocation = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    try {
      const apiKey = "AIzaSyBs_neqPp-Wmk286Eb51caljF41zsT64y0"; // Asegúrate de reemplazar esto con tu clave API de Google Maps
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );

      if (response.data.results.length > 0) {
        const addressComponents = response.data.results[0].address_components;

        const cityComponent = addressComponents.find((component) =>
          component.types.includes("locality")
        );
        const neighborhoodComponent = addressComponents.find(
          (component) =>
            component.types.includes("neighborhood") ||
            component.types.includes("sublocality")
        );
        if (cityComponent) {
          setCityName(cityComponent.long_name);
          setBarrioName(neighborhoodComponent.long_name);
          setAlertText(
            `Barrio: ${neighborhoodComponent.long_name}\n Ciudad: ${cityComponent.long_name}\n  \n (La ubicacion no se mostrara exactamente)`
          );
          toggleAlert();
        } else {
          Alert.alert("Error", "No se pudo encontrar la ciudad.");
        }
      } else {
        Alert.alert(
          "Error",
          "No se encontraron resultados para esta ubicación."
        );
      }
    } catch (error) {
      setModalVisible(true);
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation && cityName && barrioName) {
    
      router.push({
      
        pathname: "/screens/Publish/Description",
        params: {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          city: cityName,
          barrio: barrioName,
          Nombre,
          Fecha,
          Price,
          time
        },
      });
    } else {
      Alert.alert("Error", "Por favor selecciona una ubicación y completa todos los campos.");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* <Ubicacion
        width={340}
        height={560}
        style={{ position: "absolute", top: "18%" }}
      /> */}
      <View style={styles.divImg}>
        <Image
          style={styles.logo}
          source={require("../../../assets/images/LogoLetras.png")}
        />
      </View>
      <View style={styles.cajaPregunta}>
        <Text style={styles.buttontext}>Cual es la ubicacion del</Text>
        <Text style={styles.textbold}>evento?</Text>
      </View>
      <View style={styles.cajaMapa}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 5.55,
            longitude: -73.37,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleSelectLocation}
        >
          {selectedLocation && (
            <>
              <Marker coordinate={selectedLocation} />
              <Circle
                center={selectedLocation}
                radius={radius} // El radio en metros
                strokeColor="#a84df360" // Color del borde del círculo
                fillColor="#a84df360" // Color de relleno del círculo
              />
            </>
          )}
        </MapView>
      </View>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmLocation}
      >
        <Text style={styles.confirmButtonText}>Confirmar Ubicación</Text>
      </TouchableOpacity>
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContent}>
          <Text style={styles.whitetext}>Editar ubicacion</Text>
          <View style={styles.inputCaja}>
            <TextInput
              placeholderTextColor="#7C7C7C"
              style={styles.input}
              placeholder="Especifica el barrio"
              onChangeText={setBarrioName}
            />
            <Image
              source={require("../../../assets/images/editar.png")}
              style={styles.iconUser}
            />
          </View>
          <View style={styles.inputCaja2}>
            <TextInput
              placeholderTextColor="#7C7C7C"
              style={styles.input}
              placeholder="Especifica la ciudad"
              onChangeText={setCityName}

            />
            <Image
              source={require("../../../assets/images/editar.png")}
              style={styles.iconUser}
            />
          </View>
          <View style={styles.modalButtons}>
            <Pressable
              onPress={handleConfirmLocation}
              style={styles.saveButton}
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </Pressable>

            <Pressable onPress={closeModal} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <CustomModal
        onBackdropPress={toggleAlert}
        isVisible={isAlertVisible}
        toggleModal={toggleAlert}
        modalText={AlertText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#131313",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  input: {
    marginTop: "5%",
    padding: "2%",
    color: "#fff",
    fontSize: 17,
    width: "100%",
  },
  buttonText: {
    color: "black",
    fontSize: proportionalFontSize(16),
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
  cajaPregunta: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    height: "15%",
    position: "absolute",
    top: "25%",
    alignItems: "center",
  },
  whitetext: {
    color: "white",
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
  inputCaja: {
    alignItems: "center",
    position: "relative",
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff",
    flexDirection: "column",
    marginBottom: "2%",
  },
  inputCaja2: {
    alignItems: "center",
    position: "relative",
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff",
    flexDirection: "column",
    marginBottom: "8%",
  },
  modalContent: {
    backgroundColor: "rgba(45, 10, 66, 1)",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  divImg: {
    position: "absolute",
    top: "5%",
    width: "40%",
    height: "15%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 20,
    color: "white",
  },

  cajaMapa: {
    borderWidth: 5, // Ancho del borde
    borderColor: "#000000", // Color del borde
    borderRadius: 10, // Radio del borde
    overflow: "hidden", // Asegura que el mapa no sobresalga del contenedor
    position: "absolute",
    top: "38%",
    width: "75%",
    height: "33%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttontext: {
    lineHeight: 30,
    textAlign: "center",
    fontSize: 28,
    fontFamily: "Roboto-Light",
    color: "white",
  },
  textbold: {
    padding: "5%",
    lineHeight: 30,
    fontSize: 30,
    fontFamily: "Roboto-Black",
    color: "white",
  },
  map: {
    width: "100%",
    height: "100%", // El mapa ocupa el 70% de la altura de la pantalla
  },
  confirmButton: {
    position: "absolute",
    bottom: "15%",
    backgroundColor: "#722D86", // Color del botón
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 20,
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
});

export default UbicacionEvent;
