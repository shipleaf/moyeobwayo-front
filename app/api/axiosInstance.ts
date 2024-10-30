import axios from "axios";

const API_URL =
  "http://ec2-15-165-205-24.ap-northeast-2.compute.amazonaws.com:8080/api/v1";
// const API_URL = "http://127.0.0.1:8080/api/v1"

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
