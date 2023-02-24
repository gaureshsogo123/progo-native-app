import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Orders from "../../screens/orders/view/OrderScreen";
import UpdateOrder from "../../screens/updateorder/view/UpdateOrderScreen";
import OrderDetailScreen from "../../screens/orders/view/OrderDetailScreen";
import Cart from "../../screens/purchaseorder/view/Cart";
import { View, Text, TouchableOpacity, Alert, Dimensions } from "react-native";
import { useCartContext } from "../../context/CartContext";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";

const OrderStackNavigator = createNativeStackNavigator();
const {width}=Dimensions.get("screen");
const {height}=Dimensions.get("screen")

const OrdersNavigator = () => {
  const navigation = useNavigation();
  const { distributorinfo, setDistributorInfo, cartItems } = useCartContext();
  const handlePress = () => {
    if(cartItems.length>0){
    setDistributorInfo(distributorinfo);
    navigation.navigate("My Orders", {
      screen: "Cart",
    });
  }
  else{
    Alert.alert("Sorry Your Cart is Empty Please Add Some Products...");
  }
  };
  const theme = useTheme();
  return (
    <OrderStackNavigator.Navigator>
      <OrderStackNavigator.Screen
        name="Orders"
        component={Orders}
        options={{
          title: "My Orders",
        }}
      />

      <OrderStackNavigator.Screen
        name="Order Details"
        component={OrderDetailScreen}
      />

      <OrderStackNavigator.Screen
        name="UpdateOrder"
        component={UpdateOrder}
        options={{
          title: "Update Order",
          headerRight: () => {
            return (
              <View>
                <TouchableOpacity onPress={handlePress}>
                  <Text style={{marginRight:width*4/100}}>
                    <AntDesign name="shoppingcart" size={25}/>
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
                    <Text style={{ color: "white" }}>{cartItems.length}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          },
        }}
      />

      <OrderStackNavigator.Screen name="Cart" component={Cart} />
    </OrderStackNavigator.Navigator>
  );
};

export default OrdersNavigator;
