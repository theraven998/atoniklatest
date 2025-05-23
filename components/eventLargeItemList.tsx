import React from 'react';
import { FlatList, Dimensions, StyleSheet, Text, View } from 'react-native';
import EventCard from './largeEventCard'; // Importa el componente EventCard

const EventItem = ({ }) => {
  const renderItem = ({ item }) => (
    <EventCard
      event={item}
      state={true}
    />
  );
  const events=[{"_id":{"$oid":"66e9c0418e78fe79d585bdd1"},"date":{"$date":{"$numberLong":"1742256000000"}},"place":"Tech Park","name":"AI in Finance","time":"10:00 AM","description":"Exploring the impact of AI on modern healthcare.","image":"https://i.postimg.cc/28NBJWtY/art-record-covers-07-01-17.jpg","price":{"$numberInt":"75"},"min_age":{"$numberInt":"18"},"organizer":"Random Organizer","colors":["#7fb1b3","#090f10"],"tickets":[],"scanners":[],"scan_Id":"66e9c0418e78fe79d585bdb3"},{"_id":{"$oid":"66e9c0418e78fe79d585bdce"},"date":{"$date":{"$numberLong":"1726963200000"}},"place":"Central Park","name":"AI in Healthcare","time":"02:00 PM","description":"An introductory course on AI and machine learning.","image":"https://i.postimg.cc/9fPWD4pd/Rock-Covers-ilustracion-oldskull-15-880x879.jpg","price":{"$numberInt":"40"},"min_age":{"$numberInt":"21"},"organizer":"Random Organizer","colors":["#ffb733","#191000"],"tickets":[],"scanners":[],"scan_Id":"66e9c0418e78fe79d585bdb0","numid":"001"},{"_id":{"$oid":"66e9c0418e78fe79d585bdd1"},"date":{"$date":{"$numberLong":"1742256000000"}},"place":"Tech Park","name":"AI in Finance","time":"10:00 AM","description":"Exploring the impact of AI on modern healthcare.","image":"https://i.postimg.cc/28NBJWtY/art-record-covers-07-01-17.jpg","price":{"$numberInt":"75"},"min_age":{"$numberInt":"18"},"organizer":"Random Organizer","colors":["#7fb1b3","#090f10"],"tickets":[],"scanners":[],"scan_Id":"66e9c0418e78fe79d585bdb3"},{"_id":{"$oid":"66e9c0418e78fe79d585bdce"},"date":{"$date":{"$numberLong":"1726963200000"}},"place":"Central Park","name":"AI in Healthcare","time":"02:00 PM","description":"An introductory course on AI and machine learning.","image":"https://i.postimg.cc/9fPWD4pd/Rock-Covers-ilustracion-oldskull-15-880x879.jpg","price":{"$numberInt":"40"},"min_age":{"$numberInt":"21"},"organizer":"Random Organizer","colors":["#ffb733","#191000"],"tickets":[],"scanners":[],"scan_Id":"66e9c0418e78fe79d585bdb0","numid":"001"},{"_id":{"$oid":"66e9c0418e78fe79d585bdd1"},"date":{"$date":{"$numberLong":"1742256000000"}},"place":"Tech Park","name":"AI in Finance","time":"10:00 AM","description":"Exploring the impact of AI on modern healthcare.","image":"https://i.postimg.cc/28NBJWtY/art-record-covers-07-01-17.jpg","price":{"$numberInt":"75"},"min_age":{"$numberInt":"18"},"organizer":"Random Organizer","colors":["#7fb1b3","#090f10"],"tickets":[],"scanners":[],"scan_Id":"66e9c0418e78fe79d585bdb3"},{"_id":{"$oid":"66e9c0418e78fe79d585bdce"},"date":{"$date":{"$numberLong":"1726963200000"}},"place":"Central Park","name":"AI in Healthcare","time":"02:00 PM","description":"An introductory course on AI and machine learning.","image":"https://i.postimg.cc/9fPWD4pd/Rock-Covers-ilustracion-oldskull-15-880x879.jpg","price":{"$numberInt":"40"},"min_age":{"$numberInt":"21"},"organizer":"Random Organizer","colors":["#ffb733","#191000"],"tickets":[],"scanners":[],"scan_Id":"66e9c0418e78fe79d585bdb0","numid":"001"},{"_id":{"$oid":"66e9c0418e78fe79d585bdd1"},"date":{"$date":{"$numberLong":"1742256000000"}},"place":"Tech Park","name":"AI in Finance","time":"10:00 AM","description":"Exploring the impact of AI on modern healthcare.","image":"https://i.postimg.cc/28NBJWtY/art-record-covers-07-01-17.jpg","price":{"$numberInt":"75"},"min_age":{"$numberInt":"18"},"organizer":"Random Organizer","colors":["#7fb1b3","#090f10"],"tickets":[],"scanners":[],"scan_Id":"66e9c0418e78fe79d585bdb3"},{"_id":{"$oid":"66e9c0418e78fe79d585bdce"},"date":{"$date":{"$numberLong":"1726963200000"}},"place":"Central Park","name":"AI in Healthcare","time":"02:00 PM","description":"An introductory course on AI and machine learning.","image":"https://i.postimg.cc/9fPWD4pd/Rock-Covers-ilustracion-oldskull-15-880x879.jpg","price":{"$numberInt":"40"},"min_age":{"$numberInt":"21"},"organizer":"Random Organizer","colors":["#ffb733","#191000"],"tickets":[],"scanners":[],"scan_Id":"66e9c0418e78fe79d585bdb0","numid":"001"},{"_id":{"$oid":"66e9c0418e78fe79d585bdd1"},"date":{"$date":{"$numberLong":"1742256000000"}},"place":"Tech Park","name":"AI in Finance","time":"10:00 AM","description":"Exploring the impact of AI on modern healthcare.","image":"https://i.postimg.cc/28NBJWtY/art-record-covers-07-01-17.jpg","price":{"$numberInt":"75"},"min_age":{"$numberInt":"18"},"organizer":"Random Organizer","colors":["#7fb1b3","#090f10"],"tickets":[],"scanners":[],"scan_Id":"66e9c0418e78fe79d585bdb3"},{"_id":{"$oid":"66e9c0418e78fe79d585bdce"},"date":{"$date":{"$numberLong":"1726963200000"}},"place":"Central Park","name":"AI in Healthcare","time":"02:00 PM","description":"An introductory course on AI and machine learning.","image":"https://i.postimg.cc/9fPWD4pd/Rock-Covers-ilustracion-oldskull-15-880x879.jpg","price":{"$numberInt":"40"},"min_age":{"$numberInt":"21"},"organizer":"Random Organizer","colors":["#ffb733","#191000"],"tickets":[],"scanners":[],"scan_Id":"66e9c0418e78fe79d585bdb0","numid":"001"}]
  return (
    <View style={styles.container}>
<View style={styles.container}>
  <FlatList
    data={events}
    renderItem={renderItem}
    keyExtractor={(item, index) => index.toString()}
    numColumns={2} // Número de columnas
    columnWrapperStyle={{ justifyContent: "center", gap:"10%" }} // Centra los elementos en la fila
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ alignItems: "center" }} // Centra el contenido
  />
</View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {

    width: Dimensions.get('window').width * 1,
  },
});

export default EventItem;
