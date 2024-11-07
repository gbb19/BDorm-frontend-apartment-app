// src/models/Contract.ts
import { IContract } from "../types/contract.types";

export class Contract {
  contractNumber: string;
  contractYear: number;
  roomNumber: string;
  rentalPrice: number;
  waterRate: number;
  electricityRate: number;
  internetFee: number;
  status: string;
  tenantUsername: string;

  constructor(data: IContract) {
    this.contractNumber = data.contractNumber;
    this.contractYear = data.contractYear;
    this.roomNumber = data.roomNumber;
    this.rentalPrice = data.rentalPrice;
    this.waterRate = data.waterRate;
    this.electricityRate = data.electricityRate;
    this.internetFee = data.internetFee;
    this.status = data.status;
    this.tenantUsername = data.tenantUsername;
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
      contractNumber: this.contractNumber,
      contractYear: this.contractYear,
      roomNumber: this.roomNumber,
      rentalPrice: this.rentalPrice,
      waterRate: this.waterRate,
      electricityRate: this.electricityRate,
      internetFee: this.internetFee,
      status: this.status,
      tenantUsername: this.tenantUsername,
    };
  }

  static fromResponse(data: IContract): Contract {
    return new Contract(data);
  }
}