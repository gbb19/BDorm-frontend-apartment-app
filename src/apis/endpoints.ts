export const ENDPOINTS = {
  USER: {
    LOGIN: () => `/login`,
    REGISTER: () => `/register`,
  },

  CONTRACT: {
    GET_CONTRACTS: (username: string) => `contracts/${username}`,
    GET_CONTRACTS_DETAILS: (contractNumber: number, contractYear: number) =>
      `contracts/${contractNumber}/${contractYear}`,
  },

  BILL: {
    GET_BILLS_BY_USERNAME: (username: string) => `/bills/${username}`,
    GET_BILL_ITEMS_BY_BILL_ID: (billID: number) => `/bills/${billID}/items`,
    GET_TRANSACTIONS_BY_BILL_ID: (billID: number) => `/transactions/${billID}`,
    POST_CREATE_TRANSACTION: "/transactions",
  },
};
