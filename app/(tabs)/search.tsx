import React, { useState } from "react";
import {
  Image,
  TextInput,
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Dimensions,
  useColorScheme,
} from "react-native";
import axios from "axios";
import url from "../../constants/url.json";
import { useNavigation, router } from "expo-router";
import EventItem from "@/components/eventItemListSearch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Panel from "@/components/panelPushUp";
import { useAppTheme } from "@/constants/theme/useTheme";
import shadowDark from "@/assets/images/userShadow.png";
import shadowLight from "@/assets/images/userShadowLight.png";
const { height } = Dimensions.get("window");

export default function Tab() {
  const theme = useAppTheme();
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Eventos");
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const togglePanel = () => setIsVisible(!isVisible);
  const closePanel = () => setIsVisible(false);

  interface User {
    _id: string;
    profile_photo: string;
    username: string;
    followingnum: number;
    followersnum: number;
    description: string;
  }

  interface Event {
    _id: string;
    image: string;
    name: string;
    place: string;
    colors: string[];
    price: number;
    date: string;
    time: string;
    description: string;
    latitude: string;
    longitude: string;
    images: string[];
  }

  const searchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        togglePanel();
        return;
      }
      setLoading(true);
      const response = await axios.get(
        `${url.url}/api/search/username?keyword=${keyword}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(response.data.length ? response.data : []);
      setError(response.data.length ? null : "No se encontraron usuarios.");
    } catch (error) {
      setError("Error al buscar usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const searchEvents = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      setLoading(true);
      const response = await axios.get(
        `${url.url}/api/search/event?keyword=${keyword}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents(response.data.length ? response.data : []);
      setError(response.data.length ? null : "No se encontraron eventos.");
    } catch (error) {
      setError("Error al buscar eventos.");
    } finally {
      setLoading(false);
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <Pressable
      style={styles.userItem}
      onPress={() =>
        router.push({
          pathname: "/screens/Account/UserProfile",
          params: {
            userId: item._id,
            getprofile_photo: item.profile_photo,
            getusuario: item.username,
            getfollowingnum: item.followingnum,
            getfollowersnum: item.followersnum,
            getdescription: item.description,
          },
        })
      }
    >
      <Image
        source={
          item.profile_photo
            ? { uri: item.profile_photo }
            : colorScheme === "dark"
            ? shadowDark
            : shadowLight
        }
        style={styles.userImage}
      />
      <Text style={[styles.userName, { color: theme.colors.text }]}>
        {item.username}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.nav}>
        <View style={styles.bar}>
          <Image
            tintColor={theme.colors.text}
            style={styles.searchIcon}
            source={require("../../assets/images/searchIcon.png")}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="Busca usuarios o eventos"
            placeholderTextColor={
              colorScheme === "dark" ? "#ffffffd3" : "#000000"
            }
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={
              activeTab === "Usuarios" ? searchUsers : searchEvents
            }
            returnKeyType="search"
          />
        </View>
        <View style={styles.cajabuttons}>
          <Pressable
            onPress={() => setActiveTab("Eventos")}
            style={[
              styles.tabButton,
              activeTab === "Eventos" && styles.activeTabButton,
            ]}
          >
            <Text
              style={{
                color: activeTab === "Eventos" ? "#a681ff" : theme.colors.text,
              }}
            >
              Eventos
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("Usuarios")}
            style={[
              styles.tabButton,
              activeTab === "Usuarios" && styles.activeTabButton,
            ]}
          >
            <Text
              style={{
                color: activeTab === "Usuarios" ? "#a681ff" : theme.colors.text,
              }}
            >
              Usuarios
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.listContent}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#733086"
            style={{ marginTop: "50%" }}
          />
        ) : error ? (
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            {error}
          </Text>
        ) : activeTab === "Usuarios" ? (
          users.length > 0 ? (
            <FlatList
              data={users}
              renderItem={renderUser}
              keyExtractor={(item) => item._id}
              style={{ marginTop: "18%" }}
            />
          ) : (
            <Text style={[styles.noResultsText, { color: theme.colors.text }]}>
              Busca a tus amigos!
            </Text>
          )
        ) : activeTab === "Eventos" ? (
          events.length > 0 ? (
            <></>
          ) : (
            <Text style={[styles.noResultsText, { color: theme.colors.text }]}>
              Busca algún evento de tu interés!
            </Text>
          )
        ) : null}
      </View>
      <Panel
        isVisible={isVisible}
        togglePanel={togglePanel}
        closePanel={closePanel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "2%",
  },
  nav: {
    paddingTop: "10%",
    alignItems: "center",
    width: "100%",
    height: "25%",
  },
  bar: {
    alignItems: "center",
    borderColor: "#a681ff",
    borderWidth: 2,
    width: "90%",
    height: height * 0.06,
    borderRadius: 16,
    flexDirection: "row",
  },
  input: {
    height: "100%",
    width: "100%",
    paddingLeft: 10,
  },
  searchIcon: {
    marginLeft: 10,
    height: 27,
    width: 27,
  },
  cajabuttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginTop: "5%",
  },
  tabButton: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: "#a681ff",
  },
  listContent: {
    marginTop: "5%",
    position: "absolute",
    top: "8%",
    width: "100%",
    height: "90%",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
  },
  errorText: {
    marginTop: "50%",
    fontSize: 16,
    textAlign: "center",
  },
  noResultsText: {
    marginTop: "30%",
    fontSize: 16,
    textAlign: "center",
  },
});
