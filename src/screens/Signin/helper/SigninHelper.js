import { Alert } from "react-native";
import axiosInstance from "../../../axiosInstance";

export const signIn = async ({ mobile_no, pin }) => {
  return axiosInstance
    .post("/user/signIn", { mobile_no, pin })
    .then((res) => {
      return { message: res.data.message, data: res.data.data };
    })
    .catch((err) => {
      return { error: err.response?.data?.message || err.message, data: {} };
    });
};

export const signUp = async ({ mobile_no }) => {
  return axiosInstance
    .post("/user/signUp", { mobile_no })
    .then((res) => {
      return { data: res.data.message };
    })
    .catch((err) => {
      if (err.response?.status !== 400) {
        return { error: err.response?.data?.message || "Error", data: {} };
      } else {
        return { error: err.response?.data?.message || "Error", data: {} };
      }
    });
};

export const updatePin = async ({ mobile_no, pin }) => {
  return axiosInstance
    .put("/user/updatePin", { mobile_no, pin })
    .then((res) => {
      return { message: res.data.message, data: {} };
    })
    .catch((err) => {
      return { error: err.response?.data?.message || err.message, data: {} };
    });
};


export const adminAddRetailer = async (
  mobile,
  firstName,
  city
) => {
  return axiosInstance
    .post("/retailer/adminAddRetailer", {
      mobile,
      firstName,
      city
    })
    .then((res) => {
      const data = res.data.data;
      console.log("data",data)
      Alert.alert("Retailer Added");
      return { data: data };
    })
    .catch((err) => {
      return { error: err.message };
    });
};


export const getRetailer = async (
) => {
  return axiosInstance
    .get("/retailer")
    .then((res) => {
      const products = res.data.data;
      return { data: products };
    })
    .catch((err) => {
      return { error: err.message };
    });
};


