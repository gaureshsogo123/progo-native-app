import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import { useTheme, Text, Button } from "react-native-paper";
import { getOrderDetail } from "../helper/OrderHelper";

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
    margin: 5,
    padding: 5,
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

  const orderInfo = async () => {
    setRefreshing(true);
    await getOrderDetail(order.distributorid, order.orderid)
      .then((orders) => {
        setOrderDetail(orders.data);
        setRefreshing(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    orderInfo();
  }, [order.distributorid, order.orderid]);

  const renderOrderDetails = ({ item }) => {
    return (
      <View
        style={{
          ...styles.product,
          borderBottomColor: "silver",
          paddingBottom: "3%",
          backgroundColor: "#fafafa",
        }}
      >
        <View style={{ width: "70%" }}>
          <Text variant="titleMedium">{item.productname}</Text>
          <Text style={styles.price} variant="titleSmall">
            Price : {`\u20B9`} {item.productprice}
          </Text>
          <Text>
            Amount : {`\u20B9`}{" "}
            {(Number(item.productquantity) * item.productprice).toFixed(2)}
          </Text>
        </View>
        <View style={styles.unitSection}>
          <Text>Qty : </Text>
          <View
            style={{
              width: 70,
              height: 40,
              backgroundColor: theme.colors.secondaryContainer,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
            }}
          >
            <Text variant="titleSmall">{item.productquantity}</Text>
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

  const totalAmount = orderDetail.reduce((acc, curr) => {
    acc = acc + Number(curr.productquantity) * curr.productprice;
    return acc;
  }, 0);
  return (
    <>
      <View style={styles.heading}>
        <View style={styles.flexContainer}>
          <Text variant="titleMedium" style={{ width: "80%" }}>
            <Text style={{ color: "gray" }}>Outlet: </Text>
            {order.distributorname}
          </Text>

          <Text variant="titleMedium">
            <Text variant="titleMedium">ID: </Text>
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
            {totalAmount.toFixed(2)}
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
          {order.orderstatus == "Placed" ? (
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
          ) : null}
        </View>
      </View>

      <FlatList
        data={orderDetail}
        renderItem={renderOrderDetails}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => orderInfo()}
          />
        }
        keyExtractor={(item) => item.productid}
      />
    </>
  );
}

export default OrderDetailScreen;
