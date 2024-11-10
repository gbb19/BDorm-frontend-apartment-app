export interface ILedgerCreate {
  ledger_month: number;
  ledger_year: number;
  username: string;
}

export interface ILedgerResponse {
  ledger_month: number;
  ledger_year: number;
  username: string;
}

export interface ILedgerCreateResponse {
  message: string;
}
