import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Alert,
  Keyboard,
} from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { subDays } from "date-fns";
import { getOrders, getOrderStatus } from "../helper/OrderHelper";
import { useAuthContext } from "../../../context/UserAuthContext";
import OrderFilters from "./OrderFilters";
import CancelOrderPopup from "./CancelOrderPopup";
import Order from "./Order";
import { useSearchContext } from "../../../context/SearchContext";

const { height } = Dimensions.get("screen");
const { width } = Dimensions.get("screen");

export default function Orders({ navigation }) {
  const { user } = useAuthContext();
  const theme = useTheme();

  const [status, setStatus] = useState("All");
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [statuslist, setStatuslist] = useState([]);
  const [errors, setErrors] = useState({});
  const [refreshing, setRefreshing] = useState(true);
  const [textinput, setTextinput] = useState("");
  const [cancelOrderData, setCancelOrderData] = useState();
  const { search, shown, setShown, setSearch } = useSearchContext();

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", fetchOrders);
    const unsubscribeBlur = navigation.addListener("blur", () => {
      setShown(false);
    });
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [user, startDate, endDate, status]);

  useEffect(() => {
    fetchOrders();
  }, [user.userId, startDate, endDate, status]);

  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      const result = await getOrders(user.userId, startDate, endDate, status);
      if (!result.error) {
        setOrders(result.data);
        setErrors({ ...errors, getOrders: "" });
      } else setErrors({ ...errors, getOrders: "Failed to fetch orders" });
    } catch (error) {
      setErrors({ ...errors, getOrders: "Failed to fetch orders" });
    } finally {
      setRefreshing(false);
    }
  };

  const showCancelPopup = (orderid, orderstatus) => {
    if (orderstatus === "Completed") {
      Alert.alert("Completed", "Completed order cannot be cancelled");
      return;
    }
    setCancelOrderData({
      ...cancelOrderData,
      orderid: orderid,
      status: orderstatus,
    });
  };

  useEffect(() => {
    async function fetchstatus() {
      const res = await getOrderStatus();
      setStatuslist(res.data);
    }
    fetchstatus();
  }, []);

  const handlepress = (item) => {
    navigation.navigate("Order Details", {
      order: item,
    });
    setSearch("");
  };

  const filterorders = useMemo(() => {
    return orders?.filter(
      (order) =>
        search === "" ||
        order.distributorname.toLowerCase().includes(search.toLowerCase()) ||
        order.mobileno?.includes(search)
    );
  }, [orders, search]);

  useEffect(() => {
    let unsubscribeFocus = navigation.addListener("focus", () => {
      setSearch("");
    });

    return unsubscribeFocus;
  }, [navigation]);

  const filterHandlePress = () => {
    setShown(true);
    Keyboard.dismiss();
  };

  const orderKeyExtractor = (order) => order.orderid;

  const renderOrder = useCallback(({ item }) => {
    return (
      <Order
        item={item}
        handlepress={handlepress}
        showCancelPopup={showCancelPopup}
      />
    );
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.pagecontainer}>
          {/*
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TextInput
              mode="outlined"
              theme={{ roundness: 10 }}
              style={styles.input}
              placeholder="Search Suppliers"
              value={textinput}
              onChangeText={(val) => setTextinput(val)}
            />

            <View style={styles.filtericon}>
              <TouchableOpacity onPress={filterHandlePress}>
                <AntDesign
                  name="filter"
                  size={25}
                  color={theme.colors.primary}
                  style={{ alignSelf: "center" }}
                />
                <Text
                  style={{
                    fontSize: (height * 1.3) / 100,
                    color: theme.colors.primary,
                  }}
                >
                  Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>*/}
        </View>
      </View>

      <FlatList
        data={filterorders}
        keyboardShouldPersistTaps={"handled"}
        keyExtractor={orderKeyExtractor}
        renderItem={renderOrder}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchOrders} />
        }
      />
      <CancelOrderPopup
        shown={cancelOrderData?.orderid}
        setCancelOrderData={setCancelOrderData}
        onSuccess={fetchOrders}
        order={cancelOrderData}
        statusList={statuslist}
      />
      <OrderFilters
        startDate={startDate}
        status={status}
        setShown={setShown}
        endDate={endDate}
        shown={shown}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setStatus={setStatus}
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
  },
  input: {
    width: "88%",
    marginBottom: (height * 1.5) / 100,
    borderRadius: 5,
  },
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
  filtericon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  locationcontainer: {
    display: "flex",
    flexDirection: "row",
    padding: "3%",
    width: "100%",
    justifyContent: "space-between",
    paddingTop: (height * 2) / 100,
    paddingBottom: (height * 2) / 100,
  },
  cancell: {
    position: "absolute",
    right: 0,
  },
});
