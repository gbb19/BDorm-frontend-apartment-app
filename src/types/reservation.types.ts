// reservation.types.ts
export interface IReservationCreate {
  move_in_date_time: string;
  reservation_room_number: number;
  tenant_username: string;
}

export interface IReservationResponse {
  reservation_id: number;
  move_in_date_time: string;
  reservation_room_number: number;
  reservation_status: number;
  tenant_username: string;
  manager_username?: string;
  bill_id?: number;
}

export interface IReservationUpdate {
  reservation_id: number;
  reservation_status: number;
}

export interface IUpdateReservationDetails {
  reservation_id: number;
  bill_id: number;
  manager_username: string;
}
