import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { format } from "date-fns";

import React from "react";

const { height, width } = Dimensions.get("screen");

function Order({ item, showCancelPopup, handlepress }) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={styles.listcontainer}
      onPress={() => handlepress(item)}
    >
      <Text
        variant="titleMedium"
        style={{
          marginBottom: 5,
          paddingBottom: 3,
          width: "60%",
        }}
      >
        {item.distributorname}
      </Text>
      <Text style={{ marginBottom: 5 }}>Order ID: {item.orderid}</Text>
      <Text>Order Date : {format(new Date(item.orderdate), "dd-MM-yyyy")}</Text>

      <View style={styles.rightitems}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View
            style={{
              textAlignVertical: "center",
              padding: 5,
              borderRadius: 5,
              backgroundColor: theme.colors.secondaryContainer,
            }}
          >
            <Text
              style={{
                padding: 5,
                color: "#424242",
                fontWeight: "400",
              }}
            >
              Status: {item.orderstatus}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              marginTop: (height * 1) / 100,
              paddingLeft: (width * 1) / 100,
            }}
            onPress={() => showCancelPopup(item.orderid, item.orderstatus)}
          >
            <Text>
              <AntDesign name="delete" size={20} color="#424242" />
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          variant="titleSmall"
          style={{
            paddingTop: 10,
            textAlign: "right",
          }}
        >
          Amt: {`\u20B9`} {Number(item.totalamount).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default Order;

const styles = StyleSheet.create({
  listcontainer: {
    width: "95%",
    minHeight: (height * 15) / 100,
    backgroundColor: "#fafafa",
    borderRadius: 12,
    marginLeft: "3%",
    padding: "2%",
    marginBottom: (height * 1.8) / 100,
    position: "relative",
    paddingTop: (height * 2) / 100,
    marginTop: (height * 1.8) / 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  rightitems: {
    position: "absolute",
    right: (width * 2) / 100,
    paddingVertical: 15,
  },
});
