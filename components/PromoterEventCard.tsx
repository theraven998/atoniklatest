import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AnimatedNumber from "@/components/AnimatedNumber";
import AnimatedNumberCOP from "@/components/AnimatedNumberCOP";
import { ScrollView } from "react-native-gesture-handler";

const PromoteEventCard = ({
  item,
  isDarkMode,
  animationKey,
  sharePromotorCode,
  styles,
}) => {
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(item.usuarios_obtenidos);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = item.usuarios_obtenidos.filter((usuario) =>
      usuario.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <View
      style={{
        marginHorizontal: 10,
        borderRadius: 10,
        overflow: "hidden",
        height: Dimensions.get("window").height * 0.8,
        width: Dimensions.get("window").width * 0.85,
        alignSelf: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: item.image }}
        style={{ width: "35%", height: 150 }}
        resizeMode="cover"
      />
      <View style={{ padding: 10, alignItems: "center", width: "100%" }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
            color: isDarkMode ? "#FFFFFF" : "#000000",
          }}
        >
          {item.name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: isDarkMode ? "#BBBBBB" : "#666666",
            marginTop: 5,
            textAlign: "center",
          }}
        >
          {new Date(item.date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          padding: 10,
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Entradas vendidas</Text>
          <AnimatedNumber
            key={`entradas-${animationKey}`}
            value={item.entradas_vendidas}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Saldo disponible</Text>
          <AnimatedNumberCOP key={`saldo-${animationKey}`} value={item.saldo} />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: isDarkMode ? "#6200EE" : "#6200EE",
            padding: 10,
            borderRadius: 10,
            alignItems: "center",
          }}
          onPress={sharePromotorCode}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>
            Compartir código de promotor
          </Text>
        </TouchableOpacity>

        <View
          style={{
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
            width: "100%",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
              color: isDarkMode ? "#FFFFFF" : "#000000",
              padding: 10,
            }}
          >
            Usuarios que han usado el código
          </Text>
          <View style={{ marginBottom: 10, width: "100%" }}>
            <TextInput
              style={{
                backgroundColor: isDarkMode ? "#2C2C2C" : "#EAEAEA",
                padding: 10,
                borderRadius: 5,
                color: isDarkMode ? "#FFFFFF" : "#000000",
                marginBottom: 10,
              }}
              placeholder="Buscar usuario..."
              placeholderTextColor={isDarkMode ? "#BBBBBB" : "#666666"}
              onChangeText={handleSearch}
              value={searchText}
            />
            <ScrollView
              style={{
                maxHeight: 200,
              }}
            >
              {filteredUsers.length > 0 ? (
                filteredUsers.map((usuario, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: isDarkMode ? "#2C2C2C" : "#EAEAEA",
                      padding: 10,
                      borderRadius: 5,
                      marginVertical: 5,
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Text style={[styles.value, { fontSize: 16 }]}>
                      {usuario}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.value}>No se encontraron usuarios</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PromoteEventCard;
