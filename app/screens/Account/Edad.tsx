import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
  StyleSheet,
  Modal,
  Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Svg, { Path } from "react-native-svg";
import { useNavigation, useLocalSearchParams, router } from "expo-router";
import url from "../../../constants/url.json";
import axios from "axios";
import CustomModal from "@/components/modalAlert";
import { Platform } from "react-native";
import Logo from "@/components/Logo";
import SvgContainer from "@/components/SvgContainer";
import { useFonts } from "expo-font";
import Background from "@/components/Background";
import ModalRounded from "@/components/ModalRounded";
import { useAppTheme } from "@/constants/theme/useTheme";
import { useColorScheme } from "react-native";
import BotonRegister from "@/components/botonRegister";
const Edad: React.FC = () => {
  const theme = useAppTheme();
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    "Inter-ExtraLightItalic": require("@/assets/fonts/Inter-4.0/extras/ttf/InterDisplay-ExtraLightItalic.ttf"),
    "Roboto-ExtraLight.ttf": require("@/assets/fonts/Roboto-ExtraLight.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalTextButton, setModalTextButton] = useState("");

  const navigation = useNavigation();
  const { username, phoneNumber, nombre, email } = useLocalSearchParams();
  const [Fecha, setFecha] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [tempDate, setTempDate] = useState(new Date()); // Para manejar la fecha temporalmente

  const onConfirmDate = () => {
    setFecha(tempDate); // Guardar la fecha seleccionada temporalmente
    calcularTiempoVivido(tempDate); // Calcular la edad al confirmar la fecha
    setShowDatePicker(false); // Cerrar el modal
  };
  const [edad, setEdad] = useState<{
    anios: number;
    meses: number;
    dias: number;
  } | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setFecha(selectedDate);
      calcularTiempoVivido(selectedDate);
    }
    setShowDatePicker(false);
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day} - ${month} - ${year}`;
  };

  const calcularTiempoVivido = (fechaNacimiento: Date) => {
    const fechaActual = new Date();
    let anios = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    let meses = fechaActual.getMonth() - fechaNacimiento.getMonth();
    let dias = fechaActual.getDate() - fechaNacimiento.getDate();

    if (dias < 0) {
      meses--;
      dias += new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth(),
        0
      ).getDate();
    }

    if (meses < 0) {
      anios--;
      meses += 12;
    }

    setEdad({ anios, meses, dias });
  };

  const handleContinuar = () => {
    if (!Fecha) {
      setModalText("Debes ingresar una fecha de nacimiento");
      setModalTextButton("Entendido");
      setModalVisible(true);
      return;
    }
    if (edad && edad.anios < 14) {
      setModalText("Debes ser mayor de 14 años para continuar");
      setModalTextButton("Entendido");
      setModalVisible(true);
      return;
    }
    const fecha = formatDate(Fecha);
    const data = {
      username: username,
      phoneNumber: phoneNumber,
      nombre: nombre,
      fechaNacimiento: fecha,
    };
    router.push({
      pathname: "/screens/Account/Password",
      params: {
        username: username,
        email: email,
        phoneNumber: phoneNumber,
        nombre: nombre,
        fecha: fecha as string,
      },
    });
    console.log("Datos a enviar:", data);
  };

  return (
    <Background>
      <View style={styles.overlay}>
        <Logo existsDerechos={false} />
        <SvgContainer>
          <Text style={styles.bienvenida}>
            Ingresa tu fecha de{"\n"} nacimiento
          </Text>
          <View style={styles.cajainputs}>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.inputcaja}
            >
              <Image
                source={require("../../../assets/images/calendar.png")}
                style={styles.iconuser}
              />
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu fecha de nacimiento"
                placeholderTextColor="rgba(124, 124, 124, 1)"
                value={formatDate(Fecha)}
                editable={false}
              />
            </TouchableOpacity>
          </View>

          {Platform.OS === "ios" && (
            <Modal
              visible={showDatePicker}
              transparent={true}
              animationType="slide"
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                  />
                  <Button title="Confirmar" onPress={onConfirmDate} />
                  <Button
                    title="Cancelar"
                    onPress={() => setShowDatePicker(false)}
                  />
                </View>
              </View>
            </Modal>
          )}

          {Platform.OS !== "ios" && showDatePicker && (
            <DateTimePicker
              value={Fecha || new Date()}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
          )}
          <View style={styles.cajainferior}>
            <View style={styles.cajacontent}>
              <View style={styles.caja}>
                <View
                  style={[
                    styles.cajadato,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Text style={styles.dato}>{edad ? edad.anios : "-"}</Text>
                </View>
                <View style={styles.cajatipodato}>
                  <Text style={styles.tipodato}>Años</Text>
                </View>
              </View>
              <View style={styles.caja}>
                <View
                  style={[
                    styles.cajadato,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Text style={styles.dato}>{edad ? edad.meses : "-"}</Text>
                </View>
                <View style={styles.cajatipodato}>
                  <Text style={styles.tipodato}>Meses</Text>
                </View>
              </View>
              <View style={styles.caja}>
                <View
                  style={[
                    styles.cajadato,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Text style={styles.dato}>{edad ? edad.dias : "-"}</Text>
                </View>
                <View style={styles.cajatipodato}>
                  <Text style={styles.tipodato}>Días</Text>
                </View>
              </View>
            </View>
          </View>
          <BotonRegister textboton="Continuar" onPress={handleContinuar} />
        </SvgContainer>
        <ModalRounded
          text={modalText}
          textbutton={modalTextButton}
          isVisible={modalVisible}
          onClose={() => {
            setModalVisible(false);
          }}
        />
      </View>
    </Background>
  );
};
const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  divderechos: {
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
  since: {
    position: "absolute",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontStyle: "italic",
    color: "white",
    fontSize: 20,
  },
  divsince: {
    justifyContent: "center",
    alignItems: "center",
    bottom: "5%",
    width: "100%",
    height: "4%",
    position: "relative",
  },
  divimg: {
    bottom: "20%",
    marginBottom: "2%",
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
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  container: {
    bottom: "18%",
    width: 320,
    height: 344,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cajabienvenida: {
    justifyContent: "center",
    alignItems: "center",
  },
  bienvenida: {
    color: "white",
    fontFamily: "Inter-ExtraLightItalic",
    fontSize: 24,
    marginTop: "5%",
    textAlign: "center",
    width: "100%",
  },
  cajainputs: {
    width: "100%",
    marginTop: "2%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputcaja: {
    borderBottomWidth: 1,
    borderRadius: 8,
    borderColor: "#FFFFFF",
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
  },
  iconuser: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  cajainferior: {
    marginTop: "5%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cajacontent: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  caja: {
    alignItems: "center",
    marginBottom: "5%",
  },
  cajadato: {
    borderRadius: 8,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  dato: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  cajatipodato: {
    marginTop: 5,
  },
  tipodato: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  button: {
    width: "65%",
    height: "12%",
    marginTop: "7%",
    justifyContent: "center",
    alignItems: "center",
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
  buttonText: {
    fontFamily: "Roboto-ExtraLight.ttf",
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
});

export default Edad;
