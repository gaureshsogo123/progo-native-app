import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { Button, useTheme, HelperText } from "react-native-paper";
import { TextInput, Text } from "react-native-paper";
import { useAuthContext } from "../../../context/UserAuthContext";
import { fetchProducts, saveOrder } from "../helper/Purchasehelper";
import calculateTotal from "../helper/calculateTotal";
import Product from "./Product";
import { AntDesign } from "@expo/vector-icons";
import category from "../../../constants/Category";


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
    padding:10
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

function PurchaseOrderScreen({ route, navigation }) {
  const theme = useTheme();

  const { distributorId, distributorName } = route.params;

  const { user,setCartProducts,setCartSuppliername } = useAuthContext();
  const [refreshing, setRefreshing] = useState(true);
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [discount, setDiscount] = useState(0);
  const [orderAggregateData, setOrderAggregateData] = useState({
    totalPrice: 0,
    totalItems: 0,
    totalProducts: 0,
  });
  const [searchFilter, setSearchFilter] = useState("");

  const placeOrder = async () => {
    setErrors({ ...errors, saveOrder: "" });
    const orderProducts = products.filter((product) => product.quantity !== 0);
    if (orderProducts.length === 0) {
      Alert.alert(
        "Empty cart!",
        "Empty order cannot be placed. Please add some products to place an order"
      );
      return;
    }
    try {
      const result = await saveOrder(
        user.userId,
        orderProducts.length,
        orderAggregateData.totalPrice -
          (orderAggregateData.totalPrice * discount) / 100,
        "cash",
        distributorId,
        discount,
        orderAggregateData.totalPrice,
        orderProducts
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
    if (!user) return;
    setErrors({ ...errors, products: "" });
    getProducts();
  }, [distributorId]);

  const getProducts = async () => {
    setRefreshing(true);
    try {
      const products = await fetchProducts(distributorId, 0, "ALL");
      if (products.data.length === 0)
        setErrors({
          ...errors,
          products: "You do not have any products yet",
        });
      else {
        products.data = products.data.map((product) => ({
          ...product,
          quantity: product.quantity || 0,
          discount: product.discount || 0,
        }));
        setProducts(products.data);
      }
    } catch (err) {
      setErrors({ ...errors, products: "Failed to get products" });
    } finally {
      setRefreshing(false);
      setDiscount(0);
    }
  };

  useEffect(() => {
    setOrderAggregateData(calculateTotal(products));
  }, [products]);

  const updateQuantity = (amount, id) => {
    setProducts((products) => {
      let obj = [...products];
      let index = obj.findIndex((item) => item.productid === id);
      obj[index].quantity = parseInt(amount || 0);
      return obj;
    });
  };

  const cartHandlePress = (()=>{
    const orderProducts = products.filter((product) => product.quantity !== 0);
    if(orderProducts.length !==0){
     navigation.navigate("My Orders", { screen: "Cart" })
     setCartProducts(orderProducts);
     setCartSuppliername(distributorName)
    }
  })

  const renderProduct = useCallback(({ item }) => {
    return <Product item={item} updateQuantity={updateQuantity} />;
  }, []);

  const filteredProducts = useMemo(() => {
    return products?.filter((product) =>
      product.productname.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [searchFilter, products]);

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
        {/*<View style={styles.flexContainer}>
          <Text variant="titleMedium">
            <Text style={{ color: "gray" }}>Products:</Text>{" "}
            {orderAggregateData.totalProducts}
          </Text>
          <Text variant="titleMedium">
            <Text style={{ color: "gray" }}>Items:</Text>{" "}
            {orderAggregateData.totalItems}
          </Text>
  </View>*/}
        {/* <View style={styles.flexContainer}>
          <Text variant="titleMedium">
            <Text style={{ color: "gray" }}>Total Amount:</Text> {`\u20B9`}{" "}
            {Number(orderAggregateData.totalPrice).toFixed(2)}
          </Text>
</View>*/}
      </View>

      <View style={{ display: "flex", flexDirection: "row" }}>
        <TextInput
          value={searchFilter}
          mode="outlined"
          theme={{ roundness: 10 }}
          style={{ marginBottom:3, marginHorizontal: 8, width: "88%" }}
          placeholder="Search Products"
          onChangeText={(text) => setSearchFilter(text)}
        />
        <TouchableOpacity
          style={{ width: "5%", alignSelf: "center" }}
          onPress={cartHandlePress}
        >
          <AntDesign name="shoppingcart" size={28}  />
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
          <Text style={{ color: "white" }}>
            {orderAggregateData.totalProducts}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: "white",
          height: (height * 8) / 100,
          marginBottom: 10,
          marginTop:10
        }}
      >
        <ScrollView horizontal={true}>
          {category.map((val, i) => {
            return (
              <View style={{ marginRight: 15, justifyContent: "center" }} key={i}>
                <Image
                  source={{ uri: val.imglink }}
                  style={{
                    width: (width * 12) / 100,
                    height: (height * 4) / 100,
                    marginBottom: 5,
                    alignSelf: "center",
                  }}
                />
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: (height * 1.5) / 100,
                  }}
                >
                  {val.name}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
      {errors.products && (
        <HelperText visible={errors.products} type="error">
          {errors.products}{" "}
        </HelperText>
      )}
      <FlatList
        removeClippedSubviews={false}
        keyExtractor={productKeyExtractor}
        data={filteredProducts}
        renderItem={renderProduct}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => getProducts()}
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
