import axios, { InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// สร้าง axios instance
const axiosInstance = axios.create({
  baseURL: "http://10.0.3.2:25565", 
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// สร้าง named function สำหรับเพิ่ม token ใน headers
async function addAuthToken(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  const token = await AsyncStorage.getItem("token"); 
  if (token) {
    // ตรวจสอบว่า headers ไม่ใช่ undefined
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}

axiosInstance.interceptors.request.use(
  (config) => addAuthToken(config), // เรียกใช้ฟังก์ชันแบบ async
  (error) => Promise.reject(error) // เพิ่มการจัดการข้อผิดพลาด
);

export default axiosInstance;

