// app/(drawer)/_layout.tsx
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useProfilePhotoStore } from "@/app/utils/useStore";

export default function DrawerLayout() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPromotor, setShowPromotor] = useState(false);

  const isPromoter = useProfilePhotoStore((state) => state.isPromoter);

  useEffect(() => {
    const fetch = async () => {
      const token = await AsyncStorage.getItem("access_token");
      setIsVisible(!!token);
      setShowPromotor(isPromoter);
    };
    fetch();
  }, [isPromoter]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#311049",
            width: "60%",
          },
          drawerLabelStyle: {
            color: "#FFFFFF",
            fontWeight: "bold",
          },
          drawerItemStyle: {
            backgroundColor: "#530e85",
            borderRadius: 20,
            marginVertical: 5,
          },
        }}
      >
        <Drawer.Screen
          name="Perfil"
          options={{ drawerLabel: "Perfil", title: "Perfil" }}
        />
        {isVisible && (
          <Drawer.Screen
            name="Delete"
            options={{ drawerLabel: "Eliminar Cuenta", title: "Eliminar Cuenta" }}
          />
        )}
        {showPromotor && (
          <Drawer.Screen
            name="Promotor"
            options={{ drawerLabel: "Promotor", title: "Promotor" }}
          />
        )}
      </Drawer>
    </GestureHandlerRootView>
  );
}
