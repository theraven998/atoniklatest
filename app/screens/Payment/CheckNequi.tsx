import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  Animated,
  Pressable,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import logo from "../../../assets/images/logo.png";
import paso1 from "../../../assets/images/Notificaciones.png";
import paso2 from "../../../assets/images/Aprobacion.jpg";
import paso3 from "../../../assets/images/Exitoso.png";
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import url from "../../../constants/url.json";
import { useFonts } from "expo-font";
const { width } = Dimensions.get("window");

const CheckNequi: React.FC = () => {
  const navigation = useNavigation();
  const [status, setStatus] = useState("Consultando pago");
  const [currentStep, setCurrentStep] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { messageid, clientid, transactionid } = useLocalSearchParams();
  const [fontsLoaded] = useFonts({
    Inter: require("../../../assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("../../../assets/fonts/InterDisplay-Bold.ttf"),
    "Inter-Light": require("../../../assets/fonts/Inter-Light.ttf"),
    "Inter-Thin": require("../../../assets/fonts/Inter-Thin.ttf"),
    "Inter-ExtraLight": require("../../../assets/fonts/InterDisplay-ExtraLight.ttf"),
    "Roboto-Light": require("../../../assets/fonts/Roboto-Light.ttf"),
    "Roboto-Black": require("../../../assets/fonts/Roboto-Black.ttf"),
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPaymentStatus = async () => {
    try {
      const response = await axios.get(
        `${url.url}/api/get_status_payment?messageid=${messageid}&clientid=${clientid}&transactionid=${transactionid}`
      );

      if (response.status === 200) {
        const statusCode = response.data.status;
        handleStatusCode(statusCode);
      }
    } catch (error) {
      console.error("Error al consultar estado del pago:", error);
      setStatus("Revisa tu conexión a internet");
    }
  };

  const handleStatusCode = (statusCode) => {
    switch (statusCode) {
      case "33":
        setStatus("Pendiente de pago");
        break;
      case "35":
        setStatus("Pago completado");
        router.push({ pathname: "/(tabs)/ticket" });
        if (intervalRef.current) {
          clearInterval(intervalRef.current); // Detener la consulta
        }
        break;
      default:
        setStatus("Error en el pago");
        if (intervalRef.current) {
          clearInterval(intervalRef.current); // Detener la consulta
        }
        router.push({ pathname: "/screens/Payment/CheckNequi" }); // En caso de error, redirige a una pantalla de error
        break;
    }
  };
  useEffect(() => {
    if (messageid && clientid && transactionid) {
      intervalRef.current = setInterval(() => {
        fetchPaymentStatus();
      }, 30000); // tempconsulta)
    } else {
      router.push({ pathname: "/(tabs)/home" });
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [messageid, clientid, transactionid]);

  const steps = [
    { step: 1, image: paso1, text: "Accede a la sección de Notificaciones." },
    {
      step: 2,
      image: paso2,
      text: 'Dirígete a "Recibidas" y presiona Aceptar.',
    },
    {
      step: 3,
      image: paso3,
      text: 'Verifica el estado en la opción "Mis Movimientos".',
    },
  ];

  // Vinculamos el scroll con scrollX usando Animated.event
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false } // El scrollX no puede usar useNativeDriver
  );

  const indicatorWidth = scrollX.interpolate({
    inputRange: [0, width * (steps.length - 1)],
    outputRange: [0, width], // El indicador crecerá según el scroll
  });

  useLayoutEffect(() => {
    console.log("Mesange", messageid, clientid, transactionid);
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.divlogo}>
        <Image source={logo} style={styles.logo} />
      </View>
      <Text
        style={{
          position: "absolute",
          top: "18%",
          lineHeight: 30,
          textAlign: "center",
          color: "#fff",
          fontSize: 22,
          marginBottom: 10,
          fontFamily: "Inter-Bold",
          width: "90%",
          padding: 10,
          backgroundColor: "#6438D7",
          borderRadius: 10,
          shadowColor: "#000",
        }}
      >
        Realiza cada paso para completar tu pago
      </Text>
      <View style={styles.divpasos}>
        <Text style={styles.paso}>PASO {steps[currentStep].step}</Text>
        <FlatList
          data={steps}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false} // Ocultamos el indicador nativo
          onScroll={handleScroll} // Vinculamos scrollX
          onMomentumScrollEnd={(e) => {
            const index = Math.floor(e.nativeEvent.contentOffset.x / width);
            setCurrentStep(index); // Actualizamos el paso actual
          }}
          keyExtractor={(item) => item.step.toString()}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.pasoimg} />
              <Text style={styles.pasotext}> {item.text}</Text>
            </View>
          )}
        />
        {/* Indicador personalizado */}
        <View style={styles.indicatorContainer}>
          <Animated.View
            style={[styles.indicator, { width: indicatorWidth }]} // Indicador animado
          />
        </View>
      </View>

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: "10%",
          padding: 15,
          backgroundColor: "#6438D7",
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#fff",
            textAlign: "center",
            fontFamily: "Inter-Bold",
          }}
        >
          ESTADO: {" "}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#fff",
              textAlign: "center",
              fontFamily: "Inter-Bold",
            }}
          >
            {status}
          </Text>
        </Text>
      </View>
      <Pressable 
  
      style={styles.cancelPayment}>
        <Text style={styles.textwhite}>Cancelar pago</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#131313",
  },
  divlogo: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    height: "10%",
    top: "5%",
  },
  imagecontainer: {
    width: width,
    height: "100%",
    justifyContent: "center",
  },
  logo: {
    resizeMode: "contain",
    width: "90%",
    height: "90%",
  },
  divpasos: {
    alignItems: "center",
    width: width,
    height: "50%",
    position: "absolute",
    bottom: "20%",
  },
  imageContainer: {
    width: width,
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  pasoimg: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
  dialogBox: {
    height: width > 375 ? "10%" : "8%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: "10%",
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  mensaje: {
    position: "absolute",
    top: "18%",
    lineHeight: 30,
    textAlign: "center",
    color: "#fff",
    fontSize: 22,
    marginBottom: 10,
  },
  paso: {
    fontFamily: "Inter-Bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#fff",
    fontSize: 24,
  },
  responseText: {
    fontSize: 18,
    color: "#333",
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: "gray",
  },
  indicator: {
    height: 5,
    backgroundColor: "white", // Color del indicador
  },
  cancelPayment: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    height: width > 375 ? "5%" : "7%",
    position: "absolute",
    bottom: "0%",
    padding: 10,
    backgroundColor: "red",
    borderRadius: 10,
  },
  textwhite: {
    color: "white",
    fontSize: 16,
  },
  pasotext: {
    paddingTop: "5%",
    fontFamily: "Inter-Bold",
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default CheckNequi;
