import { ITransactionResponse } from "../types/transaction.types";

export class Transaction {
  transactionID: number;
  paymentDateTime: string;
  transactionStatus: number;

  constructor(data: ITransactionResponse) {
    this.transactionID = data.transaction_id;
    this.paymentDateTime = data.payment_date_time;
    this.transactionStatus = data.transaction_status;
  }

  toJSON() {
    return {
      transaction_id: this.transactionID,
      payment_date_time: this.paymentDateTime,
      transaction_status: this.transactionStatus,
    };
  }

  static fromResponse(data: ITransactionResponse): Transaction {
    return new Transaction(data);
  }
}
