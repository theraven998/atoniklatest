

import React, { useRef, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
Image,
    Dimensions,
  } from "react-native";

const { width, height } = Dimensions.get("screen");
import test4 from  "@/assets/images/test4.png"
export default function Carrousel() {
    
  
    return (
    
      <View  style={styles.container}>
    <Image style={styles.imageBanner} source={test4}/>
  
      </View>
  
    );
  }
  
  // Estilos
  const styles = StyleSheet.create({
    container: {
      backgroundColor: "#181818",
      alignItems: "center",
      marginBottom:height * 0.1,
    },
  
    imageBanner: {
      width: width * 1, // Ocupa el 90% del ancho de la pantalla
      maxHeight: height * 0.3, // No más del 50% de la altura
   
      borderRadius: 15,
 // Margen del 5% en cada lado
    },
  });
  
  