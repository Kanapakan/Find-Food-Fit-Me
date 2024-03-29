import React, { useState, useRef, useEffect } from 'react';
import { AppRegistry, Text, View, StyleSheet, Platform, Animated, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark, toggleMealTime, toggleEatKcals } from '../store/actions/recipeAction';
import firebase from 'firebase';
import { auth } from '../database/Auth';
const dbrealTime = firebase.app().database('https://fir-react-example-1e215-default-rtdb.asia-southeast1.firebasedatabase.app/');

import { Picker } from '@react-native-picker/picker';

const HEADER_MIN_HEIGHT = 100;
const HEADER_MAX_HEIGHT = 300;

const MenuDetail = ({ navigation, route }, props) => {
  // console.log("----- Bookmark : ",(useSelector((state) => state.recipes.bookmarkRecipes)))
  const allMeal = (useSelector((state) => state.recipes.allMeals))
  const sumNutrient = (useSelector((state) => state.recipes.sumNutrient))
  const sumEatKcals = (useSelector((state) => state.recipes.sumEatKcals))
  // console.log("----- sumNutrient : ", sumNutrient)



  const { id, name, kcal, time, ingredient_quantity, ingredient_name, steps, imageURL, carbs, protein, fats, } = route.params;
  const bookmark_recipe = (useSelector((state) => state.recipes.bookmarkRecipes));

  const datePick = (useSelector((state) => state.user.datePick));
  // console.log("Pick date : ", datePick)
  const existingIndex = bookmark_recipe.findIndex(recipe => recipe.id === id)
  const [bookmark, setBookmark] = useState(existingIndex >= 0)
  const [mealTime, setMealTime] = useState("")
  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    pushUserHistory(datePick)
  }, [sumEatKcals]);

  // ------------------- Loop ingredients's name -----------------------------
  const renderIn_name = () => {
    return ingredient_name.map(function (item, i) {
      return (
        <View key={i}>
          <Octicons name="primitive-dot" size={24} color="#6b6969" />
          <Text style={styles.ingredianName}>{item}</Text>
        </View>
      );
    })
  };
  // ------------------- Loop quantity's list -----------------------------
  const renderIngredient_quantity = () => {
    return ingredient_quantity.map(function (item, i) {
      return (
        <View key={i}>
          {/* <Octicons name="primitive-dot" size={24} color="#6b6969"/> */}
          <Text style={styles.amount}>{item}</Text>
        </View>
      );
    })
  };

  const renderSteps = () => {
    return steps.map(function (item, i) {
      return (
        <View key={i}>
          <View style={[{ flexDirection: "row" }]} >
            <Text style={styles.step}>{i + 1}. </Text>
            <Text style={styles.stepDetail}>{item}</Text>
          </View>

        </View>
      );
    })
  };

  // ---------- ปุ่ม bookmark ---------------
  const pressBookmark = (id) => {
    toggleBookmarkHandler(id)
    // console.log(id)
    if (bookmark === false) {
      Alert.alert("เพิ่ม \"" + name + "\" เข้า Bookmark")
    } else {
      Alert.alert("ลบ \"" + name + "\" ออกจาก Bookmark")
    }
    setBookmark(!bookmark);
  };

  const dispatch = useDispatch();
  const toggleBookmarkHandler = (mealId) => {

    dispatch(toggleBookmark(mealId));

  }

  // ---------- เพิ่มเมนูอาหาร ---------------
  const selectMeals = (id, mealTime, kcal) => {

    toggleEatKcalsHandler(kcal, "Add")
    toggleMealTimeHandler(id, mealTime, "Add", carbs, fats, protein)
    console.log("Add in " + mealTime)

    // -------------------- บันทึกลง firebase ----------------------


    let timeMealsThai;
    let timeMeals;
    switch (mealTime) {
      case "breakfast":
        timeMealsThai = "มื้อเช้า";
        timeMeals = "Breakfast";
        break;
      case "lunch":
        timeMealsThai = "มื้อกลางวัน";
        timeMeals = "Lunch";
        break;
      case "dinner":
        timeMealsThai = "มื้อเย็น";
        timeMeals = "Dinner";
        break;
    }

    Alert.alert("เพิ่ม \"" + name + "\" เข้าตารางอาหาร " + timeMealsThai)

    // navigation.navigate("ThreeTimeMeals", { mealTime: timeMeals, mealTimeThai: timeMealsThai })
  }

  const pushUserHistory = (datePick) => {
    let data;
    dbrealTime.ref("user_History/userRecipe/" + auth.currentUser?.uid + "/" + datePick).on('value', snapshot => {
      // console.log('user date :', snapshot.val())
      data = snapshot.val()
      // console.log("hideee : ", data.dateKey)
      
    if (data == null) {
      const keyDate = dbrealTime.ref("user_History/Recipe_of_day").push().getKey();
      dbrealTime.ref("user_History/userRecipe/" + auth.currentUser?.uid + "/" + datePick).update({
        date: datePick,
        dateKey: keyDate
      }).then(

        dbrealTime.ref("user_History/Recipe_of_day/" + keyDate).update({
          date: datePick,
          recipes: allMeal,
          sumCal: sumEatKcals,
          sumNutrient: sumNutrient,
          userId: auth.currentUser?.uid
        }))
    } 
    else {
      // const keyDate = dbrealTime.ref("user_History/Recepy_of_day/"+ data.datakey).getKey();
      dbrealTime.ref("user_History/Recipe_of_day/" + data.dateKey).update({
        date: datePick,
        recipes: allMeal,
        sumCal: sumEatKcals,
        sumNutrient: sumNutrient,
        userId: auth.currentUser?.uid
      })
    }
    })


  }


  const toggleMealTimeHandler = (mealId, Time, order, carbs, fats, protein) => {
    // console.log(mealId, Time)
    dispatch(toggleMealTime(mealId, Time, order, carbs, fats, protein));

  }

  // ----------------- store ค่า แคลทั้งหมด ----------------------------
  const toggleEatKcalsHandler = (kcals, order) => {
    console.log(kcals)
    dispatch(toggleEatKcals(kcals, order))

  }





  const headerHeight = scrollYAnimatedValue.interpolate(
    {
      inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp'
    });

  const headerBackgroundColor = scrollYAnimatedValue.interpolate(
    {
      inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
      outputRange: ['#000', '#000'],
      extrapolate: 'clamp'
    });

  return (
    <View style={styles.container} >
      <ScrollView
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollYAnimatedValue } } }], { useNativeDriver: false }
        )}>

        <View style={[styles.foodCard]}>

          {/* carbohydrate card */}
          <View style={styles.square}>
            <Text style={styles.typeFood}>คาร์โบไฮเดรต</Text>
            <Image style={styles.typeImage} source={require("../assets/carbohydrate-removebg.png")} />
            <Text style={styles.gram}>{carbs}</Text>
          </View>

          {/* carbohydrate card */}
          <View style={styles.square}>
            <Text style={styles.typeFood}>โปรตีน</Text>
            <Image style={styles.typeImage} source={require("../assets/protein-removebg.png")} />
            <Text style={styles.gram}>{protein}</Text>
          </View>

          {/* fat card */}
          <View style={styles.square}>
            <Text style={styles.typeFood}>ไขมัน</Text>
            <Image style={styles.typeImage} source={require("../assets/fat-removebg.png")} />
            <Text style={styles.gram}>{fats}</Text>
          </View>

        </View>


        <Text style={styles.header}>วัตถุดิบ</Text>
        {/* ตัวอย่างที่ลองใส่มา code เหมือนกัน เปลี่ยนแค่ชื่อกับปริมาณที่ใส่ */}

        {/* มายองเนส */}

        <View style={styles.ingredianBox}>

          <View style={[styles.detailIngredian, { flex: 1 }]}>
            <View>
              {renderIn_name()}
            </View>
          </View>

          <View style={[styles.amountBox, { flex: 1 }]}>
            <View>
              {renderIngredient_quantity()}
            </View>
          </View>

        </View>

        {/* renderSteps() */}
        {/* ---------------------------- วิธีทำ -------------------------------------------- */}
        <Text style={styles.header}>วิธีทำ</Text>
        <View style={[styles.stepBox, { flex: 1 }]}>
          {/* <View style={styles.stepBox}> */}
          {renderSteps()}
        </View>



        <View style={styles.line} />

        {/* ---------------------- เลือกมื้ออาหาร ----------------------------- */}
        <View style={styles.bottom}>
          <Text style={styles.foodCalBottom}>{kcal} Kcal.</Text>
          <View style={styles.pickerBorder}>
            <Picker
              selectedValue={mealTime}
              style={styles.pickerdropdown}
              onValueChange={(itemValue, itemIndex) => setMealTime(itemValue)}

            >
              {/* อย่าลืม disable  และจัดให้ตรงกลาง*/}
              <Picker.Item label="กรุณาเลือก" value="" />
              <Picker.Item label="อาหารเช้า" value="breakfast" />
              <Picker.Item label="อาหารกลางวัน" value="lunch" />
              <Picker.Item label="อาหารเย็น" value="dinner" />
            </Picker >
          </View>

        </View>

        <View style={{ alignItems: "center", marginTop: 20, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => selectMeals(id, mealTime, kcal)}
            style={styles.btnContainer}>
            <Text style={styles.btnText}>บันทึกลงตารางอาหาร</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* ---------------------------- รูปอาหาร ------------------------------------- */}
      <Animated.View style={[styles.animatedHeaderContainer, { height: headerHeight }]}>
        <View style={[styles.item1, { flex: 2 }]}>
          <Image style={styles.foodImage} source={{ uri: imageURL }} />
        </View>
        {/* ---------------------------- กล่องชื่ออาหาร ------------------------------------- */}
        <View style={styles.item2}>
          <View style={{ flexDirection: 'row' }}>

            <View style={[styles.left, { flex: 2 }]}>

              <Text numberOfLines={1} style={styles.foodName}>{name}</Text>

              <View style={styles.foodTime}>
                <MaterialIcons name="access-time" size={26} color="black" />
                <Text style={styles.timeText}>{time} นาที</Text>
              </View>

            </View>


            <View style={[styles.right, { flex: 1 }]}>
              <TouchableOpacity
                onPress={() => pressBookmark(id)}>
                {/* ไอคอนตอนกด fav สีดำ */}

                <Ionicons
                  name="bookmark"
                  size={40}
                  color={bookmark ? "black" : "white"} style={styles.favIcon} />

                {/* ไอคอนตอนยังไม่กด fav สีขาว */}
                {/* <Ionicons name="bookmark-outline" size={40} color="black" style={styles.favIcon}/> */}
              </TouchableOpacity>
              <Text style={styles.foodCal}>{kcal} Kcal.</Text>
            </View>

          </View>
        </View>

      </Animated.View>

    </View>
  );

}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      justifyContent: "center",
      flexDirection: "column"

    },
    animatedHeaderContainer: {
      position: 'absolute',
      top: (Platform.OS == 'ios') ? 20 : 0,
      left: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center'
    },
    headerText: {
      color: 'white',
      fontSize: 22
    },
    item: {
      backgroundColor: '#ff9e80',
      margin: 8,
      height: 45,
      justifyContent: 'center',
      alignItems: 'center'
    },
    item2: {
      backgroundColor: "#e4efe3",
      // justifyContent: "center",
      width: "100%"
    },
    itemText: {
      color: 'black',
      fontSize: 16
    },
    item1: {
      backgroundColor: "#fff",
      height: 150,
      width: "100%",

    },
    foodImage: {
      height: "100%",
      width: "100%"
    },
    foodName: {
      width: 260,
      fontSize: 28,
      fontWeight: "bold",
      color: "#547f53",
      flexWrap: "wrap",
      marginLeft: 20,
      marginTop: 10,
    },
    foodTime: {
      marginLeft: 20,
      marginTop: 10,
    },
    timeText: {
      fontSize: 18,
      marginTop: -25,
      marginLeft: 30,
      marginBottom: 10
    },
    foodCal: {
      fontSize: 25,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 17
    },
    left: {
      backgroundColor: "#e4efe3",
    },
    right: {
      backgroundColor: "#e4efe3",
    },
    favIcon: {
      alignSelf: "flex-end",
      marginTop: -6,
      marginRight: 10
    },
    square: {
      width: 110,
      height: 120,
      borderColor: "#b7cbb6",
      borderWidth: 4,
      borderRadius: 10,
      margin: 10,
      marginTop: 20,
      justifyContent: "center",
    },
    typeFood: {
      fontSize: 14,
      fontWeight: "bold",
      alignSelf: "center",
      color: "#6b6969",
      margin: 5
    },
    typeImage: {
      height: "40%",
      width: "60%",
      alignSelf: "center",
    },
    gram: {
      fontSize: 19,
      alignSelf: "center",
      color: "#6b6969",
      margin: 5
    },
    foodCard: {
      backgroundColor: "white",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    ingredianBox: {
      flexDirection: "row",
      margin: 5,
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
      color: "black",
      marginLeft: 20,
      marginTop: 10,
      marginBottom: 10
    },
    detailIngredian: {
      marginLeft: 40
    },
    amountBox: {
      justifyContent: "center"
    },
    ingredianName: {
      marginBottom: 1.75,
      fontSize: 18,
      color: "#6b6969",
      marginTop: -26,
      marginLeft: 20,
      flexWrap: "wrap"
    },
    amount: {
      fontSize: 18,
      color: "#6b6969",
    },
    stepBox: {
      // flexDirection: "row",
      marginLeft: 40,
      marginRight: 30
    },
    step: {
      flex: 0.07,
      fontSize: 18,
      color: "#6b6969",
      marginTop: 5
    },
    stepDetail: {
      flex: 1,
      fontSize: 18,
      color: "#6b6969",
      marginTop: 5,
      flexWrap: "wrap",
    },
    line: {
      height: 2,
      backgroundColor: "#adacac",
      marginTop: 20
    },
    bottom: {
      flexDirection: "row",
    },
    foodCalBottom: {
      flex: 1,
      fontSize: 25,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 20,
      marginLeft: 40,
      // backgroundColor: "green"
    },
    pickerBorder: {
      flex: 1,
      width: "80%",
      height: 40,
      borderColor: '#8ec18d',
      borderWidth: 2,
      borderRadius: 10,
      marginTop: 20,
      marginRight: 40,
    },
    btnContainer: {
      width: "60%",
      elevation: 8,
      backgroundColor: "#8ec18d",
      borderRadius: 10,
      paddingVertical: 10,
      // paddingHorizontal: 20,
    },
    btnText: {
      fontSize: 20,
      color: "#fff",
      fontWeight: "bold",
      alignSelf: "center",
    },
    pickerdropdown: {
      fontFamily: 'serif',
      fontSize: 18,
      // paddingHorizontal: 10,
      // paddingVertical: 10,
      // borderWidth: 2,
      // borderColor: '#8ec18d',
      color: "#adacac",
      // fontWeight: "bold",
      // borderRadius: 8,
      marginTop: -5,
      // padding: 4,
      // borderStyle: "hidden",
      textAlign: "center"
    }

  });
export default MenuDetail