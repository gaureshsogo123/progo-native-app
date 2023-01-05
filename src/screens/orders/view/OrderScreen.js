import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from "react-native";
import {
  TextInput,
  useTheme,
  Modal,
  Portal,
  Provider,
  Button,
} from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import DropdownSelect from "../../../component/DropdownSelect";
import DatePicker from "../../../component/DatePicker";
import { format, subDays } from "date-fns";
import {
  editOrderStatus,
  getOrders,
  getOrderStatus,
} from "../helper/OrderHelper";
import { useAuthContext } from "../../../context/UserAuthContext";

const { height } = Dimensions.get("screen");
const { width } = Dimensions.get("screen");

const containerStyle = {
  backgroundColor: "#eeeeee",
  width: "100%",
  minHeight: (height * 30) / 100,
  position: "absolute",
  bottom: 0,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
};

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

const statuses = [
  { key: 1, value: "Placed" },
  { key: 2, value: "Accepted" },
  { key: 3, value: "In-Process" },
  { key: 4, value: "Completed" },
  { key: 0, value: "All" },
];

export default function Orders({ navigation }) {
  const { user } = useAuthContext();
  const theme = useTheme();

  const [status, setStatus] = useState("All");
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

  const seeResult = () => {
    setShown(false);
  };

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
      console.log("Statuslist",res.data)
      setStatuslist(res.data);
    }
    fetchstatus();
  }, []);

  const filterstatus = statuslist.filter((val)=>{
    return val.orderstatus === "Cancelled"
  })

  


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
    const statusId = filterstatus.find((status)=>{
      return status.orderstatus
    })
    
    try {
      await editOrderStatus(editStatusdata.orderid,statusId.orderstatusid,"Cancelled" ).then(
        () => fetchOrders(user, startDate, endDate, status)
      );
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
          style={{
            fontWeight: "400",
            paddingBottom: (height * 1.5) / 100,
            fontSize: (height * 1.8) / 100,
            width: (width * 50) / 100,
          }}
        >
          {item.distributorname}
        </Text>
        <Text style={{ fontWeight: "400", color: "#757575" }}>
          Order Date : {format(new Date(item.orderdate), "dd-MM-yyyy")}
        </Text>

        <View style={styles.rightitems}>
          <Text
            style={{
              paddingTop: (height * 3) / 100,
              paddingBottom: (height * 1) / 100,
              color: "#757575",
              textAlign: "right",
            }}
          >
            Amt : {`\u20B9`} {parseFloat(item.totalamount).toFixed(2)}
          </Text>
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
              onPress={()=>updateStatus(item.orderid,item.orderstatus)}
            >
              <Text>
                <AntDesign name="delete" size={18} color="#424242" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.pagecontainer}>
          <TextInput
            style={styles.input}
            placeholder="Search Suppliers"
            value={textinput}
            onChangeText={(val) => setTextinput(val.toLocaleLowerCase())}
          />

          <View style={styles.filtericon}>
            <TouchableOpacity onPress={() => setShown(true)}>
              <AntDesign name="filter" size={22} color="#6a1b9a" style={{marginLeft:width*1/100}}/>
              <Text style={{ fontSize: 10, color: "#6a1b9a" }}>Filters</Text>
            </TouchableOpacity>
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
                  <TouchableOpacity onPress={()=>setCurrent(false)}>
                    <Text>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </Portal>
        </Provider>
      </>

      <>
        <Provider>
          <Portal>
            <Modal
              visible={shown}
              onDismiss={() => setShown(false)}
              contentContainerStyle={containerStyle}
            >
              <View style={styles.datecontainer}>
                <Text
                  variant="titleMedium"
                  style={{ textAlignVertical: "center" }}
                >
                  From :{" "}
                </Text>
                <DatePicker
                  date={startDate}
                  setDate={setStartDate}
                  text={"From"}
                  showFlag={true}
                />
                <Text
                  variant="titleMedium"
                  style={{ textAlignVertical: "center" }}
                >
                  To :{" "}
                </Text>
                <DatePicker
                  date={endDate}
                  setDate={setEndDate}
                  text={"To"}
                  showFlag={true}
                />
              </View>

              <View style={styles.locationcontainer}>
                <Text
                  variant="titleMedium"
                  style={{ textAlignVertical: "center" }}
                >
                  Status :
                </Text>
                <View>
                  <DropdownSelect
                    options={statuses}
                    setValue={setStatus}
                    placeholder={status}
                  />
                </View>
              </View>

              <Button
                mode="contained"
                style={{
                  borderRadius: 3,
                  width: "95%",
                  marginLeft: "3%",
                  marginTop: "5%",
                  marginBottom: "2%",
                }}
                onPress={seeResult}
              >
                View Result
              </Button>
            </Modal>
          </Portal>
        </Provider>
      </>
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
  },
  filtericon: {
    position: "absolute",
    right: 0,
    width: "10%",
    top: (height * 1) / 100,
  },
  datecontainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "3%",
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
