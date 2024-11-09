import axios from "../apis/axios";
import { ENDPOINTS } from "../apis/endpoints";
import { Tenant } from "../models/Tenant";
import { User } from "../models/User";
import { ITenantResponse } from "../types/tenant.tpyes";
import { IUserCreate, IUserLogin, IUserResponse } from "../types/user.types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export class UserService {
  static async login(user: IUserLogin): Promise<User> {
    try {
      const response = await axios.post(
        ENDPOINTS.USER.LOGIN(),
        {
          username: user.username,
          password: user.password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data && response.data.user) {
        const userData = response.data.user;
        const roles = userData.role ? userData.role : [];
        const userObject = User.fromResponse(userData);

        // เก็บข้อมูลผู้ใช้ใน AsyncStorage
        await AsyncStorage.setItem("userToken", userData.token);
        await AsyncStorage.setItem("userRole", JSON.stringify(roles));
        await AsyncStorage.setItem("username", userData.username);
        await AsyncStorage.setItem("firstName", userData.first_name);
        await AsyncStorage.setItem("lastName", userData.last_name);

        return userObject;
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      throw new Error("Failed to login");
    }
  }
  static async register(user: IUserCreate): Promise<any> {
    try {
      await axios.post(ENDPOINTS.USER.REGISTER(), user);
    } catch (error: any) {
      // Include original error message if available for better error tracking
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to register";
      throw new Error(errorMessage);
    }
  }
  static async getAllTenants(token: string): Promise<Tenant[]> {
    try {
      const response = await axios.get<{ tenants: ITenantResponse[] }>(
        ENDPOINTS.USER.GET_ALL_TENANTS,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (!response.data.tenants) {
        return [];
      }

      return response.data.tenants.map((tenant) => Tenant.fromResponse(tenant));
    } catch (error) {
      throw new Error("Failed to fetch tenants");
    }
  }
}
