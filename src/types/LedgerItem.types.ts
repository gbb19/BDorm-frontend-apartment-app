import {IContractLedgerResponse} from "./contract.types";

export interface ILedgerItemCreate {
  ledger_month: number;
  ledger_year: number;
  ledger_item_room_number: number;
  water_unit: number;
  electricity_unit: number;
}

export interface ILedgerItemResponse {
  ledger_month: number;
  ledger_year: number;
  ledger_item_room_number: number;
  water_unit: number;
  electricity_unit: number;
  ledger_item_status: number;
  Contract: IContractLedgerResponse
}

export interface ILedgerItemCreateResponse {
  message: string;
}

export interface ILedgerItemUpdate {
  ledger_month: number;
  ledger_year: number;
  ledger_item_room_number: number;
  water_unit: number;
  electricity_unit: number;
}

export interface ILedgerItemUpdateResponse {
  message: string;
}

export interface ILedgerItemStatusUpdate {
  ledger_month: number;
  ledger_year: number;
  ledger_item_room_number: number;
}

export interface ILedgerItemStatusUpdateResponse {
  message: string;
}