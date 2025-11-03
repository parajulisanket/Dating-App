import axios from "axios";

const apiPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  //   baseURL: "http://192.168.1.14:8000/",
});
export default apiPublic;
