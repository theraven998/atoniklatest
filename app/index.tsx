import React, { useEffect, useState } from "react";
import { View, StyleSheet, Linking } from "react-native";
import { Redirect, router } from "expo-router";
import LottieView from "lottie-react-native";

export default function Layout() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    console.log("App is ready");
    const handleDeepLink = async () => {
      const url = await Linking.getInitialURL();

      setTimeout(() => {
        if (url) {
          console.log("Initial URL detected:", url);
          const match = url.match(/atonik:\/\/eventoId=([^&]+)/);
          const eventoId = match?.[1];
          if (eventoId) {
            setRedirectTo(`/screens/Events/event?eventoId=${eventoId}`);
          } else {
            console.log("No eventoId found in the URL");
            setRedirectTo("/(tabs)/home");
          }
        } else {
          setRedirectTo("/(tabs)/home"); // <-- este caso faltaba
        }
      }, 3000);
    };

    handleDeepLink();

    // Properly listen for URL changes
    const linkingListener = Linking.addEventListener("url", (event) => {
      const { url } = event;
      console.log("URL change detected:", url);
      const match = url.match(/atonik:\/\/eventoId=([^&]+)/);
      const eventoId = match?.[1];
      if (eventoId) {
        setRedirectTo(`/screens/Events/event?eventoId=${eventoId}`);
      } else {
        setRedirectTo("/(tabs)/home");
      }
    });

    return () => {
      // Clean up the listener
      linkingListener?.remove();
    };
  }, []);

  if (redirectTo) {
    return <Redirect href={redirectTo} />;
  }

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/json/splash.json")}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7151ff",
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: 500,
    height: 500,
  },
});
