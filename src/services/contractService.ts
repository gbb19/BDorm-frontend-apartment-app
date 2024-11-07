import axios from "../apis/axios";
import { ENDPOINTS } from "../apis/endpoints";
import { useAuth } from "../context/AuthContext";
import { Contract } from "../models/Contract";

export class ContractService {
  // static async getAllContractByUsername(username: string): Promise<Contract[]> {
  //   try {
  //     const response = await axios.get<Contract[]>(
  //       ENDPOINTS.CONTRACT.GET_CONTRACTS(username),
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     return response.data.map((contract) => Contract.fromResponse(contract)); // การแปลงข้อมูลเป็นแบบที่ต้องการ
  //   } catch (error) {
  //     // จัดการข้อผิดพลาด
  //     throw new Error("Failed to fetch contracts");
  //   }
  static async getAllContractByUsername(username: string,token: string): Promise<number[]> {
    try {
      const response = await axios.get<{ contracts: number[] }>(
        ENDPOINTS.CONTRACT.GET_CONTRACTS(username),

        {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ใน header
          },
          withCredentials: true, // ใช้ถ้าต้องการส่งคุกกี้หรือการตรวจสอบสิทธิ์
        }
      );

      // ถ้าไม่มีสัญญาที่ตรงกับ username ให้คืนค่าอาร์เรย์ว่าง
      if (!response.data.contracts) {
        return [];
      }

      // ส่งกลับหมายเลขห้องสัญญา (contract room numbers) แบบ number[]
      return response.data.contracts;
    } catch (error) {
      // จัดการข้อผิดพลาด
      throw new Error("Failed to fetch contracts");
    }
  }
}
