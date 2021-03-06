import React, { useRef, useState } from "react";
import {Text, View, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";
import RecipeMealList from "../components/Recipe/RecipeMealList";
import { useDispatch, useSelector } from 'react-redux';

const ThreeTimeMeals = ({navigation, route}, props) => {
    let timeMeals;

    switch (route.params.mealTime) {
        case "breakfast":
            timeMeals = (useSelector((state) => state.recipes.allMeals.breakfastMeals));
            // console.log("hereeeeeeeeeeee", timeMeals)
        break;
        case "lunch":
            timeMeals = (useSelector((state) => state.recipes.allMeals.lunchMeals));
        break;
        case "dinner":
            timeMeals = (useSelector((state) => state.recipes.allMeals.dinnerMeals));
        break;  
    }


  return (
// รายการที่เลือก
    <View style={styles.container}>

        <RecipeMealList
        dateKey={route.params.dateKey}
        mealTime={route.params.mealTime}
        style={{ width: "100%", height: "100%" }}
        listData={timeMeals}
        navigation={navigation}
        />

    </View>



  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  headBox:{
    backgroundColor: "#e3e3e3",
    //ตอนเอาลง tab เอา marginTop ออกด้วยนะ
    alignItems: "flex-start",
    padding: 8
  },
  headText:{
    fontSize:23,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 10
  },
  food:{
    height: 100,
    flex: 1,
    marginLeft: 10,
    borderRadius: 15
  },
  foodBox:{
    flexDirection: 'column',
    flex: 2,
  },
  foodName:{
    fontSize: 22,
    fontWeight: "bold",
    flex: 2,
    marginLeft: 10,
    marginTop: 10,
    flexWrap: "wrap",
  },
  foodCal:{
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    flex: 1,
  },
  foodTime:{
    flex: 1,
    marginLeft: 10,
    // marginTop: -180,
  },
  timeText:{
    fontSize: 18,
    marginTop: -25,
    marginLeft: 30,
  },
  line:{
      height: 2,
      backgroundColor: "#adacac",
      marginTop: 20
  }

});

export default ThreeTimeMeals;
