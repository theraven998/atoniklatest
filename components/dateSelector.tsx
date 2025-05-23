import React, { useState, useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import left from "../assets/images/left.png";
import right from "../assets/images/right.png";
import url from "../constants/url.json";
import EventItems from "./eventItemList";
import Carrousel from "@/components/carrouselHome";
const DateSelector = () => {
  const [absoluteDate, setAbsoluteDate] = useState(new Date());
  const [dailyEvents, setDailyEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const addDays = (date: Date, days: number) => {
    const addDaysDate = new Date(date); 
    addDaysDate.setDate(addDaysDate.getDate() + days);
    return addDaysDate;
  };

  const formatDate = (date: Date) => {
    const formatDate1 = addDays(date, 1);
    const days = ["Dom", "Lun", "Mar","Mie", "Jue", "Vie", "Sab"];
    return [days[formatDate1.getDay()], formatDate1.getDate()];
  };

  const getMonthName = (date: Date) => { const months = ["enero", "febrero", "marzo", "abril", "mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]; return months[addDays(date, 1).getMonth()]; };


  const fetchEventsOne = async (fetchDate: Date) => {
    try {
      setLoading(true);
      const response = await fetch(`${url.url}/api/events/one?date=${fetchDate}`);
      if (!response.ok) throw new Error("Network response was not ok");
      setDailyEvents(await response.json());
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    fetchEventsOne(absoluteDate);
  }, []);

  return (
    <View     style={styles.container}> 
    <LinearGradient
    colors={[ '#2c1c3b','#280946']}
  locations={[0.46,0.7,  1]}

    start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
style={[styles.containerGradient,]}
  >
         <Carrousel  />
        
      <View style={styles.allText}>
    

        {[-2, -1, 0, 1, 2].map(offset => (
          <TouchableOpacity
            key={offset}
            onPress={() => {
              const newDate = addDays(absoluteDate, offset);
              fetchEventsOne(newDate);
              setAbsoluteDate(newDate);
            }}
            style={[styles.textContainer, offset === 0 ? styles.middle : {}]}
          >
            <Text style={[styles.letter, offset === 0 ? styles.middleText : {}]}>
              {formatDate(addDays(absoluteDate, offset))[0]}  {formatDate(addDays(absoluteDate, offset))[1]}
            </Text>
       
          </TouchableOpacity>
        ))}

    
      </View>
      <View style={styles.monthContainer}>
          <Text style={styles.month}>Eventos {getMonthName(absoluteDate)}</Text></View>
         
      </LinearGradient>
      <EventItems events={dailyEvents} state={"event"} />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
 
    paddingHorizontal: 16,
    width: "60%",
    borderBottomLeftRadius: 64,
    borderBottomRightRadius: 54,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
   
  },
  containerGradient: {
 
    paddingHorizontal: 16,
    width: "60%",
    borderBottomLeftRadius: 64,
    borderBottomRightRadius: 54,
    marginBottom: 10,
   
   
  },
  allText: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
    marginTop: "40%",
    paddingHorizontal: "26%",
  },
  rowContainer: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
  }, 
  row: {
    height: 45,
    width: 30,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 52,
    paddingVertical: 5,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
  },
  letter: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "300",
    textAlign: "center",
  },
  monthContainer: {
    marginTop: "0%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  month: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "#6e697253",
    borderRadius: 10,
    fontSize: 15,
    color: "#cacaca",
    fontWeight: "100",
    textAlign: "center",
    marginHorizontal:"auto"
  },
  num: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "300",
    textAlign: "center",
    
  },
  middleText: {
  
    borderRadius: 10,
    color: "#fff",
  },
  middle: {
    backgroundColor: "#6e697253",
    borderRadius: 10,
    marginBottom: 15,
  },
});

export default DateSelector;