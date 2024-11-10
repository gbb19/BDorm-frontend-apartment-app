import { IBillResponse } from "../types/bill.types";

export class Bill {
  billID: number;
  paymentTerm: number;
  createDateTime: string;
  billStatus: number;
  tenantUsername:string;

  constructor(data: IBillResponse) {
    this.billID = data.bill_id;
    this.paymentTerm = data.payment_term;
    this.createDateTime = data.create_date_time;
    this.billStatus = data.bill_status;
    this.tenantUsername = data.tenant_username
  }

  toJSON() {
    return {
      bill_id: this.billID,
      payment_term: this.paymentTerm,
      create_date_time: this.createDateTime,
      bill_status: this.billStatus,
      tenant_username: this.tenantUsername
    };
  }

  static fromResponse(data: IBillResponse): Bill {
    return new Bill(data);
  }
}
