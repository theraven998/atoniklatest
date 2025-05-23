import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import url from "../constants/url.json";

interface Ticket {
  id: number;
  name_event: string;
  description: string;
  image: string;
}

interface EventListTopProfileProps {
  usernameToget: string;
}

const EventListTopProfile: React.FC<EventListTopProfileProps> = ({
  usernameToget,
}) => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const fetchTickets = async (usernameToget: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${url.url}/api/tickets/${encodeURIComponent(usernameToget)}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los tickets");
      }
      const data = await response.json();

      if (Array.isArray(data.tickets)) {
        const formattedTickets = data.tickets.map((ticket) => ({
          id: ticket.id_event,
          name_event: ticket.name_event || "Sin título",
          image: ticket.image_event,
        }));
        setTickets(formattedTickets);
     
      } else {
        console.error(
          "Los datos de los tickets no son un array:",
          data.tickets
        );
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(usernameToget);
  }, [usernameToget]);

  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.scrollViewContent}
      showsHorizontalScrollIndicator={false}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        tickets.map((ticket) => (
          <View key={ticket.id} style={styles.ticketContainer}>
            <Image source={{ uri: ticket.image }} style={styles.ticketImage} />
            <Text style={styles.whitetext}>{ticket.name_event}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexDirection: "row", // Cambiado a 'row' para mostrar los tickets horizontalmente
  },
  ticketContainer: {
    height: "100%",
    width:
      Dimensions.get("window").width > 375
        ? Dimensions.get("window").width * 0.35
        : Dimensions.get("window").width * 0.4,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Dimensions.get("window").width > 375 ? 5 : 0,
  },
  ticketImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  whitetext: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    marginTop: 5, // Espaciado entre la imagen y el texto
  },
});

export default EventListTopProfile;
