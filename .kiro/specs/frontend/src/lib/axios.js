import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : import.meta.env.VITE_API_URL || "https://streamify-vbs2.onrender.com/api"; 
    // 👆 fallback agar VITE_API_URL set nahi h

export const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});
