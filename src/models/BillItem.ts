import { IBillItemResponse } from "../types/billItem.types";

export class BillItem {
  billID: number;
  billItemNumber: number;
  billItemName: string;
  unit: number;
  unitPrice: number;

  constructor(data: IBillItemResponse) {
    this.billID = data.bill_id;
    this.billItemNumber = data.bill_item_number;
    this.billItemName = data.bill_item_name;
    this.unit = data.unit;
    this.unitPrice = data.unit_price;
  }

  toJSON() {
    return {
      bill_id: this.billID,
      bill_item_number: this.billItemNumber,
      bill_item_name: this.billItemName,
      unit: this.unit,
      unit_price: this.unitPrice,
    };
  }

  static fromResponse(data: IBillItemResponse): BillItem {
    return new BillItem(data);
  }
}
