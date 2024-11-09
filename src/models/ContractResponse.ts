// src/models/Contract.ts
import { IContractRoomResponse } from "../types/contract.types";

export class ContractResponse {
  contractNumber: number;
  contractYear: number;
  contractRoomNumber: number;

  constructor(data: IContractRoomResponse) {
    this.contractNumber = data.contract_number
    this.contractYear = data.contract_year
    this.contractRoomNumber = data.contract_room_number
  }

  toJSON() {
    return {
      contract_number: this.contractNumber,
      contract_year: this.contractYear,
      contract_room_number: this.contractRoomNumber,
    };
  }

  static fromResponse(data: IContractRoomResponse): ContractResponse {
    return new ContractResponse(data);
  }
}
