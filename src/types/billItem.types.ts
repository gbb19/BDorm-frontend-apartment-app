// types/billItem.types.ts

export interface IBillItemResponse {
  bill_id: number;
  bill_item_number: number;
  bill_item_name: string;
  unit: number;
  unit_price: number;
}
