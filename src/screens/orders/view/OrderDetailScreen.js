import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useTheme, Text, Button, HelperText } from "react-native-paper";
import { useAuthContext } from "../../../context/UserAuthContext";
import { getOrderDetailsRetailer } from "../helper/OrderHelper";
import {
  calculateCartTotals,
  getDiscountedTaxedPrice,
} from "../../purchaseorder/helper/Purchasehelper";

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  pagecontainer: {
    width: "100%",
  },
  heading: {
    padding: 10,
  },
  product: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  unitSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: (width * 25) / 100,
  },
  unitInput: {
    width: 70,
    textAlign: "center",
    paddingHorizontal: 1,
    paddingBottom: 1,
  },
  orderButton: {
    borderRadius: 3,
    paddingVertical: 5,
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  price: {
    color: "gray",
  },
});

function OrderDetailScreen({ navigation, route }) {
  const theme = useTheme();
  const { order } = route.params;
  const [orderDetail, setOrderDetail] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [errors, setErrors] = useState({});

  const { user } = useAuthContext();
  const { totalAmount } = calculateCartTotals(orderDetail);

  const getOrderInfo = async () => {
    setRefreshing(true);
    try {
      const result = await getOrderDetailsRetailer(order.orderid, user.userId);
      if (!result.error) {
        setOrderDetail(
          result.data?.map((item) => ({
            discount: item.discount || 0,
            price: item.productprice,
            gstrate: item.productgstrate,
            productid: item.productid,
            productname: item.productname,
            manufacturer: item.manufacturer || null,
            quantity: item.productquantity || 0,
            retailerId: user.userId,
            ...item,
          }))
        );
        setErrors({ ...errors, getorderinfo: "" });
      } else setErrors({ ...errors, getorderinfo: "Failed to fetch Products" });
    } catch (err) {
      setErrors({ ...errors, getorderinfo: "Failed to fetch Products" });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getOrderInfo();
  }, [user.userId, order.orderid]);

  const getProducts = ({ item }) => {
    const productPrice = getDiscountedTaxedPrice(item, item);
    return (
      <View
        style={{
          ...styles.product,
          borderBottomColor: "silver",
          paddingBottom: "3%",
          backgroundColor: "#fafafa",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: (width * 100) / 100,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <View style={{ width: (width * 70) / 100 }}>
            <Text variant="titleMedium">{item.productname}</Text>
            <Text style={styles.price} variant="titleSmall">
              Price : {`\u20B9`} {productPrice}
            </Text>
            <Text>
              Amount : {`\u20B9`}{" "}
              {Number(productPrice * item.quantity).toFixed(2)}
            </Text>
          </View>
          <View style={styles.unitSection}>
            <Text>Qty: </Text>
            <View
              style={{
                width: "60%",
                height: 40,
                backgroundColor: theme.colors.secondaryContainer,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
              }}
            >
              <Text variant="titleSmall">{item.quantity}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const updateOrder = () => {
    navigation.navigate("UpdateOrder", {
      order: order,
    });
  };

  const totalItems = orderDetail.reduce((acc, curr) => {
    acc = acc + Number(curr.productquantity);
    return acc;
  }, 0);

  return (
    <>
      <View style={styles.heading}>
        <View style={styles.flexContainer}>
          <Text variant="titleMedium" style={{ width: "70%" }}>
            <Text style={{ color: "gray" }}>Supplier: </Text>
            {order.distributorname}
          </Text>

          <Text variant="titleMedium">
            <Text variant="titleMedium" style={{ color: "gray" }}>
              ID:
            </Text>
            {order.orderid}
          </Text>
        </View>
        <View style={styles.flexContainer}>
          <Text variant="titleMedium">
            <Text style={{ color: "gray" }}>Products:</Text>{" "}
            {orderDetail.length}
          </Text>
          <Text variant="titleMedium">
            <Text style={{ color: "gray" }}>Status:</Text> {order.orderstatus}
          </Text>
        </View>
        <View
          style={{
            ...styles.flexContainer,
            borderBottomWidth: 1,
            borderBottomColor: "silver",
            paddingBottom: 10,
          }}
        >
          <Text variant="titleMedium">
            <Text style={{ color: "gray" }}>Total Amount:</Text> {`\u20B9`}{" "}
            {Number(totalAmount).toFixed(2)}
          </Text>
          <Text variant="titleMedium">
            <Text style={{ color: "gray" }}>Items:</Text> {totalItems}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            marginTop: "3%",
          }}
        >
          <Text variant="titleMedium">Products:</Text>
          {order.orderstatus === "Placed" && order.ispaid == false && (
            <Button
              style={{
                width: "50%",
                height: 50,
                backgroundColor: theme.colors.primary,
                justifyContent: "center",
              }}
              mode="contained"
              onPress={updateOrder}
            >
              Update Order
            </Button>
          )}
        </View>
        {errors.getorderinfo && (
          <HelperText visible={errors.getorderinfo} type="error">
            {errors.getorderinfo}{" "}
          </HelperText>
        )}
      </View>

      <FlatList
        data={orderDetail}
        renderItem={getProducts}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => getOrderInfo()}
          />
        }
        keyExtractor={(item) => item.productid}
      />
    </>
  );
}

export default OrderDetailScreen;
