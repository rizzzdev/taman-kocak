import axios from "axios";

export const axiosIns = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
