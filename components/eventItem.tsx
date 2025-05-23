import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const EventCard = ({ event, state }) => {
  const navigation = useNavigation();
  const formattedDate = new Date(event.date.$date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePresss = (event) => {
    if (state == "event") {
      navigation.navigate("screens/Events/event", { event });
    }
    if (state == "manager") {
      navigation.navigate("screens/Events/eventManager", { event });
    }
    if (state == "ticket") {
      navigation.navigate("screens/Events/eventTicket", { event });
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        handlePresss(event);
      }}
    >
      <LinearGradient
        colors={[event.colors[0], event.colors[1]]}
        style={styles.blur}
      >
        <Image style={styles.poa} source={{ uri: event.image }} />

        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              fontSize: 16,
              padding: 3,
              color: "white",
              fontWeight: "400",
              marginTop: 7,
            }}
          >
            Nombre:
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: "white",
              fontWeight: "100",
              marginTop: 2,
              flexWrap: "wrap", // Permite que el texto se divida en varias líneas
              maxWidth: "80%", // Asegura que no se salga del contenedor
            }}
          >
            {event.name}
          </Text>

          <Text
            style={{
              fontSize: 16,

              padding: 3,
              color: "white",
              fontWeight: "400",
              marginTop: 7,
            }}
          >
            Lugar:
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: "white",
              fontWeight: "100",
              marginTop: 2,
              flexWrap: "wrap",
              maxWidth: "80%",
            }}
          >
            {event.place.length > 24
              ? event.place.substring(0, 24) + "..."
              : event.place}
          </Text>
        </View>

        <View style={{ marginLeft: "4%" }}>
          <Text
            style={{
              fontSize: 16,

              padding: 3,
              color: "white",
              fontWeight: "400",
              marginTop: 7,
            }}
          >
            Fecha:
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "white",
              fontWeight: 100,
              marginTop: 0,
            }}
          >
            {new Date(event.date.$date).toLocaleDateString("en-GB", {
              timeZone: "UTC",
            })}
          </Text>

          <Text
            style={{
              fontSize: 16,

              padding: 3,
              color: "white",
              fontWeight: "400",
              marginTop: 7,
            }}
          >
            Precio:
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "white",
              fontWeight: 100,
              marginTop: 0,
            }}
          >
            {`$ ${event.price}`}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  blur: {
    borderRadius: 20,
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 0,
    overflow: "hidden",
    backgroundColor: "#14112e",
    borderWidth: 0, // Grosor del borde
    borderColor: "#202020ef0",
    width: "100%",
    alignSelf: "center",
    height: 145,
    marginBottom: "10%",
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  poa: {
    width: "34%",
    height: "100%",
    marginTop: "auto",
    marginBottom: "auto",
  },
  textContainer: {
    marginLeft: 0,
  },
  label: {
    fontSize: 16,
    padding: 3,
    color: "white",
    fontWeight: "400",
    marginTop: 7,
  },
  value: {
    fontSize: 14,
    color: "white",
    fontWeight: "100",
    marginTop: 0,
  },
});

export default EventCard;
