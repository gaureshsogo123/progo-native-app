import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { useTheme, Text, TextInput } from "react-native-paper";
import category from "../../../constants/Category";

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
    backgroundColor:"#fde3d5"
  },
});
function Product({ item, updateQuantity }) {
  const theme = useTheme();
  return (
       <View
      style={{
        ...styles.product,
        borderBottomColor: "silver",
        paddingBottom: "3%",
        backgroundColor: "#fafafa",
      }}
    >
      <View style={{width:"70%",display:"flex",flexDirection:'row'}}>
        <Image source={{uri:"http://pluspng.com/img-png/lemon-hd-png-lemon-png-pic-1870.png"}}
        style={{width:60,height:70,alignSelf:'center',marginRight:12,borderRadius:20}}
      />
      <View style={{ width: "70%" }}>
        <Text variant="titleMedium">{item.productname}</Text>
        <Text style={styles.price} variant="titleSmall">
          Price: {`\u20B9`} {Number(item.price).toFixed(2)}{" "}
        </Text>
        <Text variant="titleSmall">
          Amount: {`\u20B9`}{" "}
          {Number((item.price - item.discount) * item.quantity).toFixed(2)}{" "}
        </Text>
      </View>
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
