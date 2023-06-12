import React from "react";
import { Modal, Portal, Provider, Text } from "react-native-paper";
import { View, TouchableOpacity, Dimensions, Alert } from "react-native";
import { editOrderStatus } from "../helper/OrderHelper";

const { height, width } = Dimensions.get("screen");

const cancelStatusContainer = {
  backgroundColor: "#fafafa",
  width: "90%",
  marginLeft: "6%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "8%",
};

function CancelOrderPopup({
  shown,
  statusList,
  setCancelOrderData,
  onSuccess,
  order,
}) {
  const handleCancelOrder = async () => {
    if (!order) return;
    const statusId = statusList.find(
      (status) => status.orderstatus === "Cancelled"
    );
    try {
      const res = await editOrderStatus(
        order.orderid,
        statusId.orderstatusid,
        "Cancelled"
      );
      if (!res.error) {
        onSuccess();
        Alert.alert(
          "Success",
          `Your order with ID ${order.orderid} has been cancelled.`
        );
      } else {
        Alert.alert("Error", "There was an error");
      }
    } catch (error) {
      Alert.alert("Error", "There was an error");
    } finally {
      setCancelOrderData();
    }
  };

  return (
    <Provider>
      <Portal>
        <Modal
          visible={shown}
          onDismiss={() => setCancelOrderData(false)}
          contentContainerStyle={cancelStatusContainer}
        >
          <View>
            <Text style={{ color: "black" }}>
              Do You Want to Cancel the Order ?
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: (height * 3) / 100,
              }}
            >
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
                onPress={handleCancelOrder}
              >
                <Text
                  variant="titleSmall"
                  style={{
                    textAlign: "center",
                    marginRight: (width * 12) / 100,
                    color: "red",
                    fontSize: (height * 1.9) / 100,
                  }}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCancelOrderData()}>
                <Text variant="titleSmall" style={{ color: "black" }}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
}

export default CancelOrderPopup;
