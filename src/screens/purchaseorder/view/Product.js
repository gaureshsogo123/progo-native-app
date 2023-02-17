import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";

const styles = StyleSheet.create({
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
    height: 40,
    textAlign: "center",
    paddingHorizontal: 1,
    paddingBottom: 1,
    backgroundColor: "#fde3d5",
  },
});

function Product({ item, updateQuantity, cartItems }) {
  const productQuantity =
    cartItems?.find((product) => product.productid === item.productid)
      ?.quantity || 0;
  return (
    <View
      style={{
        ...styles.product,
        borderBottomColor: "silver",
        paddingBottom: "3%",
        backgroundColor: "#fafafa",
      }}
    >
      <View style={{ width: "70%" }}>
        <Text variant="titleMedium">{item.productname}</Text>
        <Text style={styles.price} variant="titleSmall">
          Price: {`\u20B9`} {Number(item.price).toFixed(2)}{" "}
        </Text>
        <Text variant="titleSmall">
          Amount: {`\u20B9`}{" "}
          {Number((item.price - item.discount) * productQuantity).toFixed(2)}{" "}
        </Text>
      </View>
      <View style={styles.unitSection}>
        <TextInput
          keyboardType="number-pad"
          style={styles.unitInput}
          variant="flat"
          value={productQuantity === 0 ? "" : productQuantity + ""}
          onChangeText={(text) => {
            if (text.includes("-")) return;
            if (
              text == "" ||
              (Number.isInteger(parseInt(text)) && parseInt(text) > 0)
            )
              updateQuantity(text, item);
            else return;
          }}
        />
        <Text variant="labelLarge"> units</Text>
      </View>
    </View>
  );
}

export default Product;
