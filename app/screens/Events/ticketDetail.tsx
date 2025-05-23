import React, { useState, useEffect,useLayoutEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions , TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from "expo-router";
import logo from "../../../assets/images/logo.png";
import * as SplashScreen from 'expo-splash-screen';
import QRCodeStyled from 'react-native-qrcode-styled';
import check from '../../../assets/images/check.png';
import noCheck from '../../../assets/images/noCheck.png';
import QRCode from 'react-native-qrcode-svg';
import po1 from '../../../assets/images/po1.png';
import lines from "../../../assets/images/lines.png";
import po1G from '../../../assets/images/po1G.png';

import { useFonts, CutiveMono_400Regular } from '@expo-google-fonts/cutive-mono';
export default function Tab() {
  const navigation = useNavigation();
  const route = useRoute();
  const { ticket } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [fontsLoaded] = useFonts({
    CutiveMono_400Regular,
  });

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Or a placeholder component
  }
  return (

    <LinearGradient
    colors={ticket.status ? ticket.colors : ['#ffffff', '#e7e7e7c1']}// Gradient colors
      start={{ x: 1, y:0 }} // Start from the right
      end={{ x: 0, y: 0}} // End at the left
      style={styles.container}
    >
 <View style={styles.imageContainer}>
  <Image
          source={{ uri: ticket.image }}  // Replace with your image source
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

<Image style={styles.lines} source={lines}  tintColor={ticket.status ? "#ffffff" : "#000000"} />
<View style={styles.qrContainer}>

  <QRCodeStyled
 data={ticket.verification_id}
 style={styles.svg}
 padding={0}
 pieceSize={8.3}
 color={ticket.status ? "#ffffff" : "#000000"}
 

 innerEyesOptions={{
   borderRadius: 12,
   color: ticket.status ? "#b2ff93" : "#ff5d5d",
 }}
 outerEyesOptions={{
   borderRadius: 12,
   color: ticket.status ? "#ffffff" : "#000000",
 }}

  />
     <Image
              style={{ marginTop: 20, width: 40, height: 40, alignSelf: "center" }}
              source={ticket.status ? check : noCheck}
            />
</View>


    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:"column",
    justifyContent: "flex-start", // Aligns children to the top
    height:Dimensions.get('window').height* 1,
    width: Dimensions.get('window').width* 1,
  },

  
 qrContainer:{
    transform: [{ rotate: '90deg' }],
    marginTop:"0%",
    position:"absolute",
    bottom:"1%",
    alignSelf:"center"
    
  },
  imageContainer: {
    width: Dimensions.get('window').width * 1, // Adjust as needed
    height: Dimensions.get('window').width * 0.6, // Adjust as needed
    overflow: 'hidden', // Ensures the image is cropped
    justifyContent: 'center', // Center the image vertically
    alignItems: 'center', // Center the image horizontally
  },
  eventImage: {
    width: Dimensions.get('window').width * 1, // Increased width to handle rotation
    height: Dimensions.get('window').width * 1, // Increased height to handle rotation
    
    transform: [{ rotate: '90deg' }], // Rotate the image 90 degrees
  },
  rightColumn: {
    flex: 3,
    transform: [{ rotate: '90deg' }], 
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: '10%',
    paddingLeft:"7%",
    paddingTop:"10 %",
  
    marginBottom:"55%"
  
  },
  eventInfo: {
    color: 'white',
    fontSize: 20,
    marginBottom: 2,
    fontWeight: "100",
    fontFamily:"CutiveMono_400Regular"
  },
  eventInfo2: {
    color: 'white',
    fontSize: 23,
    marginBottom: 0,
    fontWeight: "500"
    
  },
  eventInfo1: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "100",
    marginTop: "15%",
    width:"70%",
    fontFamily:"CutiveMono_400Regular"

  },
  lines:{
    width:8,
    height:Dimensions.get('window').width * 1.4,
    marginLeft:"30%",
    transform: [{ rotate: '90deg' }], 
    position:"absolute",
    bottom:"0%"
  },
  eventInfoG: {
    color: '#000000',
    fontSize: 20,
    marginBottom: 2,
    fontWeight: "100",
    fontFamily:"CutiveMono_400Regular"
  },
  eventInfo2G: {
    color: '#000000a6',

    fontSize: 23,
    marginBottom: 0,
    fontWeight: "500"
  },
  eventInfo1G: {
    color: '#000000',
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "100",
    marginTop: "15%",
    width:"70%",
    fontFamily:"CutiveMono_400Regular"
  },
});