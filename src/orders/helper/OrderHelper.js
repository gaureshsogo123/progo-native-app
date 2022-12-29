import axiosInstance from "../../axiosInstance"

export const getOrders = async (userId,fromdate,todate,status)=>{
    return axiosInstance
       .post("/order/retailerOrders",{
        user_id : userId,
        fromDate: fromdate,
        toDate: todate,
        status: status,  
       })
       .then((res) => {
        return { data: res.data.data };
      })
      .catch((err) => {
        return { message: err.message };
      });
}


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
    .put("/order/editOrderStatus", { orderId, orderStatusId, orderStatus })
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      Alert.alert("", "There was an error");
      return { message: err.message };
    });
};

