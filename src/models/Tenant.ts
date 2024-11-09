// src/models/Tenant.ts

import { ITenantResponse } from "../types/tenant.tpyes";

export class Tenant {
  username: string;
  firstName: string;
  lastName: string;

  constructor(data: ITenantResponse) {
    this.username = data.username;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get initials(): string {
    return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
  }

  toJSON() {
    return {
      username: this.username,
      first_name: this.firstName,
      last_name: this.lastName,
    };
  }

  static fromResponse(data: ITenantResponse): Tenant {
    return new Tenant(data);
  }
}
