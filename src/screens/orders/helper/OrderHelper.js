import { endOfDay, format, startOfDay } from "date-fns";
import axiosInstance from "../../../axiosInstance";

export const getOrders = async (userId, fdate, tdate, status) => {
  const fromDate = startOfDay(new Date(fdate));
  const toDate = endOfDay(new Date(tdate));
  return axiosInstance
    .post("/order/retailerOrders_v2", {
      user_id: userId,
      fromDate,
      toDate,
      status: status,
    })
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      return { message: err.message };
    });
};

export const getOrderStatus = async () => {
  return axiosInstance
    .get("/order/orderStatus")
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      Alert.alert("", "There was an error");
      return { message: err.message };
    });
};

export const editOrderStatus = async (orderId, orderStatusId, orderStatus) => {
  return axiosInstance
    .put("/order/editRetailerOrderStatus", {
      orderId,
      orderStatusId,
      orderStatus,
    })
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      return { error: err?.response?.data?.message || err.message };
    });
};

export const getOrderDetailsRetailer = async (orderId, retailerId) => {
  return axiosInstance
    .post("order/retailerOrderDetails", {
      orderId,
      retailerId,
    })
    .then((res) => {
      return { error: false, data: res.data.data };
    })
    .catch((err) => {
      return { error: err.message };
    });
};
