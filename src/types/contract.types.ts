export interface IContractResponse {
  contract_number: number;
  contract_year: number;
  contract_room_number: number;
  rental_price: number;
  water_rate: number;
  electricity_rate: number;
  internet_service_fee: number;
}

export interface IContractRoomResponse {
  contract_number: number;
  contract_year: number;
  contract_room_number: number;
}


export interface IContractCreate {
  contract_year: number;
  contract_room_number: number;
  rental_price: number;
  water_rate: number;
  electricity_rate: number;
  internet_service_fee: number;
  username: string;
}
