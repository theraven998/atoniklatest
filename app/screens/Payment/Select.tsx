import React, {useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,

  ActivityIndicator,
} from "react-native";
import { useWindowDimensions } from "react-native";
import { useLocalSearchParams } from 'expo-router';

import Constants from "expo-constants";
import { useWompiStore } from "@/app/utils/wompiStore";
const statusBarHeight = Constants.statusBarHeight;
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SkeletonContent from 'react-native-skeleton-content';
import ProgressStepsBar from "@/components/progressIndicators/progressStepsBar";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/constants/theme/useTheme";
import { useColorScheme } from "react-native";
import url from "@/constants/url.json";
import ConsentCheckboxes from '@/components/payment/TermsChecks'
export default function MetodoPago() {
  const { eventId, price, eventName, quantity } = useLocalSearchParams();

  const { setWompiData } = useWompiStore();
  const [wompiData1, setWompiData1] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<"card" | "nequi">("card");
  
  const { width, height } = useWindowDimensions();
  const theme = useAppTheme();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [checks, setChecks] = useState({ checked1: false, checked2: false });
  const logoSource =
    colorScheme === "dark"
      ? require("../../../assets/images/nequiLogo.png")
      : require("../../../assets/images/nequiClaro.png");

  const handleNext = () => {
    if (selected === "card") {
      console.log("eventId type:", typeof eventId);
console.log("eventId value:", eventId);
      router.push({
        
        pathname: '/screens/Payment/Card',
        params: {
          eventId:eventId,
          eventName: eventName,
          price: price,
          quantity:quantity,
        },
      });
    } else {
      router.push("/screens/Payment/NequiForm");
    }
  };

  const styles = getStyles(theme, width, height, statusBarHeight);
  const isDisabled = !(checks.checked1 && checks.checked2);
  useEffect(() => {
    const fetchWompiData = async () => {
      try {
        const response = await fetch(`${url.url}/wompi/presigned_acceptance`);
        const data = await response.json();
        setWompiData(data);
        setWompiData1(data);
      } catch (error) {
        console.error('Error al obtener datos de Wompi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWompiData();
  }, []);

 
  return (
    <SafeAreaView
      style={{
        height: height,
        paddingTop: insets.top,
        backgroundColor: theme.colors.background,
      }}
    >
      <ScrollView style={{ flex: 1, paddingHorizontal: "4%" }}>
        <Text style={styles.title}>Añade un método de pago</Text>

        <View style={styles.optionContainer}>
          {/* Opciones */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => setSelected("card")}
          >
            <View style={styles.optionLeft}>
              <Image
                tintColor="#fff"
                source={require("../../../assets/images/cardIcon.png")}
                style={styles.cardIcon}
              />
              <View style={{ marginLeft: 20 }}>
                <Text style={styles.optionTitle}>
                  Tarjeta de crédito o débito
                </Text>
                <View style={styles.cardLogos}>
                  <Image
                    source={require("../../../assets/images/visaLogo.png")}
                    style={styles.visaLogo}
                  />
                  <Image
                    source={require("../../../assets/images/mastercardLogo.png")}
                    style={styles.mastercardLogo}
                  />
                </View>
              </View>
            </View>
            <View
              style={
                selected === "card"
                  ? styles.radioSelected
                  : styles.radioUnselected
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionFinal}
            onPress={() => setSelected("nequi")}
          >
            <View style={styles.optionLeft}>
              <Image source={logoSource} style={styles.nequiLogo} />
              <Text style={styles.optionTitle}>Pago con Nequi</Text>
            </View>
            <View
              style={
                selected === "nequi"
                  ? styles.radioSelected
                  : styles.radioUnselected
              }
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ConsentCheckboxes
   regulationLink={wompiData1?.presigned_acceptance?.permalink}
   privacyLink={wompiData1?.presigned_personal_data_auth?.permalink}
   
        onChange={setChecks}
      />
      <View style={[styles.card1, { backgroundColor: theme.colors.card }]}>
        <View style={styles.stepContainer}>
          <ProgressStepsBar totalSteps={3} currentStep={2} />
        </View>

        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
            Total
          </Text>
          <Text style={[styles.totalValue, { color: theme.colors.text }]}>
          $ {price}
          </Text>
        </View>

        <TouchableOpacity
          disabled={isDisabled}
          onPress={() => {
            handleNext();
          }}
          style={[styles.button, { backgroundColor: isDisabled ? '#ccc' : theme.colors.primary, }]}
        >
          <Text style={[styles.buttonText, {    color: isDisabled ? '#666' : '#fff'  }]}>
            Continuar compra
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme, width, height, statusBarHeight) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      marginTop: 0,
    },

    title: {
      fontSize: 27,
      color: theme.colors.text,
      marginBottom: 30,
      fontWeight: "200",
      marginVertical: 20,
      marginLeft: 5,
    },
    optionContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 10,
      padding: 25,
      justifyContent: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    option: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 25,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.separator,
    },
    optionFinal: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 25,
    },
    optionLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    optionTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "100",
    },
    cardIcon: {
      width: 26,
      height: 23,
      marginLeft: 9,
      tintColor: theme.colors.text,
    },
    cardLogos: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 5,
    },
    visaLogo: {
      width: 30,
      height: 10,
      marginRight: 5,
      marginLeft: 2,
      tintColor: theme.colors.text,
    },
    mastercardLogo: {
      width: 20,
      height: 10,
    },
    nequiLogo: {
      width: 50,
      height: 17,
      marginRight: 8,
    },
    radioUnselected: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.colors.text,
      backgroundColor: "transparent",
    },
    radioSelected: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.colors.secondary,
      backgroundColor: theme.colors.secondary,
    },
    button: {
      height: 60,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12,
      width: "100%",
    },
    buttonText: {
      fontSize: 17,
      fontWeight: "600",
    },

    card1: {
      padding: 15,
      borderRadius: 14,
      elevation: 7,
      shadowOffset: { width: 4, height: -4 },
      shadowColor: "#616161",
      shadowOpacity: 0.3,
      shadowRadius: 5,
      width: "100%",
      marginVertical: 0,
      marginBottom: height * 0.07,
    },
    shippingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    fee: {
      fontSize: 14,
      fontWeight: "500",
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 12,
      marginVertical: 15,
      zIndex: -1,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 20,
    },
    totalLabel: {
      fontSize: 20,
      fontWeight: "500",
    },
    totalValue: {
      fontSize: 20,
      fontWeight: "700",
    },
    label: {
      fontSize: 14,
      fontWeight: "400",
      zIndex: -1,
    },
    
  });
