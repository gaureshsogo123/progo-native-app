import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useAuthContext } from "../../../context/UserAuthContext";
import { getDistributors } from "../helper/LandingScreenHelper";
import { Text } from "react-native-paper";
import { useCartContext } from "../../../context/CartContext";
import { useNavigation } from "@react-navigation/native";
import { useSearchContext } from "../../../context/SearchContext";

const { height } = Dimensions.get("screen");
const { width } = Dimensions.get("screen");

export default function LandingScreen({ navigation }) {
  const { user, routeName } = useAuthContext();
  const [distributors, setDistributors] = useState([]);
  const { cartItems, setCartItems } = useCartContext();
  const { search, setSearch } = useSearchContext();
  const navi = useNavigation();

  useEffect(() => {
    getDistributors(user.userId)
      .then((res) => {
        if (!res.error) {
          setDistributors(res.data);
        }
      })
      .catch((err) => {
        //
      });
  }, [user.userId]);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      setCartItems([]);
    });
    return unsubscribeFocus;
  }, [cartItems]);

  useEffect(() => {
    let unsubscribeFocus = () => {};
    if (routeName == "UpdateOrder") {
      unsubscribeFocus = navigation.addListener("focus", () => {
        navi.reset({
          index: 1,
          routes: [{ name: "Orders" }],
        });
      });
    }
    return unsubscribeFocus;
  }, [navigation]);

  useEffect(() => {
    let unsubscribeFocus = navigation.addListener("focus", () => {
      setSearch("");
    });

    return unsubscribeFocus;
  }, [navigation]);

  useEffect(() => {
    let unsubscribeFocus = () => {};
    if (routeName == "UpdateOrder") {
      unsubscribeFocus = navigation.addListener("focus", () => {
        navi.reset({
          index: 0,
          routes: [{ name: "Orders" }],
        });
      });
    }
    return unsubscribeFocus;
  }, [navigation, routeName]);

  const filterDistributor = useMemo(() => {
    return (
      distributors &&
      distributors.filter(
        (item) =>
          search === "" ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.mobileno?.includes(search)
      )
    );
  }, [search, distributors]);

  const handlePress = (item) => {
    navigation.navigate(`purchaseorder`, {
      distributorName: item.name,
      distributorId: item.userid,
    });
    setSearch("");
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.pagecontainer}>
          {/*
          <Text
            style={{
              fontWeight: "600",
              fontSize: 18,
              paddingBottom: "2%",
              marginLeft: "2%",
            }}
          >
            {user.userName}
          </Text>*/}
          {/*
          <TextInput
            style={styles.input}
            mode="outlined"
            theme={{ roundness: 10 }}
            placeholder="Search Brand"
            value={filterText}
            onChangeText={(text) => setFilterText(text)}
            keyboardType={"name-phone-pad"}
          />*/}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          flexWrap: "wrap",
          padding: 10,
        }}
        keyboardShouldPersistTaps={"handled"}
      >
        {filterDistributor.map((val, i) => {
          return (
            <TouchableOpacity
              key={i}
              style={styles.card}
              onPress={() => handlePress(val)}
            >
              <Image
                source={{
                  uri:
                    val.image ||
                    "https://cdn-icons-png.flaticon.com/512/5486/5486254.png",
                }}
                style={{
                  width: (width * 17) / 100,
                  height: (height * 8) / 100,
                }}
              />
              <Text
                adjustsFontSizeToFit={true}
                style={{
                  fontSize: (height * 1.5) / 100,
                  marginTop: "5%",
                  fontWeight: "600",
                }}
                variant="titleMedium"
              >
                {val.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  card: {
    width: "45%",
    height: "auto",
    justifyContent: "center",
    backgroundColor: "#FDFEFF",
    alignItems: "center",
    marginBottom: "4%",
    borderRadius: 20,
    paddingTop: "3%",
    paddingBottom: "3%",
    paddingLeft: "1%",
    paddingRight: "1%",
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
