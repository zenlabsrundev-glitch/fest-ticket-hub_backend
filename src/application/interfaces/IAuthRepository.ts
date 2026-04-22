import { AdminUser } from "../domain/entities/AdminUser";

export interface IAuthRepository {
  findByEmail(email: string): Promise<AdminUser | null>;
  create(data: { name: string; email: string; password: string }): Promise<AdminUser>;
}
