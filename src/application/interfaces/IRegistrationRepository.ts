import { Registration } from "../domain/entities/Registration";

export interface IRegistrationRepository {
  save(registration: Partial<Registration>): Promise<Registration>;
  findAll(): Promise<Registration[]>;
  findById(id: string): Promise<Registration | null>;
  findByEventId(eventId: string): Promise<Registration[]>;
}
