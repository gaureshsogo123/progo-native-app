import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { Button, HelperText, useTheme } from "react-native-paper";
import { TextInput, Text } from "react-native-paper";
import { useProducts } from "../helper/useProducts";
import useDebounce from "../../../hooks/useDebounce";
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
    paddingBottom: 1,
  },
  orderButton: {
    borderRadius: 3,
    paddingVertical: 5,
    backgroundColor: "#f9a374",
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
  const theme = useTheme();
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

  useEffect(() => {
    setProducts([]);
    setPageNo(1);
  }, [debounceSearch]);

  const handleEndReached = () => {
    if (hasMore) {
      setPageNo((prev) => prev + 1);
    }
  };

  const cartHandlePress = () => {
    navigation.navigate("Home", {
      screen: "Cart",
      params: {
        cartItems,
        action: "place",
        discount: discount,
        distributorId,
        distributorName,
      },
    });
  };

  const renderProduct = useCallback(
    ({ item }) => {
      return (
        <Product
          item={item}
          setCartItems={setCartItems}
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

      <View style={{ display: "flex", flexDirection: "row" }}>
        <TextInput
          value={searchFilter}
          mode="outlined"
          theme={{ roundness: 10 }}
          style={{ marginBottom: 3, marginHorizontal: 8, width: "88%" }}
          placeholder="Search Products"
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
          height: (height * 8) / 100,
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        <ScrollView horizontal={true}>
          {category.map((val, i) => {
            return (
              <View
                style={{ marginRight: 15, justifyContent: "center" }}
                key={i}
              >
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
        Checkout
      </Button>
    </>
  );
}

export default PurchaseOrderScreen;
