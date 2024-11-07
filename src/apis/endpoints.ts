export const ENDPOINTS = {
  USER: {
    LOGIN: ()=> `/login`,
    REGISTER: ()=> `/register`,
  },

  CONTRACT:{
    GET_CONTRACTS: (username:string) => `contracts/${username}`
  },

};
