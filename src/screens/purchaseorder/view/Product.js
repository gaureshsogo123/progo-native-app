import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme, Text, TextInput } from "react-native-paper";

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
    textAlign: "center",
    paddingHorizontal: 1,
    paddingBottom: 1,
  },
});
function Product({ item, updateQuantity }) {
  const theme = useTheme();
  return (
    <View
      style={{
        ...styles.product,
        borderBottomColor: theme.colors.primary,
      }}
    >
      <View style={{ width: "70%" }}>
        <Text variant="titleMedium"> {item.productname}</Text>
        <Text style={styles.price} variant="titleSmall">
          Price: {`\u20B9`} {parseFloat(item.price).toFixed(2)}{" "}
        </Text>
        <Text variant="titleSmall">
          Amount: {`\u20B9`}{" "}
          {parseFloat((item.price - item.discount) * item.quantity).toFixed(2)}{" "}
        </Text>
      </View>
      <View style={styles.unitSection}>
        <TextInput
          keyboardType="number-pad"
          style={styles.unitInput}
          variant="flat"
          value={item.quantity === 0 ? "" : item.quantity + ""}
          onChangeText={(text) => {
            if (text.includes("-")) return;
            if (
              text == "" ||
              (Number.isInteger(parseInt(text)) && parseInt(text) > 0)
            )
              updateQuantity(text, item.productid);
            else return;
          }}
        />
        <Text variant="labelLarge"> units</Text>
      </View>
    </View>
  );
}

export default Product;
