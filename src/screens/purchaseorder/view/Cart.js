import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, useTheme } from "react-native-paper";
import cart from "../../../constants/Dummycart";
import { AntDesign } from "@expo/vector-icons";
import { useAuthContext } from "../../../context/UserAuthContext";


const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    padding: 10,
  },
  toppagecontainer: {
    backgroundColor: "white",
    width: "100%",
    height: "auto",
    paddingTop: 10,
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginLeft: 10,
  },
  productcontainer: {
    width: "100%",
    backgroundColor: "#fafafa",
    height: "auto",
    marginBottom: "2%",
    marginTop:"3%",
    shadowColor: "#000",
    borderRadius:12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});

function Cart() {
  const {cartProducts,cartSupplierName}=useAuthContext();

  const totalItems = cartProducts.reduce((acc, curr) => {
    acc = acc + Number(curr.quantity);
    return acc;
  }, 0);

  const totalAmount = cartProducts.reduce((acc, curr) => {
    acc = acc + Number(curr.quantity) * curr.price;
    return acc;
  }, 0);

  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.toppagecontainer}>
        <View style={styles.flexContainer}>
          <Text variant="titleMedium" style={{ width: "90%" }}>
            <Text style={{ color: "gray" }}>Supplier : </Text>
            {cartSupplierName}
          </Text>
        </View>
        <View style={styles.flexContainer}>
          <Text variant="titleMedium" style={{ width: "90%" }}>
            <Text style={{ color: "gray" }}>Products : </Text>
            {cartProducts.length}
          </Text>
        </View>

        <View style={styles.flexContainer}>
          <Text variant="titleMedium" style={{ width: "90%" }}>
            <Text style={{ color: "gray" }}>Items : </Text>
            {totalItems}
          </Text>
        </View>

        <View style={styles.flexContainer}>
          <Text variant="titleMedium" style={{ width: "90%" }}>
            <Text style={{ color: "gray" }}>Total Amount : </Text>
            {`\u20B9`} {totalAmount}
          </Text>
        </View>
      </View>
      <ScrollView style={{ marginTop: "1%", width: "100%" }}>
        {cartProducts.map((val, i) => {
          return (
            <View style={styles.productcontainer} key={i}>
                <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
              <Text style={{ marginLeft: 10, marginTop: 10 }} variant="titleMedium">{val.productname}</Text>
              <TouchableOpacity style={{alignSelf:"center",marginRight:10}}>
                <AntDesign name="delete" size={20}/>
              </TouchableOpacity>
              </View>
              <Text style={{ marginLeft: 10, marginTop: 10,color:"gray" }} variant="titleSmall">
                price : {`\u20B9`} {val.price}
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ marginLeft: 10, marginTop: 10 }}>
                  Total : {`\u20B9`} {(Number(val.quantity) * val.price).toFixed(2)}
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: 10,
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginRight: 10,
                    marginBottom:10
                  }}
                >
                  <Text>Qty : </Text>
                  <View
                    style={{
                      width: "40%",
                      height: 35,
                      justifyContent: "center",
                      backgroundColor: theme.colors.primary,
                      alignItems: "center",
                      borderRadius:15
                    }}
                  >
                    <Text>{val.quantity}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default Cart;
