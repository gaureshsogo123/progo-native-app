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
import {
  calculateCartTotals,
  getDiscountedTaxedPrice,
  saveOrder,
} from "../helper/Purchasehelper";
import { editOrder } from "../../updateorder/helper/UpdateOrderHelper";
import { useAuthContext } from "../../../context/UserAuthContext";
import { useCartContext } from "../../../context/CartContext";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    height: "100%",
    padding: 10,
  },
  toppagecontainer: {
    backgroundColor: "white",
    width: "100%",
    height: "auto",
    paddingTop: 5,
    paddingBottom: 5,
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
    marginLeft: 10,
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
    paddingVertical: 5,
    backgroundColor: "#f9a374",
    position: "absolute",
    bottom: 0,
    borderRadius: 3,
  },
});

const { height } = Dimensions.get("screen");

function Cart({ navigation }) {
  const theme = useTheme();
  const { user } = useAuthContext();
  const [uploading, setUploading] = useState(false);
  const { cartItems, setCartItems, clearContext, distributorInfo } =
    useCartContext();
  const [errors, setErrors] = useState({});
  const navi = useNavigation();

  const { totalAmount, totalDiscount, totalTax } =
    calculateCartTotals(cartItems);

  const totalItems = cartItems
    .filter((item) => item.quantity > 0)
    .reduce((acc, curr) => {
      acc = acc + Number(curr.quantity);
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
    if (uploading) return;
    try {
      setUploading(true);
      const result = await saveOrder(
        user.userId,
        cartItems.filter((item) => item.quantity > 0).length,
        totalAmount,
        "cash",
        distributorInfo.distributorId,
        totalDiscount,
        totalAmount - totalTax,
        cartItems.filter((item) => item.quantity > 0)
      );
      if (!result.error) {
        Alert.alert(
          "Success",
          `Your order has been successfully placed with order ID: ${result.data[0]?.orderid}`
        );
        navigation.pop(1);
        navigation.navigate("My Orders", { screen: "Orders" });
        navi.reset({
          index: 0,
          routes: [{ name: "Landing Screen" }],
        });
        clearContext();
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
      setErrors({ ...errors, saveOrder: "Failed to save order" });
    } finally {
      setUploading(false);
    }
  };

  /** set quantity to 0 so its not visible, but retains other properties like discount, gstrate */
  const deleteHandlePress = (index) => {
    setCartItems((prev) => {
      const obj = { ...prev[index], quantity: 0 };
      prev[index] = obj;
      return [...prev];
    });
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
    if (uploading) return;
    try {
      setUploading(true);
      const result = await editOrder(
        user.userId,
        cartItems.filter((item) => item.quantity > 0).length,
        totalAmount,
        "cash",
        totalAmount - totalTax,
        cartItems.filter((item) => item.quantity > 0),
        totalDiscount,
        distributorInfo.orderId,
        distributorInfo.distributorId
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
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.toppagecontainer}>
          <View style={styles.flexContainer}>
            <Text variant="titleMedium" style={{ width: "100%" }}>
              <Text style={{ color: "gray" }}>Supplier: </Text>
              {distributorInfo.distributorName}
            </Text>
          </View>

          <View style={styles.flexContainer}>
            <Text variant="titleMedium">
              <Text style={{ color: "gray" }}>Items: </Text>
              {totalItems}
            </Text>
            <Text variant="titleMedium" style={{ paddingRight: 10 }}>
              {distributorInfo.action == "update"
                ? `ID: ${distributorInfo.orderId}`
                : null}
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View style={styles.flexContainer}>
              <Text variant="titleMedium">
                <Text style={{ color: "gray" }}>Products: </Text>
                {cartItems.filter((item) => item.quantity > 0).length}
              </Text>
            </View>
            {totalTax !== "0.00" ? (
              <View style={styles.flexContainer}>
                <Text variant="titleMedium" style={{ paddingRight: 10 }}>
                  <Text style={{ color: "gray" }}>Subtotal: </Text>
                  {`\u20B9`}
                  {Number(totalAmount - totalTax).toFixed(2)}
                </Text>
              </View>
            ) : (
              <View style={styles.flexContainer}></View>
            )}
          </View>

          <View
            style={{
              display:
                totalDiscount !== "0.00" || totalTax !== "0.00"
                  ? "flex"
                  : "none",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            {totalDiscount !== "0.00" ? (
              <View style={styles.flexContainer}>
                <Text variant="titleMedium" style={{ paddingRight: 10 }}>
                  <Text style={{ color: "gray" }}>Discounts: </Text>
                  {`\u20B9`}
                  {Number(totalDiscount).toFixed(2)}
                </Text>
              </View>
            ) : (
              <View style={styles.flexContainer}></View>
            )}

            {totalTax !== "0.00" ? (
              <Text variant="titleMedium" style={{ paddingRight: 10 }}>
                <Text style={{ color: "gray" }}>GST: </Text>
                {`\u20B9`}
                {Number(totalTax).toFixed(2)}
              </Text>
            ) : (
              <Text style={{ paddingRight: 10 }}></Text>
            )}
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              borderTopColor: "black",
              borderTopWidth: 1,
            }}
          >
            <View style={styles.flexContainer}>
              <Text variant="titleMedium" style={{ paddingRight: 10 }}>
                <Text style={{ color: "gray" }}>Grand Total: </Text>
              </Text>
            </View>
            <Text variant="titleMedium" style={{ paddingRight: 10 }}>
              {`\u20B9`}
              {Number(totalAmount).toFixed(2)}
            </Text>
          </View>
        </View>

        <ScrollView
          style={{
            marginTop: "1%",
            width: "100%",
            marginBottom: (height * 6) / 100,
          }}
        >
          {cartItems
            .filter((item) => item.quantity > 0)
            .map((val, i) => (
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
                  price : {`\u20B9`}
                  {getDiscountedTaxedPrice(val, val)}
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
                    {(
                      Number(getDiscountedTaxedPrice(val, val)) * val.quantity
                    ).toFixed(2)}
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
                    <Text style={{ alignSelf: "center" }}>Qty: </Text>
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
      {distributorInfo.action === "update" ? (
        <Button
          onPress={!uploading && updateOrder}
          style={styles.orderButton}
          mode="contained"
          loading={uploading}
        >
          Update Order
        </Button>
      ) : (
        <Button
          onPress={!uploading && placeOrder}
          style={styles.orderButton}
          mode="contained"
          loading={uploading}
        >
          Place Order
        </Button>
      )}
    </>
  );
}

export default Cart;
