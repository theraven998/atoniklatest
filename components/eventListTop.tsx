import React, { useRef, useEffect, useState } from "react";
import {
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import url from "../constants/url.json";
// import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const EventList = () => {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const flatListRef = useRef<FlatList<any>>(null);
  // const navigation = useNavigation();
  const limit = 5;
  const [data, setData] = useState<Event[]>([]);

  interface EventItem {
    image: string;
    name: string;
  }

  interface Event {
    id: string;
    image: string;
    name: string;
  }

  const renderItem = ({ item }: { item: EventItem }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      // onPress={() =>
      //   navigation.navigate("screens/Events/event", { event: item } as any)
      // }
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <Text style={styles.itemDescription}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator style={{ padding: 10 }} />;
  };

  const fetchTopEvents = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${url.url}/api/events/relevance?page=${page}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();

      if (json && json.events) {
        setData((prevData) => [...prevData, ...json.events]);
        setHasMore(page < json.total_pages); // Determina si hay más páginas
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false); // No hay más datos
      }
    } catch (error) {
      console.error("Error al obtener los eventos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchTopEvents();
    }
  };

  useEffect(() => {
    fetchTopEvents();
  }, []);

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginRight: 0,
    width: width * 0.33,
    marginHorizontal: 40,
    height: width * 0.33,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  itemDescription: {
    fontSize: 14,
    textAlign: "center",
    color: "#ffffffcf",
  },
});

export default EventList;
