import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeInUp } from "react-native-reanimated";
import NetInfo from "@react-native-community/netinfo";
import Carrousel from "@/components/carrouselHome";
import EventListTop from "../../components/eventListTop";
import DateSelector from "../../components/dateSelector";
import Banner from "../../components/banner";
import PaginationEvents from "@/components/eventLargeItemList";

export default function Home() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Suscribirse a los cambios de conexión
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView>
      {isConnected ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Carrousel con animación */}
 

          {/* Selector de fecha con animación */}
          <Animated.View entering={FadeInUp.duration(700)}>
            <DateSelector />
          </Animated.View>

          {/* Lista de eventos recomendados con animación */}
          <Animated.View entering={FadeInUp.duration(800)} style={styles.listContainer}>
            <Text style={styles.p1}>Recomendados</Text>
            <EventListTop />
          </Animated.View>

          {/* Banner y lista de eventos paginados con animación */}
          <Animated.View entering={FadeInUp.duration(900)} style={styles.bannerContainer}>
            <Banner />
            <PaginationEvents />
          </Animated.View>
        </ScrollView>
      ) : (
        <View style={styles.noConnectionContainer}>
          <Text style={styles.noConnectionText}>Sin conexión a Internet</Text>
        </View>
      )}
    </GestureHandlerRootView>
  );
}

// Estilos
const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#181818",
    alignItems: "center",
  },
  listContainer: {
    maxHeight: "30%",
  },
  p1: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "100",
    marginLeft: 10,
    marginBottom: 10,
  },
  carrouselContainer: {
    marginBottom: "10%",
  },
  noConnectionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181818",
  },
  noConnectionText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
