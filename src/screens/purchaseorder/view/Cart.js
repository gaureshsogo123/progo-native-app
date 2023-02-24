import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { Text, useTheme, Button } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { saveOrder } from "../helper/Purchasehelper";
import { editOrder } from "../../updateorder/helper/UpdateOrderHelper";
import { useAuthContext } from "../../../context/UserAuthContext";
import { useCartContext } from "../../../context/CartContext";

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    height:"100%",
    padding: 10,
  },
  toppagecontainer: {
    backgroundColor: "white",
    width: "100%",
    height: "auto",
    paddingTop: 5,
    paddingBottom:5
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom:2,
    marginLeft:10,
  },
  productcontainer: {
    width: "100%",
    backgroundColor: "#fafafa",
    height: "auto",
    marginBottom: "2%",
    marginTop: "3%",
    shadowColor: "#000",
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  orderButton: {
    width: "100%",
    paddingVertical:5,
    backgroundColor: "#f9a374",
    position:'absolute',
    bottom:0,
    borderRadius:3
  },
});

const {height}= Dimensions.get("screen");
function Cart({  navigation }) {
  
  const theme = useTheme();
  const { user } = useAuthContext();
  const {
    cartItems,
    setCartItems,
    distributorinfo,
    clearContext,
  } = useCartContext();
  const [errors, setErrors] = useState({});
  const totalItems = cartItems.reduce((acc, curr) => {
    acc = acc + Number(curr.quantity);
    return acc;
  }, 0);

  const totalAmount = cartItems.reduce((acc, curr) => {
    acc = acc + Number(curr.quantity) * curr.price;
    return acc;
  }, 0);

  const placeOrder = async () => {
    setErrors({ ...errors, saveOrder: "" });
    if (cartItems.length === 0) {
      Alert.alert(
        "Empty cart!",
        "Empty order cannot be placed. Please add some products to place an order"
      );
      return;
    }
    const total = cartItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
    try {
      const result = await saveOrder(
        user.userId,
        cartItems.length,
        total - (total * distributorinfo.discount) / 100,
        "cash",
        distributorinfo.distributorId,
        distributorinfo.discount,
        total,
        cartItems
      );
      if (!result.error) {
        Alert.alert(
          "Success",
          `Your order has been successfully placed with order ID: ${result.data[0]?.orderid}`
        );
        navigation.pop(1);
        navigation.navigate("My Orders", { screen: "Orders" });
        clearContext();
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
      setErrors({ ...errors, saveOrder: "Failed to save order" });
    }
  };

  const deleteHandlePress = (index) => {
    setCartItems((prev) => prev.filter((val, i) => index !== i));
  };

  useEffect(() => {
    if (cartItems.length == 0) {
      navigation.goBack();
    }
  }, [cartItems]);
  const updateOrder = async () => {
    setErrors({ ...errors, saveOrder: "" });
    if (cartItems.length === 0) {
      Alert.alert(
        "Empty cart!",
        "Empty order cannot be placed. Please add some products to update the order or cancel if you no longer wish to fulfill this order"
      );
      return;
    }
    const total = cartItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
    try {
      const result = await editOrder(
        user.userId,
        cartItems.length,
        Number(total - (total * distributorinfo.discount) / 100).toFixed(2),
        "cash",
        Number(total).toFixed(2),
        cartItems,
        distributorinfo.discount,
        distributorinfo.orderId,
        distributorinfo.distributorId
      );
      if (!result.error) {
        Alert.alert(
          "Success",
          `Your order with ID - ${result.data[0]?.orderid} has been successfully updated!`
        );
        navigation.navigate("Orders", { screen: "OrdersList" });
        clearContext();
      } else setErrors({ ...errors, updateOrder: result.error });
    } catch (error) {
      Alert.alert("Error", "There was an error");
    }
  };

  return (
    <>
    <View style={styles.container}>
      <View style={styles.toppagecontainer}>
        <View style={styles.flexContainer}>
          <Text variant="titleMedium" style={{width:"100%"}}>
            <Text style={{ color: "gray" }}>Supplier: </Text>
            {distributorinfo.distributorName}
          </Text>
        </View>

        <View style={styles.flexContainer}>
          <Text variant="titleMedium">
            <Text style={{ color: "gray" }}>Items: </Text>
            {totalItems}
          </Text>
          <Text variant="titleMedium" style={{paddingRight:10}}>{distributorinfo.action=="update"?`ID: ${distributorinfo.orderId}`:null}</Text>
        </View>

        <View style={{display:"flex",flexDirection:'row',width:"100%",justifyContent:"space-between"}}>
        <View style={styles.flexContainer}>
          <Text variant="titleMedium" >
            <Text style={{ color: "gray" }}>Products: </Text>
            {cartItems.length}
          </Text>
        </View>
        
        
          <View style={styles.flexContainer}>
            <Text variant="titleMedium" style={{paddingRight:10}}>
              <Text style={{ color: "gray" }}>Total: </Text>
              {`\u20B9`}{totalAmount}
            </Text>
          </View>
          </View>
                </View>
      <ScrollView style={{ marginTop: "1%", width: "100%",marginBottom:height*6/100 }}>
        {cartItems.map((val, i) => (
          <View style={styles.productcontainer} key={i}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ marginLeft: 10, marginTop: 10, width: "85%" }}
                variant="titleMedium"
              >
                {val.productname}
              </Text>
              <TouchableOpacity
                style={{ alignSelf: "center", marginRight: 10 }}
                onPress={() => deleteHandlePress(i)}
              >
                <AntDesign name="delete" size={20} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                marginLeft: 10,
                marginTop: 10,
                color: "#424242",
                width: "85%",
              }}
              variant="titleSmall"
            >
              price : {`\u20B9`}{val.price}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ marginLeft: 10, marginTop: 10 }}
                variant="titleSmall"
              >
                Amount : {`\u20B9`}
                {(Number(val.quantity) * val.price).toFixed(2)}
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: 10,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginRight: 10,
                  marginBottom: 10,
                }}
              >
                <Text>Qty : </Text>
                <View
                  style={{
                    width: "40%",
                    height: 35,
                    justifyContent: "center",
                    backgroundColor: theme.colors.primary,
                    alignItems: "center",
                    borderRadius: 15,
                  }}
                >
                  <Text>{val.quantity}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      
    </View>
    {distributorinfo.action === "update" ? (
        <Button
          onPress={updateOrder}
          style={styles.orderButton}
          mode="contained"
        >
          Update Order
        </Button>
      ) : (
        <Button
          onPress={placeOrder}
          style={styles.orderButton}
          mode="contained"
        >
          Place Order
        </Button>
      )}
    </>
  );
}

export default Cart;
