import React from "react";
import { WebView } from "react-native-webview";
import { View, StyleSheet, Text } from "react-native";
import { useLayoutEffect } from "react";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import decorateMapComponent from "react-native-maps/lib/decorateMapComponent";

const WompiButton = () => {
  const navigation = useNavigation();
  const checktoken = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded!) {
      
      }
    } else {
      router.push("/(tabs)/home");
    }
  };
  const htmlContent = `
      <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Payment Button</title>
               <style>
          body, html {
            height: 100%;
            margin: 0;
            display: flex;
            justify-content: center;
            background-color: #232323;
          }
          form {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <form>
  <script
    src="https://checkout.wompi.co/widget.js"
    data-render="button"
    data-public-key="pub_prod_9LRngI5cdooCkUWYuWaRbUH0zIapB8wC"
    data-currency="COP"
    data-amount-in-cents="4950000"
    data-reference="4XMPGKWWPKWQ"
    data-signature:integrity="test_integrity_YAbPvrZJvXpHzozKYqj1CKc3U2cLDfby"
  ></script>
</form>
      </body>
    </html>
  `;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.whitetext}>Estado de la transferencia</Text>

      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.webview}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
  },
  webview: {
    height: "90%",
    width: "100%",
  },
  whitetext: {
    fontFamily: "Inter-Light",
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },
});

export default WompiButton;
