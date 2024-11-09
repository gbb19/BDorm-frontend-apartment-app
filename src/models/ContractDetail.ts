// src/models/Contract.ts
import { IContractResponse } from "../types/contract.types";

export class ContractDetail {
  contractNumber: number;
  contractYear: number;
  contractRoomNumber: number;
  rentalPrice: number;
  waterRate: number;
  electricityRate: number;
  internetFee: number;

  constructor(data: IContractResponse) {
    this.contractNumber = data.contract_number;
    this.contractYear = data.contract_year;
    this.contractRoomNumber = data.contract_room_number;
    this.rentalPrice = data.rental_price;
    this.waterRate = data.water_rate;
    this.electricityRate = data.electricity_rate;
    this.internetFee = data.internet_service_fee;
  }

  // get annualCost(): number {
  //   return (
  //     this.rentalPrice * 12 +
  //     this.waterRate * 12 +
  //     this.electricityRate * 12 +
  //     this.internetFee * 12
  //   );
  // }

  toJSON() {
    return {
      contract_number: this.contractNumber,
      contract_year: this.contractYear,
      contract_room_number: this.contractRoomNumber,
      rental_price: this.rentalPrice,
      water_rate: this.waterRate,
      electricity_rate: this.electricityRate,
      internet_service_fee: this.internetFee,
    };
  }

  static fromResponse(data: IContractResponse): ContractDetail {
    return new ContractDetail(data);
  }
}
