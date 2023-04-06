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
  Alert,
} from "react-native";
import { Button, HelperText, useTheme } from "react-native-paper";
import { TextInput, Text } from "react-native-paper";
import { useProducts } from "../helper/useProducts";
import Product from "./Product";
import useDistributorProductCategories from "../../../hooks/useDistributorProductCategories";
import useDebounce from "../../../hooks/useDebounce";
import { useCartContext } from "../../../context/CartContext";

const { height } = Dimensions.get("screen");
const { width } = Dimensions.get("screen");

const PAGE_SIZE = 15;

function PurchaseOrderScreen({ route, navigation }) {
  const { distributorId, distributorName } = route.params;
  const theme = useTheme();
  const { cartItems, setDistributorInfo, clearContext } = useCartContext();
  const [searchFilter, setSearchFilter] = useState("");
  const debounceSearch = useDebounce(searchFilter);
  const [categoryId, setCategoryId] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const { productCategories } = useDistributorProductCategories(distributorId);

  const { products, setProducts, refreshing, hasMore } = useProducts(
    distributorId,
    pageNo,
    PAGE_SIZE,
    debounceSearch,
    categoryId
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    clearContext();

    setDistributorInfo({
      action: "place",
      discount: 0,
      distributorId,
      distributorName,
    });
  }, [distributorId]);

  useEffect(() => {
    setProducts([]);
    setPageNo(1);
  }, [debounceSearch, categoryId]);

  const handleEndReached = () => {
    if (hasMore) {
      setPageNo((prev) => prev + 1);
    }
  };

  const cartHandlePress = () => {
    if (cartItems.length > 0) {
      navigation.navigate("Home", {
        screen: "Cart",
      });
    } else {
      Alert.alert("", "Sorry Your Cart is Empty Please Add Some Products...");
    }
  };

  const renderProduct = useCallback(
    ({ item }) => {
      return <Product item={item} />;
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
      <View style={{width:"100%",paddingLeft:width*2/100,paddingRight:width*2/100}}>      
        <TextInput
        value={searchFilter}
        mode="outlined"
        theme={{ roundness: 10 }}
        style={{ marginBottom: 3,}}
        placeholder="Search Products"
        onChangeText={(text) => setSearchFilter(text)}
      />
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
        <ScrollView horizontal={true} contentContainerStyle={{ padding:width*2/100 }}>
          {productCategories.map((val, i) => {
            return (
              <TouchableOpacity
                style={{
                  marginRight: 20,
                  justifyContent: "center",
                  borderTopWidth: val.categoryid == categoryId ? 6 : null,
                  borderTopColor:
                    val.categoryid == categoryId ? theme.colors.primary : null,
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
        Add to Cart
      </Button>
    </>
  );
}

export default PurchaseOrderScreen;

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
    padding: width*2/100,
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
