import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Alert,
} from "react-native";
import {
  Text,
  TextInput,
  useTheme,
  Modal,
  Portal,
  Provider,
} from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { format, subDays } from "date-fns";
import {
  editOrderStatus,
  getOrders,
  getOrderStatus,
} from "../helper/OrderHelper";
import { useAuthContext } from "../../../context/UserAuthContext";
import OrderFilters from "./OrderFilters";

const { height } = Dimensions.get("screen");
const { width } = Dimensions.get("screen");

const statusContainerStyle = {
  backgroundColor: "#eeeeee",
  width: "90%",
  marginLeft: "6%",
  display: "flex",
  justifyContent: "center",
};

const cancelStatusContainer = {
  backgroundColor: "#fafafa",
  width: "90%",
  marginLeft: "6%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "8%",
};

export default function Orders({ navigation }) {
  const { user } = useAuthContext();
  const theme = useTheme();

  const [status, setStatus] = useState("Placed");
  const [startDate, setStartDate] = useState(subDays(new Date(), 2));
  const [endDate, setEndDate] = useState(new Date());
  const [shown, setShown] = useState(false);
  const [orders, setOrders] = useState([]);
  const [editStatusdata, setEditStatusdata] = useState({});
  const [statuslist, setStatuslist] = useState([]);
  const [see, setSee] = useState(false);
  const [errors, setErrors] = useState({});
  const [refreshing, setRefreshing] = useState(true);
  const [textinput, setTextinput] = useState("");
  const [current, setCurrent] = useState(false);

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

  const updateStatus = (orderid, orderstatus) => {
    setEditStatusdata({
      ...editStatusdata,
      orderid: orderid,
      status: orderstatus,
    });
    setCurrent(true);
  };

  useEffect(() => {
    async function fetchstatus() {
      const res = await getOrderStatus();
      setStatuslist(res.data);
    }
    fetchstatus();
  }, []);

  const filterstatus = statuslist.filter((val) => {
    return val.orderstatus === "Cancelled";
  });

  const handlepress = (item) => {
    navigation.navigate("UpdateOrder", {
      order: item,
    });
  };

  const filterorders = useMemo(
    () =>
      orders?.filter((val) => {
        if (val.distributorname === "") {
          return val;
        }
        return val.distributorname.toLowerCase().includes(textinput);
      }),
    [orders, textinput]
  );

  const statusModalPress = async () => {
    const statusId = filterstatus.find((status) => {
      return status.orderstatus;
    });
    console.log("sttusId", statusId);
    try {
      const res = await editOrderStatus(
        editStatusdata.orderid,
        statusId.orderstatusid,
        "Cancelled"
      );
      if (!res.error) {
        fetchOrders();
        Alert.alert(
          "Success",
          `Your order with ID ${editStatusdata.orderid} has been cancelled.`
        );
      } else {
        Alert.alert("Error", "There was an error");
      }
    } catch (error) {
      Alert.alert("Error", "There was an error");
    } finally {
      setCurrent(false);
    }
  };

  const orderKeyExtractor = (order) => order.orderid;

  const renderOrder = useCallback(({ item }) => {
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
        <Text>
          Order Date : {format(new Date(item.orderdate), "dd-MM-yyyy")}
        </Text>

        <View style={styles.rightitems}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <TouchableOpacity
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
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: (height * 1) / 100,
                paddingLeft: (width * 1) / 100,
              }}
              onPress={() => updateStatus(item.orderid, item.orderstatus)}
            >
              <Text>
                <AntDesign name="delete" size={18} color="#424242" />
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
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.pagecontainer}>
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
              onChangeText={(val) => setTextinput(val.toLocaleLowerCase())}
            />

            <View style={styles.filtericon}>
              <TouchableOpacity onPress={() => setShown(true)}>
                <AntDesign
                  name="filter"
                  size={25}
                  color={theme.colors.primary}
                  style={{ marginLeft: (width * 1) / 100 }}
                />
                <Text style={{ fontSize: 12, color: theme.colors.primary }}>
                  Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              width: "100%",
              borderBottomWidth: 1,
              marginTop: 10,
              borderColor: "silver",
            }}
          ></View>
        </View>
      </View>

      <>
        <FlatList
          data={filterorders}
          keyExtractor={orderKeyExtractor}
          renderItem={renderOrder}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchOrders} />
          }
        />
      </>

      <>
        <Provider>
          <Portal>
            <Modal
              visible={see}
              onDismiss={() => setSee(false)}
              contentContainerStyle={statusContainerStyle}
            >
              <View style={{ marginLeft: (width * 2) / 100 }}>
                {statuslist.map((val, i) => {
                  return (
                    <TouchableOpacity
                      key={i}
                      style={{
                        paddingTop: (height * 2) / 100,
                        paddingBottom: (height * 2) / 100,
                      }}
                      //onPress={() => statusModalPress(val.orderstatus)}
                    >
                      <Text style={{ fontWeight: "500" }}>
                        {val.orderstatus}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Modal>
          </Portal>
        </Provider>
      </>

      <>
        <Provider>
          <Portal>
            <Modal
              visible={current}
              onDismiss={() => setCurrent(false)}
              contentContainerStyle={cancelStatusContainer}
            >
              <View>
                <Text>Do You Want to Cancel the Order ?</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: (height * 3) / 100,
                  }}
                >
                  <TouchableOpacity onPress={statusModalPress}>
                    <Text
                      style={{ paddingRight: (width * 12) / 100, color: "red" }}
                    >
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setCurrent(false)}>
                    <Text>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </Portal>
        </Provider>
      </>

      <OrderFilters
        startDate={startDate}
        status={status}
        setShown={setShown}
        statuslist={statuslist}
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
    padding: 10,
  },
  pagecontainer: {
    width: "100%",
  },
  input: {
    width: "88%",
    height: (height * 6) / 100,
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
    padding: 7,
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
