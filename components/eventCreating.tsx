import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const EventCardCreating = ({ event, state, gradientColors}) => {
  const navigation = useNavigation();
  const formattedDate = new Date(event.date.$date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePresss = (event) => {

    if (state) {
      navigation.navigate('screens/Events/event', { event });
    } else {

      navigation.navigate('screens/Events/eventManager', { event });
    }
  };


  return (
    <TouchableOpacity  onPress={() => { handlePresss(event) }}>
    <LinearGradient  colors={gradientColors} style={styles.blur}>
        <Image style={styles.poa} source={{ uri: event.image }} />
        
        <View style={{ marginLeft: 10 }}>
            <Text
                style={{
                    fontSize: 16,
                    padding: 3,
                    color: "white",
                    fontWeight: "400",
                    marginTop: 7,
                   
                }}
            >
                Nombre:
            </Text>

            <Text
                style={{
                    fontSize: 14,
                    color: "white",
                    fontWeight: 100,
                    marginTop: 0,
            
                }}
            >
                {event.name}
            </Text>

            <Text
                style={{
                    fontSize: 16,
                 
          
                    padding: 3,
                    color: "white",
                    fontWeight: "400",
                    marginTop: 7,
              
                }}
            >
                Lugar:
            </Text>

            <Text
                style={{
                    fontSize: 13,
                    color: "white",
                    fontWeight: "100",
                    marginTop: 2,
                
                }}
            >
                {event.place}
            </Text>
        </View>

        <View style={{ marginLeft: "7%" }}>
            <Text
                style={{
                    fontSize: 16,
                  
                  
                   padding: 3,
                    color: "white",
                    fontWeight: "400",
                    marginTop: 7,
       
                    
                }}
            >
                Fecha:
            </Text>

            <Text
                style={{
                    fontSize: 14,
                    color: "white",
                    fontWeight: 100,
                    marginTop: 0,
                 
                }}
            >
    { new Date(event.date.$date).toLocaleDateString('en-GB', { timeZone: 'UTC' }) }
            </Text>

            <Text
                style={{
                    fontSize: 16,
           

                    padding: 3,
                    color: "white",
                    fontWeight: "400",
                    marginTop: 7,
                }}
            >
                Precio:
            </Text>

            <Text
                style={{
                    fontSize: 14,
                    color: "white",
                    fontWeight: 100,
                    marginTop: 0,
            
                }}
            >
                {`$ ${event.price}`}
            </Text>
        </View>
    </LinearGradient>
</TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    blur: {
        borderRadius: 20,
        display:"flex",
        flexDirection:"row",
        paddingHorizontal: 0,
        overflow: 'hidden',
        backgroundColor:"#14112e",
        borderWidth: 0, // Grosor del borde
        borderColor:"#202020ef0",
        width:"100%",
        alignSelf:"center",
        height:145,
        marginBottom:"10%",
        shadowOffset: {
          width: 0,
          height: 0,
        },},
  poa: {
    width: '34%',
    height: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  textContainer: {
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    padding: 3,
    color: 'white',
    fontWeight: '400',
    marginTop: 7,
  },
  value: {
    fontSize: 14,
    color: 'white',
    fontWeight: '100',
    marginTop: 0,
  },
});

export default EventCardCreating;
