import { ILedgerResponse } from "../types/Ledger.types";

export class Ledger {
  ledgerMonth: number;
  ledgerYear: number;
  username: string;

  constructor(data: ILedgerResponse) {
    this.ledgerMonth = data.ledger_month;
    this.ledgerYear = data.ledger_year;
    this.username = data.username;
  }

  toJSON() {
    return {
      ledger_month: this.ledgerMonth,
      ledger_year: this.ledgerYear,
      username: this.username,
    };
  }

  static fromResponse(data: ILedgerResponse): Ledger {
    return new Ledger(data);
  }
}
