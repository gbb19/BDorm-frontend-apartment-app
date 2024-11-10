import { ILedgerItemResponse } from "../types/LedgerItem.types";
import {IContractLedgerResponse} from "../types/contract.types";

export class LedgerItem {
  ledgerMonth: number;
  ledgerYear: number;
  ledgerItemRoomNumber: number;
  waterUnit: number;
  electricityUnit: number;
  ledgerItemStatus: number;
  contract: IContractLedgerResponse;

  constructor(data: ILedgerItemResponse) {
    this.ledgerMonth = data.ledger_month;
    this.ledgerYear = data.ledger_year;
    this.ledgerItemRoomNumber = data.ledger_item_room_number;
    this.waterUnit = data.water_unit;
    this.electricityUnit = data.electricity_unit;
    this.ledgerItemStatus = data.ledger_item_status;
    this.contract = data.Contract
  }

  toJSON() {
    return {
      ledger_month: this.ledgerMonth,
      ledger_year: this.ledgerYear,
      ledger_item_room_number: this.ledgerItemRoomNumber,
      water_unit: this.waterUnit,
      electricity_unit: this.electricityUnit,
      ledger_item_status: this.ledgerItemStatus,
      Contract: this.contract
    };
  }

  static fromResponse(data: ILedgerItemResponse): LedgerItem {
    return new LedgerItem(data);
  }
}
