import React, { useState, useCallback,useEffect } from 'react';
import { StyleSheet, Image,View,Dimensions,Text, ScrollView, ActivityIndicator } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from "../constants/url.json"
import EventItemList from "./eventItemList"
import AwesomeButton, { ThemedButton } from "react-native-really-awesome-button";
export default function Ticket(activeTab:any) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carga
    const navigation = useNavigation();
    const [username, setUsername] = useState("")
    const [permission, requestPermission] = useCameraPermissions();
    // Función para cargar los tickets desde la API
    const fetchEvents = async () => {
        setLoading(true); // Reinicia el estado de carga antes de la solicitud
        try {
          const token = await AsyncStorage.getItem('access_token'); // Obtiene el token del almacenamiento
      
          if (!token) {
            throw new Error('Token no encontrado');
          }
      
          const response = await fetch(`${url.url}/api/userallowscanevents/`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`, // Agrega el token a los headers
              'Content-Type': 'application/json',
            },
          });
      
          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al obtener los eventos: ${errorMessage}`);
          }
      
          const data = await response.json();
      
          if (Array.isArray(data.events)) {
            const parsedEvents = data.events.map(eventString => {
              // Verificar si el elemento es un string antes de hacer JSON.parse
              return typeof eventString === 'string' ? JSON.parse(eventString) : eventString;
            });
      
            setEvents(parsedEvents);
        
          } else {
            console.error('Los datos de los eventos no son un array:', data.events);
          }
        } catch (error) {
          console.error('Error fetching events:', error.message);
        } finally {
          setLoading(false);
        }
      };
      
      
    



    useFocusEffect(
      useCallback(() => {
        fetchEvents()
        
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
<View style={{alignItems:"center"}}>
<View style={{marginBottom:"0%", width:"100%", alignItems:"center"}}>
<ThemedButton
          name="rick" type="danger"
          onPress={async () => {
            const { granted } = await requestPermission();
            if (granted) {
                navigation.navigate("screens/Events/scaner")
            } else {
              alert("Permiso de cámara denegado");
            }
          }}
          backgroundColor={"rgb(130, 81, 223)"}
          backgroundActive={"#501c55"}
          borderColor={"#5b2db1f"}
          backgroundDarker="rgb(72, 47, 119)"
          width={190}
          height={70}
          raiseLevel={10}
          borderRadius={14}
      
        >
          <View style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
           
            <Text style={styles.placeholderText}>Agregar Evento</Text>
          </View>
        </ThemedButton>
    
        </View>  
        <Text style={{color:"white", textAlign:"left",fontSize:23, fontWeight:"100", marginTop:"6%", marginBottom:"4%",width:Dimensions.get('window').width * 0.95, 
}}>Eventos</Text>
    <EventItemList 

    state={"ticket"}
    events={events}
    />
</View>
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
  placeholderText: {
    color: "white",
    fontSize: 20,
    fontWeight:"200",
    textAlign: "center",
  },
});
