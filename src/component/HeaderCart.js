import React from "react";
import { View, Text, TouchableOpacity, Alert, Dimensions } from "react-native";
import { useCartContext } from "../context/CartContext";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";

const { width, height } = Dimensions.get("screen");

function HeaderCart() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { cartItems } = useCartContext();

  const handlePress = () => {
    if (cartItems.length > 0) {
      navigation.navigate("My Orders", {
        screen: "Cart",
      });
    } else {
      Alert.alert("", "Sorry Your Cart is Empty Please Add Some Products...");
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <Text style={{ marginRight: (width * 4) / 100 }}>
          <AntDesign name="shoppingcart" size={25} />
        </Text>

        <View
          style={{
            width: (width * 4.5) / 100,
            borderRadius: 30,
            backgroundColor: theme.colors.primary,
            height: (height * 3) / 100,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            right: (width * 2) / 100,
            top: 0,
          }}
        >
          <Text style={{ color: "white" }}>{cartItems.length}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default HeaderCart;
