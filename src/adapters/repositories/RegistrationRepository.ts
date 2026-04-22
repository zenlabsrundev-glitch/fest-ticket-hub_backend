import { supabase } from "../../infrastructure/supabase";
import { Registration } from "../../application/domain/entities/Registration";
import { IRegistrationRepository } from "../../application/interfaces/IRegistrationRepository";
import { v4 as uuidv4 } from "uuid";

export class RegistrationRepository implements IRegistrationRepository {
  private table = "registrations";

  private rowToRegistration(row: any): Registration {
    return {
      id: row.id,
      teamName: row.team_name,
      eventId: row.event_id,
      eventName: row.event_name,
      leaderName: row.leader_name,
      leaderEmail: row.leader_email,
      leaderPhone: row.leader_phone,
      leaderCollege: row.leader_college,
      teamMembers: row.team_members ?? [],
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    } as Registration;
  }

  async save(registrationData: Partial<Registration>): Promise<Registration> {
    const id = uuidv4();

    const { data, error } = await supabase
      .from(this.table)
      .insert({
        id,
        team_name: registrationData.teamName,
        event_id: registrationData.eventId,
        event_name: registrationData.eventName,
        leader_name: registrationData.leaderName,
        leader_email: registrationData.leaderEmail,
        leader_phone: registrationData.leaderPhone,
        leader_college: registrationData.leaderCollege,
        team_members: registrationData.teamMembers ?? [],
        status: "confirmed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.rowToRegistration(data);
  }

  async findAll(): Promise<Registration[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(this.rowToRegistration);
  }

  async findById(id: string): Promise<Registration | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return this.rowToRegistration(data);
  }

  async findByEventId(eventId: string): Promise<Registration[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(this.rowToRegistration);
  }
}
