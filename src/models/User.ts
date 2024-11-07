// src/models/User.ts
import { IUserResponse } from "../types/user.types";

export class User {
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
  token: string;

  constructor(data: IUserResponse) {
    this.username = data.username;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.roles = data.roles;
    this.token = data.token;  // เพิ่ม token ใน class
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get initials(): string {
    return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
  }

  toJSON() {
    return {
      first_name: this.firstName,
      last_name: this.lastName,
      roles: this.roles, // เพิ่ม role ในการแปลงเป็น JSON
      token: this.token, // เพิ่ม token ในการแปลงเป็น JSON
    };
  }

  static fromResponse(data: IUserResponse): User {
    return new User(data);
  }
}