// reservation.model.ts
import { IReservationResponse } from "../types/reservation.types";

export class Reservation {
  reservationID: number;
  moveInDateTime: string;
  reservationRoomNumber: number;
  reservationStatus: number;
  tenantUsername: string;
  managerUsername?: string;
  billID?: number;

  constructor(data: IReservationResponse) {
    this.reservationID = data.reservation_id;
    this.moveInDateTime = data.move_in_date_time;
    this.reservationRoomNumber = data.reservation_room_number;
    this.reservationStatus = data.reservation_status;
    this.tenantUsername = data.tenant_username;
    this.managerUsername = data.manager_username;
    this.billID = data.bill_id;
  }

  toJSON() {
    return {
      reservation_id: this.reservationID,
      move_in_date_time: this.moveInDateTime,
      reservation_room_number: this.reservationRoomNumber,
      reservation_status: this.reservationStatus,
      tenant_username: this.tenantUsername,
      manager_username: this.managerUsername,
      bill_id: this.billID,
    };
  }

  static fromResponse(data: IReservationResponse): Reservation {
    return new Reservation(data);
  }
}
