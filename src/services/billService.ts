import axios from "../apis/axios";
import { ENDPOINTS } from "../apis/endpoints";
import { Bill } from "../models/Bill";
import { BillItem } from "../models/BillItem";
import { Transaction } from "../models/Transaction";
import { IBillResponse } from "../types/bill.types";
import { IBillItemResponse } from "../types/billItem.types";
import {
  ITransactionCreate,
  ITransactionResponse,
} from "../types/transaction.types";

export class BillService {
  static async getBillsByUsername(
    username: string,
    token: string
  ): Promise<Bill[]> {
    try {
      const response = await axios.get<{ bills: IBillResponse[] }>(
        ENDPOINTS.BILL.GET_BILLS_BY_USERNAME(username),
        {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ใน header
          },
          withCredentials: true, // ใช้ถ้าต้องการส่งคุกกี้หรือการตรวจสอบสิทธิ์
        }
      );

      // ถ้าไม่มีข้อมูล bills ให้คืนค่าเป็นอาร์เรย์ว่าง
      if (!response.data.bills) {
        return [];
      }

      // แปลง IBillResponse[] เป็น BillResponse[] ก่อนส่งกลับ
      return response.data.bills.map((bill) => Bill.fromResponse(bill));
    } catch (error) {
      // จัดการข้อผิดพลาด
      throw new Error("Failed to fetch bills");
    }
  }

  static async getBillItemsByBillID(
    billID: number,
    token: string
  ): Promise<BillItem[]> {
    try {
      const response = await axios.get<{
        bill_items: IBillItemResponse[] | null;
      }>(ENDPOINTS.BILL.GET_BILL_ITEMS_BY_BILL_ID(billID), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (!response.data.bill_items || response.data.bill_items.length === 0) {
        return [];
      }

      return response.data.bill_items.map((item) =>
        BillItem.fromResponse(item)
      );
    } catch (error) {
      console.error("Error fetching bill items:", error);
      throw new Error("Failed to fetch bill items");
    }
  }

  static async getTransactionsByBillID(
    billID: number,
    token: string
  ): Promise<Transaction[]> {
    try {
      const response = await axios.get<{
        transactions: ITransactionResponse[];
      }>(ENDPOINTS.BILL.GET_TRANSACTIONS_BY_BILL_ID(billID), {
        headers: {
          Authorization: `Bearer ${token}`, // ส่ง token ใน header
        },
        withCredentials: true, // ใช้ถ้าต้องการส่งคุกกี้หรือการตรวจสอบสิทธิ์
      });

      // ถ้าไม่มีข้อมูล transactions ให้คืนค่าเป็นอาร์เรย์ว่าง
      if (!response.data.transactions) {
        return [];
      }

      // แปลง ITransactionResponse[] เป็น Transaction[] ก่อนส่งกลับ
      return response.data.transactions.map((transaction) =>
        Transaction.fromResponse(transaction)
      );
    } catch (error) {
      // จัดการข้อผิดพลาด
      throw new Error("Failed to fetch transactions");
    }
  }

  static async createTransaction(
    billId: number,
    token: string
  ): Promise<ITransactionCreate> {
    try {
      const response = await axios.post<ITransactionCreate>(
        ENDPOINTS.BILL.POST_CREATE_TRANSACTION,
        {
          bill_id: billId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ใน header สำหรับการตรวจสอบสิทธิ์
          },
        }
      );

      return response.data; // คืนค่า transaction_id ที่ได้รับจากการสร้าง transaction
    } catch (error) {
      // จัดการข้อผิดพลาด
      console.error("Error creating transaction:", error);
      throw new Error("Failed to create transaction");
    }
  }
  static async getAllBills(token: string): Promise<Bill[]> {
    try {
      const response = await axios.get<{ bills: IBillResponse[] }>(
        ENDPOINTS.BILL.GET_ALL_BILLS, // ใช้ endpoint สำหรับดึงข้อมูลบิลทั้งหมด
        {
          headers: {
            Authorization: `Bearer ${token}`, // ใส่ token ใน header
          },
          withCredentials: true,
        }
      );

      if (!response.data.bills) {
        return [];
      }

      return response.data.bills.map((bill) => Bill.fromResponse(bill));
    } catch (error) {
      throw new Error("Failed to fetch all bills");
    }
  }

  static async updateTransactionStatus(
    transactionId: number,
    status: number,
    token: string
  ): Promise<void> {
    try {
      await axios.put(
        ENDPOINTS.BILL.UPDATE_TRANSACTION_STATUS(transactionId, status),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Failed to update transaction status:", error);
      throw new Error("Failed to update transaction status");
    }
  }

  static async updateBillStatus(
    billId: number,
    status: number,
    token: string
  ): Promise<void> {
    try {
      await axios.put(
        ENDPOINTS.BILL.UPDATE_BILL_STATUS(billId, status), // กำหนด endpoint สำหรับการอัปเดตสถานะ
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Failed to update bill status:", error);
      throw new Error("Failed to update bill status");
    }
  }
}
