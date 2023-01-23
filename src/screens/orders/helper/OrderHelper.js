import { format } from "date-fns";
import axiosInstance from "../../../axiosInstance";

export const getOrders = async (userId, fdate, tdate, status) => {
  const fromDate = format(fdate, "MM-dd-yyyy");
  const toDate = format(tdate, "MM-dd-yyyy");
  return axiosInstance
    .post("/order/retailerOrders", {
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


export const getOrderDetail = (distributor_id, order_id) => {
  return axiosInstance
    .get(`order/${distributor_id}/${order_id}`)
    .then((res) => {
      return { error: false, data: res.data.data };
    })
    .catch((err) => {
      toast.error(err.message);
      return { error: err.message };
    });
};

