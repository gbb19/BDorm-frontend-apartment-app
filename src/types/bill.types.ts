export interface IBillCreate {
  payment_term: number;
  tenant_username: string;
  cashier_username: string;
}

export interface IBillResponse {
  bill_id: number;
  payment_term: number;
  create_date_time: string;
  bill_status: number;
}

export interface IBillCreateResponse {
  bill_id: number;
}