import React, { useState } from 'react';
import { ScrollView, Dimensions,StyleSheet, Text, View } from 'react-native';
import EventCard from './eventItem'; // Import the new component

const EventItem = ({ events, state, navigation }) => {
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
          <EventCard
            key={index}
            event={event}
            state={state}
          />
        ))}
      </ScrollView>
   
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
  marginTop: 15,
    width:Dimensions.get('window').width*0.95,
  
  },
  scrollContainer: {
    flex: 1, // Permite que el ScrollView use el espacio disponible
    width: '100%',

  },
});

export default EventItem;
