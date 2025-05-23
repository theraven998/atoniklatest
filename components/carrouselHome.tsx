
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useRef, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
Image,
    Dimensions,
  } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
 import test from "@/assets/images/test1.png"
 import test2 from  "@/assets/images/test2.png"
 import test3 from  "@/assets/images/test3.png"
const data = [test, test2, test3];
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
export default function Carrousel() {
    const ref = React.useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);
    
    const onPressPagination = (index: number) => {
      ref.current?.scrollTo({
        /**
         * Calculate the difference between the current index and the target index
         * to ensure that the carousel scrolls to the nearest index
         */
        count: index - progress.value,
        animated: true,
      });
    };
  
  
    return (
    
      <View  style={styles.container}>
        <Carousel
          ref={ref}
          width={width}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
          height={width / 1.4}
          data={data}
          scrollAnimationDuration={1500}
          autoPlayInterval={1500}
          autoPlay={true}
          onProgressChange={progress}
          renderItem={({ item }) => (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Image
              source={item}
              style={{ width: "100%", height: "100%", resizeMode: "cover" }}
            />
          </View>
          )}
        />
   
        <Pagination.Basic
        	dotStyle={{ backgroundColor: "#ffffff", borderRadius:3, }}
          activeDotStyle={{ backgroundColor: "#6100a1" }}
          progress={progress}
          data={data}
       
          containerStyle={{ gap: 5, marginTop: -35 }}
          onPress={onPressPagination}
        />

  
      </View>
  
    );
  }
  
  // Estilos
  const styles = StyleSheet.create({
    logo: {
      height: 50,
      width: 50,

    },
  
    container: {


  
      alignItems: "center",
    },
  
    p1: {
      color: "white",
      fontSize: 20,
      fontWeight: "100",
      marginLeft: 10,
      marginBottom: 10,
    },
  });
  