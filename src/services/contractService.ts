import axios from "../apis/axios";
import { ENDPOINTS } from "../apis/endpoints";
import { ContractDetail } from "../models/ContractDetail";
import { ContractResponse } from "../models/ContractResponse";
import {
  IContractCreate,
  IContractResponse,
  IContractRoomResponse,
} from "../types/contract.types";

export class ContractService {
  static async getAllContractByUsername(
    username: string,
    token: string
  ): Promise<ContractResponse[]> {
    try {
      const response = await axios.get<{ contracts: IContractRoomResponse[] }>(
        ENDPOINTS.CONTRACT.GET_CONTRACTS(username),
        {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ใน header
          },
          withCredentials: true, // ใช้ถ้าต้องการส่งคุกกี้หรือการตรวจสอบสิทธิ์
        }
      );

      // ถ้าไม่มีข้อมูล contracts ให้คืนค่าเป็นอาร์เรย์ว่าง
      if (!response.data.contracts) {
        return [];
      }

      // แปลง IContractResponse[] เป็น ContractResponse[] ก่อนส่งกลับ
      return response.data.contracts.map((contract) =>
        ContractResponse.fromResponse(contract)
      );
    } catch (error) {
      // จัดการข้อผิดพลาด
      throw new Error("Failed to fetch contracts");
    }
  }
  static async getAllContracts(token: string): Promise<ContractResponse[]> {
    try {
      const response = await axios.get<{ contracts: IContractRoomResponse[] }>(
        ENDPOINTS.CONTRACT.GET_ALL_CONTRACTS, // ใช้ endpoint ที่ได้จาก backend
        {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ใน header
          },
          withCredentials: true, // ใช้ถ้าต้องการส่งคุกกี้หรือการตรวจสอบสิทธิ์
        }
      );

      // ถ้าไม่มีข้อมูล contracts ให้คืนค่าเป็นอาร์เรย์ว่าง
      if (!response.data.contracts) {
        return [];
      }

      // แปลง IContractResponse[] เป็น ContractResponse[] ก่อนส่งกลับ
      return response.data.contracts.map(
        (contract) => ContractResponse.fromResponse(contract) // ใช้ฟังก์ชันสำหรับแปลงข้อมูล
      );
    } catch (error) {
      console.error("Failed to fetch contracts:", error);
      throw new Error("Failed to fetch contracts");
    }
  }

  static async getContractDetails(
    contractNumber: number,
    contractYear: number,
    token: string
  ): Promise<ContractDetail> {
    try {
      const response = await axios.get<{ contract: IContractResponse }>(
        ENDPOINTS.CONTRACT.GET_CONTRACTS_DETAILS(contractNumber, contractYear),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // ตรวจสอบว่ามีข้อมูล contract อยู่ใน response
      if (!response.data || !response.data.contract) {
        throw new Error("No contract details found");
      }

      // แปลงข้อมูลจาก IContractCreate เป็น ContractDetail ก่อนส่งกลับ
      return ContractDetail.fromResponse(response.data.contract);
    } catch (error) {
      throw new Error("Failed to fetch contract details");
    }
  }

  static async createContract(
    contractData: IContractCreate,
    token: string
  ): Promise<any> {
    try {
      const response = await axios.post<any>(
        ENDPOINTS.CONTRACT.POST_CREATE_CONTRACT,
        contractData, // ส่งข้อมูล contract
        {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token สำหรับการตรวจสอบสิทธิ์
          },
        }
      );

      return response.data; // คืนค่าข้อมูลที่ได้รับจาก backend เช่น message หรือข้อมูล contract ที่สร้างสำเร็จ
    } catch (error) {
      // จัดการข้อผิดพลาด
      console.error("Error creating contract:", error);
      throw new Error("Failed to create contract");
    }
  }
}
