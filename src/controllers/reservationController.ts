import { Reservation } from "../models/Reservation";
import {
  IReservationCreate,
  IReservationResponse,
  IReservationUpdate,
  IUpdateReservationDetails,
} from "../types/reservation.types";
import { ENDPOINTS } from "../apis/endpoints";
import axios from "../apis/axios";

export class ReservationController {
  static async createReservation(
    reservationData: IReservationCreate,
    token: string
  ): Promise<Reservation> {
    try {
      const response = await axios.post<IReservationResponse>(
        ENDPOINTS.RESERVATION.POST_CREATE_RESERVATION,
        reservationData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ใส่ token สำหรับการตรวจสอบสิทธิ์
          },
        }
      );

      return new Reservation(response.data); // แปลงข้อมูลจาก API เป็น Reservation object
    } catch (error) {
      console.error("Error creating reservation:", error);
      throw new Error("Failed to create reservation");
    }
  }

  static async getReservationsByTenantUsername(
    tenantUsername: string,
    token: string
  ): Promise<Reservation[]> {
    try {
      // เรียก API เพื่อดึงข้อมูล reservation โดยใช้ tenantUsername
      const response = await axios.get<{
        reservations: IReservationResponse[];
      }>(
        ENDPOINTS.RESERVATION.GET_RESERVATIONS_BY_USERNAME(tenantUsername), // สร้าง URL โดยใช้ tenantUsername
        {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ใน header
          },
          withCredentials: true, // ใช้ถ้าต้องการส่งคุกกี้หรือการตรวจสอบสิทธิ์
        }
      );

      // ถ้าไม่มีข้อมูล reservations ให้คืนค่าเป็นอาร์เรย์ว่าง
      if (!response.data.reservations) {
        return [];
      }

      // แปลง IReservationResponse[] เป็น Reservation[] ก่อนส่งกลับ
      return response.data.reservations.map(
        (reservation) => new Reservation(reservation)
      );
    } catch (error) {
      // จัดการข้อผิดพลาด
      console.error("Failed to fetch reservations by tenant username:", error);
      throw new Error("Failed to fetch reservations");
    }
  }

  // การดึงข้อมูล Reservation ทั้งหมด
  static async getAllReservations(token: string): Promise<Reservation[]> {
    try {
      const response = await axios.get<{
        reservations: IReservationResponse[];
      }>(ENDPOINTS.RESERVATION.GET_ALL_RESERVATIONS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (!response.data.reservations) {
        return [];
      }

      return response.data.reservations.map(
        (reservation) => new Reservation(reservation)
      );
    } catch (error) {
      console.error("Failed to fetch all reservations:", error);
      throw new Error("Failed to fetch all reservations");
    }
  }

  // การอัปเดตสถานะของ Reservation
  static async updateReservationStatus(
    updateData: IReservationUpdate, // ไม่ต้องรับ reservationID ใน URL
    token: string
  ): Promise<void> {
    try {
      // ส่งข้อมูลผ่าน body แทนการใช้ reservationID ใน URL
      await axios.put(
        `${ENDPOINTS.RESERVATION.PUT_UPDATE_STATUS}`, // URL ไม่ต้องมี reservationID
        updateData, // ส่งข้อมูล updateData ใน request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Failed to update reservation status:", error);
      throw new Error("Failed to update reservation status");
    }
  }

  static async getReservationByID(
    reservationID: number,
    token: string
  ): Promise<Reservation> {
    try {
      // ส่ง request ไปยัง API เพื่อดึงข้อมูล Reservation ตาม reservation_id
      const response = await axios.get<{ reservation: IReservationResponse }>(
        ENDPOINTS.RESERVATION.GET_RESERVATION_BY_ID(reservationID),
        {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ใน header
          },
          withCredentials: true, // ใช้ถ้าต้องการส่งคุกกี้หรือการตรวจสอบสิทธิ์
        }
      );

      // ตรวจสอบว่ามีข้อมูล reservation อยู่ใน response หรือไม่
      if (!response.data || !response.data.reservation) {
        throw new Error("No reservation details found");
      }

      // แปลงข้อมูลจาก IReservationResponse เป็น Reservation ก่อนส่งกลับ
      return Reservation.fromResponse(response.data.reservation);
    } catch (error) {
      throw new Error("Failed to fetch reservation details");
    }
  }

  static async updateReservationDetails(
    reservationDetails: IUpdateReservationDetails,
    token: string
  ): Promise<void> {
    try {
      await axios.put(
        ENDPOINTS.RESERVATION.PUT_UPDATE_DETAILS,
        reservationDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ใน header เพื่อการตรวจสอบสิทธิ์
          },
          withCredentials: true,
        }
      );
      console.log("Reservation details updated successfully");
    } catch (error) {
      console.error("Failed to update reservation details:", error);
      throw new Error("Failed to update reservation details");
    }
  }
}
