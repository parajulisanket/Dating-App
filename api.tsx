import axios from "axios";

const apiPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
});
export default apiPublic;
