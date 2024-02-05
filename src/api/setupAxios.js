import { useAuth } from "../context/AuthContext";
import axios from "axios";

export const setupAxios = (token) => {
  token &&
    axios.interceptors.request.use(
      (config) => {
        if (!config.url.includes("auth")) {
          // const token = localStorage.getItem("token");

          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
};
