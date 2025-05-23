import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useNavigation,
  Link,
  router,
  useRouter,
  useLocalSearchParams,
} from "expo-router";
// import { useFonts, Inter_100Thin } from "@expo-google-fonts/inter";



export default function Login() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  



  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // const [fontsLoaded] = useFonts({
  //   Inter: Inter_100Thin,
  // });

  // if (!fontsLoaded) {
  //   return null; // O algún indicador de carga
  // }

    const handleOptionSelection = (descriptionStatus) => {
      

     
        if (descriptionStatus) {
            navigation.navigate('screens/Events/Code',{ id: id});
        } else {
        navigation.navigate('screens/Payment/Resume',{ id: id});
        }
    };

  return (
    <View style={styles.container}>
   
      <View style={styles.form}>
        <Text
          style={{
            fontSize: 20,
            color: "white",
            padding: 20,
            textAlign: "center",
            fontWeight: "100",
          }}
        >
          ¿Usted cuenta con un código de promotor?
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 40,
            marginBottom: 50,
          }}
        >
          <TouchableOpacity
            onPress={() => handleOptionSelection(true)}
            style={{
              backgroundColor: "#ffffff",
              padding: 20,
              width: "35%",
              alignItems: "center",
              borderRadius: 10,
              marginTop: 30,
            }}
          >
            <Text style={{ fontSize: 15, color: "#000000" }}>sí</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleOptionSelection(false)}
            style={{
              backgroundColor: "#996ffc",
              padding: 20,
              width: "35%",
              alignItems: "center",
              borderRadius: 10,
              marginTop: 30,
            }}
          >
            <Text style={{ fontSize: 15, color: "white" }}>Ninguno</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
  },
  form: {
    backgroundColor: "#23173b",
    height: "100%",
    marginBottom: "6%",
    width: "100%",
    minHeight: 320,
    alignItems: "center",
    justifyContent: "center",
  },
  h1: {
    fontFamily: "Inter", // Usa la fuente Inter aquí
    fontSize: 35,
    color: "white",
    marginTop: "20%",
    textAlign: "center",
    marginBottom: "15%",
  },
  span: {
    fontFamily: "Inter", // Usa la fuente Inter aquí
    fontSize: 17,
    color: "white",
    alignSelf: "center",
    width: "65%",
  },
  input: {
    fontFamily: "Inter", // Usa la fuente Inter aquí
    marginBottom: 0,
    width: "70%",
    marginLeft: "3%",
    height: 50,
    bottom: 0,
    color: "white",
    marginTop: 6,
  },
  buttonContainer: {
    width: "40%",
    height: 55, // Aquí puedes ajustar la altura del botón
    backgroundColor: "#bc35f2",
    alignSelf: "center",
    overflow: "hidden",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  img: {
    height: 180,
    justifyContent: "flex-end",
    marginBottom: "3%",
    width: 180,
  },
  img1: {
    width: 160,
    height: 12,
    marginTop: 50,
    marginBottom: 50,
  },
  icon: {
    width: 17,
    height: 21,
    color: "white",
    marginTop: 20,
  },
  iconContainer: {
    display: "flex",
    width: "65%",
    alignSelf: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "white",
    marginBottom: "14%",
  },
  account: {
    color: "white",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
    fontSize: 16,
  },
  accountHover: {
    padding: 20,
    backgroundColor: "#aba8187e",
  },
});
