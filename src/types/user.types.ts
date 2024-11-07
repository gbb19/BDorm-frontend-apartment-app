export interface IUserResponse {
  username: string;
  first_name: string;
  last_name: string;
  token: string;
  roles: string[];
}

export interface IUserCreate {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface IUserLogin {
  username: string;
  password: string;
}
