export const ENDPOINTS = {
  USER: {
    LOGIN: () => `/login`,
    REGISTER: () => `/register`,
    GET_ALL_TENANTS: "/users/tenant",
  },

  CONTRACT: {
    GET_ALL_CONTRACTS: "/contracts",
    GET_CONTRACTS: (username: string) => `contracts/${username}`,
    GET_CONTRACTS_DETAILS: (contractNumber: number, contractYear: number) =>
      `contracts/${contractNumber}/${contractYear}`,
    POST_CREATE_CONTRACT: "/contracts/create",
  },

  BILL: {
    GET_BILLS_BY_USERNAME: (username: string) => `/bills/${username}`,
    GET_BILL_ITEMS_BY_BILL_ID: (billID: number) => `/bills/${billID}/items`,
    GET_TRANSACTIONS_BY_BILL_ID: (billID: number) => `/transactions/${billID}`,
    GET_ALL_BILLS: "/bills",
    POST_CREATE_TRANSACTION: "/transactions",
    UPDATE_TRANSACTION_STATUS: (transactionId: number, status: number) =>
      `/transactions/${transactionId}/status/${status}`,
    UPDATE_BILL_STATUS: (billId: number, status: number) =>
      `/bills/${billId}/status/${status}`,
  },
  RESERVATION: {
    POST_CREATE_RESERVATION: "/reservations/create", // สำหรับการสร้างการจอง
    GET_ALL_RESERVATIONS: "/reservations", // สำหรับดึงข้อมูลการจองทั้งหมด
    PUT_UPDATE_STATUS: (reservationId: string) =>
      `/reservations/${reservationId}/status`, // สำหรับอัปเดตสถานะการจองโดยระบุ reservationId
    GET_RESERVATIONS_BY_USERNAME: (tenantUsername: string) =>
      `/reservations/tenant/${tenantUsername}`, // ฟังก์ชันรับ tenantUsername
    GET_RESERVATION_BY_ID: (reservationID: number) =>
      `/reservations/${reservationID}`,
  },
};
