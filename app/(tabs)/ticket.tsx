import React, { useState } from 'react';
import { Image, View, Dimensions,Text, StyleSheet, TouchableOpacity } from 'react-native';
import logo from "../../assets/images/logo.png";
import TicketList from "../../components/ticketList";
import ManageEvents from "../../components/manageEvents";
import ScanTickets from "../../components/scanTickets" // Asegúrate de importar tu componente ManageEvents
import { useCameraPermissions } from 'expo-camera';
import AwesomeButton, { ThemedButton } from "react-native-really-awesome-button";

export default function Tab() {
  const [permission, requestPermission] = useCameraPermissions();
  const [activeTab, setActiveTab] = useState('entradas'); // Estado para manejar el tab activo
  const [viewManageEvents, setViewManageEvents] = useState(false); // Estado para manejar la vista de gestionar eventos

  // Si `viewManageEvents` es true, mostramos el componente ManageEvents
  if (viewManageEvents) {
    return (
      <ManageEvents />
    );
  }

  return (
    <View style={styles.container}>
    <Image style={styles.logo} source={logo} />
    <View style={styles.menuContainer}>
      <TouchableOpacity onPress={() => setActiveTab('entradas')} style={{ width: '50%' }}>
        <Text style={activeTab === 'entradas' ? styles.ticketMenuTextActive : styles.ticketMenuTextInactive}>
          Mis entradas
        </Text>
      </TouchableOpacity>
      <View style={styles.separator}></View>
      <TouchableOpacity onPress={() => setActiveTab('eventos')} style={{ width: '50%' }}>
        <Text style={activeTab === 'eventos'  || activeTab === 'manageEvents' ? styles.ticketMenuTextActive : styles.ticketMenuTextInactive}>
          Mis eventos
        </Text>
      </TouchableOpacity>
    </View>

    {activeTab === 'entradas' && (
      <TicketList activeTab={activeTab} />
    )}

    {activeTab === 'eventos' && (
      <View>
        <ThemedButton
          name="rick" type="danger"
          onPress={() => setActiveTab('scanTickets')}
          backgroundColor={"rgb(130, 81, 223)"}
          backgroundActive={"#501c55"}
          borderColor={"#5b2db1f"}
          backgroundDarker="rgb(72, 47, 119)"
          width={220}
          height={220}
          raiseLevel={10}
        >
          <View style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Image style={{ width: 150, height: 150 }} source={require("../../assets/images/Qr.png")} />
            <Text style={styles.placeholderText}>Escanear tickets</Text>
          </View>
        </ThemedButton>

        <ThemedButton
          style={{ marginTop: "13%" }}
          name="rick" type="danger"
          onPress={() => setActiveTab('manageEvents')} // Cambiar a la vista 'manageEvents'
          width={220}
          height={220}
          raiseLevel={10}
        >
          <View style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Image tintColor={"white"} style={{ width: 130, height: 130, marginTop: 15, marginBottom: 10 }} source={require("../../assets/images/stat.png")} />
            <Text style={styles.placeholderText}>Gestionar eventos</Text>
          </View>
        </ThemedButton>
      </View>
    )}

    {activeTab === 'manageEvents' && (
      <View>
<TouchableOpacity onPress={() => setActiveTab('eventos')}>

<Image tintColor={"#9605cf"}  style={{ marginBottom:"0%", padding:20 ,borderRadius:20, width:40, height:20}} source={require('../../assets/images/arrow.png')} />

</TouchableOpacity>

<Text style={{color:"white", textAlign:"center",fontSize:23, fontWeight:"100", marginBottom:"6%", 
}}>Mis eventos</Text>

          <ManageEvents />
      </View>
    )}
    {activeTab === 'scanTickets' && (
      <View>
<TouchableOpacity onPress={() => setActiveTab('eventos')}>

<Image tintColor={"#9605cf"}  style={{ marginBottom:"0%", padding:20 ,borderRadius:20, width:40, height:20}} source={require('../../assets/images/arrow.png')} />

</TouchableOpacity>



          <ScanTickets />
      </View>
    )}
  </View>
);
}
  


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#141414",
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    height: 50,
    width: 50,
    marginTop: "12%",
  },
  menuContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: "10%",
    marginBottom: "10%",
  },
  separator: {
    backgroundColor: "white",
    height: 40, // Ajusta la altura según sea necesario
    width: 1,
  },
  ticketMenuTextActive: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "100",
  },
  ticketMenuTextInactive: {
    color: "#606060",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "100",
  },
  placeholderText: {
    color: "white",
    fontSize: 20,
    fontWeight:"200",
    textAlign: "center",
  },
  link: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
});
