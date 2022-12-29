import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";

import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useAuthContext } from "../../context/UserAuthContext";
import { getDistributors } from "../helper/LandingScreenHelper";

const { height } = Dimensions.get("screen");

export default function LandingScreen({ navigation }) {
  const { user } = useAuthContext();

  const [distributors, setDistributors] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    getDistributors(user.userId).then((res) => {
      if (!res.error) {
        setDistributors(res.data);
      }
    });
  });

  const filterDistributor = distributors.filter((item) => {
    if (item.name === "") {
      return item;
    }
    return item.name.toLowerCase().includes(filterText);
  });

  const handlePress = (item) => {
    navigation.navigate(`purchaseorder`, {
      retailerName: item.name,
      retailerId: item.id,
    });
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.pagecontainer}>
          <Text
            style={{
              fontWeight: "600",
              fontSize: 18,
              paddingBottom: "2%",
              marginLeft: "2%",
            }}
          >
            {user.userName}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Search Supplier"
            value={filterText}
            onChangeText={(text) => setFilterText(text.toLocaleLowerCase())}
          />
        </View>
      </View>

      <FlatList
        data={filterDistributor}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <View style={styles.list}>
                <Text style={{ fontSize: 15, fontWeight: "400" }}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  pagecontainer: {
    width: "100%",
    padding: 10,
  },
  input: {
    width: "100%",
    height: (height * 6) / 100,
    borderRadius: 5,
  },
  list: {
    width: "95%",
    height: "auto",
    padding: 20,
    borderRadius: 15,
    marginBottom: "3%",
    marginLeft: "3%",
    backgroundColor: "#fafafa",
    marginTop: "2%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});
