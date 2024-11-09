import axios from "../apis/axios";
import { ENDPOINTS } from "../apis/endpoints";
import { ContractDetail } from "../models/ContractDetail";
import { ContractResponse } from "../models/ContractResponse";
import { IContractCreate, IContractResponse } from "../types/contract.types";

export class ContractService {
  static async getAllContractByUsername(
    username: string,
    token: string
  ): Promise<ContractResponse[]> {
    try {
      const response = await axios.get<{ contracts: IContractResponse[] }>(
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

  static async getContractDetails(
    contractNumber: number,
    contractYear: number,
    token: string
  ): Promise<ContractDetail> {
    try {
      const response = await axios.get<{ contract: IContractCreate }>(
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
}
