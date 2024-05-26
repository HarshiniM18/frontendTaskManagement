import axios from "axios";

const api = axios.create({
  baseURL: "https://backendtaskmanagement.onrender.com/api",
  // baseURL: "http://localhost:1805/api",
});
export default api;
