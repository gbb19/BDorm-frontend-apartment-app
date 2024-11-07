import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../models/User"; // import User class
import { IUserResponse } from "../types/user.types";

interface AuthContextType {
  user: User | null; // เก็บข้อมูลผู้ใช้
  isLoggedIn: boolean;
  isLoading: boolean; // เพิ่ม isLoading สำหรับสถานะการโหลด
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: User) => void; // เพิ่มฟังก์ชัน setUser
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null); // เก็บข้อมูลผู้ใช้
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // สถานะการโหลด

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        if (userToken) {
          const userRole = await AsyncStorage.getItem("userRole");
          const userName = await AsyncStorage.getItem("username");
          const firstName = await AsyncStorage.getItem("firstName");
          const lastName = await AsyncStorage.getItem("lastName");

          // สร้าง user object จากข้อมูลที่เก็บ
          const userData: IUserResponse = {
            username: userName!,
            first_name: firstName!,
            last_name: lastName!,
            roles: userRole ? [userRole] : [],
            token: userToken,
          };

          setUser(new User(userData)); // ตั้งค่าผู้ใช้
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false); // เมื่อโหลดเสร็จแล้วให้ตั้งค่าเป็น false
      }
    };

    checkLoginStatus();
  }, []);

  async function logout() {
    // เคลียร์ข้อมูลจาก AsyncStorage
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userRole");
    await AsyncStorage.removeItem("username");
    await AsyncStorage.removeItem("firstName");
    await AsyncStorage.removeItem("lastName");

    // รีเซ็ตสถานะ
    setIsLoggedIn(false);
    setUser(null); // เคลียร์ข้อมูลผู้ใช้
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, isLoading, setIsLoggedIn, setUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
