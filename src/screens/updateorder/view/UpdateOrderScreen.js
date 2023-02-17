import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { useAuthContext } from "../../../context/UserAuthContext";
import theme from "../../../themes/theme";
import useDebounce from "../../../hooks/useDebounce";
import { useProducts } from "../../purchaseorder/helper/useProducts";
import { getOrderDetailsRetailer } from "../../orders/helper/OrderHelper";
import { editOrder } from "../helper/UpdateOrderHelper";
import Product from "../../purchaseorder/view/Product";

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
    backgroundColor: theme.colors.secondaryContainer,
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

const PAGE_SIZE = 15;

function UpdateOrder({ route, navigation }) {
  const { order } = route.params;
  const { user } = useAuthContext();

  const [cartItems, setCartItems] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const debounceSearch = useDebounce(searchFilter);
  const [categoryId, setCategoryId] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const {
    products,
    setProducts,
    refreshing,
    discount,
    error: productsError,
    hasMore,
  } = useProducts(
    order.distributorid,
    pageNo,
    PAGE_SIZE,
    debounceSearch,
    categoryId
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getCartProducts();
  }, []);

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
        Number(total - (total * discount) / 100).toFixed(2),
        "cash",
        Number(total).toFixed(2),
        cartItems,
        discount,
        order.orderid,
        order.distributorid
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

  useEffect(() => {
    setProducts([]);
    setPageNo(1);
  }, [debounceSearch]);

  const handleEndReached = () => {
    if (hasMore) {
      setPageNo((prev) => prev + 1);
    }
  };

  const getCartProducts = async () => {
    try {
      const orderDetails = await getOrderDetailsRetailer(
        order.orderid,
        user.userId
      );
      if (!orderDetails.error) {
        const cart = orderDetails.data.map((item) => ({
          discount: item.discount,
          price: item.productprice,
          productid: item.productid,
          quantity: item.productquantity,
          productname: item.productname,
          orderstatus: item.orderstatus,
          manufacturer: item.manufacturer,
        }));
        setCartItems(cart);
      }
    } catch (err) {
      setErrors({ ...errors, cart: "Failed to get products" });
    }
  };

  const updateQuantity = useCallback((amount, item) => {
    setCartItems((prev) => {
      let obj = [...prev];
      const index = obj.findIndex(
        (cItem) => cItem.productid === item.productid
      );
      if (index > -1) {
        obj[index].quantity = parseInt(amount || 0);
      } else {
        obj.push({
          discount: item.discount,
          price: item.price,
          productid: item.productid,
          productname: item.productname,
          manufacturer: item.manufacturer || null,
          quantity: amount || 0,
        });
      }
      return obj.filter((item) => item.quantity > 0);
    });
  }, []);

  const renderProduct = useCallback(
    ({ item }) => {
      return (
        <Product
          item={item}
          updateQuantity={updateQuantity}
          cartItems={cartItems}
        />
      );
    },
    [cartItems]
  );

  const productKeyExtractor = useCallback((product) => product.productid, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.pagecontainer}>
          <View style={styles.heading}>
            <View style={styles.flexContainer}>
              <Text variant="titleMedium" style={{ width: "80%" }}>
                <Text style={{ color: "gray" }}>Supplier: </Text>
                {order.distributorname}
              </Text>
              <Text variant="titleMedium">ID: {order.orderid}</Text>
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
        data={products}
        renderItem={renderProduct}
        onEndReached={handleEndReached}
        onEndReachedThreshold={2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setPageNo(1)}
          />
        }
      />

      {cartItems &&
        (cartItems[0]?.orderstatus.toLowerCase() === "placed" ? (
          <Button
            onPress={updateOrder}
            mode="contained"
            style={styles.orderButton}
          >
            Update Order
          </Button>
        ) : (
          <Button mode="contained" style={styles.orderButton}>
            Order {cartItems[0]?.orderstatus.toLowerCase()}
          </Button>
        ))}
    </>
  );
}

export default UpdateOrder;
