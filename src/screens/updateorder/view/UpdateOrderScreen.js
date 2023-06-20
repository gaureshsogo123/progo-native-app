import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { useAuthContext } from "../../../context/UserAuthContext";
import theme from "../../../themes/theme";
import useDebounce from "../../../hooks/useDebounce";
import { useProducts } from "../../purchaseorder/helper/useProducts";
import { getOrderDetailsRetailer } from "../../orders/helper/OrderHelper";
import Product from "../../purchaseorder/view/Product";
import useDistributorProductCategories from "../../../hooks/useDistributorProductCategories";
import { useCartContext } from "../../../context/CartContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import ProductDetail from "../../purchaseorder/view/ProductDetail";
import ProductCategories from "../../purchaseorder/view/productCategories";
import { useSearchContext } from "../../../context/SearchContext";

const { height, width } = Dimensions.get("screen");
const PAGE_SIZE = 15;

function UpdateOrder({ route, navigation }) {
  const { order } = route.params;
  const { user, setRouteName } = useAuthContext();

  const { cartItems, setCartItems, setDistributorInfo, showSingleProduct } =
    useCartContext();
  const [searchFilter, setSearchFilter] = useState("");
  const { debounceSearch } = useSearchContext();
  const [categoryId, setCategoryId] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [errors, setErrors] = useState({});
  const navi = useNavigation();
  const updateOrderRoute = useRoute();

  const { products, setProducts, refreshing, hasMore } = useProducts(
    order.distributorid,
    pageNo,
    PAGE_SIZE,
    debounceSearch,
    categoryId
  );

  useEffect(() => {
    getCartProducts();

    if (order.orderstatus == "Placed") {
      setDistributorInfo({
        action: "update",
        discount: 0,
        distributorId: order.distributorid,
        orderId: order.orderid,
        distributorName: order.distributorname,
      });
    }
  }, []);

  useEffect(() => {
    setProducts([]);
    setPageNo(1);
  }, [debounceSearch, categoryId]);

  const handleEndReached = () => {
    if (hasMore) {
      setPageNo((prev) => prev + 1);
    }
  };

  useEffect(() => {
    setRouteName(updateOrderRoute.name);
  }, [navigation]);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      navi.reset({
        index: 0,
        routes: [{ name: "Landing Screen" }],
      });
    });
    return unsubscribeFocus;
  }, [navigation]);

  const getCartProducts = async () => {
    try {
      const orderDetails = await getOrderDetailsRetailer(
        order.orderid,
        user.userId
      );
      if (orderDetails.error) {
        Alert.alert("Error", "There was an error");
      }
      const cart = orderDetails.data.map((item) => ({
        discount: item.discount,
        price: item.productprice,
        productid: item.productid,
        quantity: item.productquantity,
        productname: item.productname,
        orderstatus: item.orderstatus,
        manufacturer: item.manufacturer,
        gstrate: item.productgstrate,
      }));
      setCartItems(cart);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch previous cart items");
      setErrors({ ...errors, cart: "Failed to get products" });
    }
  };

  const renderProduct = useCallback(
    ({ item }) => {
      return <Product item={item} />;
    },
    [cartItems]
  );

  const cartHandlePress = () => {
    if (cartItems.filter((item) => item.quantity > 0).length > 0) {
      navigation.navigate("My Orders", {
        screen: "Cart",
      });
    } else {
      Alert.alert(
        "Empty Cart",
        "Sorry Your Cart is Empty Please Add Some Products..."
      );
    }
  };

  const productKeyExtractor = useCallback((product) => product.productid, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.pagecontainer}>
          <View style={styles.heading}>
            <View style={styles.flexContainer}>
              <Text variant="titleMedium" style={{ width: "70%" }}>
                <Text style={{ color: "gray" }}>Supplier: </Text>
                {order.distributorname}
              </Text>
              <Text variant="titleMedium">ID:{order.orderid}</Text>
            </View>
          </View>
          {/*
          <TextInput
            value={searchFilter}
            mode="outlined"
            theme={{ roundness: 10 }}
            style={{ marginBottom: 3, marginHorizontal: 8 }}
            placeholder="Search products"
            onChangeText={(text) => setSearchFilter(text)}
  />*/}
          <ProductCategories
            distributorId={order.distributorid}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
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

      <Button
        onPress={cartHandlePress}
        mode="contained"
        style={styles.orderButton}
      >
        Proceed
      </Button>
      {showSingleProduct && <ProductDetail />}
    </>
  );
}

export default UpdateOrder;

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
    paddingHorizontal: 10,
    paddingVertical: 5,
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
