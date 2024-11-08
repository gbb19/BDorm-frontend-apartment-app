import axios from "../apis/axios";
import { ENDPOINTS } from "../apis/endpoints";
import { Bill } from "../models/Bill";
import { BillItem } from "../models/BillItem";
import { IBillResponse } from "../types/bill.types";
import { IBillItemResponse } from "../types/billItem.types";

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
}
