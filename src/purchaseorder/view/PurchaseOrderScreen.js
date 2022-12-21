import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { TextInput, Text } from "react-native-paper";
import { fetchProducts } from "../helpers/Purchasehelper";

const styles = StyleSheet.create({
  container:{
    display:"flex",
    justifyContent:'flex-start',
    alignItems:'flex-start',
    width:'100%'
  },
  pagecontainer:{
    width:"100%",
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
  },
});

function PurchaseOrderScreen({ route }) {
  const theme = useTheme();

  const { retailerId, retailerName } = route.params;
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      const products = await fetchProducts();
      setProducts(products.data);
    };
    getProducts();
  }, [retailerId]);

  useEffect(() => {
    calculateTotal();
  }, [products]);

  const updateUnits = (amount, id) => {
    setProducts((products) => {
      let obj = [...products];
      let index = obj.findIndex((item) => item.id === id);
      obj[index].units = parseInt(amount || 0);
      return obj;
    });
  };

  const calculateTotal = () => {
    let total = 0;
    products.forEach((product) => {
      total += product.saleprice * (product.units || 0);
    });
    setTotalPrice(total);
  };

  const renderProduct = useCallback(({ item }) => {
    return (
      <View
        style={{
          ...styles.product,
          borderBottomColor:"silver" ,
          paddingBottom:'3%',
          backgroundColor:"#fafafa"
        }}
      >
        <View>
          <Text variant="titleMedium" style={{Width:"80%",fontWeight:"400"}}>{item.name}</Text>
          <Text style={styles.price} variant="titleSmall">
            Price: {item.saleprice}{" "}
          </Text>
          <Text variant="titleSmall" style={{color:"#424242"}}>
            Total: {item.saleprice * item.units}{" "}
          </Text>
        </View>
        <View style={styles.unitSection}>
          <TextInput
            keyboardType="number-pad"
            style={styles.unitInput}
            variant="flat"
            value={item.units === 0 ? "" : item.units + ""}
            onChangeText={(text) => updateUnits(text, item.id)}
          />
          <Text variant="labelLarge" style={{fontWeight:"400"}}> units</Text> 
        </View>
      </View>
    );
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [searchFilter, products]);

  const productKeyExtractor = useCallback((product) => product.id);

  return (
    <>
    <View style={styles.container}>
      <View style={styles.pagecontainer}>
      <View style={styles.heading}>
        <Text style={{ marginBottom: 5,color:"#616161" }} variant="titleLarge">
          Outlet:<Text style={{color:"#212121"}}> {retailerName}
</Text>        </Text>
        <Text style={{ marginBottom: 5,color:"#616161" }} variant="titleMedium">
          Total Price: <Text style={{color:"#212121"}}>{`\u20B9`} {parseFloat(totalPrice).toFixed(2)}</Text> 
        </Text>
      </View>

      <TextInput
        value={searchFilter}
        mode="flat"
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
      />
      <Button mode="contained" style={styles.orderButton}>
        Place Order
      </Button>
    </>
  );
}

export default PurchaseOrderScreen;
