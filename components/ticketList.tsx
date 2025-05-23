import React, { useState, useCallback,useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import QRCodeStyled from 'react-native-qrcode-styled';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import url from "../constants/url.json";
import lines from "../assets/images/lines.png";
import po1 from '../assets/images/po1.png';
import po1G from '../assets/images/po1G.png';
import check from '../assets/images/check.png';
import noCheck from '../assets/images/noCheck.png';
import { jwtDecode } from "jwt-decode";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function Ticket(activeTab:any) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carga
    const navigation = useNavigation();
    const [username, setUsername] = useState("")
    async function getDecodedToken() {
      try {
        const token = await AsyncStorage.getItem('access_token');
        
        if (token) {
      
          fetchTickets(jwtDecode<DecodedToken>(token).sub.user)
          const decodedToken= jwtDecode<DecodedToken>(token)
          // Verifica qué contiene sub
        
          
          // Accede a user de manera segura
          const user = decodedToken.sub?.user || decodedToken.user || decodedToken.sub;
          if (user) {
            setUsername(user);
 
            return String(user);
          } else {
            console.log('User not found in token');
            return null;
          }
        } else {
          console.log('No token found');
          return null;
        }
      } catch (error) {
        console.error('Error getting or decoding token:', error);
      }
    }
    

    // Función para cargar los tickets desde la API
    const fetchTickets = async (usernameToken) => {

      setLoading(true); // Reinicia el estado de carga antes de la solicitud
      try {

        const response = await fetch(`${url.url}/api/tickets/${encodeURIComponent(usernameToken)}`);
        if (!response.ok) {
          throw new Error('Error al obtener los tickets');
        }
        const data = await response.json();
   
        if (Array.isArray(data.tickets)) {
          const formattedTickets = data.tickets.map(ticket => ({
            id: ticket.id_event,
            date: new Date(ticket.date_event.$date).toLocaleDateString(), 
            place: ticket.place_event,
            status: ticket.status,
            image: ticket.image_event,
            verification_id: ticket.verification_id,
            owner: usernameToken, 
            colors: ticket.status ? ticket.colors : ['#ffffff', '#ffffff'], 
          }));
    
          setTickets(formattedTickets);
        } else {
          console.error('Los datos de los tickets no son un array:', data.tickets);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    
    



    useFocusEffect(
      useCallback(() => {
        getDecodedToken()
        
        navigation.setOptions({
          headerShown: false,
        });
  
        
        return () => {

        };
      }, [navigation])
    );

    if (loading) {
      return <ActivityIndicator size="large" color="#741ae9" />; // Indicador de carga mientras se obtienen los datos
    }

    

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {tickets.map((ticket) => (
        <TouchableOpacity 
          key={ticket.verification_id} 
          onPress={() => { navigation.navigate("screens/Events/ticketDetail", {ticket}) }}
        >
          <LinearGradient
            colors={ticket.status ? ticket.colors : ['#ffffff', '#ffffff']}
            style={styles.ticketContainer}
          >
            <View style={styles.leftColumn}>
     
              <Image
                source={ticket.status && ticket.image ? { uri: ticket.image } : po1G}
                style={styles.eventImage}
                
              />
       
            </View>
            <View style={styles.rightColumn}>
              <View>
                <Text style={ticket.status ? styles.eventInfo2 : styles.eventInfo2G}>FECHA:</Text>
                <Text style={ticket.status ? styles.eventInfo : styles.eventInfoG}>{ticket.date}</Text>
              </View>

              <View>
                <Text style={ticket.status ? styles.eventInfo2 : styles.eventInfo2G}>Lugar:</Text>
                <Text style={ticket.status ? styles.eventInfo : styles.eventInfoG}>{ticket.place}</Text>
              </View>

              <View>
                <Text style={ticket.status ? styles.eventInfo2 : styles.eventInfo2G}>Pertenece:</Text>
                <Text style={ticket.status ? styles.eventInfo : styles.eventInfoG}>{ticket.owner}</Text>
              </View>

              <Text style={ticket.status ? styles.eventInfo1 : styles.eventInfo1G}>
                ESTA BOLETA ES DE UN ÚNICO USO, AL REALIZAR UN REGISTRO SERÁ INVALIDADA
              </Text>
            </View>
            <Image
              style={{ marginRight: "5%", height: Dimensions.get('window').height * 0.195, width: 10 }}
              source={lines}
              tintColor={ticket.status ? "#ffffff" : "#000000"} // Color de tintado según el estado de status
            />
            <View>
              <QRCodeStyled
              data={ticket.verification_id}
              style={styles.svg}
              padding={0}
              pieceSize={3.6}
              color={ticket.status ? "#ffffff" : "#000000"}
              
             
              innerEyesOptions={{
                borderRadius: 3,
                color: ticket.status ? "#b2ff93" : "#ff5d5d",
              }}
              outerEyesOptions={{
                borderRadius: 8,
                color: ticket.status ? "#ffffff" : "#000000",
              }}
              />
              <Image
                style={{ marginTop: 10, width: 20, height: 20, alignSelf: "center" }}
                source={ticket.status ? check : noCheck}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom:0,
  },
  ticketContainer: {
    marginBottom: "7%",
    flexDirection: 'row',
    backgroundColor: '#B05416', // Fondo similar al de la imagen
    borderRadius: 15,
    width: Dimensions.get('window').width * 0.95, // Ancho del ticket en relación a la pantalla
    alignSelf: 'center',
    shadowColor: '#ffffffdd',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    justifyContent: "center",
    alignItems: 'center',
    height: Dimensions.get('window').height * 0.195,
    paddingRight: "5%"
  },
  leftColumn: {
    flex: 2,
    paddingRight: 10,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius:10,
  },
  rightColumn: {
    flex: 3,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: '94%'
  },
  eventInfo: {
    color: 'white',
    fontSize: 12,
    marginBottom: 2,
    fontWeight: "100",
  
  },
  eventInfo2: {
    color: 'white',
    fontSize: 12,
    marginBottom: 0,
    fontWeight: "300"
  },
  eventInfo1: {
    color: 'white',
    fontSize: 6,
    marginBottom: 0,
    textAlign: "center",
    fontWeight: "200",
    marginTop: 20
  },
  qrCode: {
    paddingLeft: 100,
    marginRight: "10%"
  },
  eventInfoG: {
    color: '#000000',
    fontSize: 12,
    marginBottom: 2,
    fontWeight: "200"
  },
  eventInfo2G: {
    color: '#000000',
    fontSize: 12,
    marginBottom: 0,
    fontWeight: "300"
  },
  eventInfo1G: {
    color: '#000000',
    fontSize: 6,
    marginBottom: 0,
    textAlign: "center",
    fontWeight: "200",
    marginTop: 20
  },
});
