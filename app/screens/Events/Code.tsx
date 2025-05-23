
import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import { Text, TextInput, View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";

export default function PromotorCodeInput() {
  const navigation = useNavigation();
  const [code, setCode] = useState(["", "", "", "", "", ""]); // Estado para mantener los 6 dígitos
  const inputRefs = useRef([]); // Referencias para los inputs

  // Manejar cambios en los inputs
  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Si se ingresa un dígito, pasar al siguiente input automáticamente
    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (event) => {
    const pastedText = event.nativeEvent.text;

      const newCode = pastedText.split("");
      
      setCode(newCode);
      newCode.forEach((digit, i) => {
        inputRefs.current[i].setNativeProps({ text: digit });
      });
    
  };

  // Manejar el botón de continuar
  const handleContinue = () => {
    if (code.join("").length === 6) {
      // Aquí navegas o haces lo que necesites con el código
   
      navigation.navigate("screens/Payment/Select", { code: code.join("") });
    } else {
      alert("Por favor, ingresa un código válido de 6 dígitos.");
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingresa el código de promotor</Text>

      <View style={styles.inputContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            ref={(el) => (inputRefs.current[index] = el)}
            maxLength={1}

            onPaste={handlePaste}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#23173b", // Color de fondo
  },
  title: {
    fontSize: 20,
    color: "white",
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "100",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignSelf: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#1a0231",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#bf70ff",
    width: 45,
    height: 70,
    textAlign: "center",
    fontSize: 20,
    color: "#ffffff",
  },
  button: {
    backgroundColor: "#bc35f2",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
