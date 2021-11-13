import React from "react";
import {Text, View, StyleSheet, Image, TextInput, TouchableOpacity,FlatList, } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'; 
import RecipeMealTime from "./RecipeMealTime";

const RecipeMealList = (props) => {
    const renderRecipeItem = (itemData) => {
        const {id, name, kcal, time, ingredient_quantity, ingredient_name, ingredient_type, steps, imageURL, originalURL} = itemData.item
        // console.log(props.mealTime)
        return (
            <View>
                <RecipeMealTime 
                mealTime={props.mealTime}
                id={id}
                name={name}
                kcal={kcal}
                time={time}
                image={imageURL}
                onSelectRecipe={() => {
                    // เขียนโค้ดเพิ่ม
                    props.navigation.navigate("MenuDetail", { id, name, kcal, time, ingredient_quantity, ingredient_name, ingredient_type, steps, imageURL, originalURL,})
                  }}
                />
            </View>
        )
    }
    return (
        <View style={styles.list}>
          <FlatList
            style={{ width: "100%", height: "100%" }}
            data={props.listData}
            renderItem={renderRecipeItem}
          />
        </View>
      );
    };


    const styles = StyleSheet.create({
        list: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      });

export default RecipeMealList;