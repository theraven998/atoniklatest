import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Pressable,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  TextInput,
  Linking,
} from "react-native";
import { Animated } from "react-native";
import AnimatedNumber from "@/components/AnimatedNumber";
import AnimatedNumberCOP from "@/components/AnimatedNumberCOP";
import { Share } from "react-native";
import Logo from "@/components/Logo";
import { RootStackParamList } from "@/app/_layout";
import drawerDark from "@/assets/images/drawer2.png";
import drawerLight from "@/assets/images/drawerLight.png";
import axios from "axios";
import {
  useNavigation,
  useFocusEffect,
  router,
  useLocalSearchParams,
} from "expo-router";
import logoDark from "@/assets/images/logo.png";
import logoLight from "@/assets/images/logoLight.png";
import url from "@/constants/url.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import PromoteEventCard from "@/components/PromoterEventCard";
import { useProfilePhotoStore } from "@/app/utils/useStore";
interface Event {
  id: number;
  name: string;
  date: string;
  image: string;
  saldo: number;
  entradas_vendidas: number;
  usuarios_obtenidos: string[];
  usuarios_boletas: number;
}
interface AnimatedNumberProps {
  value: number;
  duration?: number;
}
const windowWidth = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
export default function PromotorScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [animationKey, setAnimationKey] = useState(0);
  const isPromoter = useProfilePhotoStore((state) => state.isPromoter);
  if (!isPromoter) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: isDarkMode ? "#121212" : "#FFFFFF",
        }}
      >
        <Text
          style={{
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center",
        color: isDarkMode ? "#FFFFFF" : "#333333",
          }}
        >
          Para habilitar las opciones de promotor, por favor contáctanos vía
          WhatsApp.
        </Text>
        <Pressable
          onPress={() => {
        const phoneNumber = "+573125034112";
        const message = "Hola Atonik, tengo problemas con mi cuenta.";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
          message
        )}`;
        Linking.openURL(url);
          }}
          style={{
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginTop: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
          }}
        >
          <Text
        style={{
          color: "#FFFFFF",
          fontSize: 16,
          textAlign: "center",
          fontWeight: "600",
        }}
          >
        Hablar con soporte
          </Text>
        </Pressable>
      </View>
    );
  }
  const [filteredUsers, setFilteredUsers] = useState<string[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [code, setcode] = React.useState("");

  const getPromotorCode = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("access_token");
      if (!storedToken) {
        console.error("No token found");
        router.replace("/screens/Account/ChooseLogin");
        return;
      }
      const response = await axios.get(`${url.url}/promotor`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        console.log(response.data);
        setcode(response.data.promoteCode);
        setEvents(response.data.promoting_events || []);
      }
    } catch (error) {
      console.error("Error fetching promotor code:", error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      getPromotorCode();
      setAnimationKey((prev) => prev + 1); // Cambia clave para reiniciar animaciones
    }, [])
  );

  const sharePromotorCode = () => {
    const message = `¡Hola! Aquí tienes mi código de promotor: ${code}. ¡Úsalo y disfruta de grandes beneficios!`;
    Share.share({
      message,
      title: "Código de Promotor",
    })
      .then((result) => console.log(result))
      .catch((error) => console.log("Error sharing:", error));
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1, // Allows the ScrollView to scroll when content overflows
      paddingHorizontal: 20,
      paddingBottom: 100, // Increased padding to ensure the button is always visible
      backgroundColor: isDarkMode ? "#121212" : "#FFFFFF",
    },
    card: {
      backgroundColor: isDarkMode ? "#1E1E1E" : "#F5F5F5",
      padding: 15,
      width: "45%",
      borderRadius: 10,
      margin: 5,
      marginBottom: 15,
      shadowColor: isDarkMode ? "#000" : "#ccc",
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 3,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
    value: {
      fontSize: 20,
      fontWeight: "bold",
      color: isDarkMode ? "#BB86FC" : "#6200EE",
    },
  });

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        onPress={() => navigation.openDrawer()}
        style={{
          position: "absolute",
          left: "2%",
          height: 40,
          width: 40,
          top: height * 0.005,
          zIndex: 1,
        }}
      >
        <Image
          source={isDarkMode ? drawerDark : drawerLight}
          style={{ width: 40, height: 40 }}
        />
      </Pressable>
      <View
        style={{
          position: "absolute",
          top: height * 0.05,
          width: windowWidth,
          height: "10%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={[
            {
              resizeMode: "contain",
              width: "40%",
              height: "60%",
            },
          ]}
          source={colorScheme === "dark" ? logoDark : logoLight}
        />
      </View>

      <View style={{ marginTop: "40%" }}>
        <FlatList
          data={events}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PromoteEventCard
              item={item}
              isDarkMode={isDarkMode}
              animationKey={animationKey}
              sharePromotorCode={sharePromotorCode}
              styles={styles}
            />
          )}
          ListEmptyComponent={
            <Text
              style={{
                fontSize: 16,
                color: isDarkMode ? "#BBBBBB" : "#666666",
                marginTop: 5,
              }}
            >
              No hay eventos disponibles
            </Text>
          }
        />
      </View>
    </ScrollView>
  );
}
