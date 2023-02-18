import axios from "axios";
import { SOGO_API } from "./constants/constants";

export default axiosInstance = axios.create({
  baseURL: SOGO_API,
});
