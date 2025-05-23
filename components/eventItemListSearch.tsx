import React, { useState } from "react";
import { ScrollView, Dimensions, StyleSheet, Text, View } from "react-native";
import EventCard from "./eventItem"; // Import the new component

const EventItemSearch = ({ events, state, navigation }) => {
  const [contentHeight, setContentHeight] = useState(0);

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    setContentHeight(contentHeight);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={handleContentSizeChange}
      >
        {events.map((event: any, index: any) => (
          <EventCard key={index} event={event} state={state} />
        ))}
      </ScrollView>

    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width * 0.95,
    height: '100%',
    marginBottom: "25%",
  },
  scrollContainer: {
    height: '100%',
    flex: 1,
    width: "100%",
  },
});

export default EventItemSearch;
