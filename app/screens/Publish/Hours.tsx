import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  Image,
  BackHandler,
  Modal,
  Button,
  Platform,
} from "react-native";
import {
  useNavigation,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import NombreSvg from "../../../assets/svgs/Nombre.svg"; // Asegúrate de poner la ruta correcta

const hourEvent: React.FC = () => {
  const [pressed2, setPressed2] = useState(false);
  const [time, setTime] = useState<string>("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  useEffect(() => {
    const randomHour = Math.floor(Math.random() * 12) + 1;
    const randomMinute = Math.floor(Math.random() * 60);
    const randomPeriod = Math.random() > 0.5 ? "AM" : "PM";
    const formattedTime = `${randomHour
      .toString()
      .padStart(2, "0")}:${randomMinute
      .toString()
      .padStart(2, "0")} ${randomPeriod}`;
    setTime(formattedTime);
  }, []);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempTime, setTempTime] = useState<Date | undefined>(undefined);
  const navigation = useNavigation();
  const { Nombre, Fecha } = useLocalSearchParams();

  const onConfirmDate = () => {
    if (tempTime) {
      const formattedTime = tempTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setTime(formattedTime);
    }
    setShowDatePicker(false);
  };

  const showModalAlert = (message: string) => {
    setAlertVisible(true);
  };

  const handleRegister = () => {
    if (!time) {
      showModalAlert("Por favor, selecciona una hora para tu evento.");
      return;
    }
    router.push({
      pathname: "/screens/Publish/Price",
      params: { Nombre, Fecha, time },
    });
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
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackButtonPress
      );

      return () => backHandler.remove();
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
            <Text style={styles.buttontext}>Cual es la hora del</Text>
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
                placeholder="Ingresa la hora del evento"
                placeholderTextColor="rgba(124, 124, 124, 1)"
                value={time}
                editable={false}
              />
            </TouchableOpacity>

            {Platform.OS === "ios" && showDatePicker && (
              <Modal
                visible={showDatePicker}
                transparent={true}
                animationType="slide"
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    {/* <DateTimePicker
                      value={new Date()}
                      mode="time"
                      display="spinner"
                      onChange={(event, selectedDate) => {
                        setTempTime(selectedDate || new Date());
                      }}
                    /> */}
                    <Button title="Confirmar" onPress={onConfirmDate} />
                    <Button
                      title="Cancelar"
                      onPress={() => setShowDatePicker(false)}
                    />
                  </View>
                </View>
              </Modal>
            )}

            {/* {Platform.OS !== "ios" && showDatePicker && (
              <DateTimePicker
                is24Hour={false}
                value={new Date()}
                mode="time"
                display="spinner"
                onChange={(event, selectedDate) => {
                  setTempTime(selectedDate || new Date());
                  setShowDatePicker(false);
                  const formattedTime = (
                    selectedDate || new Date()
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true, // Formato de 12 horas con AM/PM
                  });
                  setTime(formattedTime);
                }}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
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
  input: {
    padding: "2%",
    color: "#fff",
    fontSize: 18,
    width: "100%",
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
    backgroundColor: "#722D86",
    borderRadius: 15,
    borderColor: "#430857",
    borderBottomWidth: 5,
    borderRightWidth: 5,
    shadowColor: "#5E0D75",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  pressedButton: {
    backgroundColor: "#430857",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    elevation: 2,
  },
});

export default hourEvent;
