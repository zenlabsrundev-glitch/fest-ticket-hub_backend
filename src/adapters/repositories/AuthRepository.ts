import { supabase } from "../../infrastructure/supabase";
import { AdminUser } from "../../application/domain/entities/AdminUser";
import { IAuthRepository } from "../../application/interfaces/IAuthRepository";
import { v4 as uuidv4 } from "uuid";

export class AuthRepository implements IAuthRepository {
  private table = "admin_users";

  private rowToUser(row: any): AdminUser {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async findByEmail(email: string): Promise<AdminUser | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (error || !data) return null;
    return this.rowToUser(data);
  }

  async create(data: { name: string; email: string; password: string }): Promise<AdminUser> {
    const { data: inserted, error } = await supabase
      .from(this.table)
      .insert({
        id: uuidv4(),
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.password,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.rowToUser(inserted);
  }
}
