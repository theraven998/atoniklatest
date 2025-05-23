import React, { useState, useLayoutEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
  BackHandler,
  Modal,
  Button,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useNavigation, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import CustomModal from "@/components/modalAlert";
// import NombreSvg from "../../../assets/svgs/Nombre.svg"; // Asegúrate de poner la ruta correcta
//import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

const FechaEvent: React.FC = () => {
  const [pressed, setPressed] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [pressed2, setPressed2] = useState(false);
  const [isReady2, setIsReady2] = useState(false);
  const navigation = useNavigation();
  const { Nombre } = useLocalSearchParams();
  const [User, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [AlertText, setAlertText] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [Fecha, setFecha] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date()); // Para manejar la fecha temporalmente

  const onConfirmDate = () => {
    setFecha(tempDate); // Guardar la fecha seleccionada temporalmente
    setShowDatePicker(false); // Cerrar el modal
  };

  const showModalAlert = (message: string) => {
    setAlertText(message);
    setAlertVisible(true);
  };
  const toggleAlert = () => {
    setAlertVisible(!isAlertVisible);
  };
  const handleRegister = () => {
    router.push({
      pathname: "/screens/Publish/Hours",
      params: { Nombre, Fecha: formatDate(Fecha) }, // Usa formatDate para convertir la fecha
    });
  };
  

  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";
    return date.toISOString().split('T')[0];
  };
  

  const handlePress = () => {
    if (!Fecha) {
      showModalAlert("Por favor, selecciona una fecha para tu evento.");
    } else {
      handleRegister();
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  useFocusEffect(
    React.useCallback(() => {
      const handleBackButtonPress = () => {
        router.push("/(tabs)/home");
        return true; // Evita que el navegador realice la acción de retroceso por defecto
      };

      const backHandler = () => {
        BackHandler.addEventListener(
          "hardwareBackPress",
          handleBackButtonPress
        );

        return () =>
          BackHandler.removeEventListener(
            "hardwareBackPress",
            handleBackButtonPress
          );
      };
      return backHandler();
    }, [])
  );
  return (
    <View style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.divDerechos}>
          <Text style={styles.derechos}>DERECHOS RESERVADOS</Text>
        </View>
        <View style={styles.divImg}>
          <Image
            style={styles.logo}
            source={require("../../../assets/images/LogoLetras.png")}
          />
        </View>

        <View style={styles.container}>
          {/* <NombreSvg width={339} height={339} /> */}

          <View style={styles.cajaPregunta}>
            <Text style={styles.buttontext}>Cual es la fecha del</Text>
            <Text style={styles.textbold}>evento?</Text>
          </View>
          <View style={styles.cajaInputs}>
          <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.inputCaja}
      >
        <Image
          source={require("../../../assets/images/calendar.png")}
          style={styles.iconuser}
        />
        <TextInput
          style={styles.input}
          placeholder="Ingresa la fecha del evento"
          placeholderTextColor="rgba(124, 124, 124, 1)"
          value={formatDate(Fecha)}
          editable={false}
        />
      </TouchableOpacity>

      {Platform.OS === 'ios' && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setTempDate(selectedDate); // Guardar fecha temporalmente
                  }
                }}
                minimumDate={new Date()}
              /> */}
              <Button title="Confirmar" onPress={onConfirmDate} />
              <Button title="Cancelar" onPress={() => setShowDatePicker(false)} />
            </View>
          </View>
        </Modal>
      )}
{/* 
      {Platform.OS !== 'ios' && showDatePicker && (
        <DateTimePicker
          value={Fecha || new Date()}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setFecha(selectedDate);
            }
          }}
          minimumDate={new Date()}
        />
      )} */}
          </View>

          <Pressable
            style={[styles.quieroserbutton, pressed2 && styles.pressedButton]}
            onPressIn={() => setPressed2(true)}
            onPressOut={() => setPressed2(false)}
            onPress={handlePress}
          >
            <Text style={styles.buttontextbold}>Siguiente</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#131313",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  divDerechos: {
    marginBottom: "5%",
    marginTop: "40%",
    bottom: "20%",
    width: "50%",
    height: "8%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  derechos: {
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    fontSize: 24,
  },
  iconuser: {
    justifyContent: "center",
    alignItems: "center",
    width: 20,
    height: 20,
  },
  divImg: {
    bottom: "10%",
    width: "40%",
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  logo: {
    width: "85%",
    height: "85%",
    resizeMode: "contain",
  },
  container: {
    bottom: "20%",
    width: 300,
    height: 500,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cajaPregunta: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    height: "25%",
    position: "absolute",
    top: "20%",
    alignItems: "center",
  },
  registro: {
    fontStyle: "italic",
    position: "absolute",
    color: "white",
    fontSize: 30,
    fontWeight: "light",
  },
  cajaInputs: {
    alignItems: "center",
    height: "30%",
    marginTop: "8%",
    position: "absolute",
    width: "90%",
    top: "30%",
  },
  inputCaja: {
    alignItems: "center",
    position: "absolute",
    top: "25%",
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff",
    flexDirection: "row",
  },
  iconUser: {
    width: 30,
    height: 30,
  },
  iconPass: {
    position: "absolute",
    width: 30,
    height: 30,
  },
  showPassword: {
    position: "absolute",
    left: "85%",
    top: 0,
    width: 30,
    height: 30,
  },
  input: {
    padding: "2%",
    color: "#fff",
    fontSize: 18,
    width: "100%",
  },
  inputUser: {},
  inputPass: {},
  buttonCaja: {
    backgroundColor: "blue",
    top: "0%",
    height: "20%",
    width: "100%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "80%",
    height: "80%",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 10,
  },

  buttontext: {
    lineHeight: 30,
    textAlign: "center",
    fontSize: 28,
    fontFamily: "Roboto-Light",
    color: "white",
  },
  buttontextbold: {
    padding: "5%",
    lineHeight: 30,
    fontSize: 24,
    fontFamily: "Roboto-Black",
    color: "white",
  },
  textbold: {
    padding: "5%",
    lineHeight: 30,
    fontSize: 30,
    fontFamily: "Roboto-Black",
    color: "white",
  },
  quieroserbutton: {
    position: "absolute",
    top: "60%",
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    height: "15%",
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

export default FechaEvent;
