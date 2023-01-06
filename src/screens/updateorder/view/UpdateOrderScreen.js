import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { useAuthContext } from "../../../context/UserAuthContext";
import calculateTotal from "../../purchaseorder/helper/calculateTotal";
import { fetchProducts } from "../../purchaseorder/helper/Purchasehelper";
import { getOrderDetails, editOrder } from "../helper/UpdateOrderHelper";

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
  price: {
    color: "gray",
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
    height: 40,
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
});

function UpdateOrder({ route, navigation }) {
  const {
    order,
    order: { distributorid },
  } = route.params;
  const { user } = useAuthContext();

  const [refreshing, setRefreshing] = useState(false);
  const [errors, setErrors] = useState({});
  const [discount, setDiscount] = useState(0);

  const [products, setProducts] = useState([]);
  const [orderDetails, setOrderDetails] = useState();
  const [orderAggregateData, setOrderAggregateData] = useState({
    totalPrice: 0,
    totalItems: 0,
    totalProducts: 0,
  });
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    getProducts();
  }, [order.orderid]);

  useEffect(() => {
    setOrderAggregateData(calculateTotal(products));
  }, [products]);

  const updateOrder = async () => {
    setErrors({ ...errors, saveOrder: "" });
    const orderProducts = products.filter((product) => product.quantity !== 0);
    if (orderProducts.length === 0) {
      Alert.alert(
        "Empty cart!",
        "Empty order cannot be placed. Please add some products to update the order or cancel if you no longer wish to fulfill this order"
      );
      return;
    }
    try {
      const result = await editOrder(
        user.userId,
        orderProducts.length,
        Number(
          orderAggregateData.totalPrice -
            (orderAggregateData.totalPrice * discount) / 100
        ).toFixed(2),
        "cash",
        Number(orderAggregateData.totalPrice).toFixed(2),
        orderProducts,
        discount,
        order.orderid,
        distributorid
      );
      if (!result.error) {
        Alert.alert(
          "Success",
          `Your order with ID - ${result.data[0]?.orderid} has been successfully updated!`
        );
        navigation.navigate("Orders", { screen: "OrdersList" });
      } else setErrors({ ...errors, updateOrder: result.error });
    } catch (error) {
      Alert.alert("Error", "There was an error");
    }
  };

  const getProducts = async () => {
    setRefreshing(true);
    try {
      const products = await fetchProducts(distributorid, 0, "ALL");
      const orderDetails = await getOrderDetails(distributorid, order.orderid);
      if (orderDetails.data) {
        /* map product quantity, price to product quantity, price in order*/
        setOrderDetails(orderDetails.data);
        products.data = products.data.map((product) => {
          const orderProduct = orderDetails.data.find(
            (oProduct) => oProduct.productid == product.productid
          );
          return {
            ...product,
            price: orderProduct?.productprice || product.price,
            quantity: orderProduct?.productquantity || 0,
            discount: product.discount || 0,
          };
        });
        setProducts(products.data);
      }
    } catch (error) {
      Alert.alert("Error", "There was an error");
    } finally {
      setRefreshing(false);
      setDiscount(0);
    }
  };

  const updateQuantity = (amount, id) => {
    setProducts((products) => {
      let obj = [...products];
      let index = obj.findIndex((item) => item.productid === id);
      obj[index].quantity = parseInt(amount || 0);
      return obj;
    });
  };

  const renderProduct = useCallback(({ item }) => {
    return (
      <View
        style={{
          ...styles.product,
          borderBottomColor: "silver",
          paddingBottom: "3%",
          backgroundColor: "#fafafa",
        }}
      >
        <View>
          <Text
            variant="titleMedium"
            style={{ Width: "80%", fontWeight: "400" }}
          >
            {item.productname}
          </Text>
          <Text style={styles.price} variant="titleSmall">
            Price: {`\u20B9`} {Number(item.price).toFixed(2)}{" "}
          </Text>
          <Text variant="titleSmall" style={{ color: "#424242" }}>
            Total: {`\u20B9`} {Number(item.price * item.quantity).toFixed(2)}{" "}
          </Text>
        </View>
        <View style={styles.unitSection}>
          <TextInput
            keyboardType="number-pad"
            style={styles.unitInput}
            variant="flat"
            value={item.quantity === 0 ? "" : item.quantity + ""}
            onChangeText={(text) => {
              if (text.includes("-")) return;
              if (
                text == "" ||
                (Number.isInteger(parseInt(text)) && parseInt(text) > 0)
              )
                updateQuantity(text, item.productid);
              else return;
            }}
          />
          <Text variant="labelLarge" style={{ fontWeight: "400" }}>
            {" "}
            units
          </Text>
        </View>
      </View>
    );
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        !searchFilter ||
        product.productname.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [searchFilter, products]);

  const productKeyExtractor = useCallback((product) => product.productid, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.pagecontainer}>
          <View style={styles.heading}>
            <View style={styles.flexContainer}>
              <Text variant="titleMedium">
                <Text style={{ color: "gray" }}>Outlet: </Text>
                {order.distributorname}
              </Text>
              <Text variant="titleMedium">ID: {order.orderid}</Text>
            </View>
            <View style={styles.flexContainer}>
              <Text variant="titleMedium">
                <Text style={{ color: "gray" }}>Products:</Text>{" "}
                {orderAggregateData.totalProducts}
              </Text>
              <Text variant="titleMedium">
                <Text style={{ color: "gray" }}>Items:</Text>{" "}
                {orderAggregateData.totalItems}
              </Text>
            </View>
            <View style={styles.flexContainer}>
              <Text variant="titleMedium">
                <Text style={{ color: "gray" }}>Total Amount:</Text> {`\u20B9`}{" "}
                {Number(orderAggregateData.totalPrice).toFixed(2)}
              </Text>
            </View>
          </View>

          <TextInput
            value={searchFilter}
            mode="outlined"
            theme={{ roundness: 10 }}
            style={{ marginHorizontal: 8, marginBottom: 5 }}
            placeholder="Search products"
            onChangeText={(text) => setSearchFilter(text)}
          />
        </View>
      </View>
      <FlatList
        removeClippedSubviews={false}
        keyExtractor={productKeyExtractor}
        data={filteredProducts}
        renderItem={renderProduct}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getProducts} />
        }
      />

      {orderDetails &&
        (orderDetails[0]?.orderstatus.toLowerCase() === "placed" ? (
          <Button
            onPress={updateOrder}
            mode="contained"
            style={styles.orderButton}
          >
            Update Order
          </Button>
        ) : (
          <Button mode="contained" style={styles.orderButton}>
            Order {orderDetails[0]?.orderstatus.toLowerCase()}
          </Button>
        ))}
    </>
  );
}

export default UpdateOrder;
