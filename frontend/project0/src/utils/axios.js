// utils/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // your backend URL
  withCredentials: true, // allows sending/receiving cookies
});

export default api;
//
