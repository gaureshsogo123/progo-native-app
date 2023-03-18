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

export const adminAddRetailer = async (mobile, firstName, city) => {
  return await axiosInstance
    .post("/retailer/adminAddRetailer", {
      mobile: mobile,
      firstName: firstName,
      city: city,
    })
    .then((res) => {
      const data = res.data.data;
      return { data: data };
    })
    .catch((err) => {
      return { error: err.response?.data?.message || err.message };
    });
};
