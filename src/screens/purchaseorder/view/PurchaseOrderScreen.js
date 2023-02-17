import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  Alert,
} from "react-native";
import { Button, HelperText } from "react-native-paper";
import { TextInput, Text } from "react-native-paper";
import { useAuthContext } from "../../../context/UserAuthContext";
import { saveOrder } from "../helper/Purchasehelper";
import { useProducts } from "../helper/useProducts";
import useDebounce from "../../../hooks/useDebounce";
import Product from "./Product";

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
    paddingHorizontal: 1,
    paddingBottom: 1,
  },
  orderButton: {
    borderRadius: 3,
    paddingVertical: 5,
    backgroundColor: "#f9a374",
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const PAGE_SIZE = 15;

function PurchaseOrderScreen({ route, navigation }) {
  const { distributorId, distributorName } = route.params;

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
  } = useProducts(distributorId, pageNo, PAGE_SIZE, debounceSearch, categoryId);
  const [errors, setErrors] = useState({});

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
        total - (total * discount) / 100,
        "cash",
        distributorId,
        discount,
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
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
      setErrors({ ...errors, saveOrder: "Failed to save order" });
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
      <View style={styles.heading}>
        <View style={styles.flexContainer}>
          <Text variant="titleMedium" style={{ width: "90%" }}>
            <Text style={{ color: "gray" }}>Supplier: </Text>
            {distributorName}
          </Text>
        </View>
      </View>

      <TextInput
        value={searchFilter}
        mode="outlined"
        theme={{ roundness: 10 }}
        style={{ marginHorizontal: 8, marginBottom: 5 }}
        placeholder="Search Products"
        onChangeText={(text) => setSearchFilter(text)}
      />
      {errors.products && (
        <HelperText visible={errors.products} type="error">
          {errors.products}{" "}
        </HelperText>
      )}
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
      <Button onPress={placeOrder} mode="contained" style={styles.orderButton}>
        Place Order
      </Button>
    </>
  );
}

export default PurchaseOrderScreen;
