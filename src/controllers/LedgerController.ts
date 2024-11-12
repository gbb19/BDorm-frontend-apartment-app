import axios from "../apis/axios";
import {ENDPOINTS} from "../apis/endpoints";
import {LedgerItem} from "../models/LedgerItem";
import {ILedgerCreateResponse} from "../types/Ledger.types";
import {
  ILedgerItemCreateResponse,
  ILedgerItemResponse,
  ILedgerItemStatusUpdateResponse,
  ILedgerItemUpdateResponse
} from "../types/LedgerItem.types";

export class LedgerController {
  static async createLedger(
    ledgerMonth: number,
    ledgerYear: number,
    username: string,
    token: string
  ): Promise<ILedgerCreateResponse> {
    try {
      const response = await axios.post<ILedgerCreateResponse>(
        ENDPOINTS.LEDGER.POST_CREATE_LEDGER,
        {
          ledger_month: ledgerMonth,
          ledger_year: ledgerYear,
          username: username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ใน header
          },
        }
      );
      return response.data; // คืนค่าผลลัพธ์ที่ได้รับจากการสร้าง Ledger
    } catch (error) {
      console.error("Error creating ledger:", error);
      throw new Error("Failed to create ledger");
    }
  }

  static async createLedgerItem(
    ledgerMonth: number,
    ledgerYear: number,
    ledgerItemRoomNumber: number,
    waterUnit: number,
    electricityUnit: number,
    token: string
  ): Promise<ILedgerItemCreateResponse> {
    try {
      const response = await axios.post<ILedgerItemCreateResponse>(
        ENDPOINTS.LEDGER.POST_CREATE_LEDGER_ITEM,
        {
          ledger_month: ledgerMonth,
          ledger_year: ledgerYear,
          ledger_item_room_number: ledgerItemRoomNumber,
          water_unit: waterUnit,
          electricity_unit: electricityUnit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ใน header
          },
        }
      );
      return response.data; // คืนค่าผลลัพธ์ที่ได้รับจากการสร้าง LedgerItem
    } catch (error) {
      console.error("Error creating ledger item:", error);
      throw new Error("Failed to create ledger item");
    }
  }

  static async updateLedgerItem(
    ledgerMonth: number,
    ledgerYear: number,
    ledgerItemRoomNumber: number,
    waterUnit: number,
    electricityUnit: number,
    token: string
  ): Promise<ILedgerItemUpdateResponse> {
    try {
      const response = await axios.put<ILedgerItemUpdateResponse>(
        ENDPOINTS.LEDGER.PUT_UPDATE_LEDGER_ITEM,
        {
          ledger_month: ledgerMonth,
          ledger_year: ledgerYear,
          ledger_item_room_number: ledgerItemRoomNumber,
          water_unit: waterUnit,
          electricity_unit: electricityUnit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ใน header
          },
        }
      );
      return response.data; // คืนค่าผลลัพธ์จากการอัปเดต LedgerItem
    } catch (error) {
      console.error("Error updating ledger item:", error);
      throw new Error("Failed to update ledger item");
    }
  }

  static async updateLedgerItemStatus(
    ledgerMonth: number,
    ledgerYear: number,
    ledgerItemRoomNumber: number,
    token: string
  ): Promise<ILedgerItemStatusUpdateResponse> {
    try {
      const response = await axios.put<ILedgerItemStatusUpdateResponse>(
        ENDPOINTS.LEDGER.PUT_UPDATE_LEDGER_ITEM_STATUS,
        {
          ledger_month: ledgerMonth,
          ledger_year: ledgerYear,
          ledger_item_room_number: ledgerItemRoomNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ใน header
          },
        }
      );
      return response.data; // คืนค่าผลลัพธ์จากการอัปเดตสถานะ
    } catch (error) {
      console.error("Error updating ledger item status:", error);
      throw new Error("Failed to update ledger item status");
    }
  }

  static async getLedgerItemsByMonthAndYear(
    month: number,
    year: number,
    token: string
  ): Promise<LedgerItem[]> {
    try {
      const response = await axios.get<{
        ledger_items: ILedgerItemResponse[];
      }>(
        ENDPOINTS.LEDGER.GET_BY_MONTH_AND_YEAR(month, year), // ส่ง month และ year ผ่าน path
        {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ใน header
          },
        }
      );

      // ถ้าไม่มีข้อมูล ledger items ให้คืนค่าเป็นอาร์เรย์ว่าง
      if (!response.data.ledger_items) {
        return [];
      }

      // แปลงข้อมูล response ที่เป็น array ของ ledger items
      return response.data.ledger_items.map((item) => LedgerItem.fromResponse(item));
    } catch (error) {
      console.error("Error fetching ledger items:", error);
      throw new Error("Failed to fetch ledger items");
    }
  }
}
