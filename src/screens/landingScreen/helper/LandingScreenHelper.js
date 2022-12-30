import axiosInstance from "../../../axiosInstance";


export const getDistributors = async (retailerId) => {
    return axiosInstance
      .get(`/retailer/distributors/${retailerId}`)
      .then((res) => {
        return { message: res.data.message, data: res.data.data };
      })
      .catch((err) => {
        return { error: err.message, data: {} };
      });
  };
