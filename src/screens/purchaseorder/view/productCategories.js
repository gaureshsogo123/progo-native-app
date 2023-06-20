import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import useDistributorProductCategories from "../../../hooks/useDistributorProductCategories";

const { height, width } = Dimensions.get("screen");

function ProductCategories({ categoryId, setCategoryId, distributorId }) {
  const theme = useTheme();
  const { productCategories } = useDistributorProductCategories(distributorId);
  return (
    <View
      style={{
        backgroundColor: "white",
        height: "auto",
        marginBottom: 3,
        marginTop: 0,
        justifyContent: "center",
      }}
    >
      <ScrollView horizontal={true} contentContainerStyle={{ padding: 10 }}>
        {productCategories.map((val, i) => {
          return (
            <TouchableOpacity
              style={{
                marginRight: 20,
                justifyContent: "center",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "gray",
                backgroundColor:
                  categoryId == val.categoryid ? theme.colors.secondary : null,
              }}
              key={i}
              onPress={() => setCategoryId(val.categoryid)}
            >
              {/*
              <Image
                source={{
                  uri: val.image || DEFAULT_PRODUCT_CATEGORY_IMAGE,
                }}
                style={{
                  width: (width * 14) / 100,
                  height: (height * 6) / 100,
                  marginBottom: 5,
                  alignSelf: "center",
                }}
              />*/}
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: (height * 1.5) / 100,
                  color: "black",
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
  );
}

export default ProductCategories;
