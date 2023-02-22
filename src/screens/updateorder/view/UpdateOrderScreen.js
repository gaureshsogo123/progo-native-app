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
import useProductCategories from "../../../hooks/useProductCategories";
import { useCartContext } from "../../../context/CartContext";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get("screen");
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

  const { cartItems, setCartItems } = useCartContext();
  const [searchFilter, setSearchFilter] = useState("");
  const debounceSearch = useDebounce(searchFilter);
  const [categoryId, setCategoryId] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const { productCategories } = useProductCategories();
  const [errors, setErrors] = useState({});
  const navi = useNavigation();

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

  useEffect(() => {
    getCartProducts();
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

  const renderProduct = useCallback(
    ({ item }) => {
      return <Product item={item} />;
    },
    [cartItems]
  );

  const cartHandlePress = () => {
    if (cartItems.length > 0) {
      navigation.navigate("My Orders", {
        screen: "Cart",
        params: {
          cartItems,
          action: "update",
          discount: discount,
          distributorId: order.distributorid,
          orderId: order.orderid,
          distributorName: order.distributorname,
        },
      });
    } else {
      Alert.alert("Sorry Your Cart is Empty Please Add Some Products...");
    }
  };

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
          <View style={{ display: "flex", flexDirection: "row" }}>
            <TextInput
              value={searchFilter}
              mode="outlined"
              theme={{ roundness: 10 }}
              style={{ marginBottom: 3, marginHorizontal: 8, width: "88%" }}
              placeholder="Search products"
              onChangeText={(text) => setSearchFilter(text)}
            />
            <TouchableOpacity
              style={{ width: "5%", alignSelf: "center" }}
              onPress={cartHandlePress}
            >
              <AntDesign name="shoppingcart" size={28} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: "5%",
                borderRadius: 30,
                backgroundColor: theme.colors.primary,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: -6,
              }}
              onPress={cartHandlePress}
            >
              <Text style={{ color: "white" }}>{cartItems.length}</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: "white",
              height: (height * 12) / 100,
              marginBottom: 10,
              marginTop: 10,
              justifyContent: "center",
            }}
          >
            <ScrollView
              horizontal={true}
              contentContainerStyle={{ padding: 10 }}
            >
              {productCategories.map((val, i) => {
                return (
                  <TouchableOpacity
                    style={{
                      marginRight: 20,
                      justifyContent: "center",
                      borderTopWidth: val.categoryid == categoryId ? 6 : null,
                      borderTopColor:
                        val.categoryid == categoryId
                          ? theme.colors.primary
                          : null,
                      paddingTop: "3%",
                    }}
                    key={i}
                    onPress={() => setCategoryId(val.categoryid)}
                  >
                    <Image
                      source={{
                        uri:
                          val.image ||
                          "https://cdn-icons-png.flaticon.com/512/679/679922.png",
                      }}
                      style={{
                        width: (width * 14) / 100,
                        height: (height * 6) / 100,
                        marginBottom: 5,
                        alignSelf: "center",
                      }}
                    />
                    <Text
                      style={{
                        alignSelf: "center",
                        fontSize: (height * 1.5) / 100,
                        color:
                          val.categoryid == categoryId
                            ? theme.colors.primary
                            : null,
                      }}
                      adjustsFontSizeToFit={true}
                    >
                      {val.categoryname}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
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
    </>
  );
}

export default UpdateOrder;
