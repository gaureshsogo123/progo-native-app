import axiosInstance from "../../../axiosInstance";

export const getOrderDetails = async (distributorId, orderId) => {
  try {
    const { data } = await axiosInstance.get(
      `/order/${distributorId}/${orderId}`
    );
    return { data: data.data };
  } catch (error) {
    return { error: error.message };
  }
};

export const editOrder = async (
  userId,
  totalItems,
  orderTotal,
  paymentMethod,
  subTotal,
  products,
  discount,
  orderId,
  distributorId
) => {
  return axiosInstance
    .put("/order/editOrderRetailer", {
      retailerId: userId,
      totalItems,
      orderTotal,
      paymentMethod,
      subTotal,
      products,
      discount,
      orderId,
      distributorId,
    })
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      return { error: err.response?.data?.message || err.message };
    });
};
