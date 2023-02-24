import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingScreen from "../../screens/landingScreen/view/LandingScreen";
import PurchaseOrderScreen from "../../screens/purchaseorder/view/PurchaseOrderScreen";
import Cart from "../../screens/purchaseorder/view/Cart";
import { View,TouchableOpacity, Alert, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { useCartContext } from "../../context/CartContext";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";

const HomeStackNavigator = createNativeStackNavigator();
const { width } = Dimensions.get("screen");
const {height} = Dimensions.get("screen");
const HomeNavigator = () => {
  const navigation = useNavigation();
  const { distributorinfo, setDistributorInfo, cartItems } = useCartContext();
  const handlePress = () => {
    if (cartItems.length > 0) {
      setDistributorInfo(distributorinfo);
      navigation.navigate("Home", {
        screen: "Cart",
      });
    } else {
      Alert.alert("Sorry Your Cart is Empty Please Add Some Products...");
    }
  };
  const theme = useTheme();
  return (
    <HomeStackNavigator.Navigator>
      <HomeStackNavigator.Screen
        name="Landing Screen"
        component={LandingScreen}
        options={{
          title: "Home",
        }}
      />

      <HomeStackNavigator.Screen
        name="purchaseorder"
        component={PurchaseOrderScreen}
        options={{
          title: "Create Purchase Order",
          headerRight: () => {
            return (
              <View>
                <TouchableOpacity onPress={handlePress}>
                  <Text style={{ marginRight: (width * 4) / 100 }}>
                    <AntDesign name="shoppingcart" size={25} />
                  </Text>

                  <View
                    style={{
                      width:width*4.5/100,
                      borderRadius: 30,
                      backgroundColor: theme.colors.primary,
                      height:height*3/100,
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      right:width*2/100 ,
                      top: 0,
                    }}
                  >
                    <Text style={{ color: "white" }} variant="bodySmall">{cartItems.length}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          },
        }}
      />
      <HomeStackNavigator.Screen
        name="Cart"
        component={Cart}
        options={{
          title: "Cart",
        }}
      />
    </HomeStackNavigator.Navigator>
  );
};

export default HomeNavigator;
